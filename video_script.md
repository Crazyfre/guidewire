# Auxilia : Phase 1 Demonstration Video Script

**Target Length:** ~2 minutes
**Tone:** Professional, engaging, and solution-oriented.
**Visuals:** Screenshare of your Next.js prototype and architecture.

---

### [0:00 - 0:20] Introduction & The Problem
*(Visual: Start with the Auxilia AI Homepage showing the Hero Section and Stats)*

**Speaker:** "Hello team, my name is [Your Name], and I'm excited to present **Auxilia**—a multi-agent parametric insurance platform built specifically for gig economy workers. Delivery riders and mobility drivers survive on daily output. If an unexpected shock hits—like brutal 45-degree heat, sudden 20mm rainfall, or a localized strike blocking off their delivery zone—they lose their entire day's earnings. Traditional insurance doesn't cover this. It's too slow, too manual, and requires too much proof."

### [0:20 - 0:50] The Solution & Workflow
*(Visual: Switch to the "Rider Onboarding" Page, ideally clicking through the flow)*

**Speaker:** "Auxilia solves this using an autonomous, data-driven approach. When a rider onboards, they choose their persona and primary working zone. Instead of a bulky monthly fee, they pay a micro-premium—as low as 99 rupees a week. This isn't a flat rate; it's dynamically calculated in real-time by our **XGBoost Risk Agent**, which looks at historical weather data, seasonality, and zone volatility to assign a precise risk multiplier."

### [0:50 - 1:20] Autonomous Triggers & Architecture
*(Visual: Switch to the "Live Zone Heatmap" or the "System Architecture" Page)*

**Speaker:** "Once insured, the rider doesn't have to do anything. Our platform uses asynchronous Python agents that constantly monitor free APIs like OpenWeatherMap and NewsAPI. For parametric triggers, we have hard-coded thresholds: more than 15mm of rain, AQI over 300, or confirmed strikes via news keywords. The moment these thresholds are breached in a rider's zone, it triggers our consensus protocol."

### [1:20 - 1:50] Fraud Prevention & Payouts
*(Visual: Switch to the "Claims History" or "Admin Dashboard" Page to show the agent votes)*

**Speaker:** "To prevent fraud, we don't just rely on one data point. We use an LLM-inspired 2-of-3 agent consensus model. A **Fraud Agent** actively checks if the rider's GPS matches the affected zone and corroborates it against fleet-wide swarm data—verifying if other riders also went offline. If the checks pass, a payout is executed instantly via the Razorpay API with zero human intervention, and the transaction is immutably logged to our local Hardhat blockchain."

### [1:50 - 2:00] Conclusion
*(Visual: Back to the Homepage or an impactful final slide/screen)*

**Speaker:** "By choosing a responsive Next.js Progressive Web App, we ensured riders wouldn't need to download another bulky mobile app, removing onboarding friction altogether. Auxilia isn't just a prototype; it's a completely autonomous safety net for the gig economy. Thank you."
