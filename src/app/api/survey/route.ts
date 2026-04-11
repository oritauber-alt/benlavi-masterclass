import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function bool(v: unknown): boolean | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "boolean") return v;
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

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
        project_stage_other: str(body.projectStageOther),
        saas_description: str(body.saasDescription),
        // Stuck areas
        stuck_areas: Array.isArray(body.stuckAreas) ? body.stuckAreas : null,
        what_helps_progress: str(body.whatHelpsProgress),
        // Content
        content_satisfaction: num(body.contentSatisfaction),
        training_percent_complete: str(body.trainingPercentComplete),
        outdated_module_flag: bool(body.outdatedModuleFlag),
        outdated_module_name: str(body.outdatedModuleName),
        content_improvement_suggestion: str(body.contentImprovementSuggestion),
        // Zooms
        zooms_attended_last_month: str(body.zoomsAttendedLastMonth),
        zoom_no_attend_reason: str(body.zoomNoAttendReason),
        zoom_value_rating: num(body.zoomValueRating),
        zoom_frequency_feedback: str(body.zoomFrequencyFeedback),
        office_hours_attended: bool(body.officeHoursAttended),
        office_hours_no_attend_reason: str(body.officeHoursNoAttendReason),
        // Frontal
        frontal_attended: bool(body.frontalAttended),
        frontal_speakers_rating: num(body.frontalSpeakersRating),
        frontal_content_preferences: Array.isArray(body.frontalContentPreferences)
          ? body.frontalContentPreferences
          : null,
        frontal_last_negative: str(body.frontalLastNegative),
        frontal_next_wishes: str(body.frontalNextWishes),
        // Mentors: Eilon
        mentor_eilon_experience: num(body.mentorEilonExperience),
        mentor_eilon_professionalism: num(body.mentorEilonProfessionalism),
        mentor_eilon_availability: num(body.mentorEilonAvailability),
        mentor_eilon_feedback: str(body.mentorEilonFeedback),
        // Mentors: Daniel
        mentor_daniel_experience: num(body.mentorDanielExperience),
        mentor_daniel_professionalism: num(body.mentorDanielProfessionalism),
        mentor_daniel_availability: num(body.mentorDanielAvailability),
        mentor_daniel_feedback: str(body.mentorDanielFeedback),
        // Mentors: Ido
        mentor_ido_experience: num(body.mentorIdoExperience),
        mentor_ido_professionalism: num(body.mentorIdoProfessionalism),
        mentor_ido_availability: num(body.mentorIdoAvailability),
        mentor_ido_feedback: str(body.mentorIdoFeedback),
        // Orit
        mentor_orit_experience: num(body.mentorOritExperience),
        mentor_orit_professionalism: num(body.mentorOritProfessionalism),
        mentor_orit_availability: num(body.mentorOritAvailability),
        mentor_orit_feedback: str(body.mentorOritFeedback),
        // Direction
        knows_where_to_turn: str(body.knowsWhereToTurn),
        // Community
        community_satisfaction: num(body.communitySatisfaction),
        community_helpfulness: str(body.communityHelpfulness),
        community_missing: str(body.communityMissing),
        preferred_support_channel: str(body.preferredSupportChannel),
        // Overall
        overall_satisfaction: num(body.overallSatisfaction),
        overall_feedback: str(body.overallFeedback),
        additional_notes: str(body.additionalNotes),
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
