"""Claims router — the core orchestration endpoint: 2-of-3 consensus + fraud gate + payout."""
import asyncio
import os
import uuid
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Rider, Claim, ZoneRisk, Policy
from app.agents.risk_agent import RiskAgent
from app.agents.trigger_agent import TriggerAgent
from app.agents.fraud_agent import FraudAgent
from app.agents.payout_agent import PayoutAgent
from app.blockchain import log_claim_on_chain

router = APIRouter()
risk_agent    = RiskAgent()
trigger_agent = TriggerAgent()
fraud_agent   = FraudAgent()
payout_agent  = PayoutAgent()


class ClaimRequest(BaseModel):
    rider_id: str
    zone_id: str


class ClaimResponse(BaseModel):
    claim_id: str
    status: str
    agent_votes: dict
    fraud_passed: bool
    amount: float
    tx_hash: str | None
    razorpay_payment_id: str | None
    message: str


@router.post("/claim", response_model=ClaimResponse)
async def file_claim(req: ClaimRequest, db: AsyncSession = Depends(get_db)):
    """
    Main claim orchestration:
    1. asyncio.gather() — TriggerAgent + RiskAgent + ZoneAgent (parallel)
    2. 2-of-3 consensus check
    3. FraudAgent gate (3 parallel checks)
    4. PayoutAgent disburse + blockchain log
    """
    # ── Fetch rider ──────────────────────────────────────────
    rider = await db.get(Rider, req.rider_id)
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")

    # ── Step 1: Parallel agent votes ─────────────────────────
    month = datetime.utcnow().month
    trigger_vote, risk_score, zone_activity = await asyncio.gather(
        trigger_agent.check(req.zone_id),
        risk_agent.score(req.zone_id, month=month, persona=rider.persona),
        _zone_activity_check(req.zone_id, db),
    )
    risk_vote  = risk_score > 0.6
    zone_vote  = not zone_activity   # True = activity dropped

    agent_votes = {
        "trigger": trigger_vote,
        "risk":    risk_vote,
        "zone":    zone_vote,
    }
    consensus = sum(agent_votes.values())

    # ── Step 2: 2-of-3 consensus ─────────────────────────────
    if consensus < 2:
        claim = Claim(
            id=str(uuid.uuid4()), rider_id=req.rider_id, zone_id=req.zone_id,
            trigger_type="consensus_failed", trigger_value=str(agent_votes),
            agent_votes=agent_votes, fraud_passed=False,
            amount=0, status="rejected",
        )
        db.add(claim); await db.commit()
        return ClaimResponse(
            claim_id=claim.id, status="rejected",
            agent_votes=agent_votes, fraud_passed=False,
            amount=0, tx_hash=None, razorpay_payment_id=None,
            message=f"2-of-3 consensus not met ({consensus}/3 agents voted yes).",
        )

    # ── Step 3: FraudAgent gate ──────────────────────────────
    fraud_passed, fraud_details = await fraud_agent.validate(
        req.rider_id, req.zone_id, db
    )
    claim_id = str(uuid.uuid4())

    if not fraud_passed:
        claim = Claim(
            id=claim_id, rider_id=req.rider_id, zone_id=req.zone_id,
            trigger_type="fraud_check_failed", trigger_value=str(fraud_details),
            agent_votes=agent_votes, fraud_passed=False,
            amount=0, status="rejected",
        )
        db.add(claim); await db.commit()
        return ClaimResponse(
            claim_id=claim_id, status="rejected",
            agent_votes=agent_votes, fraud_passed=False,
            amount=0, tx_hash=None, razorpay_payment_id=None,
            message="Fraud validation failed.",
        )

    # ── Step 4: Payout + blockchain ──────────────────────────
    amount = 300.0
    payout_res = await payout_agent.disburse(
        rider_id=req.rider_id, phone=rider.phone,
        amount=amount, claim_id=claim_id, zone_name=rider.zone_name,
    )
    tx_hash = await log_claim_on_chain(claim_id, req.rider_id, req.zone_id, agent_votes)

    claim = Claim(
        id=claim_id, rider_id=req.rider_id, zone_id=req.zone_id,
        trigger_type="disruption", trigger_value=str(agent_votes),
        agent_votes=agent_votes, fraud_passed=True,
        amount=amount, status="approved",
        tx_hash=tx_hash,
        razorpay_payment_id=payout_res.get("razorpay_payment_id"),
    )
    db.add(claim); await db.commit()

    return ClaimResponse(
        claim_id=claim_id, status="approved",
        agent_votes=agent_votes, fraud_passed=True,
        amount=amount, tx_hash=tx_hash,
        razorpay_payment_id=payout_res.get("razorpay_payment_id"),
        message=f"Claim approved! ₹{int(amount)} sent to UPI. TX: {tx_hash}",
    )


async def _zone_activity_check(zone_id: str, db: AsyncSession) -> bool:
    """Returns True if zone activity is NORMAL (above 30% baseline). False = dropped."""
    result = await db.execute(
        select(ZoneRisk).where(ZoneRisk.zone_id == zone_id)
    )
    zr = result.scalar_one_or_none()
    if not zr:
        return True  # No data = assume normal
    # If active_riders < 30% of zone avg (100), activity dropped
    return zr.active_riders >= 30


@router.get("/claims/{rider_id}")
async def get_rider_claims(rider_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Claim).where(Claim.rider_id == rider_id).order_by(Claim.created_at.desc())
    )
    claims = result.scalars().all()
    return [
        {
            "claim_id":    c.id,
            "zone_id":     c.zone_id,
            "trigger":     c.trigger_type,
            "agent_votes": c.agent_votes,
            "amount":      c.amount,
            "status":      c.status,
            "tx_hash":     c.tx_hash,
            "date":        c.created_at.isoformat(),
        }
        for c in claims
    ]
