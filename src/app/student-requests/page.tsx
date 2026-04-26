"use client";

import { useState, useRef, useCallback } from "react";

const TOPICS = [
  "מודולים / שיעורים",
  "מנטורים",
  "זומים",
  "פרונטלי",
  "קהילה",
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

export default function StudentRequestsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setMediaFile(file);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(file ? URL.createObjectURL(file) : null);
  }

  function removeFile() {
    setMediaFile(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("topic", topic);
    formData.append("details", details);
    if (mediaFile) formData.append("media", mediaFile);

    const res = await fetch("/api/student-requests", {
      method: "POST",
      body: formData,
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

  const spot1 = useSpotlight();
  const spot2 = useSpotlight();
  const spot3 = useSpotlight();

  const inputClass =
    "w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1e6880]/60 focus:border-transparent transition-all duration-200";

  const topicBtnClass = (active: boolean) =>
    `px-3 py-3 rounded-lg text-sm text-right transition-all duration-200 border ${
      active
        ? "bg-[#1e6880]/15 border-[#1e6880]/50 text-[#5bb8d4] shadow-lg shadow-[#1e6880]/10"
        : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
    }`;

  if (submitted) {
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
          <h1 className="text-3xl font-bold gradient-text">תודה רבה!</h1>
          <p className="text-zinc-400 text-lg max-w-md">
            הבקשה שלך נשלחה בהצלחה.
          </p>
        </div>
      </div>
    );
  }

  const isSubmitDisabled = loading || !fullName || !topic || !details;

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#1e6880]/15 rounded-full blur-3xl orb" />
      <div className="absolute top-[60%] left-10 w-72 h-72 bg-[#2d9ab8]/15 rounded-full blur-3xl orb-2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text">בקשות סטודנטים</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card 1: Full name */}
          <div ref={fadeRef1} className="fade-up">
            <div
              ref={spot1.ref}
              onMouseMove={spot1.onMouseMove}
              className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">פרטים אישיים</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                  שם מלא *
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="ישראל ישראלי"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card 2: Topic selector */}
          <div ref={fadeRef2} className="fade-up">
            <div
              ref={spot2.ref}
              onMouseMove={spot2.onMouseMove}
              className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold text-white">נושא</h2>
              <div style={dividerStyle} className="gradient-divider mb-4" />

              <div>
                <label className="block text-sm text-zinc-100 font-medium mb-3">
                  בחר/י נושא *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTopic(opt)}
                      className={topicBtnClass(topic === opt)}
                    >
                      {topic === opt && (
                        <span className="inline-block ml-1.5 text-[#5bb8d4]">
                          &#10003;
                        </span>
                      )}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Details (appears after topic selected) */}
          {topic && (
            <div ref={fadeRef3} className="fade-up">
              <div
                ref={spot3.ref}
                onMouseMove={spot3.onMouseMove}
                className="spotlight-card spotlight-teal bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
              >
                <h2 className="text-lg font-semibold text-white">
                  פרט/י את הבקשה
                </h2>
                <div style={dividerStyle} className="gradient-divider mb-4" />

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    פירוט הבקשה *
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className={inputClass + " h-32 resize-none"}
                    placeholder="ספר/י לנו מה הבקשה שלך..."
                    required
                  />
                </div>

                <div style={dividerStyle} className="gradient-divider" />

                <div>
                  <label className="block text-sm text-zinc-100 font-medium mb-1.5">
                    צרף/י תמונה או סרטון (אופציונלי)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {!mediaFile ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-800/40 hover:bg-zinc-800/70 hover:border-[#1e6880]/50 transition-all duration-200 flex flex-col items-center gap-2 group"
                    >
                      <svg className="w-8 h-8 text-zinc-400 group-hover:text-[#5bb8d4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M6.75 19.25h10.5a2 2 0 002-2V6.75a2 2 0 00-2-2H6.75a2 2 0 00-2 2v10.5a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        לחצ/י להעלאת תמונה או סרטון
                      </span>
                    </button>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800/60">
                      {mediaFile.type.startsWith("image/") && mediaPreview && (
                        <img src={mediaPreview} alt="תצוגה מקדימה" className="w-full max-h-64 object-contain" />
                      )}
                      {mediaFile.type.startsWith("video/") && mediaPreview && (
                        <video src={mediaPreview} controls className="w-full max-h-64" />
                      )}
                      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80">
                        <span className="text-sm text-zinc-300 truncate max-w-[70%]">{mediaFile.name}</span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          הסר
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error + Submit */}
          {topic && (
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
                  {loading ? "שולח..." : "שליחת הבקשה"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
