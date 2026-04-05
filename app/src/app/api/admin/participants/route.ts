import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

export async function GET() {
  try {
    const { data: allParticipants, error: pError } = await supabaseAdmin
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (pError) throw pError;

    const { data: allSkills, error: sError } = await supabaseAdmin
      .from("skills")
      .select("participant_id");

    if (sError) throw sError;

    const skillIds = new Set((allSkills ?? []).map((s: { participant_id: string }) => s.participant_id));

    return NextResponse.json({
      participants: (allParticipants ?? []).map((p: Record<string, unknown>) => ({
        id: p.id,
        fullName: p.full_name,
        email: p.email,
        businessName: p.business_name,
        status: p.status,
        tempPassword: p.temp_password,
        hasSkill: skillIds.has(p.id as string),
        currentStep: p.current_step,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message, participants: [] },
      { status: 200 }
    );
  }
}
