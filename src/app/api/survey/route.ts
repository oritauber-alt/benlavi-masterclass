import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.fullName || !body?.phone || !body?.projectStage) {
      return NextResponse.json(
        { error: "חסרים שדות חובה" },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabaseAdmin
      .from("survey_responses")
      .insert({
        full_name: String(body.fullName).trim(),
        phone: String(body.phone).trim(),
        project_stage: String(body.projectStage).trim(),
        project_stage_other: body.projectStageOther
          ? String(body.projectStageOther).trim()
          : null,
        saas_description: body.saasDescription
          ? String(body.saasDescription).trim()
          : null,
        stuck_areas: Array.isArray(body.stuckAreas) ? body.stuckAreas : null,
        what_helps_progress: body.whatHelpsProgress
          ? String(body.whatHelpsProgress).trim()
          : null,
        content_satisfaction: body.contentSatisfaction
          ? Number(body.contentSatisfaction)
          : null,
        content_feedback: body.contentFeedback
          ? String(body.contentFeedback).trim()
          : null,
        sessions_satisfaction: body.sessionsSatisfaction
          ? Number(body.sessionsSatisfaction)
          : null,
        sessions_feedback: body.sessionsFeedback
          ? String(body.sessionsFeedback).trim()
          : null,
        overall_satisfaction: body.overallSatisfaction
          ? Number(body.overallSatisfaction)
          : null,
        overall_feedback: body.overallFeedback
          ? String(body.overallFeedback).trim()
          : null,
        additional_notes: body.additionalNotes
          ? String(body.additionalNotes).trim()
          : null,
      });

    if (dbError) {
      console.error("[survey] Supabase insert failed:", dbError.message);
      return NextResponse.json(
        { error: "שגיאה בשמירת השאלון" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "שגיאת שרת" },
      { status: 500 }
    );
  }
}
