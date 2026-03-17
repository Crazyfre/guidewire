"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e1a;color:#e8eaf6;font-family:'Syne',sans-serif}
.page{min-height:100vh;position:relative}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(99,179,237,.04)1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.04)1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:32px 24px}

/* TOP BAR */
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.06)}
.logo{font-weight:800;font-size:20px;letter-spacing:-1px}
.logo span{color:#63b3ed}
.user-info{display:flex;align-items:center;gap:12px}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#63b3ed,#b794f4);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#0a0e1a}
.user-name{font-size:13px;font-weight:700}
.user-zone{font-size:11px;font-family:'Space Mono',monospace;color:#718096}
.shield-badge{background:rgba(104,211,145,.12);border:1px solid rgba(104,211,145,.3);color:#68d391;padding:6px 14px;border-radius:6px;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px;display:flex;align-items:center;gap:6px}
.shield-pulse{width:7px;height:7px;border-radius:50%;background:#68d391;animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

/* STATS ROW */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:32px}
@media(max-width:768px){.stats-row{grid-template-columns:1fr 1fr}}
.stat{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px;position:relative;overflow:hidden;transition:border-color .2s}
.stat:hover{border-color:rgba(99,179,237,.2)}
.stat-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.stat-icon{font-size:22px}
.stat-trend{font-size:10px;font-family:'Space Mono',monospace;padding:3px 7px;border-radius:4px}
.trend-up{background:rgba(104,211,145,.12);color:#68d391}
.trend-down{background:rgba(252,129,129,.12);color:#fc8181}
.stat-num{font-size:26px;font-weight:800;margin-bottom:3px}
.stat-label{font-size:11px;font-family:'Space Mono',monospace;color:#718096;text-transform:uppercase;letter-spacing:1px}

/* MAIN GRID */
.main-grid{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px}
@media(max-width:900px){.main-grid{grid-template-columns:1fr}}

/* CARD */
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:24px;margin-bottom:20px}
.card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.card-title{font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Space Mono',monospace;color:#a0aec0}
.view-all{font-size:11px;font-family:'Space Mono',monospace;color:#63b3ed;cursor:pointer}

/* ZONE RISK METER */
.risk-bar-wrap{margin-bottom:12px}
.risk-label-row{display:flex;justify-content:space-between;margin-bottom:6px}
.risk-label{font-size:12px;font-family:'Space Mono',monospace;color:#a0aec0}
.risk-score{font-size:12px;font-family:'Space Mono',monospace;color:#f6ad55;font-weight:700}
.risk-bar-bg{height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
.risk-bar-fill{height:100%;border-radius:99px;transition:width .8s ease}

/* CLAIM HISTORY */
.claim-item{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.claim-item:last-child{border-bottom:none}
.claim-dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.claim-info{flex:1}
.claim-title{font-size:13px;font-weight:700;color:#fff;margin-bottom:2px}
.claim-sub{font-size:11px;font-family:'Space Mono',monospace;color:#718096}
.claim-amount{text-align:right}
.claim-amt{font-size:15px;font-weight:800;color:#68d391}
.claim-status{font-size:10px;font-family:'Space Mono',monospace;color:#718096;text-transform:uppercase;letter-spacing:1px}

/* ACTIVE POLICY */
.policy-ring{position:relative;width:160px;height:160px;margin:16px auto}
.ring-svg{position:absolute;inset:0}
.ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.ring-days{font-size:28px;font-weight:800;color:#63b3ed}
.ring-label{font-size:10px;font-family:'Space Mono',monospace;color:#718096;letter-spacing:1px}
.policy-rows{display:grid;gap:8px;margin-top:16px}
.policy-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:12px}
.policy-row:last-child{border:none}
.pr-label{font-family:'Space Mono',monospace;color:#718096}
.pr-val{font-weight:700;color:#e8eaf6}

/* MONITOR */
.monitor-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.monitor-row:last-child{border:none}
.mon-icon{font-size:20px;width:36px;text-align:center}
.mon-info{flex:1}
.mon-title{font-size:12px;font-weight:700;color:#fff}
.mon-sub{font-size:11px;font-family:'Space Mono',monospace;color:#718096}
.mon-status{font-size:11px;font-family:'Space Mono',monospace;padding:3px 8px;border-radius:4px;text-align:center}
.status-ok{background:rgba(104,211,145,.12);color:#68d391}
.status-warn{background:rgba(246,173,85,.12);color:#f6ad55}
.status-watch{background:rgba(99,179,237,.12);color:#63b3ed}

/* FOOTER NAV */
.footer-nav{display:flex;gap:12px;justify-content:center;margin-top:16px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06)}
.fn-link{font-family:'Space Mono',monospace;font-size:11px;color:#718096;padding:8px 16px;border-radius:6px;border:1px solid rgba(255,255,255,.08);transition:all .2s}
.fn-link:hover{color:#e8eaf6;border-color:rgba(255,255,255,.18)}
`;

const claims = [
  { icon: "🌧️", bg: "rgba(99,179,237,.12)", title: "Heavy Rain – Andheri-East", sub: "Mar 14 · 14:32 · TX: 0x8f3e...a21c", amount: "₹300", status: "paid" },
  { icon: "📉", bg: "rgba(252,129,129,.12)", title: "Zone Activity Drop – Zone 3", sub: "Mar 10 · 09:17 · TX: 0x4c2b...f90a", amount: "₹300", status: "paid" },
  { icon: "🚫", bg: "rgba(246,173,85,.12)", title: "Curfew Alert – Strike Detected", sub: "Mar 3 · 11:55 · TX: 0x2d7a...b33e", amount: "₹300", status: "paid" },
];

const monitors = [
  { icon: "🌧️", title: "Rainfall – Zone 3", sub: "Current: 4.2mm/hr  |  Threshold: 15mm/hr", status: "OK", type: "ok" },
  { icon: "🌡️", title: "Temperature – Zone 3", sub: "Current: 38°C  |  Threshold: 42°C", status: "WATCH", type: "watch" },
  { icon: "💨", title: "AQI – Andheri-East", sub: "Current: AQI 187  |  Threshold: 300", status: "OK", type: "ok" },
  { icon: "📰", title: "News / Strike Monitor", sub: "No curfew keywords in last 6 hours", status: "CLEAR", type: "ok" },
  { icon: "📉", title: "Zone Activity Index", sub: "Current: 78% baseline  |  Threshold: 30%", status: "NORMAL", type: "ok" },
];

export default function DashboardPage() {
  const [daysLeft, setDaysLeft] = useState(4);
  const [earnings, setEarnings] = useState(900);

  useEffect(() => {
    const t = setTimeout(() => setEarnings(900), 400);
    return () => clearTimeout(t);
  }, []);

  // SVG ring
  const circ = 2 * Math.PI * 60;
  const dash = circ * (daysLeft / 7);

  return (
    <>
      <style>{S}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="wrap">
          {/* Topbar */}
          <div className="topbar">
            <div className="logo">Gig<span>Shield</span> AI</div>
            <div className="user-info">
              <div>
                <div className="user-name">Ramesh Kumar</div>
                <div className="user-zone">Andheri-East · Zone 3 · Q-Commerce</div>
              </div>
              <div className="avatar">RK</div>
            </div>
            <div className="shield-badge">
              <div className="shield-pulse" />
              SHIELD ACTIVE
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {[
              { icon: "🛡️", num: "₹900", label: "Earned Protected", trend: "+₹300 this week", up: true },
              { icon: "✅", num: "3", label: "Claims Approved", trend: "This month", up: true },
              { icon: "⚡", num: "< 8 min", label: "Avg Payout Time", trend: "Industry: 3 days", up: true },
              { icon: "📊", num: "0.71", label: "Zone Risk Score", trend: "High-risk zone", up: false },
            ].map(s => (
              <div key={s.label} className="stat">
                <div className="stat-top">
                  <span className="stat-icon">{s.icon}</span>
                  <span className={`stat-trend ${s.up ? "trend-up" : "trend-down"}`}>{s.trend}</span>
                </div>
                <div className="stat-num" style={{ color: s.up ? "#68d391" : "#f6ad55" }}>{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="main-grid">
            {/* Left */}
            <div>
              {/* Live Monitor */}
              <div className="card">
                <div className="card-hdr">
                  <div className="card-title">🔴 Live Trigger Monitor</div>
                  <span style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#68d391" }}>Updated 3 min ago</span>
                </div>
                {monitors.map(m => (
                  <div key={m.title} className="monitor-row">
                    <div className="mon-icon">{m.icon}</div>
                    <div className="mon-info">
                      <div className="mon-title">{m.title}</div>
                      <div className="mon-sub">{m.sub}</div>
                    </div>
                    <div className={`mon-status status-${m.type}`}>{m.status}</div>
                  </div>
                ))}
              </div>

              {/* Claims */}
              <div className="card">
                <div className="card-hdr">
                  <div className="card-title">Claim History</div>
                  <Link href="/claims" className="view-all">View all with TX proofs →</Link>
                </div>
                {claims.map(c => (
                  <div key={c.sub} className="claim-item">
                    <div className="claim-dot" style={{ background: c.bg }}>{c.icon}</div>
                    <div className="claim-info">
                      <div className="claim-title">{c.title}</div>
                      <div className="claim-sub">{c.sub}</div>
                    </div>
                    <div className="claim-amount">
                      <div className="claim-amt">{c.amount}</div>
                      <div className="claim-status">{c.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div>
              {/* Active Policy */}
              <div className="card">
                <div className="card-hdr">
                  <div className="card-title">Active Policy</div>
                </div>
                <div className="policy-ring">
                  <svg className="ring-svg" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#63b3ed" strokeWidth="10"
                      strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                      transform="rotate(-90 80 80)" />
                  </svg>
                  <div className="ring-center">
                    <div className="ring-days">{daysLeft}</div>
                    <div className="ring-label">days left</div>
                  </div>
                </div>
                <div className="policy-rows">
                  {[
                    { label: "Zone", val: "Andheri-East (3)" },
                    { label: "Premium", val: "₹149 / week" },
                    { label: "Coverage", val: "₹300 / event" },
                    { label: "Renews", val: "Sun, Mar 22" },
                    { label: "Policy Hash", val: "0xa3f1...c8d2" },
                  ].map(r => (
                    <div key={r.label} className="policy-row">
                      <span className="pr-label">{r.label}</span>
                      <span className="pr-val">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone Risk */}
              <div className="card">
                <div className="card-hdr"><div className="card-title">Zone Risk Profile</div></div>
                {[
                  { label: "Overall Risk", score: 0.71, color: "#f6ad55" },
                  { label: "Flood Risk", score: 0.85, color: "#fc8181" },
                  { label: "Heat Risk", score: 0.55, color: "#f6ad55" },
                  { label: "Strike Risk", score: 0.40, color: "#63b3ed" },
                ].map(r => (
                  <div key={r.label} className="risk-bar-wrap">
                    <div className="risk-label-row">
                      <span className="risk-label">{r.label}</span>
                      <span className="risk-score">{r.score.toFixed(2)}</span>
                    </div>
                    <div className="risk-bar-bg">
                      <div className="risk-bar-fill" style={{ width: `${r.score * 100}%`, background: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-nav">
            <Link href="/" className="fn-link">← Home</Link>
            <Link href="/claims" className="fn-link">My Claims</Link>
            <Link href="/heatmap" className="fn-link">Zone Heatmap</Link>
            <Link href="/architecture" className="fn-link">Architecture</Link>
          </div>
        </div>
      </div>
    </>
  );
}
