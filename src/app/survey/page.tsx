"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PROJECT_STAGES = [
  "רעיונאות",
  "ואלידציה",
  "מפתח/ת MVP",
  "בניתי MVP - עדיין בלי טסטרים",
  "בניתי MVP - יש טסטרים",
  "בפיתוח מוצר",
  "משווק/ת - עדיין בלי מכירות",
  "יש לקוחות משלמים",
  "אחר",
] as const;

const STUCK_AREAS = [
  "רעיונאות",
  "ולידציה וחקר שוק",
  "איפיון MVP",
  "מציאת קבוצת בקרה",
  "פיתוח (Lovable / Claude Code)",
  "תמחור",
  "קופי ודפי נחיתה",
  "שיווק וקמפיינים",
  "מכירות",
  "Product",
  "פיננסים ומשפטים",
  "אחר",
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

function RatingButtons({
  value,
  onChange,
  max = 10,
}: {
  value: number | null;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="grid grid-cols-10 gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`aspect-square rounded-lg text-sm font-medium transition-all duration-200 ${
            value === n
              ? n <= 3
                ? "bg-red-500/80 text-white shadow-lg shadow-red-500/20"
                : n <= 6
                ? "bg-amber-500/80 text-white shadow-lg shadow-amber-500/20"
                : n <= 8
                ? "bg-lime-500/80 text-white shadow-lg shadow-lime-500/20"
                : "bg-emerald-500/80 text-white shadow-lg shadow-emerald-500/20"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function SurveyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectStage, setProjectStage] = useState("");
  const [projectStageOther, setProjectStageOther] = useState("");
  const [saasDescription, setSaasDescription] = useState("");
  const [stuckAreas, setStuckAreas] = useState<string[]>([]);
  const [whatHelpsProgress, setWhatHelpsProgress] = useState("");
  const [contentSatisfaction, setContentSatisfaction] = useState<number | null>(null);
  const [contentFeedback, setContentFeedback] = useState("");
  const [sessionsSatisfaction, setSessionsSatisfaction] = useState<number | null>(null);
  const [sessionsFeedback, setSessionsFeedback] = useState("");
  const [overallSatisfaction, setOverallSatisfaction] = useState<number | null>(null);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");


  function toggleStuckArea(area: string) {
    setStuckAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        projectStage,
        projectStageOther: projectStage === "אחר" ? projectStageOther : null,
        saasDescription,
        stuckAreas,
        whatHelpsProgress,
        contentSatisfaction,
        contentFeedback: contentSatisfaction && contentSatisfaction < 9 ? contentFeedback : null,
        sessionsSatisfaction,
        sessionsFeedback: sessionsSatisfaction && sessionsSatisfaction < 9 ? sessionsFeedback : null,
        overallSatisfaction,
        overallFeedback: overallSatisfaction && overallSatisfaction < 9 ? overallFeedback : null,
        additionalNotes,
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

  // Fade-up refs for sections
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();
  const fadeRef3 = useFadeUp();
  const fadeRef4 = useFadeUp();
  const fadeRef5 = useFadeUp();

  // Spotlight for cards
  const spot1 = useSpotlight();
  const spot2 = useSpotlight();
  const spot3 = useSpotlight();
  const spot4 = useSpotlight();
  const spot5 = useSpotlight();

  const inputClass =
    "w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-200";

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl orb" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl orb-2" />

        {/* Noise overlay */}
        <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />

        <div className="text-center space-y-6 fade-up visible">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">תודה רבה!</h1>
          <p className="text-zinc-400 text-lg max-w-md">
            התשובות שלך חשובות לנו מאוד ויעזרו לנו לשפר את ההכשרה
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Noise overlay */}
      <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />

      {/* Background orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl orb" />
      <div className="absolute top-[60%] left-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl orb-2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
            שאלון סטודנטים
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">
            ספרו לנו איפה אתם
          </h1>
          <p className="text-zinc-300 text-lg">
            עזרו לנו להבין מה אתם צריכים כדי שנוכל לתת לכם יותר
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Info */}
          <div ref={fadeRef1} className="fade-up">
            <div
              ref={spot1.ref}
              onMouseMove={spot1.onMouseMove}
              className="spotlight-card bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-white">פרטים אישיים</h2>
              <div className="gradient-divider mb-4" />

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
            </div>
          </div>

          {/* Section 2: Project Status */}
          <div ref={fadeRef2} className="fade-up">
            <div
              ref={spot2.ref}
              onMouseMove={spot2.onMouseMove}
              className="spotlight-card bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">על הפרויקט שלך</h2>
              <div className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">באיזה שלב ה-SaaS שלך היום? *</label>
                <select
                  value={projectStage}
                  onChange={(e) => setProjectStage(e.target.value)}
                  required
                  className={`${inputClass} cursor-pointer appearance-none`}
                >
                  <option value="" disabled>בחר/י שלב</option>
                  {PROJECT_STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {projectStage === "אחר" && (
                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">באיזה שלב?</label>
                  <input
                    value={projectStageOther}
                    onChange={(e) => setProjectStageOther(e.target.value)}
                    className={inputClass}
                    placeholder="ספר/י באיזה שלב את/ה"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">ספר/י על ה-SaaS שלך בקצרה</label>
                <textarea
                  value={saasDescription}
                  onChange={(e) => setSaasDescription(e.target.value)}
                  className={inputClass + " h-24 resize-none"}
                  placeholder='אני עוזר/ת ל-[קהל יעד] לעשות [מה] באמצעות [המוצר שלך]'
                />
              </div>
            </div>
          </div>

          {/* Section 3: Struggles & Needs */}
          <div ref={fadeRef3} className="fade-up">
            <div
              ref={spot3.ref}
              onMouseMove={spot3.onMouseMove}
              className="spotlight-card bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">קשיים וצרכים</h2>
              <div className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-3">באילו תחומים את/ה מרגיש/ה תקוע/ה?</label>
                <div className="grid grid-cols-2 gap-2">
                  {STUCK_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleStuckArea(area)}
                      className={`px-3 py-2.5 rounded-lg text-sm text-right transition-all duration-200 border ${
                        stuckAreas.includes(area)
                          ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                          : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
                      }`}
                    >
                      {stuckAreas.includes(area) && (
                        <span className="inline-block ml-1.5 text-indigo-400">&#10003;</span>
                      )}
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">מה הדבר שהכי יעזור לך להתקדם עכשיו?</label>
                <textarea
                  value={whatHelpsProgress}
                  onChange={(e) => setWhatHelpsProgress(e.target.value)}
                  className={inputClass + " h-24 resize-none"}
                  placeholder="תפרטו כמה שיותר - למשל: משוב על המוצר, עזרה עם שיווק, בהירות לגבי הכיוון..."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Satisfaction */}
          <div ref={fadeRef4} className="fade-up">
            <div
              ref={spot4.ref}
              onMouseMove={spot4.onMouseMove}
              className="spotlight-card bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">שביעות רצון</h2>
              <div className="gradient-divider mb-4" />

              {/* Content satisfaction */}
              <div className="space-y-2">
                <label className="block text-sm text-zinc-100 font-medium">כמה מרוצה מהתכנים?</label>
                <RatingButtons value={contentSatisfaction} onChange={setContentSatisfaction} />
                <div className="flex justify-between text-xs text-zinc-400 px-0.5">
                  <span>בכלל לא</span>
                  <span>מאוד</span>
                </div>
                {contentSatisfaction !== null && contentSatisfaction < 9 && (
                  <div className="pt-2">
                    <input
                      value={contentFeedback}
                      onChange={(e) => setContentFeedback(e.target.value)}
                      className={inputClass}
                      placeholder="מה היית משפר בתכנים?"
                    />
                  </div>
                )}
              </div>

              <div className="gradient-divider" />

              {/* Sessions satisfaction */}
              <div className="space-y-2">
                <label className="block text-sm text-zinc-100 font-medium">כמה מרוצה מהזומים/פרונטלים?</label>
                <RatingButtons value={sessionsSatisfaction} onChange={setSessionsSatisfaction} />
                <div className="flex justify-between text-xs text-zinc-400 px-0.5">
                  <span>בכלל לא</span>
                  <span>מאוד</span>
                </div>
                {sessionsSatisfaction !== null && sessionsSatisfaction < 9 && (
                  <div className="pt-2">
                    <input
                      value={sessionsFeedback}
                      onChange={(e) => setSessionsFeedback(e.target.value)}
                      className={inputClass}
                      placeholder="מה היית משפר בזומים/בפרונטלים?"
                    />
                  </div>
                )}
              </div>

              <div className="gradient-divider" />

              {/* Overall satisfaction */}
              <div className="space-y-2">
                <label className="block text-sm text-zinc-100 font-medium">כמה מרוצה באופן כללי מ-nCode?</label>
                <RatingButtons value={overallSatisfaction} onChange={setOverallSatisfaction} />
                <div className="flex justify-between text-xs text-zinc-400 px-0.5">
                  <span>בכלל לא</span>
                  <span>מאוד</span>
                </div>
                {overallSatisfaction !== null && overallSatisfaction < 9 && (
                  <div className="pt-2">
                    <input
                      value={overallFeedback}
                      onChange={(e) => setOverallFeedback(e.target.value)}
                      className={inputClass}
                      placeholder="מה הדבר הכי חשוב שנשפר?"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Additional */}
          <div ref={fadeRef5} className="fade-up">
            <div
              ref={spot5.ref}
              onMouseMove={spot5.onMouseMove}
              className="spotlight-card bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-white">עוד משהו?</h2>
              <div className="gradient-divider mb-4" />
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className={inputClass + " h-24 resize-none"}
                placeholder="מה חשוב לך שנדע?"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 pb-8">
            <button
              type="submit"
              disabled={loading || !fullName || !phone || !projectStage}
              className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-l from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 cta-glow"
            >
              {loading ? "שולח..." : "שליחת השאלון"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
