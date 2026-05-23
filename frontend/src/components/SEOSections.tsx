import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SEOSections.css";

function SEOSections(): JSX.Element {
  const navigate = useNavigate();

  const services = [
    {
      icon: "📱",
      title: "Screen Replacement",
      desc: "Cracked or shattered screen? We replace iPhone and Android screens with high-quality parts. Your display will look and feel brand new. Most screen replacements done in 30–45 minutes at your location.",
    },
    {
      icon: "🔋",
      title: "Battery Replacement",
      desc: "Is your phone dying by noon? A worn-out battery is the most common phone problem we fix. We replace batteries for all iPhone models and Android devices quickly and affordably.",
    },
    {
      icon: "🔌",
      title: "Charging Port Repair",
      desc: "Phone not charging or only charges at a weird angle? We clean and repair Lightning, USB-C, and Micro-USB charging ports on-site — no parts ordering, no waiting.",
    },
    {
      icon: "📷",
      title: "Camera Repair",
      desc: "Blurry photos, black camera screen, or a cracked camera lens? We fix front and rear cameras on all iPhone and Android models so you never miss a moment.",
    },
    {
      icon: "💾",
      title: "Software & Data Recovery",
      desc: "Phone frozen, stuck in a boot loop, or won't turn on? We perform diagnostics, factory resets, and data recovery to get your phone working — and save your photos and contacts where possible.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Call or Book Online",
      desc: "Call (614) 418-6756 or fill out our free quote form. Tell us your phone model and what's wrong. We'll give you an upfront price — no surprises.",
    },
    {
      num: "02",
      title: "We Come To You",
      desc: "Pick a time that works. We travel to your home, office, or anywhere in Columbus, Ohio. Same-day appointments usually available.",
    },
    {
      num: "03",
      title: "Fixed In Under An Hour",
      desc: "We repair your phone on-site while you watch. Screen replacements, battery swaps, charging port fixes — most repairs take 30–60 minutes. You're back to normal fast.",
    },
  ];

  const areas = [
    "Downtown Columbus",
    "Short North",
    "Westerville",
    "Dublin",
    "Easton & Gahanna",
    "Grove City",
    "Hilliard",
    "Worthington",
    "Upper Arlington",
    "Reynoldsburg",
    "Pickerington",
    "Lewis Center",
    "New Albany",
    "Canal Winchester",
    "Grandview Heights",
  ];

  return (
    <>
      {/* ── WHY CHOOSE US ── */}
      <section className="seosec-why">
        <div className="seosec-container">
          <div className="seosec-label">Why Columbus Chooses Us</div>
          <h2 className="seosec-h2">
            The Phone Repair Service That <em>Comes To You</em>
          </h2>
          <p className="seosec-lead">
            Forget driving across town, sitting in a waiting room, or leaving
            your phone overnight. The Tech Next Door is Columbus's only mobile
            repair service — we come to your home, office, or workplace and fix
            your phone on the spot. Most repairs take under an hour.
          </p>

          <div className="seosec-why-grid">
            <div className="seosec-why-card">
              <span className="seosec-why-icon">🏠</span>
              <h3>We Come To You</h3>
              <p>
                No store trips. No waiting rooms. We repair your phone at your
                home, office, or wherever you are in Columbus.
              </p>
            </div>
            <div className="seosec-why-card">
              <span className="seosec-why-icon">⚡</span>
              <h3>Same-Day Service</h3>
              <p>
                Call in the morning, get your phone fixed by afternoon. Same-day
                appointments available across all of Columbus.
              </p>
            </div>
            <div className="seosec-why-card">
              <span className="seosec-why-icon">💰</span>
              <h3>Upfront Pricing</h3>
              <p>
                We give you a clear quote before we start any work. Fair prices,
                no hidden fees, no surprises on your bill.
              </p>
            </div>
            <div className="seosec-why-card">
              <span className="seosec-why-icon">🛡️</span>
              <h3>Quality Parts</h3>
              <p>
                We use high-quality replacement parts on every repair. Your
                phone will look and perform like new when we're done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="seosec-services">
        <div className="seosec-container">
          <div className="seosec-label">What We Fix</div>
          <h2 className="seosec-h2">Phone Repair Services in Columbus, Ohio</h2>
          <div className="seosec-services-grid">
            {services.map((s) => (
              <div key={s.title} className="seosec-service-card">
                <span className="seosec-service-icon">{s.icon}</span>
                <h3 className="seosec-service-title">{s.title}</h3>
                <p className="seosec-service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="seosec-cta-row">
            <button
              className="seosec-btn"
              onClick={() => navigate("/getaquote")}
            >
              Get a Free Quote
            </button>
            <a
              href="tel:+16144186756"
              className="seosec-btn seosec-btn-outline"
            >
              Call (614) 418-6756
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="seosec-how">
        <div className="seosec-container">
          <div className="seosec-label">Simple Process</div>
          <h2 className="seosec-h2">How It Works — 3 Easy Steps</h2>
          <div className="seosec-steps">
            {steps.map((s) => (
              <div key={s.num} className="seosec-step">
                <div className="seosec-step-num">{s.num}</div>
                <div className="seosec-step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section className="seosec-coverage">
        <div className="seosec-container">
          <div className="seosec-label">Service Area</div>
          <h2 className="seosec-h2">
            Mobile Phone Repair Across All of Columbus, Ohio
          </h2>
          <p className="seosec-lead">
            The Tech Next Door serves the entire Columbus metro area. We come to
            you — no matter where you are in the city or suburbs. If you're in
            the Columbus area, we've got you covered.
          </p>
          <div className="seosec-areas">
            {areas.map((a) => (
              <div key={a} className="seosec-area-chip">
                <span className="seosec-area-dot" />
                {a}
              </div>
            ))}
          </div>
          <p className="seosec-coverage-note">
            Not sure if we serve your area?{" "}
            <a href="tel:+16144186756">Call (614) 418-6756</a> and we'll
            confirm.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="seosec-faq">
        <div className="seosec-container">
          <div className="seosec-label">Common Questions</div>
          <h2 className="seosec-h2">Frequently Asked Questions</h2>
          <div className="seosec-faq-grid">
            {[
              {
                q: "Do you really come to my house?",
                a: "Yes! We are a fully mobile repair service. We travel to your home, office, or workplace anywhere in Columbus and surrounding areas. No store trip needed.",
              },
              {
                q: "How much does phone repair cost?",
                a: "Screen replacements typically range from $79–$199 depending on the model. Battery replacements start at $49. We always give you a free quote before starting any work.",
              },
              {
                q: "How long does a repair take?",
                a: "Most repairs take 30–60 minutes on-site. Screen replacements, battery swaps, and charging port repairs are usually done in under an hour.",
              },
              {
                q: "Do you repair both iPhone and Android?",
                a: "Yes. We repair all iPhone models and most Android brands including Samsung, Google Pixel, LG, and Motorola.",
              },
              {
                q: "How do I book a repair?",
                a: "Call us at (614) 418-6756, or fill out the free quote form on our website. Same-day appointments are usually available across Columbus.",
              },
              {
                q: "What if my repair doesn't fix the problem?",
                a: "We stand behind our work. If a repair doesn't resolve the issue, we'll make it right.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="seosec-faq-item">
                <h3 className="seosec-faq-q">{q}</h3>
                <p className="seosec-faq-a">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="seosec-closing">
        <div className="seosec-container seosec-closing-inner">
          <h2 className="seosec-closing-h2">
            Ready to Get Your Phone Fixed Today?
          </h2>
          <p className="seosec-closing-sub">
            Don't let a cracked screen or dead battery slow you down. We come to
            you anywhere in Columbus, Ohio — same day, fair prices, done in
            under an hour.
          </p>
          <div className="seosec-cta-row">
            <a href="tel:+16144186756" className="seosec-btn">
              📞 Call (614) 418-6756
            </a>
            <button
              className="seosec-btn seosec-btn-outline"
              onClick={() => navigate("/getaquote")}
            >
              Get a Free Quote
            </button>
          </div>
          <p className="seosec-closing-areas">
            Serving Columbus · Westerville · Dublin · Easton · Grove City ·
            Hilliard · Worthington · Upper Arlington · Reynoldsburg &amp; all
            surrounding areas
          </p>
        </div>
      </section>
    </>
  );
}

export default SEOSections;
