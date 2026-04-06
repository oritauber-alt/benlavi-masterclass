import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

const WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ||
  "https://hook.eu2.make.com/5cogkeq013f59pwuuildqk2ixbejc70a";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.name || !body?.phone || !body?.business) {
      return NextResponse.json(
        { error: "חסרים שדות חובה" },
        { status: 400 }
      );
    }

    const name = String(body.name).trim();
    const phone = String(body.phone).trim();
    const business = String(body.business).trim();

    // Save to Supabase (primary storage)
    const { error: dbError } = await supabaseAdmin
      .from("hackathon_registrations")
      .insert({ name, phone, business, source: "landing-page" });

    if (dbError) {
      console.error("[register] Supabase insert failed:", dbError.message);
    }

    // Also send to Make.com webhook (for Google Sheets sync)
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        business,
        timestamp: new Date().toISOString(),
        source: "benlavi-masterclass-landing",
      }),
    }).catch(() => {
      // Fire-and-forget: don't block response if Make fails
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "שגיאת שרת" },
      { status: 500 }
    );
  }
}
