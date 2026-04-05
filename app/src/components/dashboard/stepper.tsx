"use client";

const steps = [
  { id: 1, label: "התקנה", icon: "⬇️" },
  { id: 2, label: "הסקיל שלך", icon: "✨" },
  { id: 3, label: "סוג אתר", icon: "🖥️" },
  { id: 4, label: "סגנון עיצוב", icon: "🎨" },
];

export function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full transition-colors ${
              currentStep >= step.id
                ? "bg-blue-600/20 border border-blue-500/30 text-blue-400"
                : "bg-zinc-900 border border-zinc-800 text-zinc-500"
            }`}
          >
            <span className="text-lg">{step.icon}</span>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-4 mx-1 flex-shrink-0 ${
                currentStep > step.id ? "bg-blue-500" : "bg-zinc-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
