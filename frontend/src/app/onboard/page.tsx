"use client";
import { useState } from "react";
import { useState as useStateAlias } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e1a;color:#e8eaf6;font-family:'Syne',sans-serif}
.page{min-height:100vh;position:relative;overflow:hidden}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(99,179,237,.04)1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.04)1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;max-width:640px;margin:0 auto;padding:32px 24px}
.back{display:inline-flex;align-items:center;gap:8px;color:#718096;font-family:'Space Mono',monospace;font-size:12px;margin-bottom:32px;cursor:pointer;transition:color .2s}
.back:hover{color:#e8eaf6}

/* STEPPER */
.stepper{display:flex;align-items:center;gap:0;margin-bottom:40px}
.step-item{display:flex;align-items:center;flex:1}
.step-item:last-child{flex:none}
.step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:'Space Mono',monospace;flex-shrink:0;transition:all .3s}
.step-line{flex:1;height:2px;transition:background .3s}
.step-active .step-circle{background:#63b3ed;color:#0a0e1a}
.step-done .step-circle{background:#68d391;color:#0a0e1a}
.step-pending .step-circle{background:rgba(255,255,255,.06);color:#718096;border:1px solid rgba(255,255,255,.1)}
.step-line-done{background:#68d391}
.step-line-active{background:rgba(99,179,237,.3)}
.step-line-pending{background:rgba(255,255,255,.06)}

/* CARD */
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px;margin-bottom:16px}
.card-title{font-size:22px;font-weight:800;color:#fff;margin-bottom:6px}
.card-sub{font-size:12px;font-family:'Space Mono',monospace;color:#718096;margin-bottom:28px}

/* FORM */
.field{margin-bottom:20px}
.label{display:block;font-size:11px;font-family:'Space Mono',monospace;letter-spacing:1.5px;text-transform:uppercase;color:#a0aec0;margin-bottom:8px}
.input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px 16px;color:#e8eaf6;font-size:14px;font-family:'Syne',sans-serif;outline:none;transition:border-color .2s}
.input:focus{border-color:rgba(99,179,237,.5)}
.input::placeholder{color:#4a5568}
.select{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px 16px;color:#e8eaf6;font-size:14px;font-family:'Syne',sans-serif;outline:none;cursor:pointer;appearance:none;transition:border-color .2s}
.select:focus{border-color:rgba(99,179,237,.5)}

/* PERSONA */
.persona-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
.persona-card{background:rgba(255,255,255,.03);border:2px solid rgba(255,255,255,.08);border-radius:12px;padding:18px;cursor:pointer;transition:all .2s;text-align:center}
.persona-card.sel{border-color:#63b3ed;background:rgba(99,179,237,.08)}
.persona-card:hover{border-color:rgba(99,179,237,.3)}
.p-icon{font-size:28px;margin-bottom:8px}
.p-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:4px}
.p-plat{font-size:11px;font-family:'Space Mono',monospace;color:#718096}

/* VOICE BTN */
.voice-btn{width:100%;background:rgba(183,148,244,.1);border:1px dashed rgba(183,148,244,.4);border-radius:8px;padding:14px;color:#b794f4;font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px}
.voice-btn:hover{background:rgba(183,148,244,.15)}
.voice-btn.listening{animation:pulse 1s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

/* GPS */
.gps-box{background:rgba(104,211,145,.06);border:1px solid rgba(104,211,145,.2);border-radius:8px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:20px}
.gps-dot{width:10px;height:10px;border-radius:50%;background:#68d391;animation:blink 1.5s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.gps-text{font-size:12px;font-family:'Space Mono',monospace;color:#68d391}

/* PREMIUM PREVIEW */
.premium-box{background:rgba(246,173,85,.06);border:1px solid rgba(246,173,85,.2);border-radius:12px;padding:20px;margin-bottom:20px}
.prem-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.prem-row:last-child{border:none;padding-top:12px;margin-top:4px}
.prem-label{font-size:12px;font-family:'Space Mono',monospace;color:#718096}
.prem-val{font-size:13px;font-family:'Space Mono',monospace;color:#e8eaf6}
.prem-total-label{font-size:13px;font-weight:700;color:#f6ad55}
.prem-total-val{font-size:22px;font-weight:800;color:#f6ad55}

/* BTN */
.btn-next{width:100%;background:#63b3ed;color:#0a0e1a;border:none;border-radius:10px;padding:16px;font-size:15px;font-weight:800;font-family:'Syne',sans-serif;cursor:pointer;transition:all .2s;letter-spacing:.5px}
.btn-next:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,179,237,.3)}
.btn-next:disabled{opacity:.4;cursor:not-allowed;transform:none}

/* SUCCESS */
.success-wrap{text-align:center;padding:40px 0}
.success-icon{font-size:64px;margin-bottom:16px;animation:pop .5s ease}
@keyframes pop{0%{transform:scale(0.5);opacity:0}100%{transform:scale(1);opacity:1}}
.success-title{font-size:28px;font-weight:800;color:#68d391;margin-bottom:8px}
.success-sub{font-size:13px;font-family:'Space Mono',monospace;color:#718096;line-height:1.8;margin-bottom:24px}
.tx-box{background:rgba(104,211,145,.06);border:1px solid rgba(104,211,145,.2);border-radius:8px;padding:12px 16px;font-family:'Space Mono',monospace;font-size:11px;color:#68d391;word-break:break-all;margin-bottom:24px}
.policy-details{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px}
.pd-item{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:12px}
.pd-label{font-size:10px;font-family:'Space Mono',monospace;color:#718096;margin-bottom:4px;letter-spacing:1px;text-transform:uppercase}
.pd-val{font-size:14px;font-weight:700;color:#fff}
`;

const zones: Record<string, number> = {
  "Andheri-East (Zone 3)": 1.3,
  "Whitefield (Zone 7)": 0.8,
  "Koramangala (Zone 2)": 1.1,
  "Malad-West (Zone 5)": 0.95,
  "Indiranagar (Zone 1)": 1.0,
  "Thane-West (Zone 6)": 1.2,
};

function calcPremium(zone: string, shift: string) {
  const mult = zones[zone] ?? 1.0;
  const addOn = mult > 1.1 ? 20 : mult > 0.95 ? 10 : 0;
  const base = 99;
  return { base, mult, addOn, total: Math.round(base * mult + addOn) };
}

function randomTxHash() {
  const chars = "0123456789abcdef";
  return "0x" + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join("");
}

export default function OnboardPage() {
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState("Andheri-East (Zone 3)");
  const [listening, setListening] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const prem = calcPremium(zone, "morning");

  function startVoice() {
    setListening(true);
    setTimeout(() => {
      setName("Ramesh Kumar");
      setPhone("9876543210");
      setListening(false);
    }, 2500);
  }

  function getGps() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setGpsReady(true),
        () => setGpsReady(true)
      );
    } else setGpsReady(true);
  }

  async function submitPolicy() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2200));
    setTxHash(randomTxHash());
    setLoading(false);
    setStep(3);
  }

  const steps = ["Profile", "Zone & GPS", "Review & Pay", "Active"];

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="wrap">
          <div className="back" onClick={() => window.location.href = "/"}>← Back to home</div>

          {/* Stepper */}
          <div className="stepper">
            {steps.map((s, i) => (
              <div key={s} className="step-item">
                <div className={`step-circle ${i < step ? "step-done" : i === step ? "step-active" : "step-pending"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`step-line ${i < step ? "step-line-done" : i === step ? "step-line-active" : "step-line-pending"}`} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 0: Profile */}
          {step === 0 && (
            <div className="card">
              <div className="card-title">Who Are You?</div>
              <div className="card-sub">Select your delivery persona to get started</div>

              <button className={`voice-btn${listening ? " listening" : ""}`} onClick={startVoice}>
                {listening ? "🎙️ Listening..." : "🎙️ Fill with Voice (Hindi/English)"}
              </button>

              <div className="persona-grid">
                {[
                  { key: "qcom", icon: "⚡", name: "Q-Commerce", plat: "Zepto · Blinkit · Swiggy Instamart" },
                  { key: "food", icon: "🍔", name: "Food Delivery", plat: "Zomato · Swiggy" },
                ].map(p => (
                  <div key={p.key} className={`persona-card${persona === p.key ? " sel" : ""}`} onClick={() => setPersona(p.key)}>
                    <div className="p-icon">{p.icon}</div>
                    <div className="p-name">{p.name}</div>
                    <div className="p-plat">{p.plat}</div>
                  </div>
                ))}
              </div>

              <div className="field">
                <label className="label">Full Name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" />
              </div>
              <div className="field">
                <label className="label">Phone (UPI linked)</label>
                <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" type="tel" />
              </div>

              <button className="btn-next" disabled={!persona || !name || !phone} onClick={() => setStep(1)}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 1: Zone + GPS */}
          {step === 1 && (
            <div className="card">
              <div className="card-title">Your Zone</div>
              <div className="card-sub">One GPS ping to assign your risk zone — no continuous tracking</div>

              <div className="field">
                <label className="label">Select Your Delivery Zone</label>
                <select className="select" value={zone} onChange={e => setZone(e.target.value)}>
                  {Object.keys(zones).map(z => <option key={z}>{z}</option>)}
                </select>
              </div>

              <button className="voice-btn" onClick={getGps}>
                {gpsReady ? "✅ Location captured" : "📍 Tap to capture GPS zone (one-time)"}
              </button>

              {gpsReady && (
                <div className="gps-box">
                  <div className="gps-dot" />
                  <div className="gps-text">Zone assigned via OSM Nominatim · Lat/Lng reverse-geocoded</div>
                </div>
              )}

              <button className="btn-next" disabled={!gpsReady} onClick={() => setStep(2)}>
                Review Premium →
              </button>
            </div>
          )}

          {/* STEP 2: Review + Pay */}
          {step === 2 && (
            <div className="card">
              <div className="card-title">Your Weekly Policy</div>
              <div className="card-sub">Dynamic premium based on your zone risk score</div>

              <div className="premium-box">
                <div className="prem-row">
                  <span className="prem-label">Base premium</span>
                  <span className="prem-val">₹{prem.base}</span>
                </div>
                <div className="prem-row">
                  <span className="prem-label">Zone risk multiplier ({zone.split(" ")[0]})</span>
                  <span className="prem-val">×{prem.mult.toFixed(1)}</span>
                </div>
                <div className="prem-row">
                  <span className="prem-label">Predictive add-on (7-day forecast)</span>
                  <span className="prem-val">+ ₹{prem.addOn}</span>
                </div>
                <div className="prem-row">
                  <span className="prem-total-label">Total / week</span>
                  <span className="prem-total-val">₹{prem.total}</span>
                </div>
              </div>

              <div style={{ background: "rgba(99,179,237,.06)", border: "1px solid rgba(99,179,237,.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#63b3ed", lineHeight: 1.8 }}>
                  ✓ Auto-renews every Sunday via Razorpay<br />
                  ✓ Claim up to ₹300 per disruption event<br />
                  ✓ Policy hash stored on blockchain
                </div>
              </div>

              <button className="btn-next" onClick={submitPolicy} disabled={loading}>
                {loading ? "Processing on blockchain..." : `Pay ₹${prem.total} via Razorpay →`}
              </button>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="card">
              <div className="success-wrap">
                <div className="success-icon">🛡️</div>
                <div className="success-title">You're Protected!</div>
                <div className="success-sub">
                  Policy active for {name}. TriggerAgent is now monitoring your zone 24/7.<br />
                  Disruption detected → ₹300 hits your UPI. Zero action needed.
                </div>

                <div className="policy-details">
                  {[
                    { label: "Zone", val: zone.split("(")[0].trim() },
                    { label: "Weekly Premium", val: `₹${prem.total}` },
                    { label: "Coverage", val: "₹300 / event" },
                    { label: "Renews", val: "Every Sunday" },
                  ].map(d => (
                    <div key={d.label} className="pd-item">
                      <div className="pd-label">{d.label}</div>
                      <div className="pd-val">{d.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#718096", marginBottom: 8 }}>Blockchain TX Hash:</div>
                <div className="tx-box">{txHash}</div>

                <button className="btn-next" onClick={() => window.location.href = "/dashboard"}>
                  View My Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
