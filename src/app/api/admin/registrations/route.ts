import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get("format");

  const { data, error } = await supabaseAdmin
    .from("hackathon_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (format === "csv") {
    const rows = data ?? [];
    const header = "תאריך,שם,טלפון,עסק,מקור";
    const csvRows = rows.map((r) =>
      [
        new Date(r.created_at).toLocaleString("he-IL"),
        r.name,
        r.phone,
        r.business,
        r.source || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = "\uFEFF" + [header, ...csvRows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="registrations.csv"',
      },
    });
  }

  return NextResponse.json({ registrations: data ?? [] });
}
