import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";
import { generateSkill } from "@/lib/skill-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      businessName,
      businessDomain,
      dailyWork,
      timeConsumingTask,
      automatableTask,
      aiExperience,
      brandColors,
      websiteUrl,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "חסר אימייל" }, { status: 400 });
    }

    const { data: participants } = await supabaseAdmin
      .from("participants")
      .select("id")
      .eq("email", email)
      .limit(1);

    const participant = participants?.[0];
    if (!participant) {
      return NextResponse.json({ error: "משתתף לא נמצא" }, { status: 404 });
    }

    await supabaseAdmin
      .from("participants")
      .update({
        business_name: businessName,
        business_domain: businessDomain,
        daily_work: dailyWork,
        time_consuming_task: timeConsumingTask,
        automatable_task: automatableTask,
        ai_experience: aiExperience ? parseInt(aiExperience) : null,
        brand_colors: brandColors,
        website_url: websiteUrl,
        status: "brief_submitted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", participant.id);

    const skillContent = await generateSkill({
      businessName,
      businessDomain,
      dailyWork,
      timeConsumingTask,
      automatableTask,
      brandColors,
    });

    await supabaseAdmin.from("skills").insert({
      participant_id: participant.id,
      skill_content: skillContent,
    });

    await supabaseAdmin
      .from("participants")
      .update({ status: "ready", updated_at: new Date().toISOString() })
      .eq("id", participant.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[brief-submitted] failed:", err);
    return NextResponse.json(
      { error: "שליחת הטופס נכשלה, נסה שוב" },
      { status: 500 }
    );
  }
}
