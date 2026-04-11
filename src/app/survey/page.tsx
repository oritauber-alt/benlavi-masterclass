"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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

const TRAINING_PERCENT_OPTIONS = [
  "0-25%",
  "25-50%",
  "50-75%",
  "75-100%",
] as const;

const OFFICE_HOURS_NO_REASON_OPTIONS = [
  { value: "bad_timing", label: "הזמנים לא נוחים לי" },
  { value: "didnt_know", label: "לא ידעתי" },
  { value: "didnt_need", label: "לא הייתי צריך" },
  { value: "other", label: "אחר" },
] as const;

const FRONTAL_NO_REASON_OPTIONS = [
  { value: "bad_timing", label: "הזמנים לא נוחים לי" },
  { value: "didnt_know", label: "לא ידעתי" },
  { value: "didnt_connect", label: "לא התחברתי לתוכן" },
  { value: "other", label: "אחר" },
] as const;

const FRONTAL_CONTENT_OPTIONS = [
  "הרצאות מקצועיות",
  "סדנאות פרקטיות",
  "נטוורקינג",
  "אחר",
] as const;

const ZOOMS_ATTENDED_OPTIONS = ["0", "1", "2-3", "4+"] as const;

const COMMUNITY_HELPFULNESS_OPTIONS = [
  { value: "a_lot", label: "הרבה" },
  { value: "a_little", label: "קצת" },
  { value: "not_really", label: "לא ממש" },
  { value: "not_at_all", label: "בכלל לא" },
] as const;

const KNOWS_WHERE_OPTIONS = [
  { value: "yes", label: "כן" },
  { value: "depends", label: "תלוי" },
  { value: "no", label: "לא" },
] as const;

const ZOOM_FREQUENCY_OPTIONS = [
  { value: "enough", label: "מספיק לי" },
  { value: "want_more", label: "פחות מדי" },
  { value: "too_much", label: "יותר מדי" },
] as const;

const PREFERRED_CHANNEL_OPTIONS = [
  { value: "community_group", label: "קבוצת הקהילה" },
  { value: "personal_mentor", label: "וואטסאפ אישי למנטור" },
  { value: "office_hours", label: "Office Hours / זום שאלות-תשובות" },
  { value: "no_preference", label: "לא משנה לי" },
] as const;

type StageCategory = "learning" | "building" | "selling" | "other";

function getStageCategory(stage: string): StageCategory {
  const learning = ["רעיונאות", "ואלידציה", "מפתח/ת MVP"];
  const building = [
    "בניתי MVP - עדיין בלי טסטרים",
    "בניתי MVP - יש טסטרים",
    "בפיתוח מוצר",
  ];
  const selling = ["משווק/ת - עדיין בלי מכירות", "יש לקוחות משלמים"];
  if (learning.includes(stage)) return "learning";
  if (building.includes(stage)) return "building";
  if (selling.includes(stage)) return "selling";
  return "other";
}

// Section keys for the adaptive ordering
type SectionKey =
  | "personal"
  | "journey"
  | "struggles"
  | "content"
  | "zooms"
  | "frontal"
  | "mentors"
  | "community"
  | "overall"
  | "extras";

function getSectionOrder(category: StageCategory): SectionKey[] {
  // Fixed: personal -> journey -> struggles -> [adaptive] -> overall -> extras
  const fixedStart: SectionKey[] = ["personal", "journey", "struggles"];
  const fixedEnd: SectionKey[] = ["overall", "extras"];

  let middle: SectionKey[];
  if (category === "learning") {
    middle = ["content", "zooms", "frontal", "mentors", "community"];
  } else if (category === "building") {
    middle = ["mentors", "zooms", "frontal", "content", "community"];
  } else if (category === "selling") {
    middle = ["mentors", "community", "zooms", "frontal", "content"];
  } else {
    middle = ["content", "zooms", "frontal", "mentors", "community"];
  }

  return [...fixedStart, ...middle, ...fixedEnd];
}

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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const fadeRef = useFadeUp();
  const spot = useSpotlight();
  return (
    <div ref={fadeRef} className="fade-up">
      <div
        ref={spot.ref}
        onMouseMove={spot.onMouseMove}
        className="spotlight-card bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 space-y-5"
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="gradient-divider mb-4" />
        {children}
      </div>
    </div>
  );
}

function MentorBlock({
  name,
  description,
  experience,
  setExperience,
  professionalism,
  setProfessionalism,
  availability,
  setAvailability,
  feedback,
  setFeedback,
  inputClass,
}: {
  name: string;
  description: string;
  experience: number | null;
  setExperience: (n: number) => void;
  professionalism: number | null;
  setProfessionalism: (n: number) => void;
  availability: number | null;
  setAvailability: (n: number) => void;
  feedback: string;
  setFeedback: (s: string) => void;
  inputClass: string;
}) {
  return (
    <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-5 space-y-5">
      <div>
        <h3 className="text-base font-bold text-white">{name}</h3>
        <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-zinc-100 font-medium">
          חוויה כללית
        </label>
        <RatingButtons value={experience} onChange={setExperience} />
        <div className="flex justify-between text-xs text-zinc-400 px-0.5">
          <span>בכלל לא</span>
          <span>מעולה</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-zinc-100 font-medium">
          מקצועיות ואיכות התשובות
        </label>
        <RatingButtons value={professionalism} onChange={setProfessionalism} />
        <div className="flex justify-between text-xs text-zinc-400 px-0.5">
          <span>נמוכה</span>
          <span>גבוהה</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-zinc-100 font-medium">זמינות</label>
        <RatingButtons value={availability} onChange={setAvailability} />
        <div className="flex justify-between text-xs text-zinc-400 px-0.5">
          <span>לא זמין</span>
          <span>מאוד זמין</span>
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-100 font-medium mb-1.5">
          חוויה אישית / מה היית רוצה שישתפר?
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className={inputClass + " h-20 resize-none"}
          placeholder="אופציונלי"
        />
      </div>
    </div>
  );
}

export default function SurveyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Section 1: personal
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Section 2: journey
  const [projectStage, setProjectStage] = useState("");
  const [projectStageOther, setProjectStageOther] = useState("");
  const [saasDescription, setSaasDescription] = useState("");

  // Section 3: struggles
  const [stuckAreas, setStuckAreas] = useState<string[]>([]);
  const [whatHelpsProgress, setWhatHelpsProgress] = useState("");

  // Section: content
  const [contentSatisfaction, setContentSatisfaction] = useState<number | null>(null);
  const [outdatedModuleFlag, setOutdatedModuleFlag] = useState<boolean | null>(null);
  const [outdatedModuleName, setOutdatedModuleName] = useState("");
  const [contentImprovementSuggestion, setContentImprovementSuggestion] = useState("");
  const [trainingPercentComplete, setTrainingPercentComplete] = useState("");

  // Section: zooms
  const [zoomsAttendedLastMonth, setZoomsAttendedLastMonth] = useState("");
  const [zoomNoAttendReason, setZoomNoAttendReason] = useState("");
  const [zoomValueRating, setZoomValueRating] = useState<number | null>(null);
  const [zoomFrequencyFeedback, setZoomFrequencyFeedback] = useState("");
  const [officeHoursAttended, setOfficeHoursAttended] = useState<boolean | null>(null);
  const [officeHoursNoAttendReason, setOfficeHoursNoAttendReason] = useState("");
  const [officeHoursNoAttendOther, setOfficeHoursNoAttendOther] = useState("");
  const [zoomContentWishes, setZoomContentWishes] = useState("");

  // Section: frontal
  const [frontalAttended, setFrontalAttended] = useState<boolean | null>(null);
  const [frontalSpeakersRating, setFrontalSpeakersRating] = useState<number | null>(null);
  const [frontalContentPreferences, setFrontalContentPreferences] = useState<string[]>([]);
  const [frontalNextWishes, setFrontalNextWishes] = useState("");
  const [frontalNoAttendReason, setFrontalNoAttendReason] = useState("");
  const [frontalNoAttendOther, setFrontalNoAttendOther] = useState("");

  // Section: mentors
  const [mentorEilonExperience, setMentorEilonExperience] = useState<number | null>(null);
  const [mentorEilonProfessionalism, setMentorEilonProfessionalism] = useState<number | null>(null);
  const [mentorEilonAvailability, setMentorEilonAvailability] = useState<number | null>(null);
  const [mentorEilonFeedback, setMentorEilonFeedback] = useState("");
  const [mentorDanielExperience, setMentorDanielExperience] = useState<number | null>(null);
  const [mentorDanielProfessionalism, setMentorDanielProfessionalism] = useState<number | null>(null);
  const [mentorDanielAvailability, setMentorDanielAvailability] = useState<number | null>(null);
  const [mentorDanielFeedback, setMentorDanielFeedback] = useState("");
  const [mentorIdoExperience, setMentorIdoExperience] = useState<number | null>(null);
  const [mentorIdoProfessionalism, setMentorIdoProfessionalism] = useState<number | null>(null);
  const [mentorIdoAvailability, setMentorIdoAvailability] = useState<number | null>(null);
  const [mentorIdoFeedback, setMentorIdoFeedback] = useState("");
  const [mentorOritExperience, setMentorOritExperience] = useState<number | null>(null);
  const [mentorOritProfessionalism, setMentorOritProfessionalism] = useState<number | null>(null);
  const [mentorOritAvailability, setMentorOritAvailability] = useState<number | null>(null);
  const [mentorOritFeedback, setMentorOritFeedback] = useState("");
  const [knowsWhereToTurn, setKnowsWhereToTurn] = useState("");

  // Section: community
  const [communitySatisfaction, setCommunitySatisfaction] = useState<number | null>(null);
  const [communityHelpfulness, setCommunityHelpfulness] = useState("");
  const [communityMissing, setCommunityMissing] = useState("");
  const [preferredSupportChannels, setPreferredSupportChannels] = useState<string[]>([]);

  function togglePreferredChannel(value: string) {
    setPreferredSupportChannels((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  // Section: overall
  const [overallSatisfaction, setOverallSatisfaction] = useState<number | null>(null);
  const [overallFeedback, setOverallFeedback] = useState("");

  // Section: extras
  const [additionalNotes, setAdditionalNotes] = useState("");

  const stageCategory = useMemo(() => getStageCategory(projectStage), [projectStage]);
  const sectionOrder = useMemo(() => getSectionOrder(stageCategory), [stageCategory]);

  function toggleStuckArea(area: string) {
    setStuckAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  function toggleFrontalContent(opt: string) {
    setFrontalContentPreferences((prev) =>
      prev.includes(opt) ? prev.filter((a) => a !== opt) : [...prev, opt]
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
        trainingPercentComplete,
        outdatedModuleFlag,
        outdatedModuleName: outdatedModuleFlag ? outdatedModuleName : null,
        contentImprovementSuggestion,
        zoomsAttendedLastMonth,
        zoomNoAttendReason: zoomsAttendedLastMonth === "0" ? zoomNoAttendReason : null,
        zoomValueRating: zoomsAttendedLastMonth !== "0" ? zoomValueRating : null,
        zoomFrequencyFeedback,
        zoomContentWishes,
        officeHoursAttended,
        officeHoursNoAttendReason:
          officeHoursAttended === false
            ? officeHoursNoAttendReason === "other"
              ? officeHoursNoAttendOther
              : officeHoursNoAttendReason
            : null,
        frontalAttended,
        frontalSpeakersRating: frontalAttended ? frontalSpeakersRating : null,
        frontalContentPreferences,
        frontalNextWishes,
        frontalLastNegative:
          frontalAttended === false
            ? frontalNoAttendReason === "other"
              ? frontalNoAttendOther
              : frontalNoAttendReason
            : null,
        mentorEilonExperience,
        mentorEilonProfessionalism,
        mentorEilonAvailability,
        mentorEilonFeedback,
        mentorDanielExperience,
        mentorDanielProfessionalism,
        mentorDanielAvailability,
        mentorDanielFeedback,
        mentorIdoExperience,
        mentorIdoProfessionalism,
        mentorIdoAvailability,
        mentorIdoFeedback,
        mentorOritExperience,
        mentorOritProfessionalism,
        mentorOritAvailability,
        mentorOritFeedback,
        knowsWhereToTurn,
        communitySatisfaction,
        communityHelpfulness,
        communityMissing,
        preferredSupportChannel: preferredSupportChannels.join(","),
        overallSatisfaction,
        overallFeedback:
          overallSatisfaction !== null && overallSatisfaction < 8 ? overallFeedback : null,
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

  const inputClass =
    "w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-200";

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl orb" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl orb-2" />
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

  // ===== Section renderers =====

  const sections: Record<SectionKey, React.ReactNode> = {
    personal: (
      <SectionCard key="personal" title="פרטים אישיים">
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
      </SectionCard>
    ),

    journey: (
      <SectionCard key="journey" title="איפה את/ה עומד/ת">
        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            באיזה שלב ה-SaaS שלך היום? *
          </label>
          <select
            value={projectStage}
            onChange={(e) => setProjectStage(e.target.value)}
            required
            className={`${inputClass} cursor-pointer appearance-none`}
          >
            <option value="" disabled>
              בחר/י שלב
            </option>
            {PROJECT_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
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
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            ספר/י על ה-SaaS שלך בקצרה
          </label>
          <textarea
            value={saasDescription}
            onChange={(e) => setSaasDescription(e.target.value)}
            className={inputClass + " h-24 resize-none"}
            placeholder="אני עוזר/ת ל-[קהל יעד] לעשות [מה] באמצעות [המוצר שלך]"
          />
        </div>
      </SectionCard>
    ),

    struggles: (
      <SectionCard key="struggles" title="קשיים וצרכים">
        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-3">
            באילו תחומים את/ה מרגיש/ה תקוע/ה?
          </label>
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
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            מה הדבר שהכי יעזור לך להתקדם עכשיו?
          </label>
          <textarea
            value={whatHelpsProgress}
            onChange={(e) => setWhatHelpsProgress(e.target.value)}
            className={inputClass + " h-24 resize-none"}
            placeholder="למשל: משוב על המוצר, עזרה עם שיווק, בהירות לגבי הכיוון..."
          />
          <p className="text-xs text-zinc-400 mt-1">(תפרטו כמה שיותר)</p>
        </div>
      </SectionCard>
    ),

    content: (
      <SectionCard key="content" title="התכנים בהכשרה">
        <div className="space-y-2">
          <label className="block text-sm text-zinc-100 font-medium">
            כמה את/ה מרוצה מהתכנים?
          </label>
          <RatingButtons value={contentSatisfaction} onChange={setContentSatisfaction} />
          <div className="flex justify-between text-xs text-zinc-400 px-0.5">
            <span>בכלל לא</span>
            <span>מאוד</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            כמה אחוז מההכשרה השלמת?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TRAINING_PERCENT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTrainingPercentComplete(opt)}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${
                  trainingPercentComplete === opt
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            נתקלת במודול שהרגשת שהוא לא מעודכן?
          </label>
          <div className="flex gap-2">
            {[
              { v: true, label: "כן" },
              { v: false, label: "לא" },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => setOutdatedModuleFlag(opt.v)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  outdatedModuleFlag === opt.v
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {outdatedModuleFlag === true && (
            <input
              value={outdatedModuleName}
              onChange={(e) => setOutdatedModuleName(e.target.value)}
              className={inputClass + " mt-2"}
              placeholder="איזה מודול?"
            />
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            איזה תחום הכי היית רוצה שיתווסף או ישודרג?
          </label>
          <textarea
            value={contentImprovementSuggestion}
            onChange={(e) => setContentImprovementSuggestion(e.target.value)}
            className={inputClass + " h-20 resize-none"}
            placeholder="אופציונלי"
          />
        </div>
      </SectionCard>
    ),

    zooms: (
      <SectionCard key="zooms" title="זומים ומפגשים">
        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            כמה זומים השתתפת בחודש האחרון?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ZOOMS_ATTENDED_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setZoomsAttendedLastMonth(opt)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  zoomsAttendedLastMonth === opt
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {zoomsAttendedLastMonth === "0" && (
          <div>
            <label className="block text-sm text-zinc-100 font-medium mb-1.5">
              למה לא השתתפת?
            </label>
            <textarea
              value={zoomNoAttendReason}
              onChange={(e) => setZoomNoAttendReason(e.target.value)}
              className={inputClass + " h-20 resize-none"}
              placeholder="חשוב לנו להבין"
            />
          </div>
        )}

        {zoomsAttendedLastMonth && zoomsAttendedLastMonth !== "0" && (
          <div className="space-y-2">
            <label className="block text-sm text-zinc-100 font-medium">
              כמה הזומים תרמו לך?
            </label>
            <RatingButtons value={zoomValueRating} onChange={setZoomValueRating} />
            <div className="flex justify-between text-xs text-zinc-400 px-0.5">
              <span>בכלל לא</span>
              <span>מאוד</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            הגעת ל-Office Hours של אילון (יום ד&apos; בדיסקורד)?
          </label>
          <div className="flex gap-2">
            {[
              { v: true, label: "כן" },
              { v: false, label: "לא" },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => setOfficeHoursAttended(opt.v)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  officeHoursAttended === opt.v
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {officeHoursAttended === false && (
            <div className="mt-3 space-y-2">
              <label className="block text-xs text-zinc-400">למה לא?</label>
              <div className="grid grid-cols-2 gap-2">
                {OFFICE_HOURS_NO_REASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOfficeHoursNoAttendReason(opt.value)}
                    className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                      officeHoursNoAttendReason === opt.value
                        ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                        : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {officeHoursNoAttendReason === "other" && (
                <input
                  value={officeHoursNoAttendOther}
                  onChange={(e) => setOfficeHoursNoAttendOther(e.target.value)}
                  className={inputClass + " mt-2"}
                  placeholder="מה הסיבה?"
                />
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            מה דעתך על כמות הזומים החודשיים? (3-4 בחודש)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ZOOM_FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setZoomFrequencyFeedback(opt.value)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  zoomFrequencyFeedback === opt.value
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            איזה תכנים היית רוצה שנביא לזומים?
          </label>
          <textarea
            value={zoomContentWishes}
            onChange={(e) => setZoomContentWishes(e.target.value)}
            className={inputClass + " h-20 resize-none"}
            placeholder="אופציונלי"
          />
        </div>
      </SectionCard>
    ),

    frontal: (
      <SectionCard key="frontal" title="מפגשים פרונטליים">
        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            הגעת בעבר למפגש פרונטלי?
          </label>
          <div className="flex gap-2">
            {[
              { v: true, label: "כן" },
              { v: false, label: "לא" },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => setFrontalAttended(opt.v)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  frontalAttended === opt.v
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {frontalAttended === false && (
            <div className="mt-3 space-y-2">
              <label className="block text-xs text-zinc-400">למה לא?</label>
              <div className="grid grid-cols-2 gap-2">
                {FRONTAL_NO_REASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrontalNoAttendReason(opt.value)}
                    className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                      frontalNoAttendReason === opt.value
                        ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                        : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {frontalNoAttendReason === "other" && (
                <input
                  value={frontalNoAttendOther}
                  onChange={(e) => setFrontalNoAttendOther(e.target.value)}
                  className={inputClass + " mt-2"}
                  placeholder="מה הסיבה?"
                />
              )}
            </div>
          )}
        </div>

        {frontalAttended === true && (
          <div className="space-y-2">
            <label className="block text-sm text-zinc-100 font-medium">
              כמה אתה מרוצה מהמרצים האורחים בפרונטליים?
            </label>
            <RatingButtons value={frontalSpeakersRating} onChange={setFrontalSpeakersRating} />
            <div className="flex justify-between text-xs text-zinc-400 px-0.5">
              <span>בכלל לא</span>
              <span>מאוד</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-3">
            איזה תכנים היית רוצה?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FRONTAL_CONTENT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleFrontalContent(opt)}
                className={`px-3 py-2.5 rounded-lg text-sm text-right transition-all duration-200 border ${
                  frontalContentPreferences.includes(opt)
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
                }`}
              >
                {frontalContentPreferences.includes(opt) && (
                  <span className="inline-block ml-1.5 text-indigo-400">&#10003;</span>
                )}
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            עוד משהו שחשוב שנדע?
          </label>
          <textarea
            value={frontalNextWishes}
            onChange={(e) => setFrontalNextWishes(e.target.value)}
            className={inputClass + " h-20 resize-none"}
            placeholder="אופציונלי"
          />
        </div>
      </SectionCard>
    ),

    mentors: (
      <SectionCard key="mentors" title="מנטורים וצוות">
        <p className="text-sm text-indigo-200/90 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
          אל תרגישו לא בנוח, אנחנו רוצים להשתפר בשבילכם.
        </p>
        <MentorBlock
          name="אילון"
          description="מנטור טכני, Office Hours שבועי בדיסקורד"
          experience={mentorEilonExperience}
          setExperience={setMentorEilonExperience}
          professionalism={mentorEilonProfessionalism}
          setProfessionalism={setMentorEilonProfessionalism}
          availability={mentorEilonAvailability}
          setAvailability={setMentorEilonAvailability}
          feedback={mentorEilonFeedback}
          setFeedback={setMentorEilonFeedback}
          inputClass={inputClass}
        />

        <MentorBlock
          name="דניאל"
          description="מנטור טכני"
          experience={mentorDanielExperience}
          setExperience={setMentorDanielExperience}
          professionalism={mentorDanielProfessionalism}
          setProfessionalism={setMentorDanielProfessionalism}
          availability={mentorDanielAvailability}
          setAvailability={setMentorDanielAvailability}
          feedback={mentorDanielFeedback}
          setFeedback={setMentorDanielFeedback}
          inputClass={inputClass}
        />

        <MentorBlock
          name="עידו ראם"
          description="מנטור עסקי, אסטרטגי ומנטלי"
          experience={mentorIdoExperience}
          setExperience={setMentorIdoExperience}
          professionalism={mentorIdoProfessionalism}
          setProfessionalism={setMentorIdoProfessionalism}
          availability={mentorIdoAvailability}
          setAvailability={setMentorIdoAvailability}
          feedback={mentorIdoFeedback}
          setFeedback={setMentorIdoFeedback}
          inputClass={inputClass}
        />

        <MentorBlock
          name="אורי"
          description="אחראי קהילה ושיחות אונבורדינג"
          experience={mentorOritExperience}
          setExperience={setMentorOritExperience}
          professionalism={mentorOritProfessionalism}
          setProfessionalism={setMentorOritProfessionalism}
          availability={mentorOritAvailability}
          setAvailability={setMentorOritAvailability}
          feedback={mentorOritFeedback}
          setFeedback={setMentorOritFeedback}
          inputClass={inputClass}
        />

        <div className="pt-2">
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            כשיש לך שאלה או צורך, את/ה יודע/ת לאן לפנות?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {KNOWS_WHERE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setKnowsWhereToTurn(opt.value)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  knowsWhereToTurn === opt.value
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>
    ),

    community: (
      <SectionCard key="community" title="הקהילה">
        <div className="space-y-2">
          <label className="block text-sm text-zinc-100 font-medium">
            כמה את/ה מרוצה מהקהילה (קבוצת הוואטסאפ)?
          </label>
          <RatingButtons value={communitySatisfaction} onChange={setCommunitySatisfaction} />
          <div className="flex justify-between text-xs text-zinc-400 px-0.5">
            <span>בכלל לא</span>
            <span>מאוד</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            כמה הקהילה עוזרת לך להתקדם?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COMMUNITY_HELPFULNESS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCommunityHelpfulness(opt.value)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  communityHelpfulness === opt.value
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-1.5">
            מה היה משפר לך את הקהילה?
          </label>
          <textarea
            value={communityMissing}
            onChange={(e) => setCommunityMissing(e.target.value)}
            className={inputClass + " h-20 resize-none"}
            placeholder="אופציונלי"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-100 font-medium mb-2">
            באילו ערוצים הכי נוח לך לקבל עזרה? (אפשר לבחור כמה)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {PREFERRED_CHANNEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => togglePreferredChannel(opt.value)}
                className={`px-4 py-2.5 rounded-lg text-sm text-right transition-all duration-200 border ${
                  preferredSupportChannels.includes(opt.value)
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80"
                }`}
              >
                {preferredSupportChannels.includes(opt.value) && (
                  <span className="inline-block ml-1.5 text-indigo-400">&#10003;</span>
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>
    ),

    overall: (
      <SectionCard key="overall" title="באופן כללי">
        <div className="space-y-2">
          <label className="block text-sm text-zinc-100 font-medium">
            כמה את/ה מרוצה באופן כללי מ-nCode?
          </label>
          <RatingButtons value={overallSatisfaction} onChange={setOverallSatisfaction} />
          <div className="flex justify-between text-xs text-zinc-400 px-0.5">
            <span>בכלל לא</span>
            <span>מאוד</span>
          </div>
          {overallSatisfaction !== null && overallSatisfaction < 8 && (
            <div className="pt-2">
              <textarea
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                className={inputClass + " h-20 resize-none"}
                placeholder="מה הדבר הכי חשוב שנשפר?"
              />
            </div>
          )}
        </div>
      </SectionCard>
    ),

    extras: (
      <SectionCard key="extras" title="עוד משהו?">
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          className={inputClass + " h-24 resize-none"}
          placeholder="מה חשוב לך שנדע?"
        />
      </SectionCard>
    ),
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="fixed inset-0 noise-grain opacity-[0.03] pointer-events-none z-50" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl orb" />
      <div className="absolute top-[60%] left-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl orb-2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
            שאלון סטודנטים
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">ספרו לנו איפה אתם</h1>
          <p className="text-zinc-300 text-lg">
            עזרו לנו להבין מה אתם צריכים כדי שנוכל לתת לכם יותר
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {sectionOrder.map((key) => sections[key])}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

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
