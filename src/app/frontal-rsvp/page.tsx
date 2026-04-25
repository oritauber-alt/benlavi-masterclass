"use client";

import { useState, useRef, useCallback } from "react";

const STATUS_OPTIONS = [
  { value: "מגיע/ה", label: "מגיע/ה" },
  {
    value: "מגיע/ה באיחור",
    label: "מגיע/ה באיחור כי אני לא יודע/ת לנהל לעצמי את הזמן",
  },
  { value: "לא מגיע/ה", label: "לא מגיע/ה" },
] as const;

const SCHEDULE = [
  { time: "17:45", title: "הגעה" },
  { time: "18:30", title: "שיחת פתיחה של בן" },
  {
    time: "19:00",
    title: "הרצאה של עומרי סורק",
    subtitle:
      "יזם בן 25, שבנה SaaS שפרץ לחו״ל ומייצר היום עשרות אלפי דולרים בחודש. הוא יפרק לנו את כל הדרך, מהרגע שהקים את הסאס ועד איך הצליח לפרוץ לשוק הבינלאומי.",
  },
  { time: "20:15", title: "הפסקה" },
  {
    time: "20:30",
    title: "חלוקה לקבוצות ועבודה על הסאססים עם המנטורים",
  },
  { time: "21:15", title: "סיום המפגש" },
];

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
    "linear-gradient(90deg, transparent 0%, rgba(30, 104, 128, 0.5) 50%, transparent 100%)",
};

export default function FrontalRsvpPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleStatusSelect(value: string) {
    setStatus(value);
    if (value === "מגיע/ה") {
      // Play crab dance music
      if (!audioRef.current) {
        audioRef.current = new Audio("/crab-dance.mp3");
        audioRef.current.addEventListener("ended", () => {
          const a = audioRef.current;
          if (a) {
            a.currentTime = 0;
            a.play().catch(() => {});
          }
        });
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      // Vibrate on Android
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    } else {
      // Stop music if switching away
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/frontal-rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, status }),
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
    "w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1e6880]/60 focus:border-transparent transition-all duration-200";

  const statusBtnClass = (active: boolean) =>
    `w-full px-4 py-3 rounded-lg text-sm text-right transition-all duration-200 border ${
      active
        ? "bg-[#1e6880]/15 border-[#1e6880]/50 text-[#5bb8d4] shadow-lg shadow-[#1e6880]/10"
        : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
    }`;

  if (submitted) {
    let message = "";
    if (status === "מגיע/ה") {
      message = "נתראה ב-27.4!";
    } else if (status === "מגיע/ה באיחור") {
      message = "נתראה ב-27.4! ובינתיים, צפו בסרטון";
    } else {
      message = "חבל! נתראה בפעם הבאה";
    }

    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#1e6880]/10 rounded-full blur-3xl orb" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-[#2d9ab8]/10 rounded-full blur-3xl orb-2" />
        <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />

        <div className="text-center space-y-6 fade-up visible">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#1e6880]/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#5bb8d4]"
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
          <h1 className="text-3xl font-bold gradient-text">{message}</h1>
        </div>
      </div>
    );
  }

  const showVideo = status === "מגיע/ה באיחור" || status === "לא מגיע/ה";
  const isPartyMode = status === "מגיע/ה";
  const isSubmitDisabled = loading || !firstName || !lastName || !status;

  return (
    <div className={`min-h-screen bg-zinc-950 relative overflow-hidden ${isPartyMode ? "disco-mode" : ""}`}>
      <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />
      <div className={`absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl ${isPartyMode ? "disco-orb-1" : "bg-[#1e6880]/15 orb"}`} />
      <div className={`absolute top-[60%] left-10 w-72 h-72 rounded-full blur-3xl ${isPartyMode ? "disco-orb-2" : "bg-[#2d9ab8]/15 orb-2"}`} />
      {isPartyMode && (
        <>
          <div className="disco-orb-3 absolute top-[30%] left-[60%] w-80 h-80 rounded-full blur-3xl" />
          <div className="disco-orb-4 absolute top-[70%] right-[50%] w-64 h-64 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text">פרונטלי ncode</h1>
          <p className="text-xl text-[#5bb8d4] mt-2 font-medium">27.4.2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card 1: Event Details */}
          <div ref={fadeRef1} className="fade-up">
            <div
              ref={spot1.ref}
              onMouseMove={spot1.onMouseMove}
              className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">
                לו״ז המפגש
              </h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div className="space-y-4">
                {SCHEDULE.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <span className="text-[#5bb8d4] font-mono font-bold text-sm whitespace-nowrap">
                        {item.time}
                      </span>
                      {idx < SCHEDULE.length - 1 && (
                        <div className="w-px h-full min-h-[24px] bg-gradient-to-b from-[#1e6880]/50 to-transparent mt-1" />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-white font-medium">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={dividerStyle} className="gradient-divider my-4" />

              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <svg
                    className="w-5 h-5 text-[#5bb8d4] mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-zinc-300 text-sm">
                    סמינר הקיבוצים, דרך נמיר 149
                  </p>
                </div>

                <div className="flex gap-2 items-start">
                  <svg
                    className="w-5 h-5 text-[#5bb8d4] mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p className="text-zinc-300 text-sm">
                    חניון במקום ב-22 ש״ח ליום שלם, או אזור כחול-לבן מסביב
                  </p>
                </div>

                <div className="flex gap-2 items-start">
                  <svg
                    className="w-5 h-5 text-[#5bb8d4] mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <p className="text-zinc-300 text-sm">
                    20 דקות הליכה מרכבת ת״א אוניברסיטת. תחנת אוטובוס: סמינר
                    הקיבוצים/דרך נמיר
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Name fields */}
          <div ref={fadeRef2} className="fade-up">
            <div
              ref={spot2.ref}
              onMouseMove={spot2.onMouseMove}
              className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">פרטים אישיים</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  שם פרטי *
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
                  שם משפחה *
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
          </div>

          {/* Card 3: RSVP status */}
          <div ref={fadeRef3} className="fade-up">
            <div
              ref={spot3.ref}
              onMouseMove={spot3.onMouseMove}
              className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">
                סטטוס הגעה
              </h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleStatusSelect(opt.value)}
                    className={statusBtnClass(status === opt.value)}
                  >
                    {status === opt.value && (
                      <span className="inline-block ml-1.5 text-[#5bb8d4]">
                        &#10003;
                      </span>
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dance GIF for "מגיע/ה" */}
          {status === "מגיע/ה" && (
            <div ref={fadeRef4} className="fade-up">
              <div
                ref={spot4.ref}
                onMouseMove={spot4.onMouseMove}
                className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
              >
                <h2 className="text-lg font-semibold text-white text-center">
                  pov: אנחנו ביום שני
                </h2>
                <p className="text-center text-zinc-300 text-sm">
                  🔊 תגבירו את הסאונד 🔊
                </p>
                <div style={dividerStyle} className="gradient-divider mb-4" />
                <img
                  src="/dance.gif"
                  alt="ריקוד"
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Conditional video section */}
          {showVideo && (
            <div ref={fadeRef4} className="fade-up">
              <div
                ref={spot4.ref}
                onMouseMove={spot4.onMouseMove}
                className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
              >
                <h2 className="text-lg font-semibold text-white">
                  הגיע הזמן ללמוד איך לנהל את הזמן יותר טוב
                </h2>
                <div style={dividerStyle} className="gradient-divider mb-4" />

                <div className="aspect-video w-full overflow-hidden rounded-xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/hf7J87c_iy8?start=1&autoplay=1&mute=1"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error + Submit */}
          {status && (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="pt-2 pb-8">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-l from-[#1e6880] via-[#237a94] to-[#2d9ab8] hover:from-[#237a94] hover:via-[#2d9ab8] hover:to-[#3db5d6]"
                  style={{
                    boxShadow:
                      "0 0 40px rgba(30, 104, 128, 0.4), 0 0 80px rgba(45, 154, 184, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {loading ? "שולח..." : "שריון מקום"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
