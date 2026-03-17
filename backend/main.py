"""
GigShield AI — FastAPI Backend
Main application entry point with CORS, routers, and startup events.
"""
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import onboard, risk, triggers, claims, payout, admin
from app.agents.trigger_agent import TriggerAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

trigger_agent = TriggerAgent()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: init DB, start background polling."""
    await init_db()
    logger.info("✅ Database initialised")
    # Start TriggerAgent polling loop in background
    task = asyncio.create_task(trigger_agent.poll_loop())
    logger.info("✅ TriggerAgent polling started (every 10 min)")
    yield
    task.cancel()
    logger.info("🛑 TriggerAgent polling stopped")


app = FastAPI(
    title="GigShield AI",
    description="Parametric insurance backend for gig workers — multi-agent, blockchain-verified, instant UPI payouts.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(onboard.router, prefix="/api/v1", tags=["Onboarding"])
app.include_router(risk.router, prefix="/api/v1", tags=["Risk"])
app.include_router(triggers.router, prefix="/api/v1", tags=["Triggers"])
app.include_router(claims.router, prefix="/api/v1", tags=["Claims"])
app.include_router(payout.router, prefix="/api/v1", tags=["Payout"])
app.include_router(admin.router, prefix="/api/v1", tags=["Admin"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "GigShield AI Backend"}
