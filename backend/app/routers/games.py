import asyncio
import json
import os
import random
import time
from collections import defaultdict, deque
from typing import Literal, Optional

from fastapi import APIRouter, HTTPException, Request
from openai import OpenAIError
from pydantic import BaseModel, Field

from app.routers.chatbot import get_client

router = APIRouter(prefix="/api/games", tags=["games"])

GAMES_MODEL = os.getenv("GAMES_MODEL", os.getenv("OPENAI_MODEL", "gpt-4o-mini"))
GAMES_RATE_LIMIT_PER_MINUTE = int(os.getenv("GAMES_RATE_LIMIT_PER_MINUTE", "10"))
GAMES_RATE_LIMIT_PER_DAY = int(os.getenv("GAMES_RATE_LIMIT_PER_DAY", "60"))

_rate_buckets: dict[str, deque] = defaultdict(deque)
_rate_lock = asyncio.Lock()


async def _check_rate_limit(client_ip: str) -> None:
    now = time.time()
    async with _rate_lock:
        bucket = _rate_buckets[client_ip]
        cutoff_day = now - 86400
        while bucket and bucket[0] < cutoff_day:
            bucket.popleft()
        if len(bucket) >= GAMES_RATE_LIMIT_PER_DAY:
            raise HTTPException(
                status_code=429,
                detail=f"Daily game limit of {GAMES_RATE_LIMIT_PER_DAY} reached. Come back tomorrow.",
            )
        cutoff_min = now - 60
        recent = sum(1 for t in bucket if t >= cutoff_min)
        if recent >= GAMES_RATE_LIMIT_PER_MINUTE:
            raise HTTPException(
                status_code=429,
                detail=f"Slow down — max {GAMES_RATE_LIMIT_PER_MINUTE} game actions per minute.",
            )
        bucket.append(now)


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


SKILLS_CONTEXT = (
    "Pierce Doman is a Trinidad & Tobago-based Full Stack Developer, AI Engineer, "
    "and Business Process Analyst at Radian H.A. Limited. "
    "Skills: React, Next.js, Node.js, Express, Python, FastAPI, Flask, PostgreSQL, MySQL, "
    "LangChain, OpenAI API, Hugging Face, Odoo ERP, WordPress (custom builds + plugins), "
    "Java, PHP, C++, Git, Vercel, Power Automate, PowerShell, Agile/Scrum. "
    "Real shipped projects: Lumiere Lounge (commercial React/Node/Stripe booking system for a "
    "premium restaurant), Student Conduct Tracker (Final Year Project, Flask + Python, earned "
    "Second Class Honours), AI Image Generator (custom WordPress plugin + OpenAI API), "
    "Java 2D Platformer (custom physics engine), Radian Corporate Website (took over a stalled "
    "project and shipped to production), and a full Odoo ERP rollout with custom modules across "
    "Accounting, Sales, CRM, Rental Operations, and Reporting. "
    "Education: BSc Computer Science (Special) at UWI, Second Class Honours."
)


# ─────────────────────────── SPOT THE BUG ───────────────────────────

PUZZLE_SYSTEM = (
    "You are a puzzle generator for a fun portfolio mini-game called 'Spot the Bug'. "
    "You return ONLY valid JSON, no markdown, no commentary."
)

BUG_FLAVOURS = [
    "off-by-one error in a loop bound",
    "wrong comparison operator (== vs ===, > vs >=)",
    "method name typo (e.g. .lenght, .toLowercase)",
    "wrong variable referenced inside a closure or loop",
    "missing await on an async call",
    "mutation of a list while iterating over it",
    "incorrect return value or early return",
    "string concatenation when arithmetic was intended",
    "wrong array index or slice bound",
    "shadowed variable in nested scope",
]


class PuzzleResponse(BaseModel):
    language: str
    code: str
    choices: list[str]
    correct: str
    bugLine: str
    explanation: str


@router.post("/spot-bug/puzzle", response_model=PuzzleResponse)
async def spot_bug_puzzle(request: Request) -> PuzzleResponse:
    await _check_rate_limit(_client_ip(request))
    client = get_client()

    flavour = random.choice(BUG_FLAVOURS)
    language = random.choice(["javascript", "python"])
    correct_letter = random.choice(["A", "B", "C", "D"])

    user_prompt = f"""Generate a coding bug puzzle.

Language: {language}
Bug type to use: {flavour}
The CORRECT answer must be option {correct_letter}.

Return ONLY this JSON shape, no markdown fences:
{{
  "language": "{language}",
  "code": "<6-10 line {language} snippet containing the bug. Use \\n for newlines. Realistic, like something a dev would actually write.>",
  "choices": [
    "A) <description of bug or wrong description>",
    "B) <description>",
    "C) <description>",
    "D) <description>"
  ],
  "correct": "{correct_letter}",
  "bugLine": "<the exact line of code containing the bug>",
  "explanation": "<one sentence explaining what the bug is and the fix>"
}}

Rules:
- Option {correct_letter} must accurately describe the bug. The other 3 options must be plausible-sounding but wrong (e.g. style preferences, wrong fixes for non-bugs, irrelevant nitpicks).
- Each choice MUST start with its letter and a closing parenthesis (e.g. "A) ").
- Code must be syntactically clean other than the one logic bug.
- Keep choices to one short sentence each."""

    try:
        completion = await client.chat.completions.create(
            model=GAMES_MODEL,
            messages=[
                {"role": "system", "content": PUZZLE_SYSTEM},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=600,
            temperature=0.95,
            response_format={"type": "json_object"},
        )
    except OpenAIError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {e}") from e

    raw = completion.choices[0].message.content or ""
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Bad puzzle JSON: {e}") from e

    try:
        puzzle = PuzzleResponse(**data)
    except (TypeError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Puzzle shape invalid: {e}") from e

    if puzzle.correct not in {"A", "B", "C", "D"}:
        raise HTTPException(status_code=502, detail="Puzzle correct field invalid")
    if len(puzzle.choices) != 4:
        raise HTTPException(status_code=502, detail="Puzzle must have 4 choices")

    return puzzle


class ReactionRequest(BaseModel):
    outcome: Literal["win", "lose", "timeout"]
    bugLine: Optional[str] = None


class ReactionResponse(BaseModel):
    text: str


@router.post("/spot-bug/reaction", response_model=ReactionResponse)
async def spot_bug_reaction(req: ReactionRequest, request: Request) -> ReactionResponse:
    await _check_rate_limit(_client_ip(request))
    client = get_client()

    if req.outcome == "win":
        persona = (
            "You are Aunt May from Spider-Man. The player just correctly identified a code bug "
            "in a fun mini-game on Pierce Doman's portfolio site. Give a warm, proud, slightly "
            "flustered 2-sentence reaction in Aunt May's voice. Be wholesome. You may reference "
            "Peter or coding. Output ONLY the in-character lines, in quotation marks."
        )
    else:
        slip = "ran out of time" if req.outcome == "timeout" else "picked the wrong answer"
        persona = (
            "You are J. Jonah Jameson from the Daily Bugle, in classic over-the-top form. "
            f"The player just {slip} on a coding bug challenge in a fun mini-game on Pierce "
            "Doman's portfolio site. Give a loud, dramatic 2-sentence roast in Jameson's voice. "
            "You may reference Spider-Man being a menace. Output ONLY the in-character lines, "
            "in quotation marks. Keep it playful — never insult the actual user."
        )

    try:
        completion = await client.chat.completions.create(
            model=GAMES_MODEL,
            messages=[{"role": "user", "content": persona}],
            max_tokens=180,
            temperature=0.9,
        )
    except OpenAIError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {e}") from e

    text = (completion.choices[0].message.content or "").strip()
    return ReactionResponse(text=text)


# ─────────────────────────── HIRE SPIDER-MAN ───────────────────────────


class HireMessage(BaseModel):
    role: Literal["spider", "user"]
    text: str


class HireReplyRequest(BaseModel):
    messages: list[HireMessage] = Field(..., min_length=1)
    round: int = Field(..., ge=1, le=10)
    max_rounds: int = Field(3, ge=1, le=10)


class HireReplyResponse(BaseModel):
    text: str


def _format_transcript(messages: list[HireMessage]) -> str:
    lines = []
    for m in messages:
        speaker = "Spider-Man" if m.role == "spider" else "Recruiter"
        lines.append(f"{speaker}: {m.text}")
    return "\n".join(lines)


@router.post("/hire/reply", response_model=HireReplyResponse)
async def hire_reply(req: HireReplyRequest, request: Request) -> HireReplyResponse:
    await _check_rate_limit(_client_ip(request))
    client = get_client()

    is_final = req.round >= req.max_rounds
    transcript = _format_transcript(req.messages)

    closing_clause = (
        "This is the FINAL round — land your best closing argument. Be confident but not arrogant."
        if is_final
        else f"Round {req.round} of {req.max_rounds}. Keep it punchy."
    )

    prompt = f"""You are Pierce Doman roleplaying as Spider-Man, defending Pierce's developer skills to a skeptical recruiter in a fun portfolio mini-game.

Pierce's real background:
{SKILLS_CONTEXT}

Style:
- Witty, confident, friendly. Use Spider-Man banter sparingly (one quip max per reply).
- Reference Pierce's REAL skills and shipped projects from the background above. Do not invent jobs, schools, or technologies that aren't listed.
- Keep replies under 70 words.
- {closing_clause}

Conversation so far:
{transcript}

Respond as Spider-Man (one short paragraph, no labels, no quotation marks):"""

    try:
        completion = await client.chat.completions.create(
            model=GAMES_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=180,
            temperature=0.85,
        )
    except OpenAIError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {e}") from e

    text = (completion.choices[0].message.content or "").strip()
    return HireReplyResponse(text=text)


class HireVerdictRequest(BaseModel):
    messages: list[HireMessage] = Field(..., min_length=2)


class HireVerdictResponse(BaseModel):
    outcome: Literal["spider", "recruiter"]
    summary: str


@router.post("/hire/verdict", response_model=HireVerdictResponse)
async def hire_verdict(req: HireVerdictRequest, request: Request) -> HireVerdictResponse:
    await _check_rate_limit(_client_ip(request))
    client = get_client()

    transcript = _format_transcript(req.messages)
    prompt = f"""You are a neutral judge for a portfolio mini-game. A recruiter tried to NOT hire Spider-Man (developer Pierce Doman) over 3 rounds of objections. Read the transcript and decide who wins.

Pierce's real background:
{SKILLS_CONTEXT}

Transcript:
{transcript}

Judging rules:
- "spider" wins if Spider-Man's defenses cite real skills/projects and address each objection convincingly.
- "recruiter" wins if Spider-Man dodged objections, repeated himself, or made claims unsupported by Pierce's background.
- Be fair, not biased toward Spider-Man.

Return ONLY this JSON, no markdown fences:
{{"outcome": "spider" or "recruiter", "summary": "<one punchy sentence in the style of a boxing announcer declaring the winner and why>"}}"""

    try:
        completion = await client.chat.completions.create(
            model=GAMES_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.6,
            response_format={"type": "json_object"},
        )
    except OpenAIError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {e}") from e

    raw = (completion.choices[0].message.content or "").strip()
    try:
        data = json.loads(raw)
        verdict = HireVerdictResponse(**data)
    except (json.JSONDecodeError, TypeError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Bad verdict JSON: {e}") from e

    return verdict
