"use client";
import { useState } from "react";
import Link from "next/link";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e1a;color:#e8eaf6;font-family:'Syne',sans-serif}
.page{min-height:100vh;position:relative}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(99,179,237,.04)1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.04)1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:32px 24px}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.06)}
.logo{font-weight:800;font-size:20px;letter-spacing:-1px}.logo span{color:#63b3ed}
.admin-badge{background:rgba(252,129,129,.12);border:1px solid rgba(252,129,129,.3);color:#fc8181;padding:6px 14px;border-radius:6px;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px}

/* KPIs */
.kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:32px}
@media(max-width:900px){.kpi-grid{grid-template-columns:repeat(2,1fr)}}
.kpi{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px;transition:border-color .2s}
.kpi:hover{border-color:rgba(99,179,237,.2)}
.kpi-num{font-size:22px;font-weight:800;margin-bottom:2px}
.kpi-label{font-size:10px;font-family:'Space Mono',monospace;color:#718096;letter-spacing:1px;text-transform:uppercase}

/* GRID 2COL */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
@media(max-width:768px){.grid2{grid-template-columns:1fr}}

/* CARD */
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:22px;margin-bottom:20px}
.card-title{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:'Space Mono',monospace;color:#a0aec0;margin-bottom:18px}

/* ZONE TABLE */
.zone-table{width:100%;border-collapse:collapse}
.zone-table th{font-size:10px;font-family:'Space Mono',monospace;color:#718096;text-align:left;padding:0 0 10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,.06)}
.zone-table td{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px;vertical-align:middle}
.zone-table tr:last-child td{border:none}
.zone-badge{display:inline-block;padding:3px 8px;border-radius:4px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700}

/* BAR CHART */
.bar-chart{display:flex;flex-direction:column;gap:10px}
.bc-row{display:flex;align-items:center;gap:12px}
.bc-label{font-size:11px;font-family:'Space Mono',monospace;color:#a0aec0;width:100px;flex-shrink:0;text-align:right}
.bc-bar-bg{flex:1;height:20px;background:rgba(255,255,255,.04);border-radius:4px;overflow:hidden}
.bc-fill{height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px;font-size:10px;font-family:'Space Mono',monospace;color:#0a0e1a;font-weight:700;transition:width 1s ease}

/* AGENT PERF */
.agent-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.agent-row:last-child{border:none}
.agent-icon{font-size:22px;width:36px;text-align:center}
.agent-info{flex:1}
.agent-name{font-size:13px;font-weight:700;color:#fff;margin-bottom:2px}
.agent-stat{font-size:11px;font-family:'Space Mono',monospace;color:#718096}
.agent-metric{text-align:right}
.metric-num{font-size:15px;font-weight:800}
.metric-label{font-size:10px;font-family:'Space Mono',monospace;color:#718096}

/* FORECAST */
.forecast-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
@media(max-width:600px){.forecast-grid{grid-template-columns:repeat(4,1fr)}}
.fc-day{background:rgba(255,255,255,.03);border-radius:8px;padding:10px 6px;text-align:center;border:1px solid rgba(255,255,255,.06)}
.fc-day-name{font-size:10px;font-family:'Space Mono',monospace;color:#718096;margin-bottom:6px}
.fc-icon{font-size:18px;margin-bottom:4px}
.fc-risk{font-size:11px;font-family:'Space Mono',monospace;font-weight:700}

/* FOOTER */
.footer-nav{display:flex;gap:12px;justify-content:center;margin-top:16px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06)}
.fn-link{font-family:'Space Mono',monospace;font-size:11px;color:#718096;padding:8px 16px;border-radius:6px;border:1px solid rgba(255,255,255,.08);transition:all .2s}
.fn-link:hover{color:#e8eaf6;border-color:rgba(255,255,255,.18)}
`;

const zones = [
  { name: "Andheri-East", zone: "Zone 3", riders: 187, claims: 14, loss: "₹4,200", ratio: "22%", risk: 0.71, color: "#fc8181", tag: "HIGH" },
  { name: "Koramangala", zone: "Zone 2", riders: 142, claims: 8, loss: "₹2,400", ratio: "16%", risk: 0.55, color: "#f6ad55", tag: "MED" },
  { name: "Whitefield", zone: "Zone 7", riders: 98, claims: 3, loss: "₹900", ratio: "9%", risk: 0.32, color: "#68d391", tag: "LOW" },
  { name: "Malad-West", zone: "Zone 5", riders: 203, claims: 11, loss: "₹3,300", ratio: "18%", risk: 0.63, color: "#f6ad55", tag: "MED" },
  { name: "Thane-West", zone: "Zone 6", riders: 134, claims: 9, loss: "₹2,700", ratio: "20%", risk: 0.68, color: "#f6ad55", tag: "MED" },
];

const agents = [
  { icon: "📡", name: "TriggerAgent", stat: "Polls every 10 min · 3 APIs", metric: "99.2%", label: "Uptime" },
  { icon: "🎯", name: "RiskAgent", stat: "XGBoost · <100ms inference", metric: "94ms", label: "Avg latency" },
  { icon: "🔍", name: "FraudAgent", stat: "3 parallel checks via asyncio", metric: "2.1%", label: "False positive" },
  { icon: "💰", name: "PayoutAgent", stat: "Razorpay sandbox + FCM", metric: "7.4 min", label: "Avg payout" },
];

const forecast = [
  { day: "Mon", icon: "⛅", risk: 0.3, color: "#68d391" },
  { day: "Tue", icon: "🌧️", risk: 0.8, color: "#fc8181" },
  { day: "Wed", icon: "🌧️", risk: 0.9, color: "#fc8181" },
  { day: "Thu", icon: "⛅", risk: 0.5, color: "#f6ad55" },
  { day: "Fri", icon: "☀️", risk: 0.2, color: "#68d391" },
  { day: "Sat", icon: "⛅", risk: 0.35, color: "#68d391" },
  { day: "Sun", icon: "🌡️", risk: 0.6, color: "#f6ad55" },
];

export default function AdminPage() {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <>
      <style>{S}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="wrap">
          <div className="topbar">
            <div className="logo">Gig<span>Shield</span> AI</div>
            <div className="admin-badge">⚙️ INSURER / ADMIN VIEW</div>
          </div>

          {/* KPIs */}
          <div className="kpi-grid">
            {[
              { num: "764", label: "Active Riders", color: "#63b3ed" },
              { num: "45", label: "Claims This Week", color: "#68d391" },
              { num: "₹13,500", label: "Total Payouts (7d)", color: "#f6ad55" },
              { num: "17.4%", label: "Avg Loss Ratio", color: "#b794f4" },
              { num: "2.1%", label: "Fraud Rate", color: "#fc8181" },
            ].map(k => (
              <div key={k.label} className="kpi">
                <div className="kpi-num" style={{ color: k.color }}>{k.num}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Zone Loss Ratio */}
          <div className="card">
            <div className="card-title">Zone Loss Ratio by Area</div>
            <div className="bar-chart">
              {zones.map(z => (
                <div key={z.name} className="bc-row">
                  <div className="bc-label">{z.name}</div>
                  <div className="bc-bar-bg">
                    <div className="bc-fill" style={{ width: z.ratio, background: z.color }}>{z.ratio}</div>
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: z.color, width: 36 }}>{z.tag}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid 2 col */}
          <div className="grid2">
            {/* Zone Table */}
            <div className="card">
              <div className="card-title">Zone Performance Table</div>
              <table className="zone-table">
                <thead>
                  <tr>
                    <th>Zone</th><th>Riders</th><th>Claims</th><th>Payout</th><th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map(z => (
                    <tr key={z.name} style={{ cursor: "pointer", opacity: activeZone && activeZone !== z.name ? 0.5 : 1 }}
                      onClick={() => setActiveZone(activeZone === z.name ? null : z.name)}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 12 }}>{z.name}</div>
                        <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: "#718096" }}>{z.zone}</div>
                      </td>
                      <td style={{ fontFamily: "'Space Mono',monospace" }}>{z.riders}</td>
                      <td style={{ fontFamily: "'Space Mono',monospace" }}>{z.claims}</td>
                      <td style={{ fontFamily: "'Space Mono',monospace", color: "#68d391" }}>{z.loss}</td>
                      <td>
                        <span className="zone-badge" style={{ background: `${z.color}18`, color: z.color, border: `1px solid ${z.color}30` }}>
                          {z.risk.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Agent Performance */}
            <div className="card">
              <div className="card-title">Agent Performance</div>
              {agents.map(a => (
                <div key={a.name} className="agent-row">
                  <div className="agent-icon">{a.icon}</div>
                  <div className="agent-info">
                    <div className="agent-name">{a.name}</div>
                    <div className="agent-stat">{a.stat}</div>
                  </div>
                  <div className="agent-metric">
                    <div className="metric-num" style={{ color: "#68d391" }}>{a.metric}</div>
                    <div className="metric-label">{a.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="card">
            <div className="card-title">7-Day Disruption Forecast (Predictive)</div>
            <div className="forecast-grid">
              {forecast.map(f => (
                <div key={f.day} className="fc-day" style={{ borderColor: `${f.color}30` }}>
                  <div className="fc-day-name">{f.day}</div>
                  <div className="fc-icon">{f.icon}</div>
                  <div className="fc-risk" style={{ color: f.color }}>{(f.risk * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-nav">
            <Link href="/" className="fn-link">← Home</Link>
            <Link href="/dashboard" className="fn-link">Rider View</Link>
            <Link href="/claims" className="fn-link">All Claims</Link>
            <Link href="/heatmap" className="fn-link">Heatmap</Link>
          </div>
        </div>
      </div>
    </>
  );
}
