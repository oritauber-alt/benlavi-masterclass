import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.firstName || !body?.lastName || !body?.businessName || !body?.businessType) {
      return NextResponse.json(
        { error: "חסרים שדות חובה" },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabaseAdmin
      .from("business_intake")
      .insert({
        first_name: str(body.firstName),
        last_name: str(body.lastName),
        business_name: str(body.businessName),
        business_type: str(body.businessType),
        business_services: str(body.businessServices),
        target_audience: str(body.targetAudience),
        dream_employee: str(body.dreamEmployee),
        instagram_url: str(body.instagramUrl),
        facebook_url: str(body.facebookUrl),
        website_url: str(body.websiteUrl),
        employee_count: str(body.employeeCount),
        customer_handling: str(body.customerHandling),
        finance_handling: str(body.financeHandling),
        content_creation: str(body.contentCreation),
        quotes_or_team_bottleneck: str(body.quotesOrTeamBottleneck),
        calendar_management: str(body.calendarManagement),
        brand_voice: str(body.brandVoice),
        ai_experience: num(body.aiExperience),
        desired_agent: str(body.desiredAgent),
        additional_notes: str(body.additionalNotes),
      });

    if (dbError) {
      console.error("[business-intake] Supabase insert failed:", dbError.message);
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
