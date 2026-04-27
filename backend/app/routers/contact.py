import asyncio
import os
import re
import smtplib
import time
from collections import defaultdict, deque
from email.message import EmailMessage

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["contact"])

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
CONTACT_TO_EMAIL = os.getenv("CONTACT_TO_EMAIL", SMTP_USER)
CONTACT_FROM_NAME = os.getenv("CONTACT_FROM_NAME", "Portfolio Contact Form")

CONTACT_RATE_PER_HOUR = int(os.getenv("CONTACT_RATE_PER_HOUR", "3"))
CONTACT_RATE_PER_DAY = int(os.getenv("CONTACT_RATE_PER_DAY", "10"))

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

_buckets: dict[str, deque] = defaultdict(deque)
_lock = asyncio.Lock()


async def _check_rate(ip: str) -> None:
    now = time.time()
    async with _lock:
        b = _buckets[ip]
        cutoff_day = now - 86400
        while b and b[0] < cutoff_day:
            b.popleft()
        if len(b) >= CONTACT_RATE_PER_DAY:
            raise HTTPException(
                status_code=429,
                detail=f"Daily limit of {CONTACT_RATE_PER_DAY} messages reached.",
            )
        cutoff_hour = now - 3600
        recent = sum(1 for t in b if t >= cutoff_hour)
        if recent >= CONTACT_RATE_PER_HOUR:
            raise HTTPException(
                status_code=429,
                detail=f"Too many messages — max {CONTACT_RATE_PER_HOUR} per hour.",
            )
        b.append(now)


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    # Honeypot — hidden from humans, bots fill everything.
    website: str = Field(default="", max_length=200)


def _send_email_sync(req: ContactRequest) -> None:
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio contact from {req.name}"
    msg["From"] = f"{CONTACT_FROM_NAME} <{SMTP_USER}>"
    msg["To"] = CONTACT_TO_EMAIL
    msg["Reply-To"] = req.email
    msg.set_content(
        f"Name: {req.name}\n"
        f"Email: {req.email}\n\n"
        f"Message:\n{req.message}\n"
    )
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(msg)


@router.post("/contact")
async def contact(req: ContactRequest, request: Request) -> dict:
    # Honeypot triggered — pretend success so bots don't probe further.
    if req.website.strip():
        return {"ok": True}

    if not EMAIL_RE.match(req.email):
        raise HTTPException(status_code=400, detail="Invalid email address.")
    if not (SMTP_USER and SMTP_PASSWORD):
        raise HTTPException(status_code=500, detail="Email transport not configured.")

    ip = request.client.host if request.client else "unknown"
    await _check_rate(ip)

    try:
        await asyncio.to_thread(_send_email_sync, req)
    except smtplib.SMTPAuthenticationError as e:
        raise HTTPException(status_code=502, detail=f"SMTP auth failed: {e}") from e
    except smtplib.SMTPException as e:
        raise HTTPException(status_code=502, detail=f"Mail send failed: {e}") from e

    return {"ok": True}
