"""
TriggerAgent — polls OpenWeatherMap + NewsAPI every 10 minutes.
Emits disruption signals that feed the 2-of-3 consensus vote.
"""
import os
import asyncio
import logging
import aiohttp
from datetime import datetime

logger = logging.getLogger(__name__)

# ── Thresholds ──────────────────────────────────────────────
RAIN_THRESHOLD_MM    = float(os.getenv("RAIN_THRESHOLD_MM", 15))
HEAT_THRESHOLD_C     = float(os.getenv("HEAT_THRESHOLD_C",  42))
AQI_THRESHOLD        = int(os.getenv("AQI_THRESHOLD",      300))
POLL_INTERVAL_SEC    = int(os.getenv("TRIGGER_POLL_INTERVAL", 600))  # 10 min

# Zone → city mapping for OWM
ZONE_CITY = {
    "Z1": "Bengaluru", "Z2": "Bengaluru", "Z3": "Mumbai",
    "Z4": "Pune",      "Z5": "Mumbai",    "Z6": "Thane",  "Z7": "Bengaluru",
}

# Strike keywords for NewsAPI
STRIKE_KEYWORDS = ["curfew", "bandh", "strike", "protest blockade", "road block"]


class TriggerAgent:
    def __init__(self):
        self.owm_key  = os.getenv("OPENWEATHERMAP_API_KEY", "")
        self.news_key = os.getenv("NEWSAPI_KEY", "")
        self._signals: dict[str, dict] = {}   # zone_id → latest signal

    # ── Public API ──────────────────────────────────────────

    async def check(self, zone_id: str) -> bool:
        """Return True if any weather/news trigger is breached for this zone."""
        city = ZONE_CITY.get(zone_id, "Mumbai")
        results = await asyncio.gather(
            self._check_weather(city),
            self._check_news(city),
            return_exceptions=True,
        )
        breached = any(r is True for r in results)
        self._signals[zone_id] = {
            "breached": breached,
            "weather":  results[0] if not isinstance(results[0], Exception) else False,
            "news":     results[1] if not isinstance(results[1], Exception) else False,
            "ts":       datetime.utcnow().isoformat(),
        }
        return breached

    def latest_signal(self, zone_id: str) -> dict:
        return self._signals.get(zone_id, {"breached": False, "ts": None})

    # ── Background polling loop ─────────────────────────────

    async def poll_loop(self):
        while True:
            logger.info("TriggerAgent — polling all zones...")
            for zone_id in ZONE_CITY:
                try:
                    await self.check(zone_id)
                except Exception as exc:
                    logger.warning(f"TriggerAgent poll error for {zone_id}: {exc}")
            await asyncio.sleep(POLL_INTERVAL_SEC)

    # ── Internal checks ─────────────────────────────────────

    async def _check_weather(self, city: str) -> bool:
        if not self.owm_key:
            return False
        url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?q={city},IN&appid={self.owm_key}&units=metric"
        )
        try:
            async with aiohttp.ClientSession() as s:
                async with s.get(url, timeout=aiohttp.ClientTimeout(total=8)) as r:
                    data = await r.json()
            rain_1h = data.get("rain", {}).get("1h", 0)
            temp    = data.get("main", {}).get("temp", 0)
            return rain_1h > RAIN_THRESHOLD_MM or temp > HEAT_THRESHOLD_C
        except Exception:
            return False

    async def _check_news(self, city: str) -> bool:
        if not self.news_key:
            return False
        q = " OR ".join(STRIKE_KEYWORDS[:3]) + f" {city}"
        url = (
            f"https://newsapi.org/v2/everything"
            f"?q={q}&language=en&sortBy=publishedAt&pageSize=5&apiKey={self.news_key}"
        )
        try:
            async with aiohttp.ClientSession() as s:
                async with s.get(url, timeout=aiohttp.ClientTimeout(total=8)) as r:
                    data = await r.json()
            articles = data.get("articles", [])
            return len(articles) > 0
        except Exception:
            return False
