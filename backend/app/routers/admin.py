"""Admin router — insurer/admin analytics."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import Claim, Rider, ZoneRisk

router = APIRouter()


@router.get("/admin/stats")
async def admin_stats(db: AsyncSession = Depends(get_db)):
    total_riders   = (await db.execute(select(func.count(Rider.id)))).scalar_one()
    total_claims   = (await db.execute(select(func.count(Claim.id)))).scalar_one()
    approved       = (await db.execute(select(func.count(Claim.id)).where(Claim.status == "approved"))).scalar_one()
    total_payout   = (await db.execute(select(func.sum(Claim.amount)).where(Claim.status == "approved"))).scalar_one() or 0
    fraud_rejected = (await db.execute(select(func.count(Claim.id)).where(Claim.status == "rejected"))).scalar_one()
    return {
        "total_riders":   total_riders,
        "total_claims":   total_claims,
        "approved_claims": approved,
        "total_payout":   total_payout,
        "fraud_rejected": fraud_rejected,
        "fraud_rate":     round(fraud_rejected / max(total_claims, 1) * 100, 2),
        "loss_ratio":     round(total_payout / max(total_riders * 99, 1) * 100, 2),
    }


@router.get("/admin/zones")
async def zone_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ZoneRisk))
    zones = result.scalars().all()
    return [{"zone_id": z.zone_id, "risk_score": z.risk_score, "active_riders": z.active_riders} for z in zones]
