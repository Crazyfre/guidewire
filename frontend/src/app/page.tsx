"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e1a;color:#e8eaf6;font-family:'Syne',sans-serif}
.page{min-height:100vh;position:relative;overflow:hidden}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(99,179,237,.04)1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.04)1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:32px 24px}

/* NAV */
nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:64px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.06)}
.logo{font-weight:800;font-size:22px;letter-spacing:-1px}
.logo span{color:#63b3ed}
.nav-links{display:flex;gap:24px;align-items:center}
.nav-links a{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#718096;transition:color .2s}
.nav-links a:hover{color:#e8eaf6}
.nav-cta{background:#63b3ed;color:#0a0e1a;padding:9px 20px;border-radius:6px;font-weight:700;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px;transition:opacity .2s}
.nav-cta:hover{opacity:.85}

/* HERO */
.hero{text-align:center;padding:80px 0 64px}
.hero-badge{display:inline-block;background:rgba(99,179,237,.12);border:1px solid rgba(99,179,237,.3);color:#63b3ed;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:3px;padding:6px 16px;border-radius:2px;margin-bottom:24px;text-transform:uppercase}
.hero h1{font-size:clamp(36px,6vw,72px);font-weight:800;letter-spacing:-2px;line-height:1.05;color:#fff;margin-bottom:16px}
.hero h1 span{color:#63b3ed}
.hero p{color:#718096;font-size:16px;max-width:560px;margin:0 auto 40px;line-height:1.8;font-family:'Space Mono',monospace;font-size:13px}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-primary{background:#63b3ed;color:#0a0e1a;padding:14px 32px;border-radius:8px;font-weight:700;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:1px;transition:all .2s;display:inline-block}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,179,237,.3)}
.btn-secondary{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#e8eaf6;padding:14px 32px;border-radius:8px;font-weight:700;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:1px;transition:all .2s;display:inline-block}
.btn-secondary:hover{border-color:rgba(99,179,237,.4);color:#63b3ed}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:64px 0}
@media(max-width:768px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px;text-align:center}
.stat-num{font-size:32px;font-weight:800;margin-bottom:4px}
.stat-label{font-size:11px;font-family:'Space Mono',monospace;color:#718096;letter-spacing:1px;text-transform:uppercase}

/* FEATURES */
.section-head{text-align:center;margin-bottom:40px}
.section-head h2{font-size:clamp(24px,3vw,40px);font-weight:800;letter-spacing:-1px;color:#fff;margin-bottom:8px}
.section-head p{color:#718096;font-family:'Space Mono',monospace;font-size:12px}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:64px}
@media(max-width:768px){.features{grid-template-columns:1fr}}
.feature-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px;transition:all .2s;position:relative;overflow:hidden}
.feature-card:hover{transform:translateY(-4px);border-color:rgba(99,179,237,.25)}
.feature-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.feature-icon{font-size:32px;margin-bottom:14px}
.feature-title{font-size:16px;font-weight:700;color:#fff;margin-bottom:8px}
.feature-desc{font-size:12px;color:#718096;line-height:1.8;font-family:'Space Mono',monospace}

/* FLOW PREVIEW */
.flow-preview{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px;margin-bottom:64px}
.flow-steps{display:flex;gap:0;overflow-x:auto;padding-bottom:8px}
.fp-step{flex:1;min-width:140px;text-align:center;position:relative}
.fp-step:not(:last-child)::after{content:'→';position:absolute;right:-12px;top:50%;transform:translateY(-90%);color:#63b3ed;font-size:18px;z-index:1}
.fp-icon{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 10px}
.fp-label{font-size:11px;font-family:'Space Mono',monospace;color:#a0aec0;line-height:1.5}

/* FOOTER */
footer{border-top:1px solid rgba(255,255,255,.06);padding:32px 0;text-align:center;color:#4a5568;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px}
footer span{color:#63b3ed}
`;

const features = [
  { icon: "🎯", title: "AI Risk Profiling", desc: "XGBoost model scores your zone risk in real-time. Dynamic premium from ₹79–₹149/week based on flood, heat, and strike history.", color: "#b794f4" },
  { icon: "📡", title: "Auto Trigger Detection", desc: "TriggerAgent polls OpenWeatherMap + NewsAPI every 10 mins. No manual claim needed. Disruption fires automatically.", color: "#f6ad55" },
  { icon: "⛓️", title: "Blockchain Proof", desc: "Every claim logged to ClaimLedger.sol on Hardhat testnet. Immutable, tamper-proof audit trail with TX hash receipt.", color: "#68d391" },
  { icon: "🔍", title: "Fraud Prevention", desc: "3-check parallel validation: GPS zone match, duplicate prevention, and swarm corroboration via zone activity index.", color: "#fc8181" },
  { icon: "💸", title: "Instant UPI Payout", desc: "PayoutAgent triggers Razorpay sandbox transfer the moment claim clears. Push notification via Firebase FCM.", color: "#81e6d9" },
  { icon: "📊", title: "Smart Dashboard", desc: "Worker sees earnings protected + claim history. Admin sees zone loss ratios and 7-day predictive disruption forecast.", color: "#63b3ed" },
];

const flowSteps = [
  { icon: "📱", label: "Rider Onboards\nVoice/GPS", bg: "rgba(99,179,237,.15)" },
  { icon: "🧠", label: "AI Scores\nZone Risk", bg: "rgba(183,148,244,.15)" },
  { icon: "📡", label: "Triggers\nMonitored", bg: "rgba(246,173,85,.15)" },
  { icon: "⚖️", label: "2-of-3\nConsensus", bg: "rgba(252,129,129,.15)" },
  { icon: "✅", label: "Auto Claim\n+ Blockchain", bg: "rgba(104,211,145,.15)" },
  { icon: "💸", label: "UPI Payout\nInstant", bg: "rgba(129,230,217,.15)" },
];

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 1247;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      setCount(c => {
        if (c + step >= target) { clearInterval(t); return target; }
        return c + step;
      });
    }, 20);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{S}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="wrap">
          <nav>
            <div className="logo">Gig<span>Shield</span> AI</div>
            <div className="nav-links">
              <Link href="/architecture">Architecture</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/admin">Admin</Link>
              <Link href="/onboard" className="nav-cta">Get Protected →</Link>
            </div>
          </nav>

          <div className="hero">
            <div className="hero-badge">DEVTrails 2026 · Q-Commerce Insurance</div>
            <h1>Your Gig. <span>Protected.</span><br />Automatically.</h1>
            <p>AI-powered parametric insurance for Zepto & Blinkit riders. Disruption detected → claim filed → ₹300 in your UPI. Zero action needed from you.</p>
            <div className="hero-btns">
              <Link href="/onboard" className="btn-primary">Start Protection — ₹99/week</Link>
              <Link href="/architecture" className="btn-secondary">View Architecture →</Link>
            </div>
          </div>

          <div className="stats">
            {[
              { num: `₹${count.toLocaleString()}`, label: "Earnings Protected Today", color: "#68d391" },
              { num: "< 10 min", label: "Avg Claim Processing", color: "#63b3ed" },
              { num: "2-of-3", label: "Agent Consensus Model", color: "#b794f4" },
              { num: "100%", label: "Free API Stack", color: "#f6ad55" },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="section-head">
            <h2>Everything Automated</h2>
            <p>from risk profiling to blockchain proof — zero rider action</p>
          </div>
          <div className="features">
            {features.map(f => (
              <div key={f.title} className="feature-card" style={{ borderColor: `${f.color}20` }}>
                <div className="feature-card" style={{ display: 'none' }} />
                <style>{`.feature-card:nth-child(${features.indexOf(f) + 1})::before{background:${f.color}}`}</style>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          <div className="section-head">
            <h2>How It Works</h2>
            <p>end-to-end pipeline in 6 steps</p>
          </div>
          <div className="flow-preview">
            <div className="flow-steps">
              {flowSteps.map((s, i) => (
                <div key={i} className="fp-step">
                  <div className="fp-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="fp-label" style={{ whiteSpace: "pre-line" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <footer>
            Built for <span>DEVTrails 2026</span> · GigShield AI · Q-Commerce Parametric Insurance
          </footer>
        </div>
      </div>
    </>
  );
}
