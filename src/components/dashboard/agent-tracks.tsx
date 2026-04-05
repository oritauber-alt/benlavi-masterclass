"use client";

import { useState } from "react";
import { updateAgentTrack } from "@/app/dashboard/actions";

type Track = {
  track_key: string;
  title_he: string;
  subtitle_he: string | null;
  description_he: string | null;
  prompt_template: string;
  required_mcps: string[] | null;
};

const trackIcons: Record<string, string> = {
  content: "💰",
  invoice: "🧾",
  "day-manager": "⏰",
};

export function AgentTracks({
  tracks,
  selectedTrack,
  participantId,
  skillContent,
}: {
  tracks: Track[];
  selectedTrack?: string | null;
  participantId?: string;
  skillContent?: string | null;
}) {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(selectedTrack ?? null);
  const [copied, setCopied] = useState(false);

  async function handleSelect(trackKey: string) {
    setExpandedTrack(trackKey);
    if (participantId) await updateAgentTrack(participantId, trackKey);
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      {tracks.map((track) => {
        const isExpanded = expandedTrack === track.track_key;
        const finalPrompt = skillContent
          ? track.prompt_template.replace("{{skill}}", skillContent)
          : track.prompt_template;

        return (
          <div
            key={track.track_key}
            className={`border rounded-xl transition-all ${
              isExpanded
                ? "border-blue-500/30 bg-zinc-900"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <button
              onClick={() => handleSelect(track.track_key)}
              className="w-full p-4 text-right flex items-center gap-3"
            >
              <span className="text-2xl">
                {trackIcons[track.track_key] ?? "🤖"}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-zinc-200">{track.subtitle_he}</p>
                <p className="text-sm text-zinc-400">{track.title_he}</p>
              </div>
              <span className="text-zinc-500 text-sm">
                {isExpanded ? "▲" : "▼"}
              </span>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3">
                <p className="text-sm text-zinc-400">{track.description_he}</p>

                {track.required_mcps && (
                  <div className="flex gap-2">
                    {track.required_mcps.map((mcp) => (
                      <span
                        key={mcp}
                        className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded"
                      >
                        {mcp}
                      </span>
                    ))}
                  </div>
                )}

                <div className="bg-zinc-950/80 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-[family-name:var(--font-noto-hebrew)]">
                    {finalPrompt}
                  </pre>
                </div>

                <button
                  onClick={() => handleCopy(finalPrompt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {copied ? "הועתק! ✓" : "העתק Prompt"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
