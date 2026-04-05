"use client";

import { useState } from "react";

export default function BriefPage() {
  const [step, setStep] = useState<"register" | "brief" | "done">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  // Step 1: Register
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Brief
  const [businessName, setBusinessName] = useState("");
  const [businessDomain, setBusinessDomain] = useState("");
  const [dailyWork, setDailyWork] = useState("");
  const [timeConsumingTask, setTimeConsumingTask] = useState("");
  const [automatableTask, setAutomatableTask] = useState("");
  const [aiExperience, setAiExperience] = useState("1");
  const [brandColors, setBrandColors] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/webhooks/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone }),
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setCredentials({ email, password: data.password });
    setStep("brief");
    setLoading(false);
  }

  async function handleBrief(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/brief-submitted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        businessName,
        businessDomain,
        dailyWork,
        timeConsumingTask,
        automatableTask,
        aiExperience,
        brandColors,
        websiteUrl,
      }),
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setStep("done");
    setLoading(false);
  }

  const inputClass =
    "w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-l from-white to-zinc-400 bg-clip-text text-transparent">
            אקתון AI לבעלי עסקים
          </h1>
          <p className="text-zinc-400 mt-2">30 באפריל 2026 | בית הצעירים, מזא&quot;ה 9</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["פרטים אישיים", "בריף עסקי", "מוכנים!"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === 0 && step === "register"
                    ? "bg-blue-600 text-white"
                    : i === 1 && step === "brief"
                    ? "bg-blue-600 text-white"
                    : i === 2 && step === "done"
                    ? "bg-green-600 text-white"
                    : step === "done" || (step === "brief" && i === 0)
                    ? "bg-green-600/20 text-green-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {(step === "done" && i < 2) || (step === "brief" && i === 0) ? "✓" : i + 1}
              </div>
              <span className="text-sm text-zinc-400 hidden sm:inline">{label}</span>
              {i < 2 && <div className="w-8 h-px bg-zinc-700" />}
            </div>
          ))}
        </div>

        {/* Step 1: Register */}
        {step === "register" && (
          <form onSubmit={handleRegister} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-200">פרטים אישיים</h2>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">שם מלא *</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="ישראל ישראלי"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">אימייל *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">טלפון</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="050-1234567"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "שומר..." : "המשך לבריף העסקי"}
            </button>
          </form>
        )}

        {/* Step 2: Brief */}
        {step === "brief" && (
          <form onSubmit={handleBrief} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-200">בריף עסקי</h2>
            <p className="text-sm text-zinc-400">ספרו לנו על העסק שלכם - ככה ניצור לכם סקיל מותאם אישית</p>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">שם העסק *</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={inputClass}
                placeholder="למשל: סטודיו יוגה שלווה"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">תחום *</label>
              <input
                value={businessDomain}
                onChange={(e) => setBusinessDomain(e.target.value)}
                className={inputClass}
                placeholder="למשל: בריאות וכושר, עיצוב גרפי, ייעוץ עסקי"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">מה את/ה עושה ביום יום? (2-3 משפטים)</label>
              <textarea
                value={dailyWork}
                onChange={(e) => setDailyWork(e.target.value)}
                className={inputClass + " h-20 resize-none"}
                placeholder="תארו את היום הטיפוסי שלכם בעסק"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">מה הדבר שהכי גוזל לך זמן בעסק?</label>
              <textarea
                value={timeConsumingTask}
                onChange={(e) => setTimeConsumingTask(e.target.value)}
                className={inputClass + " h-20 resize-none"}
                placeholder="למשל: לענות למיילים, ליצור תוכן, לנהל לידים"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">יש משימה שחוזרת על עצמה שהיית שמח/ה לאוטמט?</label>
              <textarea
                value={automatableTask}
                onChange={(e) => setAutomatableTask(e.target.value)}
                className={inputClass + " h-20 resize-none"}
                placeholder="למשל: שליחת הצעות מחיר, מעקב חשבוניות, סיכום יום"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">ניסיון עם כלי AI (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAiExperience(String(n))}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      aiExperience === String(n)
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-1">1 = אפס ניסיון, 5 = משתמש מתקדם</p>
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">צבעי מותג</label>
              <input
                value={brandColors}
                onChange={(e) => setBrandColors(e.target.value)}
                className={inputClass}
                placeholder="למשל: #FF6B35, #004E89, #FFFFFF"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">לינק לאתר קיים (אם יש)</label>
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className={inputClass}
                placeholder="https://your-website.com"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "יוצר סקיל מותאם..." : "סיום - צור לי סקיל!"}
            </button>
          </form>
        )}

        {/* Step 3: Done */}
        {step === "done" && credentials && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 text-center">
            <div className="text-4xl">🎉</div>
            <h2 className="text-2xl font-bold text-zinc-100">הכל מוכן!</h2>
            <p className="text-zinc-400">הסקיל שלך נוצר ומחכה לך במערכת</p>

            <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3 text-right">
              <h3 className="font-medium text-zinc-200">פרטי ההתחברות שלך:</h3>
              <div>
                <span className="text-sm text-zinc-400">אימייל: </span>
                <span className="text-zinc-200 font-mono">{credentials.email}</span>
              </div>
              <div>
                <span className="text-sm text-zinc-400">סיסמה: </span>
                <span className="text-zinc-200 font-mono">{credentials.password}</span>
              </div>
              <p className="text-xs text-zinc-500">שמרו את הפרטים האלה! תצטרכו אותם ביום האקתון</p>
            </div>

            <div className="space-y-3">
              <a
                href="/login"
                className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors text-center"
              >
                כניסה למערכת
              </a>
              <p className="text-sm text-zinc-500">
                נתראה ב-30 באפריל | בית הצעירים, מזא&quot;ה 9 | 18:00
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
