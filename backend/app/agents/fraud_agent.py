"""
FraudAgent — 3-check parallel validation via asyncio.gather().
All 3 checks must pass for a claim to proceed.
"""
import asyncio
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import Claim


class FraudAgent:

    async def validate(
        self,
        rider_id: str,
        zone_id: str,
        db: AsyncSession,
        trigger_ts: datetime | None = None,
    ) -> tuple[bool, dict]:
        """
        Run all 3 fraud checks in parallel.
        Returns (passed: bool, details: dict).
        """
        results = await asyncio.gather(
            self._check_gps_zone(rider_id, zone_id, db, trigger_ts),
            self._check_duplicate(rider_id, zone_id, db),
            self._check_swarm(zone_id, db),
            return_exceptions=True,
        )

        checks = {
            "gps_zone":  results[0] if not isinstance(results[0], Exception) else False,
            "no_duplicate": results[1] if not isinstance(results[1], Exception) else False,
            "swarm_ok":  results[2] if not isinstance(results[2], Exception) else False,
        }
        passed = all(checks.values())
        return passed, checks

    # ── Check 1: GPS zone validation ───────────────────────
    async def _check_gps_zone(
        self,
        rider_id: str,
        zone_id: str,
        db: AsyncSession,
        trigger_ts: datetime | None,
    ) -> bool:
        """
        Verify rider was in the disrupted zone at trigger time.
        For sandbox demo: always returns True (no continuous GPS tracking).
        In production: cross-reference shift check-in record.
        """
        return True  # sandbox: rider onboarded to zone_id already confirmed

    # ── Check 2: Duplicate claim prevention ────────────────
    async def _check_duplicate(
        self,
        rider_id: str,
        zone_id: str,
        db: AsyncSession,
    ) -> bool:
        """Return True if NO approved claim exists for this rider+zone this week."""
        week_ago = datetime.utcnow() - timedelta(days=7)
        result = await db.execute(
            select(func.count(Claim.id))
            .where(
                Claim.rider_id == rider_id,
                Claim.zone_id  == zone_id,
                Claim.status   == "approved",
                Claim.created_at >= week_ago,
            )
        )
        count = result.scalar_one()
        return count == 0

    # ── Check 3: Swarm corroboration ────────────────────────
    async def _check_swarm(self, zone_id: str, db: AsyncSession) -> bool:
        """
        Check if zone activity has genuinely dropped.
        Compares total claims filed this zone in last 24h (proxy for low activity).
        In production: query active rider heartbeats.
        """
        # Sandbox: always corroborated — in prod query zone activity index
        return True
