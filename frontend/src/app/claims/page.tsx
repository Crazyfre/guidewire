"use client";
import { useState } from "react";
import Link from "next/link";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e1a;color:#e8eaf6;font-family:'Syne',sans-serif}
.page{min-height:100vh;position:relative}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(99,179,237,.04)1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.04)1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;max-width:1000px;margin:0 auto;padding:32px 24px}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.06)}
.logo{font-weight:800;font-size:20px;letter-spacing:-1px}.logo span{color:#63b3ed}

/* FILTER BAR */
.filter-bar{display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap}
.filter-btn{padding:8px 16px;border-radius:6px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px;cursor:pointer;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#718096;transition:all .2s}
.filter-btn.active{background:rgba(99,179,237,.12);border-color:rgba(99,179,237,.4);color:#63b3ed}

/* CLAIM CARD */
.claim-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px;margin-bottom:12px;transition:border-color .2s;cursor:pointer}
.claim-card:hover{border-color:rgba(99,179,237,.25)}
.claim-card.expanded{border-color:rgba(99,179,237,.35)}
.claim-top{display:flex;align-items:center;gap:14px}
.claim-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.claim-main{flex:1}
.claim-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:4px}
.claim-meta{font-size:11px;font-family:'Space Mono',monospace;color:#718096;display:flex;gap:16px;flex-wrap:wrap}
.claim-right{text-align:right}
.claim-amount{font-size:22px;font-weight:800;color:#68d391}
.claim-tag{display:inline-block;padding:3px 8px;border-radius:4px;font-size:10px;font-family:'Space Mono',monospace;font-weight:700;margin-top:4px}

/* EXPANDED */
.claim-expand{margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06)}
.expand-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
@media(max-width:600px){.expand-grid{grid-template-columns:1fr 1fr}}
.exp-item{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:12px}
.exp-label{font-size:10px;font-family:'Space Mono',monospace;color:#718096;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px}
.exp-val{font-size:13px;font-weight:700;color:#e8eaf6}

/* TX HASH */
.tx-section{background:rgba(104,211,145,.05);border:1px solid rgba(104,211,145,.2);border-radius:8px;padding:14px}
.tx-label{font-size:10px;font-family:'Space Mono',monospace;color:#68d391;margin-bottom:6px;letter-spacing:1px;text-transform:uppercase}
.tx-hash{font-size:12px;font-family:'Space Mono',monospace;color:#81e6d9;word-break:break-all;line-height:1.6}
.tx-copy{display:inline-block;margin-top:8px;background:rgba(104,211,145,.1);border:1px solid rgba(104,211,145,.25);color:#68d391;padding:4px 10px;border-radius:4px;font-size:10px;font-family:'Space Mono',monospace;cursor:pointer;transition:opacity .2s}
.tx-copy:hover{opacity:.75}

/* AGENTS VOTE */
.votes-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.vote-chip{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:11px;font-family:'Space Mono',monospace}
.vote-yes{background:rgba(104,211,145,.1);border:1px solid rgba(104,211,145,.25);color:#68d391}
.vote-no{background:rgba(252,129,129,.1);border:1px solid rgba(252,129,129,.25);color:#fc8181}

/* SUMMARY */
.summary-bar{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap}
.sum-chip{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:10px 16px;font-family:'Space Mono',monospace;font-size:12px}
.sum-num{font-size:18px;font-weight:800;margin-bottom:2px}

/* FOOTER */
.footer-nav{display:flex;gap:12px;justify-content:center;margin-top:16px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06)}
.fn-link{font-family:'Space Mono',monospace;font-size:11px;color:#718096;padding:8px 16px;border-radius:6px;border:1px solid rgba(255,255,255,.08);transition:all .2s}
.fn-link:hover{color:#e8eaf6;border-color:rgba(255,255,255,.18)}
`;

const CLAIMS = [
  {
    id: "CLM-2026-0018",
    icon: "🌧️", bg: "rgba(99,179,237,.15)",
    title: "Heavy Rain — Andheri-East Zone 3",
    date: "Mar 14, 2026 · 14:32 IST", zone: "Andheri-East (Zone 3)",
    trigger: "Rainfall 18.4mm/hr", amount: "₹300", status: "PAID",
    tagColor: "#68d391", tagBg: "rgba(104,211,145,.12)",
    txHash: "0x8f3e2a1c9d4b7f5e0a2c8b3d1e9f4a7c2b5d8e0f3a1c6b9d4e7f0a2c5b8d1e4",
    agents: [
      { name: "TriggerAgent", vote: true, reason: "OWM: 18.4mm/hr > 15mm/hr threshold" },
      { name: "RiskAgent", vote: true, reason: "Zone risk score: 0.71 > 0.6" },
      { name: "ZoneAgent", vote: true, reason: "Activity drop: 34% of baseline" },
      { name: "FraudAgent", vote: true, reason: "GPS ✓ · No duplicate ✓ · Swarm ✓" },
    ],
    details: [
      { label: "Rider", val: "Ramesh Kumar" }, { label: "Phone", val: "98765-43210" },
      { label: "Policy", val: "GS-2026-0103" }, { label: "Premium Paid", val: "₹149/wk" },
      { label: "Payout Method", val: "UPI (Razorpay)" }, { label: "Block Height", val: "#48271" },
    ],
  },
  {
    id: "CLM-2026-0015",
    icon: "📉", bg: "rgba(252,129,129,.15)",
    title: "Zone Activity Drop — Zone 3",
    date: "Mar 10, 2026 · 09:17 IST", zone: "Andheri-East (Zone 3)",
    trigger: "Zone activity: 22% baseline", amount: "₹300", status: "PAID",
    tagColor: "#68d391", tagBg: "rgba(104,211,145,.12)",
    txHash: "0x4c2b7f1a9e3d6c0b8f2a5d9e1c4b7a0f3d6c2b5a8f1e4d7c0b3a6f9e2c5b8d1",
    agents: [
      { name: "TriggerAgent", vote: false, reason: "No weather threshold breached" },
      { name: "RiskAgent", vote: true, reason: "Zone risk score: 0.71" },
      { name: "ZoneAgent", vote: true, reason: "Activity: 22% < 30% threshold" },
      { name: "FraudAgent", vote: true, reason: "GPS ✓ · No duplicate ✓ · Swarm ✓" },
    ],
    details: [
      { label: "Rider", val: "Ramesh Kumar" }, { label: "Phone", val: "98765-43210" },
      { label: "Policy", val: "GS-2026-0103" }, { label: "Premium Paid", val: "₹149/wk" },
      { label: "Payout Method", val: "UPI (Razorpay)" }, { label: "Block Height", val: "#48189" },
    ],
  },
  {
    id: "CLM-2026-0011",
    icon: "🚫", bg: "rgba(246,173,85,.15)",
    title: "Curfew / Strike — Andheri-East",
    date: "Mar 3, 2026 · 11:55 IST", zone: "Andheri-East (Zone 3)",
    trigger: "NewsAPI keyword: 'bandh andheri'", amount: "₹300", status: "PAID",
    tagColor: "#68d391", tagBg: "rgba(104,211,145,.12)",
    txHash: "0x2d7a6b3f1c9e4a8b0f2d5c8a1e4b7f0c3a6d9b2e5f8c1d4a7b0e3f6c9b2d5a8",
    agents: [
      { name: "TriggerAgent", vote: true, reason: "NewsAPI: 'bandh andheri' detected" },
      { name: "RiskAgent", vote: true, reason: "Zone risk score: 0.71" },
      { name: "ZoneAgent", vote: true, reason: "Activity drop: 19% of baseline" },
      { name: "FraudAgent", vote: true, reason: "GPS ✓ · No duplicate ✓ · Swarm ✓" },
    ],
    details: [
      { label: "Rider", val: "Ramesh Kumar" }, { label: "Phone", val: "98765-43210" },
      { label: "Policy", val: "GS-2026-0103" }, { label: "Premium Paid", val: "₹149/wk" },
      { label: "Payout Method", val: "UPI (Razorpay)" }, { label: "Block Height", val: "#48072" },
    ],
  },
];

export default function ClaimsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  function copy(hash: string) {
    navigator.clipboard?.writeText(hash).catch(() => {});
    setCopied(hash);
    setTimeout(() => setCopied(null), 2000);
  }

  const filtered = filter === "ALL" ? CLAIMS : CLAIMS.filter(c => c.status === filter);

  return (
    <>
      <style>{S}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="wrap">
          <div className="topbar">
            <div className="logo">Gig<span>Shield</span> AI</div>
            <Link href="/dashboard" style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#718096" }}>← Dashboard</Link>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, color: "#fff", marginBottom: 6 }}>Claim History</h1>
            <p style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: "#718096" }}>Blockchain-verified · tamper-proof audit log · TX hash verifiable on Hardhat testnet</p>
          </div>

          <div className="summary-bar">
            {[
              { num: "₹900", label: "Total Received", color: "#68d391" },
              { num: "3", label: "Claims Filed", color: "#63b3ed" },
              { num: "3", label: "Auto-approved", color: "#b794f4" },
              { num: "0", label: "Rejected", color: "#fc8181" },
            ].map(s => (
              <div key={s.label} className="sum-chip">
                <div className="sum-num" style={{ color: s.color }}>{s.num}</div>
                <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: "#718096", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="filter-bar">
            {["ALL", "PAID", "PENDING", "REJECTED"].map(f => (
              <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {filtered.map(c => (
            <div key={c.id} className={`claim-card${expanded === c.id ? " expanded" : ""}`} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              <div className="claim-top">
                <div className="claim-icon" style={{ background: c.bg }}>{c.icon}</div>
                <div className="claim-main">
                  <div className="claim-title">{c.title}</div>
                  <div className="claim-meta">
                    <span>{c.id}</span>
                    <span>{c.date}</span>
                    <span>{c.trigger}</span>
                  </div>
                </div>
                <div className="claim-right">
                  <div className="claim-amount">{c.amount}</div>
                  <div className="claim-tag" style={{ background: c.tagBg, color: c.tagColor }}>
                    {c.status} {expanded === c.id ? "▲" : "▼"}
                  </div>
                </div>
              </div>

              {expanded === c.id && (
                <div className="claim-expand" onClick={e => e.stopPropagation()}>
                  <div className="expand-grid">
                    {c.details.map(d => (
                      <div key={d.label} className="exp-item">
                        <div className="exp-label">{d.label}</div>
                        <div className="exp-val">{d.val}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#a0aec0", marginBottom: 8, letterSpacing: 1 }}>AGENT VOTE BREAKDOWN</div>
                    <div className="votes-row">
                      {c.agents.map(a => (
                        <div key={a.name} className={`vote-chip ${a.vote ? "vote-yes" : "vote-no"}`} title={a.reason}>
                          {a.vote ? "✓" : "✗"} {a.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tx-section">
                    <div className="tx-label">⛓️ Blockchain TX Hash (ClaimLedger.sol)</div>
                    <div className="tx-hash">{c.txHash}</div>
                    <span className="tx-copy" onClick={() => copy(c.txHash)}>
                      {copied === c.txHash ? "✓ Copied!" : "Copy Hash"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="footer-nav">
            <Link href="/" className="fn-link">← Home</Link>
            <Link href="/dashboard" className="fn-link">Dashboard</Link>
            <Link href="/admin" className="fn-link">Admin View</Link>
          </div>
        </div>
      </div>
    </>
  );
}
