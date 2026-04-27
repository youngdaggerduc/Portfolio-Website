import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from app.config import TORTOISE_ORM
from app.routers import chatbot, contact, games, homepage

app = FastAPI(title="Portfolio API")

# CORS allow-list. In dev defaults to the Vite dev server. In prod set
# ALLOWED_ORIGINS to a comma-separated list, e.g.
#   ALLOWED_ORIGINS=https://pierce-doman.vercel.app,https://pierce-doman.com
_default_origins = "http://localhost:5173"
allowed_origins = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(homepage.router)
app.include_router(chatbot.router)
app.include_router(contact.router)
app.include_router(games.router)

register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)


@app.get("/")
async def root():
    return {"status": "ok"}


@app.get("/healthz")
async def healthz():
    return {"ok": True}
