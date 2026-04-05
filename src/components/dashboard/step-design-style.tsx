"use client";

import { updateDesignStyle } from "@/app/dashboard/actions";

const designStyles = [
  { key: "modern-minimal", label: "מודרני-מינימליסטי", desc: "קווים נקיים, הרבה רווח לבן, מינימלי", colors: ["#0a0a0a", "#ffffff", "#6366f1"] },
  { key: "bold-colorful", label: "Bold וצבעוני", desc: "צבעים חזקים, טיפוגרפיה גדולה, אנרגטי", colors: ["#f43f5e", "#fbbf24", "#06b6d4"] },
  { key: "elegant-business", label: "אלגנטי-עסקי", desc: "מקצועי, יוקרתי, גוונים כהים", colors: ["#1e293b", "#c8a97e", "#f8fafc"] },
  { key: "creative-young", label: "קריאייטיבי-צעיר", desc: "שובב, גרדיאנטים, מודרני וצעיר", colors: ["#8b5cf6", "#ec4899", "#14b8a6"] },
];

export function StepDesignStyle({
  participantId,
  selected,
}: {
  participantId?: string;
  selected?: string | null;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6" id="step-4">
      <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2 mb-4">
        <span>🎨</span> שלב 4: בחרו סגנון עיצוב
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {designStyles.map((style) => (
          <button
            key={style.key}
            onClick={async () => {
              if (participantId) await updateDesignStyle(participantId, style.key);
            }}
            className={`p-4 rounded-lg border text-right transition-all ${
              selected === style.key
                ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500/50"
                : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-700"
            }`}
          >
            <div className="flex gap-1 mb-3">
              {style.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="font-medium text-zinc-200">{style.label}</p>
            <p className="text-xs text-zinc-500 mt-1">{style.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
