"""Onboarding router — rider registration and policy creation."""
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from app.database import get_db
from app.models import Rider, Policy
from app.agents.risk_agent import RiskAgent
from app.blockchain import log_policy_on_chain

router = APIRouter()
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
risk_agent = RiskAgent()


class OnboardRequest(BaseModel):
    name: str
    phone: str
    persona: str           # "qcom" | "food"
    zone_id: str
    zone_name: str
    password: str = "gigshield123"  # Default for demo


class OnboardResponse(BaseModel):
    rider_id: str
    policy_id: str
    total_premium: float
    risk_score: float
    tx_hash: str | None
    message: str


@router.post("/onboard", response_model=OnboardResponse)
async def onboard_rider(req: OnboardRequest, db: AsyncSession = Depends(get_db)):
    """Register rider, compute dynamic premium, create policy, log on blockchain."""
    # Check duplicate
    existing = await db.execute(select(Rider).where(Rider.phone == req.phone))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Phone already registered")

    # Compute risk score + premium
    month = datetime.utcnow().month
    risk_score = await risk_agent.score(req.zone_id, month=month, persona=req.persona)
    multiplier = risk_agent.multiplier(risk_score)
    base = 99.0
    addons = 20.0 if multiplier > 1.1 else (10.0 if multiplier > 0.95 else 0.0)
    total_premium = round(base * multiplier + addons, 2)

    # Create rider
    rider = Rider(
        id=str(uuid.uuid4()),
        name=req.name, phone=req.phone, persona=req.persona,
        zone_id=req.zone_id, zone_name=req.zone_name,
        hashed_password=pwd_ctx.hash(req.password),
    )
    db.add(rider)

    # Create policy
    policy_id = str(uuid.uuid4())
    renews_at = datetime.utcnow() + timedelta(days=7)
    policy = Policy(
        id=policy_id, rider_id=rider.id, zone_id=req.zone_id,
        base_premium=base, risk_multiplier=multiplier,
        addons=addons, total_premium=total_premium,
        coverage_amount=300.0, is_active=True,
        renews_at=renews_at,
    )
    db.add(policy)
    await db.flush()

    # Blockchain log
    tx_hash = await log_policy_on_chain(policy_id, rider.id, req.zone_id, total_premium)
    policy.tx_hash = tx_hash
    await db.commit()

    return OnboardResponse(
        rider_id=rider.id, policy_id=policy_id,
        total_premium=total_premium, risk_score=round(risk_score, 3),
        tx_hash=tx_hash,
        message=f"Welcome {req.name}! Your zone risk score is {risk_score:.2f}. Policy active for 7 days.",
    )
