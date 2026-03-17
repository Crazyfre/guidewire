"""SQLAlchemy ORM models for GigShield."""
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class Rider(Base):
    __tablename__ = "riders"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(128))
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    persona: Mapped[str] = mapped_column(String(32))       # "qcom" | "food"
    zone_id: Mapped[str] = mapped_column(String(16))       # e.g. "Z3"
    zone_name: Mapped[str] = mapped_column(String(64))
    hashed_password: Mapped[str] = mapped_column(String(256))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    policies: Mapped[list["Policy"]] = relationship(back_populates="rider")
    claims: Mapped[list["Claim"]] = relationship(back_populates="rider")


class Policy(Base):
    __tablename__ = "policies"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    rider_id: Mapped[str] = mapped_column(ForeignKey("riders.id"))
    zone_id: Mapped[str] = mapped_column(String(16))
    base_premium: Mapped[float] = mapped_column(Float, default=99.0)
    risk_multiplier: Mapped[float] = mapped_column(Float, default=1.0)
    addons: Mapped[float] = mapped_column(Float, default=0.0)
    total_premium: Mapped[float] = mapped_column(Float)
    coverage_amount: Mapped[float] = mapped_column(Float, default=300.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    tx_hash: Mapped[str] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    renews_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    rider: Mapped["Rider"] = relationship(back_populates="policies")


class Claim(Base):
    __tablename__ = "claims"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    rider_id: Mapped[str] = mapped_column(ForeignKey("riders.id"))
    zone_id: Mapped[str] = mapped_column(String(16))
    trigger_type: Mapped[str] = mapped_column(String(64))  # "rain", "heat", "aqi", "strike", "activity"
    trigger_value: Mapped[str] = mapped_column(String(64))
    agent_votes: Mapped[dict] = mapped_column(JSON)         # {"trigger": True, "risk": True, "zone": True}
    fraud_passed: Mapped[bool] = mapped_column(Boolean, default=False)
    amount: Mapped[float] = mapped_column(Float, default=300.0)
    status: Mapped[str] = mapped_column(String(32), default="pending")  # pending|approved|rejected
    tx_hash: Mapped[str] = mapped_column(String(128), nullable=True)
    razorpay_payment_id: Mapped[str] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    rider: Mapped["Rider"] = relationship(back_populates="claims")


class ZoneRisk(Base):
    __tablename__ = "zone_risks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    zone_id: Mapped[str] = mapped_column(String(16), index=True)
    risk_score: Mapped[float] = mapped_column(Float)
    active_riders: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
