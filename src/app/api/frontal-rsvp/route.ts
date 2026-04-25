import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.firstName || !body?.lastName || !body?.status) {
      return NextResponse.json({ error: "חסרים שדות חובה" }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin
      .from("frontal_rsvp")
      .insert({
        first_name: String(body.firstName).trim(),
        last_name: String(body.lastName).trim(),
        status: String(body.status).trim(),
      });

    if (dbError) {
      console.error("[frontal-rsvp] insert failed:", dbError.message);
      return NextResponse.json({ error: "שגיאה בשמירה" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
