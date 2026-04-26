import asyncio
import json
import os
import re
import time
import uuid
from collections import defaultdict, deque
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI, OpenAIError
from pydantic import BaseModel, Field

from app.rag import format_context, retrieve

router = APIRouter(prefix="/api", tags=["chatbot"])

BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent
MEMORY_DIR = BACKEND_ROOT / "memory"
MEMORY_DIR.mkdir(exist_ok=True)

SYSTEM_PROMPT_PATH = Path(__file__).resolve().parent.parent / "system_prompt.txt"

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
MAX_HISTORY_MESSAGES = int(os.getenv("CHAT_MAX_HISTORY", "10"))
MAX_RESPONSE_TOKENS = int(os.getenv("CHAT_MAX_TOKENS", "400"))
MAX_USER_CHARS = int(os.getenv("CHAT_MAX_USER_CHARS", "2000"))
TEMPERATURE = float(os.getenv("CHAT_TEMPERATURE", "0.7"))

RATE_LIMIT_PER_MINUTE = int(os.getenv("CHAT_RATE_LIMIT_PER_MINUTE", "15"))
RATE_LIMIT_PER_DAY = int(os.getenv("CHAT_RATE_LIMIT_PER_DAY", "100"))

SESSION_ID_RE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")

_client: Optional[AsyncOpenAI] = None
_rate_buckets: dict[str, deque] = defaultdict(deque)
_rate_lock = asyncio.Lock()


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
        _client = AsyncOpenAI(api_key=api_key)
    return _client


def load_system_prompt() -> str:
    if SYSTEM_PROMPT_PATH.exists():
        return SYSTEM_PROMPT_PATH.read_text(encoding="utf-8").strip()
    return "You are Spider-PD, an AI assistant for Pierce Doman's portfolio site."


def session_path(session_id: str) -> Path:
    if not SESSION_ID_RE.match(session_id):
        raise HTTPException(status_code=400, detail="Invalid session_id")
    return MEMORY_DIR / f"{session_id}.json"


def load_history(session_id: str) -> list[dict]:
    p = session_path(session_id)
    if not p.exists():
        return []
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def save_history(session_id: str, history: list[dict]) -> None:
    session_path(session_id).write_text(
        json.dumps(history, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


async def check_rate_limit(client_ip: str) -> None:
    now = time.time()
    async with _rate_lock:
        bucket = _rate_buckets[client_ip]
        cutoff_day = now - 86400
        while bucket and bucket[0] < cutoff_day:
            bucket.popleft()
        if len(bucket) >= RATE_LIMIT_PER_DAY:
            raise HTTPException(
                status_code=429,
                detail=f"Daily limit of {RATE_LIMIT_PER_DAY} messages reached. Try again tomorrow.",
            )
        cutoff_min = now - 60
        recent = sum(1 for t in bucket if t >= cutoff_min)
        if recent >= RATE_LIMIT_PER_MINUTE:
            raise HTTPException(
                status_code=429,
                detail=f"Slow down — max {RATE_LIMIT_PER_MINUTE} messages per minute.",
            )
        bucket.append(now)


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[str] = None


@router.post("/chat")
async def chat(req: ChatRequest, request: Request) -> StreamingResponse:
    user_text = req.message.strip()
    if not user_text:
        raise HTTPException(status_code=400, detail="Empty message")
    if len(user_text) > MAX_USER_CHARS:
        user_text = user_text[:MAX_USER_CHARS]

    client_ip = request.client.host if request.client else "unknown"
    await check_rate_limit(client_ip)

    session_id = req.session_id or str(uuid.uuid4())
    history = load_history(session_id)
    windowed = history[-MAX_HISTORY_MESSAGES:]

    client = get_client()

    try:
        retrieved = await retrieve(client, user_text)
    except OpenAIError:
        retrieved = []
    context_block = format_context(retrieved)

    system_messages = [{"role": "system", "content": load_system_prompt()}]
    if context_block:
        system_messages.append({"role": "system", "content": context_block})

    messages = [
        *system_messages,
        *windowed,
        {"role": "user", "content": user_text},
    ]

    async def event_stream():
        yield _sse("session", {"session_id": session_id})

        full_parts: list[str] = []
        try:
            stream = await client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=messages,
                max_tokens=MAX_RESPONSE_TOKENS,
                temperature=TEMPERATURE,
                stream=True,
            )
            async for event in stream:
                if not event.choices:
                    continue
                delta = event.choices[0].delta.content or ""
                if delta:
                    full_parts.append(delta)
                    yield _sse("token", {"text": delta})
        except OpenAIError as e:
            yield _sse("error", {"message": str(e)})
            return

        full_response = "".join(full_parts)
        if full_response:
            history.append({"role": "user", "content": user_text})
            history.append({"role": "assistant", "content": full_response})
            save_history(session_id, history)

        yield _sse("done", {})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.get("/chat/sessions")
async def list_sessions() -> dict:
    sessions = []
    for path in MEMORY_DIR.glob("*.json"):
        try:
            convo = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        sessions.append({
            "session_id": path.stem,
            "message_count": len(convo),
            "last_message": convo[-1]["content"] if convo else None,
        })
    return {"sessions": sessions}


@router.delete("/chat/sessions/{session_id}")
async def delete_session(session_id: str) -> dict:
    p = session_path(session_id)
    if p.exists():
        p.unlink()
    return {"deleted": session_id}
