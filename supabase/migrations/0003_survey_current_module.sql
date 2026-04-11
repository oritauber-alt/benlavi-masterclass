-- Survey: add current_module dropdown
-- Date: 2026-04-11

ALTER TABLE "survey_responses"
  ADD COLUMN IF NOT EXISTS "current_module" text;
