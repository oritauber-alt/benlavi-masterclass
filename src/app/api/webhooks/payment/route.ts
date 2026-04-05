import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";
import { createClient } from "@supabase/supabase-js";

function generatePassword(name: string): string {
  const cleanName = name.split(" ")[0].toLowerCase().replace(/[^a-z\u0590-\u05FF]/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName || "user"}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { fullName, email, phone } = body;
    if (!fullName || !email) {
      return NextResponse.json({ error: "חסר שם או אימייל" }, { status: 400 });
    }

    const password = generatePassword(fullName);

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: authUser, error: authError } =
      await supabaseAuth.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const { error: dbError } = await supabaseAdmin.from("participants").insert({
      id: authUser.user.id,
      email,
      full_name: fullName,
      phone: phone || null,
      temp_password: password,
      status: "paid",
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId: authUser.user.id, password });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
