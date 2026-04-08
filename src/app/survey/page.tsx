"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CUSTOMER_COUNTS = ["1-5", "6-20", "21-50", "51-100", "100+", "אחר"] as const;

const LIFESPAN_OPTIONS = [
  "חד פעמי",
  "חודש",
  "2-3 חודשים",
  "4-6 חודשים",
  "6-12 חודשים",
  "שנה+",
] as const;

const MRR_OPTIONS = [
  "עד 1,000 ₪",
  "1,000-5,000 ₪",
  "5,000-15,000 ₪",
  "15,000-50,000 ₪",
  "50,000+ ₪",
] as const;

const MARKETING_CHANNELS = [
  "שיווק אורגני ברשתות (תוכן, פוסטים)",
  "שיווק ממומן (Meta, Google Ads)",
  "SEO",
  "פה לאוזן / הפניות",
  "שיתופי פעולה ואפיליאייט",
  "אימייל מרקטינג",
  "אחר",
] as const;

const CHALLENGE_CATEGORIES = [
  {
    title: "צמיחה ושיווק",
    items: [
      "שיווק אורגני (תוכן, SEO, רשתות)",
      "שיווק ממומן (Meta, Google)",
      "מכירות והמרות",
    ],
  },
  {
    title: "מוצר",
    items: [
      "פיצ׳רים ופיתוח מוצר",
      "onboarding ללקוחות חדשים",
      "דף תמחור ואריזת מוצר",
    ],
  },
  {
    title: "תפעול",
    items: [
      "ייעול תהליכי עבודה (workflows)",
      "שימור לקוחות (retention)",
      "פיננסים ומשפטים",
    ],
  },
] as const;

function useSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);
  return { ref, onMouseMove: handleMove };
}

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const dividerStyle = { background: "linear-gradient(90deg, transparent 0%, rgba(224, 122, 95, 0.5) 50%, transparent 100%)" };

export default function SurveyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saasDescription, setSaasDescription] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [customerCount, setCustomerCount] = useState("");
  const [customerCountOther, setCustomerCountOther] = useState("");
  const [lifespan, setLifespan] = useState("");
  const [mrr, setMrr] = useState("");
  const [marketingChannels, setMarketingChannels] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [challengeOther, setChallengeOther] = useState("");
  const [aiImprovement, setAiImprovement] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  function toggleItem(value: string, list: string[], setList: (v: string[]) => void) {
    setList(
      list.includes(value) ? list.filter((c) => c !== value) : [...list, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Pack extra fields into existing DB columns
    const marketingStr = marketingChannels.length > 0 ? marketingChannels.join(", ") : null;
    const detailsAndMarketing = [
      productDetails ? `פירוט מוצר: ${productDetails}` : null,
      marketingStr ? `דרכי שיווק: ${marketingStr}` : null,
    ].filter(Boolean).join("\n\n");

    const res = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        projectStage: customerCount === "אחר" ? customerCountOther || "אחר" : customerCount,
        projectStageOther: customerCount === "אחר" ? customerCountOther : null,
        saasDescription: saasDescription || null,
        stuckAreas: challenges.length > 0
          ? challenges.map((c) => c === "אחר" && challengeOther ? `אחר: ${challengeOther}` : c)
          : null,
        whatHelpsProgress: mrr || null,
        contentFeedback: lifespan || null,
        sessionsFeedback: aiImprovement || null,
        overallFeedback: detailsAndMarketing || null,
        additionalNotes: additionalNotes || null,
      }),
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();
  const fadeRef3 = useFadeUp();
  const fadeRef4 = useFadeUp();

  const spot1 = useSpotlight();
  const spot2 = useSpotlight();
  const spot3 = useSpotlight();
  const spot4 = useSpotlight();

  const inputClass =
    "w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent transition-all duration-200";

  const selectClass =
    "w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none";

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl orb" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl orb-2" />
        <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />

        <div className="text-center space-y-6 fade-up visible">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">תודה רבה!</h1>
          <p className="text-zinc-400 text-lg max-w-md">
            קיבלנו את התשובות שלך. נשתמש במידע הזה כדי לבנות לך את החוויה הכי טובה.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl orb" />
      <div className="absolute top-[60%] left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl orb-2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 pulse-dot" />
            שאלון סטודנטים
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">
            שאלון סטודנטים - ncode
          </h1>
          <p className="text-zinc-300 text-lg">
            עזרו לנו להבין איפה אתם ומה אתם צריכים
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal + Product */}
          <div ref={fadeRef1} className="fade-up">
            <div
              ref={spot1.ref}
              onMouseMove={spot1.onMouseMove}
              className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">פרטים אישיים</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">שם מלא *</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="ישראל ישראלי"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">טלפון *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="050-1234567"
                  required
                />
              </div>

              <div style={dividerStyle} className="gradient-divider" />

              <h2 className="text-lg font-semibold text-white">על המוצר שלך</h2>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">ספר/י על המוצר שלך בקצרה *</label>
                <textarea
                  value={saasDescription}
                  onChange={(e) => setSaasDescription(e.target.value)}
                  className={inputClass + " h-24 resize-none"}
                  placeholder='אני עוזר/ת ל-[קהל יעד] לעשות [מה] באמצעות [המוצר שלך]'
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  מדהים! עכשיו תפרט/י על המוצר
                </label>
                <textarea
                  value={productDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  className={inputClass + " h-28 resize-none"}
                  placeholder={"למשל: איך המוצר עובד, מה הפיצ׳רים העיקריים, מה מבדיל אתכם מהמתחרים..."}
                />
              </div>

              <div style={dividerStyle} className="gradient-divider" />

              <h2 className="text-lg font-semibold text-white">מספרים</h2>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">כמה לקוחות משלמים יש לך היום? *</label>
                <select
                  value={customerCount}
                  onChange={(e) => setCustomerCount(e.target.value)}
                  required
                  className={selectClass}
                >
                  <option value="" disabled>בחר/י</option>
                  {CUSTOMER_COUNTS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {customerCount === "אחר" && (
                  <input
                    value={customerCountOther}
                    onChange={(e) => setCustomerCountOther(e.target.value)}
                    className={inputClass + " mt-3"}
                    placeholder="פרט/י..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">כמה זמן לקוח ממוצע נשאר?</label>
                <select
                  value={lifespan}
                  onChange={(e) => setLifespan(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>בחר/י</option>
                  {LIFESPAN_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">מה ה-MRR (הכנסה חודשית חוזרת) שלך?</label>
                <select
                  value={mrr}
                  onChange={(e) => setMrr(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>בחר/י</option>
                  {MRR_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Marketing */}
          <div ref={fadeRef2} className="fade-up">
            <div
              ref={spot2.ref}
              onMouseMove={spot2.onMouseMove}
              className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">דרכי שיווק</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-3">באילו ערוצים את/ה משווק/ת היום?</label>
                <p className="text-xs text-zinc-400 mb-3">אפשר לבחור כמה</p>
                <div className="grid grid-cols-2 gap-2">
                  {MARKETING_CHANNELS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleItem(opt, marketingChannels, setMarketingChannels)}
                      className={`px-3 py-2.5 rounded-lg text-sm text-right transition-all duration-200 border ${
                        marketingChannels.includes(opt)
                          ? "bg-orange-500/15 border-orange-500/40 text-orange-200"
                          : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
                      }`}
                    >
                      {marketingChannels.includes(opt) && (
                        <span className="inline-block ml-1.5 text-orange-400">&#10003;</span>
                      )}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Challenges */}
          <div ref={fadeRef3} className="fade-up">
            <div
              ref={spot3.ref}
              onMouseMove={spot3.onMouseMove}
              className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">אתגרים וצרכים</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-3">מה האתגר הכי גדול בצמיחה שלך עכשיו?</label>
                <p className="text-xs text-zinc-400 mb-4">אפשר לבחור כמה</p>

                {CHALLENGE_CATEGORIES.map((category) => (
                  <div key={category.title} className="mb-4">
                    <p className="text-xs text-zinc-400 font-medium mb-2">{category.title}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {category.items.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleItem(opt, challenges, setChallenges)}
                          className={`px-3 py-2.5 rounded-lg text-sm text-right transition-all duration-200 border ${
                            challenges.includes(opt)
                              ? "bg-orange-500/15 border-orange-500/40 text-orange-200"
                              : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
                          }`}
                        >
                          {challenges.includes(opt) && (
                            <span className="inline-block ml-1.5 text-orange-400">&#10003;</span>
                          )}
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => toggleItem("אחר", challenges, setChallenges)}
                  className={`px-3 py-2.5 rounded-lg text-sm text-right transition-all duration-200 border ${
                    challenges.includes("אחר")
                      ? "bg-orange-500/15 border-orange-500/40 text-orange-200"
                      : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
                  }`}
                >
                  {challenges.includes("אחר") && (
                    <span className="inline-block ml-1.5 text-orange-400">&#10003;</span>
                  )}
                  אחר
                </button>
                {challenges.includes("אחר") && (
                  <input
                    value={challengeOther}
                    onChange={(e) => setChallengeOther(e.target.value)}
                    className={inputClass + " mt-3"}
                    placeholder="פרט/י..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">מה היית רוצה לקבל מהאקתון?</label>
                <textarea
                  value={aiImprovement}
                  onChange={(e) => setAiImprovement(e.target.value)}
                  className={inputClass + " h-24 resize-none"}
                  placeholder="למשל: לבנות אוטומציה ספציפית, ללמוד לעבוד עם AI, לקבל עזרה עם אתגר מסוים..."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Additional */}
          <div ref={fadeRef4} className="fade-up">
            <div
              ref={spot4.ref}
              onMouseMove={spot4.onMouseMove}
              className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-white">עוד משהו?</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className={inputClass + " h-24 resize-none"}
                placeholder="כל דבר נוסף שתרצו לשתף..."
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <div className="pt-2 pb-8">
            <button
              type="submit"
              disabled={loading || !fullName || !phone || !customerCount}
              className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-l from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-500 cta-glow"
            >
              {loading ? "שולח..." : "שליחת השאלון"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
