import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = "https://hook.eu2.make.com/5cogkeq013f59pwuuildqk2ixbejc70a";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.name || !body?.phone || !body?.business) {
      return NextResponse.json(
        { error: "חסרים שדות חובה" },
        { status: 400 }
      );
    }

    const payload = {
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      business: String(body.business).trim(),
      timestamp: new Date().toISOString(),
      source: "benlavi-masterclass-landing",
    };

    const webhookRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      return NextResponse.json(
        { error: "שליחה נכשלה" },
        { status: 502 }
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
