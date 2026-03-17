"""
Blockchain helper — calls the local Hardhat ClaimLedger.sol via web3.py.
Falls back to a deterministic hash for sandbox / demo mode when no node is running.
"""
import os
import hashlib
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

HARDHAT_RPC  = os.getenv("HARDHAT_RPC_URL", "http://127.0.0.1:8545")
CONTRACT_ADDR = os.getenv("CLAIM_LEDGER_ADDRESS", "")

# Minimal ABI for ClaimLedger.sol
CLAIM_LEDGER_ABI = [
    {
        "inputs": [
            {"name": "claimId",   "type": "string"},
            {"name": "riderId",   "type": "string"},
            {"name": "zoneId",    "type": "string"},
            {"name": "agentVotes","type": "uint8"},
            {"name": "amount",    "type": "uint256"},
        ],
        "name": "logClaim",
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable",
    },
    {
        "inputs": [
            {"name": "policyId",    "type": "string"},
            {"name": "riderId",     "type": "string"},
            {"name": "zoneId",      "type": "string"},
            {"name": "premiumWei",  "type": "uint256"},
        ],
        "name": "logPolicy",
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable",
    },
]


def _sandbox_hash(data: str) -> str:
    """Generate deterministic hex hash for demo/sandbox mode."""
    return "0x" + hashlib.sha256(data.encode()).hexdigest()


async def log_claim_on_chain(
    claim_id: str,
    rider_id: str,
    zone_id: str,
    agent_votes: dict,
) -> str:
    """Log a claim to ClaimLedger.sol. Returns TX hash."""
    votes_count = sum(1 for v in agent_votes.values() if v)
    amount_inr = 300

    if not CONTRACT_ADDR:
        # Sandbox: return deterministic hash
        data = f"{claim_id}:{rider_id}:{zone_id}:{votes_count}:{datetime.utcnow().date()}"
        return _sandbox_hash(data)

    try:
        from web3 import AsyncWeb3
        w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(HARDHAT_RPC))
        contract = w3.eth.contract(address=CONTRACT_ADDR, abi=CLAIM_LEDGER_ABI)
        account = (await w3.eth.accounts)[0]
        tx = await contract.functions.logClaim(
            claim_id, rider_id, zone_id, votes_count, amount_inr
        ).transact({"from": account})
        receipt = await w3.eth.wait_for_transaction_receipt(tx)
        return receipt.transactionHash.hex()
    except Exception as exc:
        logger.warning(f"Blockchain log failed (using sandbox hash): {exc}")
        data = f"{claim_id}:{rider_id}:{zone_id}:{votes_count}"
        return _sandbox_hash(data)


async def log_policy_on_chain(
    policy_id: str,
    rider_id: str,
    zone_id: str,
    premium: float,
) -> str:
    """Log a policy creation to ClaimLedger.sol. Returns TX hash."""
    if not CONTRACT_ADDR:
        data = f"policy:{policy_id}:{rider_id}:{zone_id}"
        return _sandbox_hash(data)

    try:
        from web3 import AsyncWeb3
        w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(HARDHAT_RPC))
        contract = w3.eth.contract(address=CONTRACT_ADDR, abi=CLAIM_LEDGER_ABI)
        account = (await w3.eth.accounts)[0]
        tx = await contract.functions.logPolicy(
            policy_id, rider_id, zone_id, int(premium * 100)
        ).transact({"from": account})
        receipt = await w3.eth.wait_for_transaction_receipt(tx)
        return receipt.transactionHash.hex()
    except Exception as exc:
        logger.warning(f"Policy blockchain log failed: {exc}")
        return _sandbox_hash(f"policy:{policy_id}:{rider_id}")
