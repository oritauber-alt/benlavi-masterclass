"use client";

import { useState } from "react";

export function PromptResult({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-400">
          הPrompt שלך מוכן!
        </h3>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {copied ? "הועתק! ✓" : "העתק"}
        </button>
      </div>

      <div className="bg-zinc-950/80 rounded-lg p-4 max-h-64 overflow-y-auto">
        <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-[family-name:var(--font-noto-hebrew)]">
          {prompt}
        </pre>
      </div>

      <p className="text-sm text-zinc-400 mt-3">
        הדביקו את הPrompt הזה ב-Antigravity ותראו את הקסם
      </p>
    </div>
  );
}
