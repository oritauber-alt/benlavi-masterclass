import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.fullName || !body?.topic || !body?.details) {
      return NextResponse.json({ error: "חסרים שדות חובה" }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin
      .from("student_requests")
      .insert({
        full_name: String(body.fullName).trim(),
        topic: String(body.topic).trim(),
        details: String(body.details).trim(),
      });

    if (dbError) {
      console.error("[student-requests] insert failed:", dbError.message);
      return NextResponse.json({ error: "שגיאה בשמירה" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
