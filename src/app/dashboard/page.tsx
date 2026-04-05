export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/db";
import { Stepper } from "@/components/dashboard/stepper";
import { StepInstallation } from "@/components/dashboard/step-installation";
import { StepSkill } from "@/components/dashboard/step-skill";
import { StepSiteType } from "@/components/dashboard/step-site-type";
import { StepDesignStyle } from "@/components/dashboard/step-design-style";
import { PromptResult } from "@/components/dashboard/prompt-result";
import { AgentTracks } from "@/components/dashboard/agent-tracks";
import { McpGuides } from "@/components/dashboard/mcp-guides";

export default async function DashboardPage() {
  const user = await requireAuth();

  const { data: participantRows, error: participantError } = await supabaseAdmin
    .from("participants")
    .select("*")
    .eq("id", user.id)
    .limit(1);

  if (participantError) {
    console.error("[dashboard] failed to load participant:", participantError);
  }

  const participant = participantRows?.[0] ?? null;

  const { data: skillRows } = participant
    ? await supabaseAdmin
        .from("skills")
        .select("*")
        .eq("participant_id", participant.id)
        .limit(1)
    : { data: null };

  const skill = skillRows?.[0] ?? null;

  const [promptsRes, tracksRes, guidesRes] = await Promise.all([
    supabaseAdmin.from("prompts").select("*"),
    supabaseAdmin.from("agent_tracks").select("*"),
    supabaseAdmin.from("mcp_guides").select("*"),
  ]);

  const allPrompts = promptsRes.data;
  const allTracks = tracksRes.data;
  const allGuides = guidesRes.data;

  if (promptsRes.error || tracksRes.error || guidesRes.error) {
    console.error("[dashboard] load errors:", {
      prompts: promptsRes.error?.message,
      tracks: tracksRes.error?.message,
      guides: guidesRes.error?.message,
    });
  }

  const selectedPrompt =
    participant?.selected_site_type && participant?.selected_design_style
      ? (allPrompts ?? []).find(
          (p: Record<string, unknown>) =>
            p.site_type === participant.selected_site_type &&
            p.design_style === participant.selected_design_style
        )
      : null;

  const finalPrompt =
    selectedPrompt && skill
      ? (selectedPrompt as Record<string, string>).prompt_template.replace("{{skill}}", skill.skill_content as string)
      : null;

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-l from-white to-zinc-400 bg-clip-text text-transparent">
          חלק 1: בניית דף אישי
        </h2>

        <Stepper currentStep={participant?.current_step ?? 1} />

        <div className="mt-8 space-y-8">
          <StepInstallation />
          <StepSkill skill={skill} participant={participant} />
          <StepSiteType
            participantId={participant?.id}
            selected={participant?.selected_site_type}
          />
          <StepDesignStyle
            participantId={participant?.id}
            selected={participant?.selected_design_style}
          />
          {finalPrompt && <PromptResult prompt={finalPrompt} />}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-l from-white to-zinc-400 bg-clip-text text-transparent">
          חלק 2: בניית אייג&apos;נט לעסק
        </h2>

        <AgentTracks
          tracks={allTracks ?? []}
          selectedTrack={participant?.selected_agent_track}
          participantId={participant?.id}
          skillContent={skill?.skill_content}
        />

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-zinc-200">
            מדריכי חיבור MCP
          </h3>
          <McpGuides guides={allGuides ?? []} />
        </div>
      </section>
    </div>
  );
}
