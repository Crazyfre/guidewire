"""Triggers router — manual polling + latest signals."""
from fastapi import APIRouter
from app.agents.trigger_agent import TriggerAgent

router = APIRouter()
trigger_agent = TriggerAgent()


@router.get("/trigger-check/{zone_id}")
async def trigger_check(zone_id: str):
    breached = await trigger_agent.check(zone_id)
    signal = trigger_agent.latest_signal(zone_id)
    return {"zone_id": zone_id, "breached": breached, "signal": signal}


@router.get("/triggers/latest")
async def all_signals():
    from app.agents.trigger_agent import ZONE_CITY
    results = {}
    for zone_id in ZONE_CITY:
        results[zone_id] = trigger_agent.latest_signal(zone_id)
    return results
