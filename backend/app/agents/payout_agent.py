"""
PayoutAgent — triggers Razorpay sandbox payout + Firebase FCM push.
"""
import os
import logging
import aiohttp
import asyncio
from datetime import datetime

logger = logging.getLogger(__name__)

RAZORPAY_KEY_ID     = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
FIREBASE_SERVER_KEY = os.getenv("FIREBASE_SERVER_KEY", "")


class PayoutAgent:

    async def disburse(
        self,
        rider_id: str,
        phone: str,
        amount: float,
        claim_id: str,
        zone_name: str,
    ) -> dict:
        """
        1. Initiate Razorpay sandbox payout
        2. Send Firebase FCM push notification
        Returns payout result dict.
        """
        results = await asyncio.gather(
            self._razorpay_payout(phone, amount, claim_id),
            self._fcm_push(phone, amount, zone_name),
            return_exceptions=True,
        )

        payout_res  = results[0] if not isinstance(results[0], Exception) else {"id": f"rz_{claim_id[:8]}", "status": "sandbox"}
        fcm_res     = results[1] if not isinstance(results[1], Exception) else {"success": True}

        return {
            "razorpay_payment_id": payout_res.get("id", f"rz_sandbox_{claim_id[:8]}"),
            "fcm_sent":            fcm_res.get("success", True),
            "amount":              amount,
            "disbursed_at":        datetime.utcnow().isoformat(),
        }

    async def _razorpay_payout(self, phone: str, amount: float, claim_id: str) -> dict:
        """Create Razorpay sandbox payout (paise = amount * 100)."""
        if not RAZORPAY_KEY_ID:
            logger.info(f"Razorpay sandbox: mock payout ₹{amount} to {phone}")
            return {"id": f"rz_mock_{claim_id[:8]}", "status": "processed"}

        url = "https://api.razorpay.com/v1/payouts"
        payload = {
            "account_number": "2323230000000000",   # test account
            "amount":         int(amount * 100),
            "currency":       "INR",
            "mode":           "UPI",
            "purpose":        "payout",
            "fund_account": {
                "account_type": "vpa",
                "vpa":          {"address": f"{phone}@upi"},
                "contact": {
                    "name":    phone,
                    "contact": phone,
                    "type":    "customer",
                },
            },
            "queue_if_low_balance": True,
            "reference_id":   claim_id,
            "narration":      "GigShield Disruption Payout",
        }
        try:
            async with aiohttp.ClientSession() as s:
                async with s.post(
                    url, json=payload,
                    auth=aiohttp.BasicAuth(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as r:
                    return await r.json()
        except Exception as exc:
            logger.error(f"Razorpay error: {exc}")
            return {"id": f"rz_err_{claim_id[:8]}", "status": "error"}

    async def _fcm_push(self, phone: str, amount: float, zone_name: str) -> dict:
        """Send Firebase FCM push notification."""
        if not FIREBASE_SERVER_KEY:
            logger.info(f"FCM sandbox: mock push to {phone} — ₹{amount} payout")
            return {"success": True}

        url = "https://fcm.googleapis.com/fcm/send"
        payload = {
            "to":           f"/topics/rider_{phone}",
            "notification": {
                "title": "🛡️ GigShield — Payout Sent!",
                "body":  f"Disruption in {zone_name}. ₹{int(amount)} shielded — check UPI.",
            },
            "data": {"amount": str(amount), "zone": zone_name},
        }
        try:
            async with aiohttp.ClientSession() as s:
                async with s.post(
                    url, json=payload,
                    headers={"Authorization": f"key={FIREBASE_SERVER_KEY}"},
                    timeout=aiohttp.ClientTimeout(total=8),
                ) as r:
                    return await r.json()
        except Exception:
            return {"success": True}   # best-effort
