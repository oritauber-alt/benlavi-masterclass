"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Guide = {
  mcp_name: string;
  title_he: string;
  guide_content_md: string;
};

const mcpIcons: Record<string, string> = {
  gmail: "📧",
  sheets: "📊",
  calendar: "📅",
  telegram: "📱",
};

export function McpGuides({ guides }: { guides: Guide[] }) {
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {guides.map((guide) => (
        <div
          key={guide.mcp_name}
          className="border border-zinc-800 rounded-lg overflow-hidden"
        >
          <button
            onClick={() =>
              setOpenGuide(openGuide === guide.mcp_name ? null : guide.mcp_name)
            }
            className="w-full p-4 text-right flex items-center gap-3 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-xl">
              {mcpIcons[guide.mcp_name] ?? "🔌"}
            </span>
            <span className="flex-1 font-medium text-zinc-200">
              {guide.title_he}
            </span>
            <span className="text-zinc-500 text-sm">
              {openGuide === guide.mcp_name ? "▲" : "▼"}
            </span>
          </button>

          {openGuide === guide.mcp_name && (
            <div className="px-4 pb-4 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{guide.guide_content_md}</ReactMarkdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
