"""
GigShield AI — XGBoost Zone Risk Model Training Script
Generates synthetic training data and trains a binary classifier.
Saves the model as zone_risk_model.pkl for FastAPI RiskAgent to load.

Usage:
    cd ml/
    python train_model.py
"""
import numpy as np
import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from xgboost import XGBClassifier

SEED = 42
np.random.seed(SEED)
N_SAMPLES = 5000

# ── Feature engineering ────────────────────────────────────────────────────────
print("🔧 Generating synthetic training data...")

months = np.random.randint(1, 13, N_SAMPLES)
zone_nums = np.random.randint(1, 8, N_SAMPLES)

# Zone-specific flood/heat/strike priors
ZONE_PRIORS = {
    1: (0.4, 0.5, 0.3),
    2: (0.6, 0.5, 0.4),
    3: (0.9, 0.7, 0.5),
    4: (0.5, 0.8, 0.25),
    5: (0.6, 0.55, 0.35),
    6: (0.7, 0.65, 0.45),
    7: (0.2, 0.4, 0.15),
}

flood_risk  = np.array([ZONE_PRIORS[z][0] + np.random.normal(0, 0.05) for z in zone_nums]).clip(0, 1)
heat_risk   = np.array([ZONE_PRIORS[z][1] + np.random.normal(0, 0.05) for z in zone_nums]).clip(0, 1)
strike_risk = np.array([ZONE_PRIORS[z][2] + np.random.normal(0, 0.05) for z in zone_nums]).clip(0, 1)

# Monsoon season boost (Jun–Sep = months 6–9)
monsoon = np.where((months >= 6) & (months <= 9), 1, 0)
flood_risk = (flood_risk + monsoon * 0.2).clip(0, 1)

# Cyclical month encoding
month_sin = np.sin(2 * np.pi * months / 12)
month_cos = np.cos(2 * np.pi * months / 12)

# Persona (1 = q-commerce = higher risk from rain/AQI sensitivity)
is_qcom = np.random.choice([0, 1], N_SAMPLES, p=[0.3, 0.7])

# Label: disruption occurred if weighted risk exceeds threshold
disruption_score = (
    0.5 * flood_risk +
    0.25 * heat_risk +
    0.15 * strike_risk +
    0.1 * monsoon
) + np.random.normal(0, 0.05, N_SAMPLES)
disruption_score = disruption_score.clip(0, 1)
labels = (disruption_score > 0.6).astype(int)

# Build DataFrame
df = pd.DataFrame({
    "flood_risk":  flood_risk,
    "heat_risk":   heat_risk,
    "strike_risk": strike_risk,
    "month_sin":   month_sin,
    "month_cos":   month_cos,
    "is_qcom":     is_qcom.astype(float),
    "label":       labels,
})

print(f"   Samples: {len(df)} | Disruption rate: {labels.mean():.1%}")

# ── Train / test split ─────────────────────────────────────────────────────────
X = df.drop("label", axis=1)
y = df["label"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED, stratify=y)

# ── Train XGBoost ──────────────────────────────────────────────────────────────
print("\n🚀 Training XGBoost classifier...")
model = XGBClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.08,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=(y_train == 0).sum() / (y_train == 1).sum(),
    use_label_encoder=False,
    eval_metric="logloss",
    random_state=SEED,
    verbosity=0,
)
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

# ── Evaluate ──────────────────────────────────────────────────────────────────
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_prob)
print(f"\n📊 Test ROC-AUC: {auc:.4f}")
print(classification_report(y_test, y_pred, target_names=["No Disruption", "Disruption"]))

# ── Feature importance ────────────────────────────────────────────────────────
print("📌 Feature Importances:")
for feat, imp in sorted(zip(X.columns, model.feature_importances_), key=lambda x: -x[1]):
    print(f"   {feat:20s} {imp:.4f}")

# ── Save model ────────────────────────────────────────────────────────────────
OUTPUT = Path(__file__).parent / "zone_risk_model.pkl"
joblib.dump(model, OUTPUT)
print(f"\n✅ Model saved to {OUTPUT}")
print("   Copy to backend/ml/ and set MODEL_PATH in risk_agent.py")
