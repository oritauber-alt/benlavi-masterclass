"use client";

import { useState } from "react";

export function StepInstallation() {
  const [antigravityDone, setAntigravityDone] = useState(false);
  const [claudeCodeDone, setClaudeCodeDone] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6" id="step-1">
      <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
        <span>⬇️</span> שלב 1: התקנה
      </h3>

      {/* Antigravity */}
      <div className="space-y-3">
        <h4 className="font-medium text-zinc-300">התקנת Antigravity</h4>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm">
          <li>פתחו את הדפדפן ועברו לאתר <a href="https://antigravity.dev" target="_blank" className="text-blue-400 hover:underline">antigravity.dev</a></li>
          <li>לחצו על "Download" והתקינו את האפליקציה</li>
          <li>פתחו את Antigravity</li>
          <li>התחברו עם חשבון Anthropic (Claude) שלכם</li>
          <li>אם אין לכם חשבון - צרו אחד ב-<a href="https://console.anthropic.com" target="_blank" className="text-blue-400 hover:underline">console.anthropic.com</a></li>
        </ol>
        <div className="bg-zinc-800/50 rounded-lg p-4 text-center text-zinc-500 text-sm">
          GIF הדגמה יתווסף כאן
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={antigravityDone}
            onChange={(e) => setAntigravityDone(e.target.checked)}
            className="rounded border-zinc-600"
          />
          סיימתי להתקין Antigravity
        </label>
      </div>

      <div className="h-px bg-gradient-to-l from-transparent via-zinc-700 to-transparent" />

      {/* Claude Code */}
      <div className="space-y-3">
        <h4 className="font-medium text-zinc-300">התקנת Claude Code</h4>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm">
          <li>פתחו את הטרמינל (Terminal) במחשב שלכם</li>
          <li>הקלידו: <code className="bg-zinc-800 px-2 py-0.5 rounded text-blue-400">npm install -g @anthropic-ai/claude-code</code></li>
          <li>חכו שההתקנה תסתיים</li>
          <li>הקלידו: <code className="bg-zinc-800 px-2 py-0.5 rounded text-blue-400">claude</code></li>
          <li>התחברו עם חשבון Anthropic שלכם</li>
          <li>אם הכל עבד, תראו את Claude מוכן לעבודה</li>
        </ol>
        <div className="bg-zinc-800/50 rounded-lg p-4 text-center text-zinc-500 text-sm">
          GIF הדגמה יתווסף כאן
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={claudeCodeDone}
            onChange={(e) => setClaudeCodeDone(e.target.checked)}
            className="rounded border-zinc-600"
          />
          סיימתי להתקין Claude Code
        </label>
      </div>
    </div>
  );
}
