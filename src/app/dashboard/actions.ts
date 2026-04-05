"use server";

import { supabaseAdmin } from "@/db";
import { revalidatePath } from "next/cache";

export async function updateSiteType(participantId: string, siteType: string) {
  await supabaseAdmin
    .from("participants")
    .update({ selected_site_type: siteType, updated_at: new Date().toISOString() })
    .eq("id", participantId);
  revalidatePath("/dashboard");
}

export async function updateDesignStyle(participantId: string, designStyle: string) {
  await supabaseAdmin
    .from("participants")
    .update({ selected_design_style: designStyle, updated_at: new Date().toISOString() })
    .eq("id", participantId);
  revalidatePath("/dashboard");
}

export async function updateAgentTrack(participantId: string, trackKey: string) {
  await supabaseAdmin
    .from("participants")
    .update({ selected_agent_track: trackKey, updated_at: new Date().toISOString() })
    .eq("id", participantId);
  revalidatePath("/dashboard");
}
