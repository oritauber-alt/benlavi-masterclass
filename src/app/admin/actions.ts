"use server";

import { supabaseAdmin } from "@/db";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { generateSecurePassword } from "@/lib/password";

export async function createParticipant(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const businessName = formData.get("businessName") as string;

  const password = generateSecurePassword();

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
    throw new Error(`Auth error: ${authError.message}`);
  }

  await supabaseAdmin.from("participants").insert({
    id: authUser.user.id,
    email,
    full_name: fullName,
    phone: phone || null,
    business_name: businessName || null,
    temp_password: password,
    status: "paid",
  });

  revalidatePath("/admin");
}
