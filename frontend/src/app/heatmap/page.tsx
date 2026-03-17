"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e1a;color:#e8eaf6;font-family:'Syne',sans-serif}
.page{min-height:100vh;position:relative}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(99,179,237,.04)1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.04)1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:32px 24px}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.06)}
.logo{font-weight:800;font-size:20px;letter-spacing:-1px}.logo span{color:#63b3ed}

/* MAP AREA */
.map-container{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;position:relative;margin-bottom:20px}
.map-canvas{width:100%;height:500px;position:relative;background:linear-gradient(135deg,#0d1526 0%,#0a1020 100%)}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(99,179,237,.06)1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.06)1px,transparent 1px);background-size:60px 60px}

/* ZONE BUBBLES */
.zone-bubble{position:absolute;display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:transform .2s}
.zone-bubble:hover{transform:scale(1.1)}
.bubble-ring{position:absolute;border-radius:50%;animation:ripple 2s infinite}
@keyframes ripple{0%{transform:scale(1);opacity:.4}100%{transform:scale(2.2);opacity:0}}
.bubble-circle{border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Space Mono',monospace;position:relative;z-index:1;border:2px solid}
.bubble-label{margin-top:6px;font-size:10px;font-family:'Space Mono',monospace;color:#a0aec0;white-space:nowrap;background:rgba(10,14,26,.85);padding:3px 8px;border-radius:4px}

/* LEGEND */
.legend{position:absolute;bottom:16px;left:16px;background:rgba(10,14,26,.9);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 16px}
.legend-title{font-size:10px;font-family:'Space Mono',monospace;color:#718096;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
.legend-row{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.legend-dot{width:10px;height:10px;border-radius:50%}
.legend-label{font-size:11px;font-family:'Space Mono',monospace;color:#a0aec0}

/* SIDEBAR */
.heatmap-grid{display:grid;grid-template-columns:1fr 320px;gap:20px}
@media(max-width:900px){.heatmap-grid{grid-template-columns:1fr}}

/* ZONE CARDS */
.zone-list{display:flex;flex-direction:column;gap:10px}
.zone-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;cursor:pointer;transition:all .2s}
.zone-card:hover{border-color:rgba(99,179,237,.25)}
.zone-card.sel{border-color:rgba(99,179,237,.4);background:rgba(99,179,237,.04)}
.zc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.zc-name{font-size:14px;font-weight:700;color:#fff}
.zc-badge{padding:3px 8px;border-radius:4px;font-size:10px;font-family:'Space Mono',monospace;font-weight:700}
.risk-mini-bar{height:5px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;margin-bottom:6px}
.risk-mini-fill{height:100%;border-radius:99px;transition:width .8s}
.zc-stats{display:flex;gap:12px;font-size:11px;font-family:'Space Mono',monospace;color:#718096}

/* DETAIL PANEL */
.detail-panel{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px}
.dp-title{font-size:16px;font-weight:800;color:#fff;margin-bottom:4px}
.dp-sub{font-size:11px;font-family:'Space Mono',monospace;color:#718096;margin-bottom:20px}
.dp-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:12px}
.dp-row:last-child{border:none}
.dp-label{font-family:'Space Mono',monospace;color:#718096}
.dp-val{font-weight:700;color:#e8eaf6}
.trigger-pill{display:inline-block;padding:4px 10px;border-radius:4px;font-size:10px;font-family:'Space Mono',monospace;margin:3px 3px 3px 0;font-weight:700}

/* FOOTER */
.footer-nav{display:flex;gap:12px;justify-content:center;margin-top:20px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06)}
.fn-link{font-family:'Space Mono',monospace;font-size:11px;color:#718096;padding:8px 16px;border-radius:6px;border:1px solid rgba(255,255,255,.08);transition:all .2s}
.fn-link:hover{color:#e8eaf6;border-color:rgba(255,255,255,.18)}
`;

const ZONES = [
  { id: "Z3", name: "Andheri-East", zone: "Zone 3", x: 35, y: 28, risk: 0.85, color: "#fc8181", tag: "HIGH RISK", riders: 187, claims: 14, rain: "18mm/hr", aqi: 187, activity: "34%", triggers: [{ label: "FLOOD RISK", c: "#fc8181" }, { label: "HEAT RISK", c: "#f6ad55" }] },
  { id: "Z2", name: "Koramangala", zone: "Zone 2", x: 62, y: 55, risk: 0.55, color: "#f6ad55", tag: "MED RISK", riders: 142, claims: 8, rain: "3mm/hr", aqi: 145, activity: "72%", triggers: [{ label: "HEAT RISK", c: "#f6ad55" }] },
  { id: "Z7", name: "Whitefield", zone: "Zone 7", x: 75, y: 35, risk: 0.28, color: "#68d391", tag: "LOW RISK", riders: 98, claims: 3, rain: "0mm/hr", aqi: 89, activity: "91%", triggers: [] },
  { id: "Z5", name: "Malad-West", zone: "Zone 5", x: 22, y: 60, risk: 0.63, color: "#f6ad55", tag: "MED RISK", riders: 203, claims: 11, rain: "7mm/hr", aqi: 210, activity: "58%", triggers: [{ label: "AQI RISK", c: "#f6ad55" }] },
  { id: "Z6", name: "Thane-West", zone: "Zone 6", x: 50, y: 72, risk: 0.71, color: "#f6ad55", tag: "MED RISK", riders: 134, claims: 9, rain: "11mm/hr", aqi: 175, activity: "51%", triggers: [{ label: "RAIN RISK", c: "#63b3ed" }] },
  { id: "Z1", name: "Indiranagar", zone: "Zone 1", x: 42, y: 44, risk: 0.38, color: "#68d391", tag: "LOW RISK", riders: 119, claims: 4, rain: "1mm/hr", aqi: 102, activity: "84%", triggers: [] },
];

const sz = (risk: number) => 44 + risk * 28;

export default function HeatmapPage() {
  const [selected, setSelected] = useState(ZONES[0]);

  return (
    <>
      <style>{S}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="wrap">
          <div className="topbar">
            <div className="logo">Gig<span>Shield</span> AI</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#68d391", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#68d391", display: "inline-block", animation: "pulse 1.5s infinite" }} />
              LIVE ZONE MONITOR
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, color: "#fff", marginBottom: 6 }}>Zone Risk Heatmap</h1>
            <p style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: "#718096" }}>Real-time disruption risk by delivery zone · Click a zone to see details</p>
          </div>

          <div className="heatmap-grid">
            <div>
              {/* Map */}
              <div className="map-container">
                <div className="map-canvas">
                  <div className="map-grid" />
                  {/* Zone bubbles */}
                  {ZONES.map(z => {
                    const size = sz(z.risk);
                    return (
                      <div key={z.id} className="zone-bubble" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)" }}
                        onClick={() => setSelected(z)}>
                        <div className="bubble-ring" style={{ width: size + 20, height: size + 20, top: -10, left: -10, background: z.color, opacity: 0.15 }} />
                        <div className="bubble-circle" style={{ width: size, height: size, background: `${z.color}22`, borderColor: z.color, color: z.color, boxShadow: selected.id === z.id ? `0 0 24px ${z.color}55` : "none" }}>
                          {z.id}
                        </div>
                        <div className="bubble-label">{z.name}</div>
                      </div>
                    );
                  })}
                  {/* Legend */}
                  <div className="legend">
                    <div className="legend-title">Risk Level</div>
                    {[{ c: "#fc8181", l: "High Risk (>0.7)" }, { c: "#f6ad55", l: "Medium (0.4–0.7)" }, { c: "#68d391", l: "Low Risk (<0.4)" }].map(l => (
                      <div key={l.l} className="legend-row"><div className="legend-dot" style={{ background: l.c }} /><div className="legend-label">{l.l}</div></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Zone list */}
              <div className="zone-list">
                {ZONES.map(z => (
                  <div key={z.id} className={`zone-card${selected.id === z.id ? " sel" : ""}`} onClick={() => setSelected(z)}>
                    <div className="zc-top">
                      <div className="zc-name">{z.name} <span style={{ fontSize: 11, color: "#718096", fontWeight: 400, fontFamily: "'Space Mono',monospace" }}>({z.zone})</span></div>
                      <div className="zc-badge" style={{ background: `${z.color}18`, color: z.color, border: `1px solid ${z.color}30` }}>{z.tag}</div>
                    </div>
                    <div className="risk-mini-bar"><div className="risk-mini-fill" style={{ width: `${z.risk * 100}%`, background: z.color }} /></div>
                    <div className="zc-stats">
                      <span>👥 {z.riders} riders</span>
                      <span>✅ {z.claims} claims</span>
                      <span>📊 {(z.risk * 100).toFixed(0)}% risk</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div>
              <div className="detail-panel">
                <div className="dp-title">{selected.name}</div>
                <div className="dp-sub">{selected.zone} · Live risk score: {selected.risk.toFixed(2)}</div>
                {[
                  { label: "Active Riders", val: selected.riders.toString() },
                  { label: "Claims This Week", val: selected.claims.toString() },
                  { label: "Current Rainfall", val: selected.rain },
                  { label: "AQI Level", val: selected.aqi.toString() },
                  { label: "Zone Activity", val: `${selected.activity} of baseline` },
                  { label: "Risk Score", val: selected.risk.toFixed(2) },
                ].map(r => (
                  <div key={r.label} className="dp-row"><span className="dp-label">{r.label}</span><span className="dp-val">{r.val}</span></div>
                ))}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#718096", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Active Triggers</div>
                  {selected.triggers.length === 0
                    ? <div style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: "#68d391" }}>✓ No active triggers</div>
                    : selected.triggers.map(t => (
                      <span key={t.label} className="trigger-pill" style={{ background: `${t.c}18`, color: t.c, border: `1px solid ${t.c}30` }}>{t.label}</span>
                    ))}
                </div>
              </div>

              <div className="detail-panel" style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: "#a0aec0", marginBottom: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  TriggerAgent Status
                </div>
                {[
                  { icon: "🌧️", name: "Rain Check", ok: parseFloat(selected.rain) < 15 },
                  { icon: "🌡️", name: "Heat Check", ok: true },
                  { icon: "💨", name: "AQI Check", ok: selected.aqi < 300 },
                  { icon: "📰", name: "News/Strike", ok: true },
                  { icon: "📉", name: "Activity Index", ok: parseFloat(selected.activity) > 30 },
                ].map(c => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                    <span>{c.icon}</span>
                    <span style={{ flex: 1, fontSize: 12, fontFamily: "'Space Mono',monospace", color: "#a0aec0" }}>{c.name}</span>
                    <span style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", padding: "2px 8px", borderRadius: 4, ...(c.ok ? { background: "rgba(104,211,145,.1)", color: "#68d391" } : { background: "rgba(252,129,129,.1)", color: "#fc8181" }) }}>
                      {c.ok ? "CLEAR" : "ALERT"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-nav">
            <Link href="/" className="fn-link">← Home</Link>
            <Link href="/dashboard" className="fn-link">Dashboard</Link>
            <Link href="/admin" className="fn-link">Admin View</Link>
            <Link href="/architecture" className="fn-link">Architecture</Link>
          </div>
        </div>
      </div>
    </>
  );
}
