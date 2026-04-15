import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.name || !body?.phone) {
      return NextResponse.json(
        { error: "חסרים שדות חובה" },
        { status: 400 }
      );
    }

    const name = String(body.name).trim();
    const phone = String(body.phone).trim();
    const business = body.business ? String(body.business).trim() : null;

    const { error: dbError } = await supabaseAdmin
      .from("ximus_leads")
      .insert({ name, phone, business, source: "ximus-landing" });

    if (dbError) {
      console.error("[ximus-register] Supabase insert failed:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "שגיאת שרת" },
      { status: 500 }
    );
  }
}
