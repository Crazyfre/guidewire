// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ClaimLedger
 * @notice Tamper-proof audit log for Auxilia parametric insurance claims.
 *         Deployed on Hardhat local testnet (chainId 31337).
 *
 * Functions:
 *   logClaim()   — called by backend PayoutAgent after 2-of-3 consensus + fraud pass
 *   logPolicy()  — called on rider onboarding to anchor the policy hash
 *   getClaim()   — read claim by claimId
 *   getClaimsByRider() — paginated claim list for a rider
 */
contract ClaimLedger {

    // ── Structs ─────────────────────────────────────────────

    struct ClaimRecord {
        string  claimId;
        string  riderId;
        string  zoneId;
        uint8   agentVotes;     // count of YES votes (2 or 3 out of 3)
        uint256 amountINR;      // in whole rupees
        uint256 timestamp;
        bool    exists;
    }

    struct PolicyRecord {
        string  policyId;
        string  riderId;
        string  zoneId;
        uint256 premiumPaise;   // premium × 100 (e.g. 14900 = ₹149)
        uint256 timestamp;
        bool    exists;
    }

    // ── State ────────────────────────────────────────────────

    address public owner;
    uint256 public totalClaims;
    uint256 public totalPayoutINR;

    mapping(string => ClaimRecord)   public claims;    // claimId → record
    mapping(string => string[])      public riderClaims; // riderId → [claimIds]
    mapping(string => PolicyRecord)  public policies;  // policyId → record

    // ── Events ───────────────────────────────────────────────

    event ClaimLogged(
        string indexed claimId,
        string indexed riderId,
        string  zoneId,
        uint8   agentVotes,
        uint256 amountINR,
        uint256 timestamp
    );

    event PolicyLogged(
        string indexed policyId,
        string indexed riderId,
        string  zoneId,
        uint256 premiumPaise,
        uint256 timestamp
    );

    // ── Constructor ──────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorised");
        _;
    }

    // ── Write functions ──────────────────────────────────────

    /**
     * @notice Log an approved claim. Called by backend after full consensus + fraud pass.
     */
    function logClaim(
        string calldata claimId,
        string calldata riderId,
        string calldata zoneId,
        uint8           agentVotes,
        uint256         amountINR
    ) external onlyOwner {
        require(!claims[claimId].exists, "Claim already logged");
        require(agentVotes >= 2, "Minimum 2-of-3 consensus required");

        claims[claimId] = ClaimRecord({
            claimId:    claimId,
            riderId:    riderId,
            zoneId:     zoneId,
            agentVotes: agentVotes,
            amountINR:  amountINR,
            timestamp:  block.timestamp,
            exists:     true
        });

        riderClaims[riderId].push(claimId);
        totalClaims     += 1;
        totalPayoutINR  += amountINR;

        emit ClaimLogged(claimId, riderId, zoneId, agentVotes, amountINR, block.timestamp);
    }

    /**
     * @notice Log a new policy creation on rider onboarding.
     */
    function logPolicy(
        string calldata policyId,
        string calldata riderId,
        string calldata zoneId,
        uint256         premiumPaise
    ) external onlyOwner {
        require(!policies[policyId].exists, "Policy already logged");

        policies[policyId] = PolicyRecord({
            policyId:     policyId,
            riderId:      riderId,
            zoneId:       zoneId,
            premiumPaise: premiumPaise,
            timestamp:    block.timestamp,
            exists:       true
        });

        emit PolicyLogged(policyId, riderId, zoneId, premiumPaise, block.timestamp);
    }

    // ── Read functions ───────────────────────────────────────

    function getClaim(string calldata claimId)
        external view
        returns (ClaimRecord memory)
    {
        require(claims[claimId].exists, "Claim not found");
        return claims[claimId];
    }

    function getClaimCountByRider(string calldata riderId)
        external view
        returns (uint256)
    {
        return riderClaims[riderId].length;
    }

    function getClaimIdsByRider(string calldata riderId)
        external view
        returns (string[] memory)
    {
        return riderClaims[riderId];
    }

    function getPolicy(string calldata policyId)
        external view
        returns (PolicyRecord memory)
    {
        require(policies[policyId].exists, "Policy not found");
        return policies[policyId];
    }

    function getStats()
        external view
        returns (uint256 _totalClaims, uint256 _totalPayoutINR)
    {
        return (totalClaims, totalPayoutINR);
    }
}
