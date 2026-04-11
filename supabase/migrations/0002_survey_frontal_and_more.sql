-- Survey: add frontal section, mentor professionalism, zoom frequency, support channel
-- Date: 2026-04-11

ALTER TABLE "survey_responses"
  ADD COLUMN IF NOT EXISTS "frontal_attended" boolean,
  ADD COLUMN IF NOT EXISTS "frontal_speakers_rating" integer,
  ADD COLUMN IF NOT EXISTS "frontal_content_preferences" text[],
  ADD COLUMN IF NOT EXISTS "frontal_last_negative" text,
  ADD COLUMN IF NOT EXISTS "frontal_next_wishes" text,
  ADD COLUMN IF NOT EXISTS "zoom_frequency_feedback" text,
  ADD COLUMN IF NOT EXISTS "preferred_support_channel" text,
  ADD COLUMN IF NOT EXISTS "mentor_eilon_professionalism" integer,
  ADD COLUMN IF NOT EXISTS "mentor_daniel_professionalism" integer,
  ADD COLUMN IF NOT EXISTS "mentor_ido_professionalism" integer,
  ADD COLUMN IF NOT EXISTS "mentor_orit_professionalism" integer;
