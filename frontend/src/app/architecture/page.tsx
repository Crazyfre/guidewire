"use client";
import { useState } from "react";

// This is the original GigShieldArch component ported to Next.js
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0e1a; color: #e8eaf6; font-family: 'Syne', sans-serif; }
  .container { min-height: 100vh; background: #0a0e1a; padding: 32px 24px; position: relative; overflow: hidden; }
  .grid-bg { position: fixed; inset: 0; background-image: linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; z-index: 0; }
  .content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 48px; }
  .back-link { display: inline-block; margin-bottom: 20px; font-family: 'Space Mono', monospace; font-size: 11px; color: #718096; cursor: pointer; letter-spacing: 1px; }
  .back-link:hover { color: #e8eaf6; }
  .badge { display: inline-block; background: rgba(99,179,237,0.12); border: 1px solid rgba(99,179,237,0.3); color: #63b3ed; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 3px; padding: 6px 16px; border-radius: 2px; margin-bottom: 16px; text-transform: uppercase; }
  .title { font-size: clamp(28px, 5vw, 52px); font-weight: 800; color: #fff; letter-spacing: -1px; line-height: 1.1; }
  .title span { color: #63b3ed; }
  .subtitle { margin-top: 8px; color: #718096; font-size: 14px; font-family: 'Space Mono', monospace; letter-spacing: 1px; }
  .tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 4px; margin-bottom: 40px; width: fit-content; margin-left: auto; margin-right: auto; flex-wrap: wrap; justify-content: center; }
  .tab { padding: 10px 20px; border-radius: 6px; font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 1px; cursor: pointer; border: none; background: transparent; color: #718096; transition: all 0.2s; text-transform: uppercase; }
  .tab.active { background: #63b3ed; color: #0a0e1a; font-weight: 700; }
  .arch-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  @media (max-width: 768px) { .arch-grid { grid-template-columns: 1fr; } }
  .layer-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
  .layer-card:hover { border-color: rgba(99,179,237,0.3); transform: translateY(-2px); }
  .layer-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .layer-label { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; opacity: 0.6; }
  .layer-title { font-size: 15px; font-weight: 700; margin-bottom: 14px; color: #fff; }
  .tech-pill { display: inline-block; padding: 4px 10px; border-radius: 4px; font-family: 'Space Mono', monospace; font-size: 10px; margin: 3px 3px 3px 0; font-weight: 700; }
  .blue::before { background: #63b3ed; } .blue .layer-label { color: #63b3ed; } .blue .tech-pill { background: rgba(99,179,237,0.15); color: #63b3ed; border: 1px solid rgba(99,179,237,0.2); }
  .green::before { background: #68d391; } .green .layer-label { color: #68d391; } .green .tech-pill { background: rgba(104,211,145,0.15); color: #68d391; border: 1px solid rgba(104,211,145,0.2); }
  .orange::before { background: #f6ad55; } .orange .layer-label { color: #f6ad55; } .orange .tech-pill { background: rgba(246,173,85,0.15); color: #f6ad55; border: 1px solid rgba(246,173,85,0.2); }
  .purple::before { background: #b794f4; } .purple .layer-label { color: #b794f4; } .purple .tech-pill { background: rgba(183,148,244,0.15); color: #b794f4; border: 1px solid rgba(183,148,244,0.2); }
  .red::before { background: #fc8181; } .red .layer-label { color: #fc8181; } .red .tech-pill { background: rgba(252,129,129,0.15); color: #fc8181; border: 1px solid rgba(252,129,129,0.2); }
  .teal::before { background: #81e6d9; } .teal .layer-label { color: #81e6d9; } .teal .tech-pill { background: rgba(129,230,217,0.15); color: #81e6d9; border: 1px solid rgba(129,230,217,0.2); }
  .agents-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  @media (max-width: 768px) { .agents-row { grid-template-columns: 1fr 1fr; } }
  .agent-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; text-align: center; position: relative; overflow: hidden; transition: all 0.2s; }
  .agent-card:hover { transform: translateY(-3px); }
  .agent-icon { font-size: 28px; margin-bottom: 8px; }
  .agent-name { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .agent-desc { font-size: 11px; color: #718096; font-family: 'Space Mono', monospace; line-height: 1.5; }
  .agent-badge { position: absolute; top: 8px; right: 8px; font-size: 9px; font-family: 'Space Mono', monospace; padding: 2px 6px; border-radius: 3px; letter-spacing: 1px; }
  .full-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .full-card-title { font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-family: 'Space Mono', monospace; margin-bottom: 16px; color: #63b3ed; }
  .flow-container { padding: 8px 0; }
  .flow-step { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 4px; position: relative; }
  .flow-line-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 48px; }
  .flow-dot { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; position: relative; z-index: 1; }
  .flow-connector { width: 2px; height: 32px; background: linear-gradient(to bottom, rgba(99,179,237,0.4), rgba(99,179,237,0.1)); margin: 0 auto; }
  .flow-content { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px 18px; margin-bottom: 4px; transition: border-color 0.2s; }
  .flow-content:hover { border-color: rgba(99,179,237,0.25); }
  .flow-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .flow-desc { font-size: 12px; color: #718096; font-family: 'Space Mono', monospace; line-height: 1.6; }
  .flow-tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
  .flow-tag { font-size: 10px; font-family: 'Space Mono', monospace; padding: 3px 8px; border-radius: 3px; background: rgba(99,179,237,0.1); color: #63b3ed; border: 1px solid rgba(99,179,237,0.2); }
  .flow-tag.green { background: rgba(104,211,145,0.1); color: #68d391; border-color: rgba(104,211,145,0.2); }
  .flow-tag.orange { background: rgba(246,173,85,0.1); color: #f6ad55; border-color: rgba(246,173,85,0.2); }
  .flow-tag.purple { background: rgba(183,148,244,0.1); color: #b794f4; border-color: rgba(183,148,244,0.2); }
  .flow-tag.red { background: rgba(252,129,129,0.1); color: #fc8181; border-color: rgba(252,129,129,0.2); }
  .decision-wrap { display: flex; align-items: center; gap: 16px; margin: 4px 0; }
  .diamond-wrap { width: 48px; display: flex; justify-content: center; flex-shrink: 0; }
  .diamond { width: 36px; height: 36px; background: rgba(246,173,85,0.15); border: 1px solid rgba(246,173,85,0.4); transform: rotate(45deg); display: flex; align-items: center; justify-content: center; }
  .diamond-inner { transform: rotate(-45deg); font-size: 14px; }
  .decision-content { flex: 1; background: rgba(246,173,85,0.05); border: 1px dashed rgba(246,173,85,0.3); border-radius: 8px; padding: 12px 16px; }
  .decision-title { font-size: 13px; font-weight: 700; color: #f6ad55; margin-bottom: 4px; }
  .decision-desc { font-size: 11px; color: #a0856b; font-family: 'Space Mono', monospace; }
  .parallel-box { border: 1px solid rgba(99,179,237,0.2); border-radius: 10px; padding: 16px; background: rgba(99,179,237,0.03); margin: 4px 0; }
  .parallel-label { font-size: 10px; font-family: 'Space Mono', monospace; color: #63b3ed; letter-spacing: 2px; margin-bottom: 12px; text-transform: uppercase; }
  .parallel-agents { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .mini-agent { background: rgba(255,255,255,0.04); border-radius: 8px; padding: 10px 8px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
  .mini-agent-icon { font-size: 18px; margin-bottom: 4px; }
  .mini-agent-name { font-size: 10px; font-family: 'Space Mono', monospace; color: #a0aec0; }
  .trigger-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  @media (max-width: 600px) { .trigger-grid { grid-template-columns: 1fr; } }
  .trigger-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 10px; }
  .trigger-icon { font-size: 20px; }
  .trigger-name { font-size: 12px; font-weight: 700; color: #fff; }
  .trigger-src { font-size: 10px; color: #718096; font-family: 'Space Mono', monospace; }
  .trigger-thresh { margin-left: auto; font-size: 10px; font-family: 'Space Mono', monospace; color: #f6ad55; text-align: right; }
  .api-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  @media (max-width: 600px) { .api-row { grid-template-columns: 1fr; } }
  .api-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 14px; }
  .api-name { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .api-detail { font-size: 11px; color: #718096; font-family: 'Space Mono', monospace; }
  .free-badge { display: inline-block; background: rgba(104,211,145,0.15); color: #68d391; border: 1px solid rgba(104,211,145,0.3); font-size: 9px; font-family: 'Space Mono', monospace; padding: 2px 6px; border-radius: 3px; margin-bottom: 6px; letter-spacing: 1px; }
  .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .section-title { font-size: 16px; font-weight: 700; color: #fff; }
  .section-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .consensus-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .consensus-node { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; font-size: 12px; font-family: 'Space Mono', monospace; color: #a0aec0; text-align: center; }
  .consensus-arrow { color: #63b3ed; font-size: 18px; }
  .consensus-result { background: rgba(104,211,145,0.1); border: 1px solid rgba(104,211,145,0.3); border-radius: 8px; padding: 8px 16px; font-size: 12px; font-family: 'Space Mono', monospace; color: #68d391; font-weight: 700; }
`;

const TABS = ["Architecture", "Pipeline", "Agents", "Triggers & APIs"];

const flowSteps = [
  { icon: "📱", color: "#63b3ed", bg: "rgba(99,179,237,0.15)", title: "1. Rider Onboarding", desc: "Voice/text onboarding (Hindi/English via Web Speech API). Rider selects persona: Q-Commerce (Zepto/Blinkit). Browser Geolocation API fires one GPS ping → Nominatim (OSM) reverse-geocodes to Zone ID.", tags: [{ label: "Web Speech API", type: "" }, { label: "OSM Nominatim", type: "" }, { label: "Zone Assignment", type: "green" }], isDecision: false },
  { icon: "🧠", color: "#b794f4", bg: "rgba(183,148,244,0.15)", title: "2. AI Risk Profiling", desc: "RiskAgent runs XGBoost model on: rider's zone, historical disruption data, time-of-year, persona type. Outputs a risk_score (0–1) per zone. Profile stored in PostgreSQL.", tags: [{ label: "XGBoost", type: "purple" }, { label: "Zone Risk Score", type: "purple" }, { label: "PostgreSQL", type: "" }], isDecision: false },
  { icon: "📋", color: "#68d391", bg: "rgba(104,211,145,0.15)", title: "3. Weekly Policy Creation", desc: "PremiumAgent computes: Base ₹99 × zone_risk_multiplier (0.8–1.3) + predictive add-on (₹0–30). Auto-renews every Sunday via Razorpay sandbox. Policy hash stored on local Hardhat blockchain.", tags: [{ label: "₹99 Base", type: "green" }, { label: "Dynamic Multiplier", type: "green" }, { label: "Razorpay Sandbox", type: "" }, { label: "On-chain Policy", type: "orange" }], isDecision: false },
  { icon: "📡", color: "#f6ad55", bg: "rgba(246,173,85,0.15)", title: "4. Real-Time Trigger Monitoring", desc: "TriggerAgent polls 3 free APIs every 10 mins: OpenWeatherMap (rain, heat, AQI), NewsAPI (curfews, strikes), Zone Activity Index (computed from active riders in DB). If any threshold breached → signals emitted.", tags: [{ label: "OpenWeatherMap", type: "orange" }, { label: "NewsAPI", type: "orange" }, { label: "Zone Activity Index", type: "orange" }], isDecision: false },
  { icon: "⚖️", color: "#f6ad55", bg: "rgba(246,173,85,0.1)", title: "DECISION: 2-of-3 Agent Consensus Required", desc: "", tags: [], isDecision: true },
  { icon: "🔍", color: "#fc8181", bg: "rgba(252,129,129,0.15)", title: "5. Fraud Detection (Parallel)", desc: "FraudAgent runs 3 checks in parallel via asyncio: (1) Was rider's GPS zone active at trigger time? (2) Is this a duplicate claim this week? (3) Does zone activity index confirm low swarm? All 3 must pass.", tags: [{ label: "GPS Zone Validation", type: "red" }, { label: "Duplicate Check", type: "red" }, { label: "Swarm Corroboration", type: "red" }, { label: "asyncio parallel", type: "" }], isDecision: false },
  { icon: "✅", color: "#68d391", bg: "rgba(104,211,145,0.15)", title: "6. Auto Claim Approval + Blockchain Log", desc: "ClaimAgent triggers payout. ClaimLedger.sol (Hardhat local testnet) records: claimId, riderId, zoneId, weatherProof, timestamp, agentVotes. Tamper-proof. Rider sees TX hash in app.", tags: [{ label: "ClaimLedger.sol", type: "green" }, { label: "Hardhat Testnet", type: "green" }, { label: "ethers.js", type: "" }, { label: "TX Hash to Rider", type: "green" }], isDecision: false },
  { icon: "💸", color: "#81e6d9", bg: "rgba(129,230,217,0.15)", title: "7. Instant UPI Payout", desc: "PayoutAgent initiates Razorpay sandbox transfer. Push notification (Firebase FCM): 'Disruption detected in your zone. ₹300 shielded — check UPI.' Zero rider action needed.", tags: [{ label: "Razorpay Sandbox", type: "" }, { label: "Firebase FCM", type: "" }, { label: "Zero-touch", type: "green" }], isDecision: false },
  { icon: "📊", color: "#63b3ed", bg: "rgba(99,179,237,0.15)", title: "8. Analytics Dashboard", desc: "Worker view: earnings protected this week, active zone heatmap, claim history with TX proofs. Admin/Insurer view: loss ratio by zone, agent performance, predictive disruption forecast for next 7 days.", tags: [{ label: "Worker Dashboard", type: "" }, { label: "Insurer Dashboard", type: "" }, { label: "Predictive Forecast", type: "purple" }], isDecision: false },
];

const agents = [
  { icon: "🎯", name: "RiskAgent", desc: "XGBoost zone risk scoring. Runs on shift start + weekly re-profile.", color: "#b794f4", badge: "ML" },
  { icon: "📡", name: "TriggerAgent", desc: "Polls weather/news APIs every 10 min. Emits disruption signals.", color: "#f6ad55", badge: "ASYNC" },
  { icon: "🔍", name: "FraudAgent", desc: "3-check parallel validation: GPS zone, duplicate, swarm corroboration.", color: "#fc8181", badge: "PARALLEL" },
  { icon: "💰", name: "PayoutAgent", desc: "Initiates Razorpay sandbox + logs to blockchain + sends FCM push.", color: "#68d391", badge: "AUTO" },
];

const triggers = [
  { icon: "🌧️", name: "Heavy Rain", src: "OpenWeatherMap (free)", thresh: "> 15mm/hr" },
  { icon: "🌡️", name: "Extreme Heat", src: "OpenWeatherMap (free)", thresh: "> 42°C" },
  { icon: "💨", name: "Air Pollution", src: "OWM Air Quality (free)", thresh: "AQI > 300" },
  { icon: "🚫", name: "Curfew / Strike", src: "NewsAPI (free tier)", thresh: "keyword match" },
  { icon: "📉", name: "Zone Activity Drop", src: "Internal DB query", thresh: "< 30% baseline" },
];

const apis = [
  { name: "OpenWeatherMap", detail: "Weather + Air Quality. 1000 calls/day free. Rain, heat, AQI triggers.", free: true },
  { name: "NewsAPI.org", detail: "Curfew & strike detection via keyword filtering. 100 req/day free.", free: true },
  { name: "OSM Nominatim", detail: "Reverse geocoding GPS → Zone ID. Completely free, no key needed.", free: true },
  { name: "Razorpay Sandbox", detail: "Mock UPI payouts. Full test mode, no real money. Free to use.", free: true },
  { name: "Firebase FCM", detail: "Push notifications to riders. Spark plan (free) covers demo scale.", free: true },
  { name: "Hardhat (local)", detail: "Local Ethereum testnet. ClaimLedger.sol. Zero cost, runs offline.", free: true },
];

const archLayers = [
  { color: "blue", label: "Frontend Layer", title: "React Native + Next.js", items: ["React Native (rider app)", "Next.js (admin dashboard)", "Web Speech API (voice onboarding)", "ethers.js (blockchain proof display)", "OSM Leaflet (zone heatmap)"] },
  { color: "green", label: "Backend Layer", title: "FastAPI (Async Python)", items: ["FastAPI + asyncio", "4 Agent classes (async coroutines)", "asyncio.gather() for parallelism", "JWT auth", "PostgreSQL (Supabase free tier)"] },
  { color: "purple", label: "AI/ML Layer", title: "scikit-learn + Rule Engine", items: ["XGBoost risk model (.pkl)", "Zone Activity Index (rule-based)", "Isolation Forest (fraud anomaly)", "Kaggle + simulated training data", "Sub-100ms inference via FastAPI"] },
  { color: "orange", label: "Data Layer", title: "APIs + Internal DB", items: ["OpenWeatherMap (free tier)", "NewsAPI (free tier)", "OSM Nominatim (free)", "Browser Geolocation (one-time ping)", "Zone Activity from own DB"] },
  { color: "red", label: "Blockchain Layer", title: "Hardhat + Solidity", items: ["ClaimLedger.sol (50 lines)", "approveClaim() function", "Hardhat local testnet", "Hash-chained audit log", "ethers.js frontend read/write"] },
  { color: "teal", label: "Payments + Notifs", title: "Razorpay + Firebase", items: ["Razorpay sandbox (mock UPI)", "Auto-renew weekly policy", "Firebase FCM (push notifs)", "Zero-touch payout flow", "Rider TX hash receipt"] },
];

export default function ArchitecturePage() {
  const [tab, setTab] = useState("Architecture");
  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="grid-bg" />
        <div className="content">
          <div className="header">
            <a href="/" className="back-link">← Back to home</a>
            <div className="badge">DEVTrails 2026 · Q-Commerce Persona</div>
            <h1 className="title">GigShield <span>AI</span></h1>
            <p className="subtitle">Feasible Architecture · Revised Pipeline · Agent Flow</p>
          </div>
          <div className="tabs">
            {TABS.map(t => (<button key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>))}
          </div>

          {tab === "Architecture" && (
            <>
              <div className="section-header"><span className="section-title">System Layers</span><div className="section-line" /></div>
              <div className="arch-grid">
                {archLayers.map(layer => (
                  <div key={layer.label} className={`layer-card ${layer.color}`}>
                    <div className="layer-label">{layer.label}</div>
                    <div className="layer-title">{layer.title}</div>
                    {layer.items.map(item => <span key={item} className="tech-pill">{item}</span>)}
                  </div>
                ))}
              </div>
              <div className="section-header" style={{ marginTop: 32 }}><span className="section-title">Parallel Agent Consensus Flow</span><div className="section-line" /></div>
              <div className="full-card">
                <div className="consensus-row">
                  <div className="consensus-node">🌧️ TriggerAgent<br /><span style={{ fontSize: 10, color: "#718096" }}>API threshold met</span></div>
                  <div className="consensus-arrow">+</div>
                  <div className="consensus-node">🎯 RiskAgent<br /><span style={{ fontSize: 10, color: "#718096" }}>Zone risk &gt; 0.6</span></div>
                  <div className="consensus-arrow">+</div>
                  <div className="consensus-node">📉 ZoneAgent<br /><span style={{ fontSize: 10, color: "#718096" }}>Activity drop confirmed</span></div>
                  <div className="consensus-arrow">→</div>
                  <div className="consensus-node" style={{ background: "rgba(252,129,129,0.08)", borderColor: "rgba(252,129,129,0.2)" }}>🔍 FraudAgent<br /><span style={{ fontSize: 10, color: "#718096" }}>3-check parallel pass</span></div>
                  <div className="consensus-arrow">→</div>
                  <div className="consensus-result">✅ CLAIM APPROVED<br />₹300 payout</div>
                </div>
                <div style={{ marginTop: 14, fontSize: 11, fontFamily: "'Space Mono', monospace", color: "#718096" }}>
                  All agents run via <span style={{ color: "#63b3ed" }}>asyncio.gather()</span> — true parallel execution, no message queue needed. 2-of-3 consensus required to fire claim.
                </div>
              </div>
              <div className="section-header" style={{ marginTop: 24 }}><span className="section-title">What Changed & Why</span><div className="section-line" /></div>
              <div className="arch-grid">
                {[
                  { was: "Google Maps (paid)", now: "OSM Nominatim (free) + one-time GPS ping", why: "Zone assignment only — no continuous tracking needed" },
                  { was: "Real-time GPS swarm tracking", now: "Zone Activity Index from own DB", why: "Active rider count + weather = sufficient swarm signal" },
                  { was: "OpenRouteService traffic", now: "Time-of-day rule engine", why: "ORS has no live traffic — rules are more reliable for demo" },
                  { was: "RabbitMQ message queue", now: "Python asyncio.gather()", why: "Same parallelism, zero infra overhead, truly demonstrable" },
                  { was: "Full blockchain (Hyperledger)", now: "ClaimLedger.sol on Hardhat local", why: "~50 lines Solidity, runs offline, full audit proof" },
                  { was: "Federated ML / TF Lite", now: "XGBoost .pkl on FastAPI backend", why: "Pre-trained, <100ms inference, buildable in hours" },
                ].map(item => (
                  <div key={item.was} className="layer-card blue" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#fc8181", marginBottom: 4 }}>❌ WAS: {item.was}</div>
                    <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#68d391", marginBottom: 8 }}>✅ NOW: {item.now}</div>
                    <div style={{ fontSize: 11, color: "#718096" }}>{item.why}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "Pipeline" && (
            <div className="flow-container">
              <div className="section-header"><span className="section-title">Full Application Flow</span><div className="section-line" /><span style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#718096" }}>Q-Commerce Persona · End-to-End</span></div>
              {flowSteps.map((step, i) => (
                <div key={i}>
                  {step.isDecision ? (
                    <>
                      <div style={{ width: 2, height: 24, background: "rgba(99,179,237,0.2)", marginLeft: 23 }} />
                      <div className="decision-wrap">
                        <div className="diamond-wrap"><div className="diamond"><div className="diamond-inner">⚖️</div></div></div>
                        <div className="decision-content">
                          <div className="decision-title">DECISION: 2-of-3 Agent Consensus</div>
                          <div className="decision-desc">TriggerAgent + RiskAgent + ZoneAgent must agree. If consensus → FraudAgent gate. If no consensus → no claim, log attempt.</div>
                        </div>
                      </div>
                      <div style={{ width: 2, height: 24, background: "rgba(99,179,237,0.2)", marginLeft: 23 }} />
                    </>
                  ) : (
                    <div className="flow-step">
                      <div className="flow-line-wrap">
                        <div className="flow-dot" style={{ background: step.bg, border: `1px solid ${step.color}40` }}><span style={{ fontSize: 20 }}>{step.icon}</span></div>
                        {i < flowSteps.length - 1 && !flowSteps[i + 1]?.isDecision && <div className="flow-connector" />}
                      </div>
                      <div className="flow-content">
                        <div className="flow-title">{step.title}</div>
                        <div className="flow-desc">{step.desc}</div>
                        {step.tags.length > 0 && (
                          <div className="flow-tags">{step.tags.map(tag => <span key={tag.label} className={`flow-tag ${tag.type}`}>{tag.label}</span>)}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {i === 3 && (
                    <div style={{ marginLeft: 64, marginBottom: 4 }}>
                      <div className="parallel-box">
                        <div className="parallel-label">⚡ asyncio.gather() — All 3 run simultaneously</div>
                        <div className="parallel-agents">
                          {[{ icon: "🌧️", name: "TriggerAgent" }, { icon: "🎯", name: "RiskAgent" }, { icon: "📉", name: "ZoneAgent" }, { icon: "🔮", name: "PredictAgent" }].map(a => (
                            <div key={a.name} className="mini-agent"><div className="mini-agent-icon">{a.icon}</div><div className="mini-agent-name">{a.name}</div></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "Agents" && (
            <>
              <div className="section-header"><span className="section-title">Multi-Agent System</span><div className="section-line" /><span style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#718096" }}>asyncio.gather() · Python coroutines</span></div>
              <div className="agents-row">
                {agents.map(agent => (
                  <div key={agent.name} className="agent-card" style={{ borderColor: `${agent.color}25` }}>
                    <div className="agent-badge" style={{ background: `${agent.color}18`, color: agent.color }}>{agent.badge}</div>
                    <div className="agent-icon">{agent.icon}</div>
                    <div className="agent-name">{agent.name}</div>
                    <div className="agent-desc">{agent.desc}</div>
                  </div>
                ))}
              </div>
              <div className="section-header" style={{ marginTop: 24 }}><span className="section-title">Agent Communication Pattern</span><div className="section-line" /></div>
              <div className="full-card">
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, lineHeight: 2, color: "#a0aec0" }}>
                  <div><span style={{ color: "#63b3ed" }}>async def</span> <span style={{ color: "#68d391" }}>handle_disruption</span>(zone_id, rider_id):</div>
                  <div style={{ paddingLeft: 24 }}><span style={{ color: "#63b3ed" }}>results</span> = <span style={{ color: "#f6ad55" }}>await</span> asyncio.gather(</div>
                  <div style={{ paddingLeft: 48 }}>trigger_agent.check(zone_id),     <span style={{ color: "#718096" }}># OpenWeather + NewsAPI</span></div>
                  <div style={{ paddingLeft: 48 }}>risk_agent.score(zone_id),        <span style={{ color: "#718096" }}># XGBoost inference</span></div>
                  <div style={{ paddingLeft: 48 }}>zone_agent.activity(zone_id),     <span style={{ color: "#718096" }}># DB count query</span></div>
                  <div style={{ paddingLeft: 24 }}>)</div>
                  <div style={{ paddingLeft: 24 }}><span style={{ color: "#63b3ed" }}>if</span> sum(results) &gt;= 2:  <span style={{ color: "#718096" }}># 2-of-3 consensus</span></div>
                  <div style={{ paddingLeft: 48 }}>fraud_ok = <span style={{ color: "#f6ad55" }}>await</span> fraud_agent.validate(rider_id, zone_id)</div>
                  <div style={{ paddingLeft: 48 }}><span style={{ color: "#63b3ed" }}>if</span> fraud_ok:</div>
                  <div style={{ paddingLeft: 72 }}><span style={{ color: "#f6ad55" }}>await</span> payout_agent.disburse(rider_id, amount=300)</div>
                  <div style={{ paddingLeft: 72 }}>blockchain.log_claim(rider_id, zone_id, results)</div>
                </div>
              </div>
            </>
          )}

          {tab === "Triggers & APIs" && (
            <>
              <div className="section-header"><span className="section-title">5 Parametric Triggers</span><div className="section-line" /><span style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#718096" }}>all free · no paid APIs</span></div>
              <div className="trigger-grid" style={{ marginBottom: 32 }}>
                {triggers.map(t => (
                  <div key={t.name} className="trigger-item">
                    <div className="trigger-icon">{t.icon}</div>
                    <div><div className="trigger-name">{t.name}</div><div className="trigger-src">{t.src}</div></div>
                    <div className="trigger-thresh">{t.thresh}</div>
                  </div>
                ))}
              </div>
              <div className="section-header"><span className="section-title">API Stack — All Free Tier</span><div className="section-line" /></div>
              <div className="api-row">
                {apis.map(api => (
                  <div key={api.name} className="api-item">
                    {api.free && <div className="free-badge">FREE</div>}
                    <div className="api-name">{api.name}</div>
                    <div className="api-detail">{api.detail}</div>
                  </div>
                ))}
              </div>
              <div className="section-header" style={{ marginTop: 32 }}><span className="section-title">Weekly Premium Model</span><div className="section-line" /></div>
              <div className="full-card">
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, lineHeight: 2.2, color: "#a0aec0" }}>
                  <div><span style={{ color: "#63b3ed" }}>premium</span> = base(₹99) × <span style={{ color: "#b794f4" }}>zone_risk_multiplier</span> + <span style={{ color: "#f6ad55" }}>predictive_add_on</span></div>
                  <div><span style={{ color: "#b794f4" }}>zone_risk_multiplier</span>: 0.8 (safe zone) → 1.3 (flood-prone zone)</div>
                  <div><span style={{ color: "#f6ad55" }}>predictive_add_on</span>: ₹0–30 based on 7-day weather forecast</div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 8 }}>
                    <span style={{ color: "#68d391" }}>Example:</span> Andheri Zone 3 (flood-prone) in monsoon = ₹99 × 1.3 + ₹20 = <span style={{ color: "#68d391", fontWeight: 700 }}>₹149/week</span>
                  </div>
                  <div><span style={{ color: "#68d391" }}>Example:</span> Whitefield Zone 7 (dry, safe) = ₹99 × 0.8 + ₹0 = <span style={{ color: "#68d391", fontWeight: 700 }}>₹79/week</span></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
