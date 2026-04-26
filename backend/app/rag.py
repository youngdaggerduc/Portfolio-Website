import hashlib
import json
import math
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

from openai import AsyncOpenAI

EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
RAG_TOP_K = int(os.getenv("RAG_TOP_K", "3"))

BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_ROOT / "data"
INDEX_PATH = DATA_DIR / ".index.json"

_TITLE_RE = re.compile(r"^\[TITLE:\s*(.+?)\s*\]\s*$")
_SPLIT_RE = re.compile(r"^---\s*$", flags=re.MULTILINE)


@dataclass
class Chunk:
    title: str
    text: str
    embedding: list[float] = field(default_factory=list)


_index: Optional[list[Chunk]] = None
_index_hash: Optional[str] = None


def _load_chunks_from_disk() -> list[Chunk]:
    chunks: list[Chunk] = []
    if not DATA_DIR.exists():
        return chunks
    for path in sorted(DATA_DIR.glob("*.txt")):
        raw = path.read_text(encoding="utf-8")
        for block in _SPLIT_RE.split(raw):
            block = block.strip()
            if not block:
                continue
            lines = block.splitlines()
            m = _TITLE_RE.match(lines[0]) if lines else None
            if m:
                title = m.group(1)
                body = "\n".join(lines[1:]).strip()
            else:
                title = path.stem
                body = block
            if body:
                chunks.append(Chunk(title=title, text=body))
    return chunks


def _content_hash(chunks: list[Chunk]) -> str:
    h = hashlib.sha256()
    h.update(EMBEDDING_MODEL.encode())
    h.update(b"\n")
    for c in chunks:
        h.update(c.title.encode())
        h.update(b"\n")
        h.update(c.text.encode())
        h.update(b"\n---\n")
    return h.hexdigest()


def _cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


async def _embed(client: AsyncOpenAI, texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    resp = await client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
    return [d.embedding for d in resp.data]


async def get_index(client: AsyncOpenAI) -> list[Chunk]:
    global _index, _index_hash
    chunks = _load_chunks_from_disk()
    if not chunks:
        _index = []
        _index_hash = None
        return _index

    current_hash = _content_hash(chunks)

    if _index is not None and _index_hash == current_hash:
        return _index

    if INDEX_PATH.exists():
        try:
            cached = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
            if cached.get("hash") == current_hash:
                _index = [Chunk(**c) for c in cached["chunks"]]
                _index_hash = current_hash
                return _index
        except (json.JSONDecodeError, KeyError, TypeError):
            pass

    embeddings = await _embed(client, [c.text for c in chunks])
    for chunk, emb in zip(chunks, embeddings):
        chunk.embedding = emb
    _index = chunks
    _index_hash = current_hash

    DATA_DIR.mkdir(exist_ok=True)
    INDEX_PATH.write_text(
        json.dumps({
            "hash": current_hash,
            "model": EMBEDDING_MODEL,
            "chunks": [
                {"title": c.title, "text": c.text, "embedding": c.embedding}
                for c in chunks
            ],
        }),
        encoding="utf-8",
    )
    return _index


async def retrieve(client: AsyncOpenAI, query: str, k: int = RAG_TOP_K) -> list[Chunk]:
    index = await get_index(client)
    if not index:
        return []
    query_emb = (await _embed(client, [query]))[0]
    scored = [(_cosine(query_emb, c.embedding), c) for c in index]
    scored.sort(key=lambda t: t[0], reverse=True)
    return [c for _, c in scored[:k]]


def format_context(chunks: list[Chunk]) -> str:
    if not chunks:
        return ""
    parts = ["Relevant context about Pierce (use this to answer accurately; cite specifics from here, never invent):"]
    for c in chunks:
        parts.append(f"\n## {c.title}\n{c.text}")
    return "\n".join(parts)
