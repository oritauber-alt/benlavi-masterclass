-- Survey redesign: add columns for mentor ratings, community, zoom details, etc.
-- Date: 2026-04-11

ALTER TABLE "survey_responses"
  ADD COLUMN IF NOT EXISTS "training_percent_complete" text,
  ADD COLUMN IF NOT EXISTS "outdated_module_flag" boolean,
  ADD COLUMN IF NOT EXISTS "outdated_module_name" text,
  ADD COLUMN IF NOT EXISTS "content_improvement_suggestion" text,
  ADD COLUMN IF NOT EXISTS "zooms_attended_last_month" text,
  ADD COLUMN IF NOT EXISTS "zoom_no_attend_reason" text,
  ADD COLUMN IF NOT EXISTS "zoom_value_rating" integer,
  ADD COLUMN IF NOT EXISTS "office_hours_attended" boolean,
  ADD COLUMN IF NOT EXISTS "office_hours_no_attend_reason" text,
  ADD COLUMN IF NOT EXISTS "mentor_eilon_experience" integer,
  ADD COLUMN IF NOT EXISTS "mentor_eilon_availability" integer,
  ADD COLUMN IF NOT EXISTS "mentor_eilon_feedback" text,
  ADD COLUMN IF NOT EXISTS "mentor_daniel_experience" integer,
  ADD COLUMN IF NOT EXISTS "mentor_daniel_availability" integer,
  ADD COLUMN IF NOT EXISTS "mentor_daniel_feedback" text,
  ADD COLUMN IF NOT EXISTS "mentor_ido_experience" integer,
  ADD COLUMN IF NOT EXISTS "mentor_ido_availability" integer,
  ADD COLUMN IF NOT EXISTS "mentor_ido_feedback" text,
  ADD COLUMN IF NOT EXISTS "mentor_orit_experience" integer,
  ADD COLUMN IF NOT EXISTS "mentor_orit_availability" integer,
  ADD COLUMN IF NOT EXISTS "mentor_orit_feedback" text,
  ADD COLUMN IF NOT EXISTS "knows_where_to_turn" text,
  ADD COLUMN IF NOT EXISTS "community_satisfaction" integer,
  ADD COLUMN IF NOT EXISTS "community_helpfulness" text,
  ADD COLUMN IF NOT EXISTS "community_missing" text;
