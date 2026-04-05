"use client";

import { updateSiteType } from "@/app/dashboard/actions";

const siteTypes = [
  { key: "landing", label: "דף נחיתה", desc: "דף אחד שמוכר את השירות שלך", icon: "🚀" },
  { key: "info", label: "אתר מידע / תדמית", desc: "מספר עמודים עם מידע על העסק", icon: "📄" },
  { key: "portfolio", label: "תיק עבודות", desc: "הצגת עבודות ופרויקטים שלך", icon: "🎯" },
  { key: "catalog", label: "חנות / קטלוג מוצרים", desc: "הצגת מוצרים או שירותים", icon: "🛍️" },
];

export function StepSiteType({
  participantId,
  selected,
}: {
  participantId?: string;
  selected?: string | null;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6" id="step-3">
      <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2 mb-4">
        <span>🖥️</span> שלב 3: בחרו סוג אתר
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {siteTypes.map((type) => (
          <button
            key={type.key}
            onClick={async () => {
              if (participantId) await updateSiteType(participantId, type.key);
            }}
            className={`p-4 rounded-lg border text-right transition-all ${
              selected === type.key
                ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500/50"
                : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-700"
            }`}
          >
            <span className="text-2xl">{type.icon}</span>
            <p className="font-medium text-zinc-200 mt-2">{type.label}</p>
            <p className="text-xs text-zinc-500 mt-1">{type.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
