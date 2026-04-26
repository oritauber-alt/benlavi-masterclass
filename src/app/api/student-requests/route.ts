import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";

const BUCKET = "student-requests-media";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = formData.get("fullName")?.toString().trim() || "";
    const topic = formData.get("topic")?.toString().trim() || "";
    const details = formData.get("details")?.toString().trim() || "";
    const mediaFile = formData.get("media") as File | null;

    if (!fullName || !topic || !details) {
      return NextResponse.json({ error: "חסרים שדות חובה" }, { status: 400 });
    }

    let mediaUrl: string | null = null;

    if (mediaFile && mediaFile.size > 0) {
      if (mediaFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "הקובץ גדול מדי (מקסימום 50MB)" },
          { status: 400 }
        );
      }

      // Ensure bucket exists
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      if (!buckets?.find((b) => b.name === BUCKET)) {
        await supabaseAdmin.storage.createBucket(BUCKET, { public: true });
      }

      const ext = mediaFile.name.split(".").pop() || "bin";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const arrayBuffer = await mediaFile.arrayBuffer();
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(fileName, Buffer.from(arrayBuffer), {
          contentType: mediaFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[student-requests] upload failed:", uploadError.message);
        return NextResponse.json(
          { error: "שגיאה בהעלאת הקובץ" },
          { status: 500 }
        );
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      mediaUrl = urlData.publicUrl;
    }

    const { error: dbError } = await supabaseAdmin
      .from("student_requests")
      .insert({
        full_name: fullName,
        topic,
        details,
        media_url: mediaUrl,
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
