"use client";

import { useState, useRef, useCallback } from "react";

const EMPLOYEE_COUNTS = ["1-5", "6-15", "16-50", "50+"] as const;

type BusinessType = null | "business-owner" | "company-manager";

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
  const ref = useCallback((el: HTMLDivElement | null) => {
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
  }, []);
  return ref;
}

const dividerStyle = {
  background:
    "linear-gradient(90deg, transparent 0%, rgba(224, 122, 95, 0.5) 50%, transparent 100%)",
};

export default function BusinessIntakePage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  /* ── Section 1: Personal ── */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  /* ── Section 2: Business type + about ── */
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [businessServices, setBusinessServices] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [dreamEmployee, setDreamEmployee] = useState("");

  /* ── Section 3: Processes (business owner) ── */
  const [customerHandling, setCustomerHandling] = useState("");
  const [financeHandling, setFinanceHandling] = useState("");
  const [contentCreation, setContentCreation] = useState("");
  const [quotesHandling, setQuotesHandling] = useState("");
  const [calendarManagement, setCalendarManagement] = useState("");

  /* ── Section 3: Processes (company manager) ── */
  const [employeeCount, setEmployeeCount] = useState("");
  const [companyCustomerHandling, setCompanyCustomerHandling] = useState("");
  const [companyFinanceHandling, setCompanyFinanceHandling] = useState("");
  const [companyContentCreation, setCompanyContentCreation] = useState("");
  const [teamBottleneck, setTeamBottleneck] = useState("");

  /* ── Section 4: Style & experience ── */
  const [brandVoice, setBrandVoice] = useState("");
  const [aiExperience, setAiExperience] = useState<number | null>(null);
  const [desiredAgent, setDesiredAgent] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body: Record<string, unknown> = {
      firstName,
      lastName,
      businessName,
      businessType: businessType === "business-owner" ? "בעל/ת עסק" : "מנהל/ת חברה",
      businessServices: businessServices || null,
      targetAudience: targetAudience || null,
      dreamEmployee: dreamEmployee || null,
      instagramUrl: instagramUrl || null,
      facebookUrl: facebookUrl || null,
      websiteUrl: websiteUrl || null,
      brandVoice: brandVoice || null,
      aiExperience,
      desiredAgent: desiredAgent || null,
      additionalNotes: additionalNotes || null,
    };

    if (businessType === "business-owner") {
      body.customerHandling = customerHandling || null;
      body.financeHandling = financeHandling || null;
      body.contentCreation = contentCreation || null;
      body.quotesOrTeamBottleneck = quotesHandling || null;
      body.calendarManagement = calendarManagement || null;
    } else {
      body.employeeCount = employeeCount || null;
      body.customerHandling = companyCustomerHandling || null;
      body.financeHandling = companyFinanceHandling || null;
      body.contentCreation = companyContentCreation || null;
      body.quotesOrTeamBottleneck = teamBottleneck || null;
    }

    try {
      const res = await fetch("/api/business-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch {
      setError("שגיאת תקשורת, נסו שוב");
      setLoading(false);
    }
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

  const branchBtnClass = (active: boolean) =>
    `flex-1 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border ${
      active
        ? "bg-orange-500/15 border-orange-500/50 text-orange-200 shadow-lg shadow-orange-500/10"
        : "bg-zinc-800/60 border-zinc-700/50 text-zinc-300 hover:bg-zinc-700/80 hover:text-white"
    }`;

  const aiScaleBtn = (level: number) =>
    `flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
      aiExperience === level
        ? "bg-orange-500/15 border-orange-500/40 text-orange-200"
        : "bg-zinc-800/60 border-zinc-700/50 text-zinc-300 hover:bg-zinc-700/80 hover:text-white"
    }`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl orb" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl orb-2" />
        <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />

        <div className="text-center space-y-6 fade-up visible">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">תודה רבה!</h1>
          <p className="text-zinc-400 text-lg max-w-md">
            קיבלנו את התשובות שלך. הצוות שלנו ישתמש במידע הזה כדי להכין לך
            חבילה אישית עם סוכן AI מותאם לעסק שלך.
          </p>
          <p className="text-orange-300/80 font-medium">נתראה ב-30 באפריל!</p>
        </div>
      </div>
    );
  }

  const sharedRequired =
    !firstName || !lastName || !businessName || !businessType || !businessServices || !targetAudience || !dreamEmployee || !instagramUrl || !facebookUrl || !websiteUrl || !brandVoice || aiExperience === null || !desiredAgent;

  const ownerRequired =
    businessType === "business-owner"
      ? !customerHandling || !financeHandling || !contentCreation || !quotesHandling || !calendarManagement
      : false;

  const managerRequired =
    businessType === "company-manager"
      ? !employeeCount || !companyCustomerHandling || !companyFinanceHandling || !companyContentCreation || !teamBottleneck
      : false;

  const isSubmitDisabled =
    loading || sharedRequired || ownerRequired || managerRequired;

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl orb" />
      <div className="absolute top-[60%] left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl orb-2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text">
            האקתון AI לבעלי עסקים
          </h1>
          <p className="text-zinc-400 mt-3">
            השאלון הזה יעזור לנו לבנות לך חבילה אישית לפני האקתון
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ═══ Section 1: Personal & Business Info ═══ */}
          <div ref={fadeRef1} className="fade-up">
            <div
              ref={spot1.ref}
              onMouseMove={spot1.onMouseMove}
              className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">
                פרטים אישיים ועסקיים
              </h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    שם פרטי
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                    placeholder="ישראל"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    שם משפחה
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                    placeholder="ישראלי"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  שם העסק / חברה
                </label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={inputClass}
                  placeholder="למשל: סטודיו עיצוב שלווה"
                  required
                />
              </div>

              <div style={dividerStyle} className="gradient-divider" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  קישור לאינסטגרם
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://instagram.com/your_business"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  קישור לפייסבוק
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://facebook.com/your_business"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  אתר / דף נחיתה
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://your-website.com"
                  dir="ltr"
                  required
                />
              </div>
            </div>
          </div>

          {/* ═══ Section 2: Business Type + About ═══ */}
          <div ref={fadeRef2} className="fade-up">
            <div
              ref={spot2.ref}
              onMouseMove={spot2.onMouseMove}
              className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">על העסק</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-3">
                  מה מתאר אותך?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setBusinessType("business-owner")}
                    className={branchBtnClass(
                      businessType === "business-owner"
                    )}
                  >
                    בעל/ת עסק
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusinessType("company-manager")}
                    className={branchBtnClass(
                      businessType === "company-manager"
                    )}
                  >
                    מנהל/ת חברה
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  מה העסק/חברה שלך עושה? איזה שירותים/מוצרים אתם מציעים?
                </label>
                <textarea
                  value={businessServices}
                  onChange={(e) => setBusinessServices(e.target.value)}
                  className={inputClass + " h-24 resize-none"}
                  placeholder="למשל: עיצוב גרפי ובניית אתרים לעסקים קטנים, ייעוץ עסקי..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  מי קהל היעד שלכם?
                </label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className={inputClass + " h-20 resize-none"}
                  placeholder="למשל: בעלי עסקים קטנים, זוגות צעירים, חברות הייטק..."
                  required
                />
              </div>

              <div style={dividerStyle} className="gradient-divider" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  אם היית יכול/ה לגייס עובד/ת מושלם/ת שעובד/ת 24/7, נשאר/ת לנצח ולא נשחק/ת - את מי היית מגייס/ת?
                </label>
                <p className="text-xs text-zinc-400 mb-3">
                  איך התפקיד היה נראה? באיזו תדירות? לאיזה מערכות צריך גישה?
                </p>
                <textarea
                  value={dreamEmployee}
                  onChange={(e) => setDreamEmployee(e.target.value)}
                  className={inputClass + " h-28 resize-none"}
                  placeholder="למשל: מנהל/ת לקוחות שעוקב אחרי כל ליד, שומע שיחות מכירה, עובד עם ה-CRM..."
                  required
                />
              </div>
            </div>
          </div>

          {/* ═══ Section 3: Processes (branch-dependent) ═══ */}
          {businessType === "business-owner" && (
            <div ref={fadeRef3} className="fade-up">
              <div
                ref={spot3.ref}
                onMouseMove={spot3.onMouseMove}
                className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
              >
                <h2 className="text-lg font-semibold text-white">
                  תהליכים בעסק שלך
                </h2>
                <div style={dividerStyle} className="gradient-divider mb-4" />

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך את/ה מטפל/ת בפניות לקוחות היום?
                  </label>
                  <textarea
                    value={customerHandling}
                    onChange={(e) => setCustomerHandling(e.target.value)}
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: עונה בוואטסאפ ידנית, יש מזכירה, לא מספיק לענות לכולם..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך את/ה מנהל/ת את הכספים והחשבוניות?
                  </label>
                  <textarea
                    value={financeHandling}
                    onChange={(e) => setFinanceHandling(e.target.value)}
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: אקסל, רואה חשבון אחת לחודש, תוכנת חשבשבת..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך את/ה יוצר/ת תוכן לרשתות?
                  </label>
                  <textarea
                    value={contentCreation}
                    onChange={(e) => setContentCreation(e.target.value)}
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: כותב/ת לבד, מעסיק/ה קופירייטר, לא מפרסם/ת..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך את/ה שולח/ת הצעות מחיר?
                  </label>
                  <textarea
                    value={quotesHandling}
                    onChange={(e) => setQuotesHandling(e.target.value)}
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: וורד, PDF, בוואטסאפ בטקסט חופשי..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך את/ה מנהל/ת את היומן והמשימות?
                  </label>
                  <textarea
                    value={calendarManagement}
                    onChange={(e) => setCalendarManagement(e.target.value)}
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: Google Calendar, פתקים, בראש..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {businessType === "company-manager" && (
            <div ref={fadeRef3} className="fade-up">
              <div
                ref={spot3.ref}
                onMouseMove={spot3.onMouseMove}
                className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
              >
                <h2 className="text-lg font-semibold text-white">
                  תהליכים בחברה שלך
                </h2>
                <div style={dividerStyle} className="gradient-divider mb-4" />

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    כמה עובדים יש בחברה?
                  </label>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      בחר/י
                    </option>
                    {EMPLOYEE_COUNTS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך מתנהלת התקשורת עם לקוחות בחברה?
                  </label>
                  <textarea
                    value={companyCustomerHandling}
                    onChange={(e) =>
                      setCompanyCustomerHandling(e.target.value)
                    }
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: נציגי שירות בוואטסאפ, מוקד טלפוני, CRM..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך מנוהלים תהליכי הכספים? (חשבוניות, דיווחים, תשלומים)
                  </label>
                  <textarea
                    value={companyFinanceHandling}
                    onChange={(e) =>
                      setCompanyFinanceHandling(e.target.value)
                    }
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: מנהלת חשבונות, תוכנת ERP, אקסלים..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    איך נוצר תוכן שיווקי בחברה?
                  </label>
                  <textarea
                    value={companyContentCreation}
                    onChange={(e) =>
                      setCompanyContentCreation(e.target.value)
                    }
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: צוות שיווק פנימי, סוכנות חיצונית, לא עושים..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    מה התהליכים שגוזלים הכי הרבה זמן לצוות?
                  </label>
                  <textarea
                    value={teamBottleneck}
                    onChange={(e) => setTeamBottleneck(e.target.value)}
                    className={inputClass + " h-20 resize-none"}
                    placeholder="למשל: דיווחים שבועיים, ניהול לידים, תיאומי פגישות..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══ Section 4: Style & Experience ═══ */}
          {businessType && (
            <>
              <div ref={fadeRef4} className="fade-up">
                <div
                  ref={spot4.ref}
                  onMouseMove={spot4.onMouseMove}
                  className="spotlight-card spotlight-orange bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
                >
                  <h2 className="text-lg font-semibold text-white">
                    סגנון ונסיון
                  </h2>
                  <div style={dividerStyle} className="gradient-divider mb-4" />

                  <div>
                    <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                      איך היית מתאר/ת את הטון של העסק/חברה?
                    </label>
                    <textarea
                      value={brandVoice}
                      onChange={(e) => setBrandVoice(e.target.value)}
                      className={inputClass + " h-20 resize-none"}
                      placeholder="למשל: מקצועי, חברי, ענייני..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-100 font-medium mb-3">
                      מה רמת הניסיון שלך עם כלי AI?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setAiExperience(level)}
                          className={aiScaleBtn(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs text-zinc-500">
                      <span>אף פעם לא השתמשתי</span>
                      <span>משתמש/ת כל יום</span>
                    </div>
                  </div>

                  <div style={dividerStyle} className="gradient-divider" />

                  <div>
                    <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                      איזה סוכן AI הכי מעניין אותך?
                    </label>
                    <textarea
                      value={desiredAgent}
                      onChange={(e) => setDesiredAgent(e.target.value)}
                      className={inputClass + " h-20 resize-none"}
                      placeholder="למשל: סוכן שעונה ללקוחות בוואטסאפ, סוכן שמארגן חשבוניות..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                      עוד משהו שחשוב שנדע?
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className={inputClass + " h-20 resize-none"}
                      placeholder="כל דבר נוסף שיעזור לנו להכין לך את החבילה הכי טובה..."
                    />
                  </div>
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
                  disabled={isSubmitDisabled}
                  className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-l from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-500 cta-glow"
                >
                  {loading ? "שולח..." : "שליחת השאלון"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
