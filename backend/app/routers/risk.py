"""Risk score router."""
from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.risk_agent import RiskAgent
from datetime import datetime

router = APIRouter()
risk_agent = RiskAgent()


@router.get("/risk-score/{zone_id}")
async def get_risk_score(zone_id: str, persona: str = "qcom"):
    month = datetime.utcnow().month
    score = await risk_agent.score(zone_id, month=month, persona=persona)
    multiplier = risk_agent.multiplier(score)
    addons = 20.0 if multiplier > 1.1 else (10.0 if multiplier > 0.95 else 0.0)
    return {
        "zone_id": zone_id,
        "risk_score": round(score, 3),
        "multiplier": multiplier,
        "base_premium": 99,
        "addons": addons,
        "total_premium": round(99 * multiplier + addons, 2),
    }
