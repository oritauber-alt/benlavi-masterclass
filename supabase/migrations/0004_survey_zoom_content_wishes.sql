-- Survey: add zoom content wishes question
-- Date: 2026-04-11

ALTER TABLE "survey_responses"
  ADD COLUMN IF NOT EXISTS "zoom_content_wishes" text;
