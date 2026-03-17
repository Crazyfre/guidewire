"""
RiskAgent — XGBoost zone risk scoring.
Loads pre-trained model and scores zones in < 100ms.
"""
import os
import asyncio
import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent.parent / "ml" / "zone_risk_model.pkl"

# Zone feature lookup (fallback if model not trained yet)
ZONE_DEFAULTS: dict[str, float] = {
    "Z1": 0.38, "Z2": 0.55, "Z3": 0.85,
    "Z4": 0.60, "Z5": 0.63, "Z6": 0.71, "Z7": 0.28,
}


class RiskAgent:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if MODEL_PATH.exists():
            try:
                self.model = joblib.load(MODEL_PATH)
            except Exception:
                self.model = None

    def _features(self, zone_id: str, month: int, persona: str) -> np.ndarray:
        """Build feature vector: [flood_risk, heat_risk, strike_history, month_sin, month_cos, is_qcom]."""
        zone_num = int(zone_id.replace("Z", "")) if zone_id.startswith("Z") else 3
        flood = [0.9, 0.7, 0.85, 0.5, 0.6, 0.7, 0.2][min(zone_num - 1, 6)]
        heat  = [0.6, 0.5, 0.7, 0.8, 0.55, 0.65, 0.4][min(zone_num - 1, 6)]
        strike = [0.3, 0.4, 0.5, 0.25, 0.35, 0.45, 0.15][min(zone_num - 1, 6)]
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)
        is_qcom = 1.0 if persona == "qcom" else 0.0
        return np.array([[flood, heat, strike, month_sin, month_cos, is_qcom]])

    async def score(self, zone_id: str, month: int = 3, persona: str = "qcom") -> float:
        """Return risk score 0–1 for a zone. Uses XGBoost model or fallback lookup."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._score_sync, zone_id, month, persona)

    def _score_sync(self, zone_id: str, month: int, persona: str) -> float:
        if self.model is not None:
            try:
                feats = self._features(zone_id, month, persona)
                return float(self.model.predict_proba(feats)[0][1])
            except Exception:
                pass
        return ZONE_DEFAULTS.get(zone_id, 0.5)

    def multiplier(self, risk_score: float) -> float:
        """Convert risk score to premium multiplier (0.8 – 1.3)."""
        return round(0.8 + risk_score * 0.5, 2)
