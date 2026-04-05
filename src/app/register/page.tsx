"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", business: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [ctaOffset, setCtaOffset] = useState({ x: 0, y: 0 });

  // Cursor tracking for spotlight
  useEffect(() => {
    const handler = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Magnetic CTA button
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        setCtaOffset({ x: dx * 0.25, y: dy * 0.25 });
      } else {
        setCtaOffset({ x: 0, y: 0 });
      }
    };

    const handleLeave = () => setCtaOffset({ x: 0, y: 0 });

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Scroll entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Spotlight cards
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".spotlight-card");
    const handlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = [];

    cards.forEach((card) => {
      const fn = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      };
      card.addEventListener("mousemove", fn);
      handlers.push({ el: card, fn });
    });

    return () => handlers.forEach(({ el, fn }) => el.removeEventListener("mousemove", fn));
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "שליחה נכשלה");
      }

      setStatus("success");
      setFormData({ name: "", phone: "", business: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "שליחה נכשלה, נסה שוב");
    }
  }

  function scrollToForm() {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Cursor spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px, rgba(129, 140, 248, 0.07), transparent 45%)`,
        }}
      />

      {/* Noise grain */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] noise-grain mix-blend-overlay" />

      {/* Floating orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] orb pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] orb-2 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Hero
          ctaRef={ctaRef}
          ctaOffset={ctaOffset}
          onCtaClick={scrollToForm}
        />

        <div className="gradient-divider my-8 md:my-16 mx-auto max-w-6xl" />

        <Stats />

        <div className="gradient-divider my-8 md:my-16 mx-auto max-w-6xl" />

        <WhatSection />

        <div className="gradient-divider my-8 md:my-16 mx-auto max-w-6xl" />

        <TimelineSection />

        <div className="gradient-divider my-8 md:my-16 mx-auto max-w-6xl" />

        <FormSection
          formData={formData}
          status={status}
          errorMsg={errorMsg}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <Footer />
      </div>
    </main>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero({
  ctaRef,
  ctaOffset,
  onCtaClick,
}: {
  ctaRef: React.RefObject<HTMLButtonElement | null>;
  ctaOffset: { x: number; y: number };
  onCtaClick: () => void;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="fade-up inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-sm text-zinc-300">ההרשמה פתוחה | מקומות מוגבלים</span>
        </div>

        {/* Headline */}
        <h1 className="fade-up text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6">
          <span className="gradient-text">בנה </span>
          <span className="gradient-text-brand">אייג׳נט AI</span>
          <br />
          <span className="gradient-text">לעסק שלך</span>
          <br />
          <span className="gradient-text-brand">ביום אחד</span>
        </h1>

        {/* Subheadline */}
        <p className="fade-up text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          אקתון מעשי לבעלי עסקים. לומדים, בונים, יוצאים עם כלי AI שעובד בשבילך.
        </p>

        {/* Event details */}
        <div className="fade-up flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-12 text-zinc-500">
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <span>30 באפריל 2026</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-700 hidden md:block" />
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span>בית הצעירים, מזא״ה 9, תל אביב</span>
          </div>
        </div>

        {/* CTA */}
        <div className="fade-up flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            ref={ctaRef}
            onClick={onCtaClick}
            style={{
              transform: `translate(${ctaOffset.x}px, ${ctaOffset.y}px)`,
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="cta-glow relative px-8 py-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:from-indigo-400 hover:to-purple-500 transition-colors"
          >
            הירשם עכשיו
          </button>
          <a
            href="#what"
            className="px-8 py-4 rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm text-zinc-300 font-medium text-lg hover:bg-zinc-900/50 hover:border-zinc-700 transition-all"
          >
            מה בונים באקתון
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="fade-up mt-20 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-xs tracking-wider">גלול</span>
          <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STATS
// ============================================================
function Stats() {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCounter value={1} suffix="" label="יום מרוכז" variant="large" />
          <StatCounter value={8} suffix="+" label="שעות בנייה" variant="small" />
          <StatCounter value={12} suffix="" label="מנטורים בתעשייה" variant="small" />
          <StatCounter value={50} suffix="" label="מקומות בלבד" variant="large" />
        </div>
      </div>
    </section>
  );
}

function StatCounter({
  value,
  suffix,
  label,
  variant,
}: {
  value: number;
  suffix: string;
  label: string;
  variant: "large" | "small";
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1200;
            const start = performance.now();
            const animate = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.round(eased * value));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const sizeClass =
    variant === "large"
      ? "text-6xl md:text-7xl"
      : "text-4xl md:text-5xl";

  return (
    <div
      ref={ref}
      className={`fade-up ${variant === "large" ? "md:col-span-1" : ""}`}
    >
      <div className={`${sizeClass} font-bold gradient-text-brand leading-none mb-3`}>
        {display}
        {suffix}
      </div>
      <div className="text-zinc-400 text-sm md:text-base">{label}</div>
    </div>
  );
}

// ============================================================
// WHAT YOU BUILD
// ============================================================
function WhatSection() {
  return (
    <section id="what" className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="fade-up mb-16 max-w-3xl">
          <div className="text-sm text-indigo-400 mb-3 tracking-wider">מה בונים</div>
          <h2 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
            לא סדנת הרצאות.
            <br />
            <span className="gradient-text-brand">אקתון של בנייה.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Large card */}
          <div className="fade-up md:col-span-7 spotlight-card rounded-2xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-sm p-8 md:p-10">
            <div className="flex items-start justify-between mb-8">
              <div className="text-xs text-indigo-400 tracking-widest">01</div>
              <div className="text-4xl">🤖</div>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-zinc-100 mb-4">
              סוכן שירות לקוחות אוטומטי
            </h3>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              עונה על פניות בוואטסאפ, מייל ואתר. מבין הקשר, שולף מידע מהמערכות שלך, וסוגר לקוח בלי להעיר אותך ב-2 בלילה.
            </p>
          </div>

          {/* Medium card */}
          <div className="fade-up md:col-span-5 spotlight-card rounded-2xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-sm p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-8">
                <div className="text-xs text-purple-400 tracking-widest">02</div>
                <div className="text-4xl">💼</div>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-zinc-100 mb-4">
                אייג׳נט מכירות
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                מסווג לידים, כותב פולואפים מותאמים, ומזיז עסקאות בפייפליין.
              </p>
            </div>
          </div>

          {/* Small wide card */}
          <div className="fade-up md:col-span-5 spotlight-card rounded-2xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-sm p-8 md:p-10">
            <div className="flex items-start justify-between mb-8">
              <div className="text-xs text-pink-400 tracking-widest">03</div>
              <div className="text-4xl">⚡</div>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-zinc-100 mb-4">
              אוטומציית תהליכים
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              מחבר בין הכלים שלך, מעביר מידע, ומחסל משימות חוזרות.
            </p>
          </div>

          {/* Final large card */}
          <div className="fade-up md:col-span-7 spotlight-card rounded-2xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-sm p-8 md:p-10">
            <div className="flex items-start justify-between mb-8">
              <div className="text-xs text-emerald-400 tracking-widest">+</div>
              <div className="text-4xl">🎯</div>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-zinc-100 mb-4">
              הכל סביב ה-use case שלך
            </h3>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              מגיעים עם בעיה אמיתית מהעסק. יוצאים עם כלי AI שמטפל בה. בלי הדגמות תיאורטיות, בלי to-do לשבוע הבא.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE
// ============================================================
function TimelineSection() {
  const items = [
    { time: "09:00", title: "התכנסות והכרות", desc: "קפה, בוקר, הצגת המשתתפים והמנטורים" },
    { time: "09:30", title: "מבוא מעשי ל-AI Agents", desc: "מה עובד, מה מיתוס, איפה העסק שלך נכנס" },
    { time: "10:30", title: "בחירת ה-use case", desc: "מיפוי בעיות, בחירת אתגר לבנייה" },
    { time: "11:00", title: "תחילת בנייה עם מנטור", desc: "בנייה צמודה עם מפתח/סטודנטית בכיר" },
    { time: "13:00", title: "ארוחת צהריים", desc: "אוכל, נטוורקינג, שיחות טובות" },
    { time: "14:00", title: "המשך בנייה ושיפור", desc: "חידוד, חיבורים למערכות, בדיקות" },
    { time: "17:00", title: "הצגת פרויקטים", desc: "כל משתתף מציג מה בנה ומה למד" },
    { time: "18:30", title: "סיכום וסיום", desc: "משוב, המשך הדרך, קוקטייל סיום" },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="fade-up mb-16 text-center">
          <div className="text-sm text-purple-400 mb-3 tracking-wider">סדר היום</div>
          <h2 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
            יום אחד. <span className="gradient-text-brand">8 שלבים.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Gradient line */}
          <div className="absolute right-[60px] md:right-[80px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/40 to-pink-500/40" />

          <div className="space-y-8">
            {items.map((item, i) => (
              <div key={i} className="fade-up flex gap-6 md:gap-10 items-start">
                <div className="flex-shrink-0 w-[60px] md:w-[80px] text-left md:text-right">
                  <div className="text-base md:text-lg font-mono text-zinc-400 pt-1">
                    {item.time}
                  </div>
                </div>
                <div className="relative flex-shrink-0 pt-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 ring-4 ring-zinc-950" />
                </div>
                <div className="flex-1 pb-2">
                  <h3 className="text-xl md:text-2xl font-semibold text-zinc-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FORM
// ============================================================
function FormSection({
  formData,
  status,
  errorMsg,
  onChange,
  onSubmit,
}: {
  formData: { name: string; phone: string; business: string };
  status: Status;
  errorMsg: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <section id="register" className="relative py-20 md:py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="fade-up mb-12 text-center">
          <div className="text-sm text-pink-400 mb-3 tracking-wider">הרשמה</div>
          <h2 className="text-4xl md:text-6xl font-bold gradient-text leading-tight mb-6">
            שמור לעצמך <span className="gradient-text-brand">מקום.</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            נשארו מקומות ספורים. נחזור אלייך תוך 24 שעות.
          </p>
        </div>

        {status === "success" ? (
          <div className="fade-up border-gradient rounded-2xl p-10 text-center">
            <div className="text-6xl mb-6">✓</div>
            <h3 className="text-3xl font-bold gradient-text-brand mb-4">
              נרשמת בהצלחה
            </h3>
            <p className="text-zinc-400 text-lg">
              קיבלנו את הפרטים שלך. ניצור קשר בקרוב.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="fade-up space-y-5 p-8 md:p-10 rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md"
          >
            <FormField
              label="שם מלא"
              name="name"
              type="text"
              value={formData.name}
              onChange={onChange}
              placeholder="ישראל ישראלי"
              required
              disabled={status === "loading"}
            />
            <FormField
              label="טלפון"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onChange}
              placeholder="050-1234567"
              required
              disabled={status === "loading"}
              dir="ltr"
            />
            <FormField
              label="מה העסק שלך"
              name="business"
              type="text"
              value={formData.business}
              onChange={onChange}
              placeholder="לדוגמה: מרפאת שיניים, משרד עו״ד, חנות אונליין"
              required
              disabled={status === "loading"}
            />

            {status === "error" && (
              <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
                {errorMsg || "שליחה נכשלה, נסה שוב"}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="cta-glow w-full py-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:from-indigo-400 hover:to-purple-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "שולח..." : "שלח הרשמה"}
            </button>

            <p className="text-xs text-zinc-500 text-center pt-2">
              בהרשמה את/ה מאשר/ת קבלת עדכונים לגבי האקתון
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  dir,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm text-zinc-300 mb-2 font-medium"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        dir={dir}
        className="w-full px-4 py-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-zinc-900/90 transition-colors disabled:opacity-60"
      />
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <div>אקתון AI לבעלי עסקים © 2026</div>
        <div>30 באפריל 2026 | בית הצעירים, מזא״ה 9, תל אביב</div>
      </div>
    </footer>
  );
}

// ============================================================
// ICONS
// ============================================================
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
