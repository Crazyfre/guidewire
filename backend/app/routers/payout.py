"""Payout router — manual payout trigger for admin."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Rider
from app.agents.payout_agent import PayoutAgent

router = APIRouter()
payout_agent = PayoutAgent()


class PayoutRequest(BaseModel):
    rider_id: str
    amount: float
    claim_id: str


@router.post("/payout")
async def manual_payout(req: PayoutRequest, db: AsyncSession = Depends(get_db)):
    rider = await db.get(Rider, req.rider_id)
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    result = await payout_agent.disburse(
        rider_id=req.rider_id, phone=rider.phone,
        amount=req.amount, claim_id=req.claim_id,
        zone_name=rider.zone_name,
    )
    return result
