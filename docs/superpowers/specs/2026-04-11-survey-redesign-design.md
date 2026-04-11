# Survey Redesign — Design Spec

**Date:** 2026-04-11
**Author:** Orit (ncode community manager)
**Context:** Feedback from Ben Lavi that the current `/survey` page is missing critical coverage of the ncode "envelope" — mentors (by name), community, zooms, frontals, onboarding. This spec redesigns the survey to cover everything.

---

## Goals

1. **Identify envelope weak points** — which part of the system (mentors / zooms / content / community / onboarding) needs improvement
2. **Capture ideas** for new content, modules, or features
3. **Flag unhappy students** for personal follow-up (not at risk of leaving — just worth reaching out)
4. **Measure mentors individually** — rating per named mentor so ncode knows where to invest
5. **Map the community by stage** (learning / building / selling) for better targeting

---

## Student population context

- **~516 students total**, heterogeneous
- **Segments (by student type):** ~90% new entrepreneurs, ~10% existing business owners, plus some employees and marketers
- **Segments (by journey stage) — estimated:**
  - 🎓 Learning (pre-MVP): 65%
  - 🔨 Building MVP / product: 30%
  - 📈 Selling / has customers: 5%
- **Daily engagement:** sporadic — many students stop opening content once they have a working product and rely on the mentor/community envelope instead

---

## ncode team (as referenced by the survey)

**Management (not surveyed):** Ben Lavi (CEO), Daniel (COO), Shalev Yifrach (CMO), Dor (Head of Sales)

**Mentors (surveyed by name):**
- **Eilon** — technical mentor, most accessible day-to-day, runs weekly Office Hours (Wed 19:00-21:00 on Discord) — open sessions OR personal 15-min zoom slots, format varies
- **Daniel (the other one)** — technical mentor for deep consultations, also prepares training content, less accessible day-to-day, unclear path to reach him
- **Ido Raam** — business/strategy/mental mentor, available mainly in personal chat, monthly zoom, no formal structure

**Community / onboarding (also surveyed):**
- **Orit (me)** — onboarding calls with new students, answers in community, schedules zoom/frontal sessions, runs surveys, collects content requests

---

## Training structure (for context)

- 17 modules, video-only currently, with glossary (תוכס מושגים)
- Tests/exercises coming soon (reviewed by Orit + mentors)
- No scoring / progress tracking yet
- **Currently being re-filmed** — this means some existing modules may feel outdated to students
- On top of training: 3-4 zooms/month + frontal meeting every ~6 weeks + weekly Office Hours

---

## Design principles

- **Target length:** 5-10 minutes, ~20 core questions (more if student interacts with many mentors)
- **Hybrid structure:** everyone gets the same sections, but **order adapts** to student's current stage (learning-stage students see content questions first, selling-stage students see mentor/envelope questions first)
- **Full identification upfront:** name + phone required. Orit can follow up personally with anyone unhappy.
- **Mentor protection:** each mentor gets identical structure — general experience, availability, open feedback. No "did you interact" gating — all students rate based on whatever experience they have (direct or observed).
- **Granular stage capture:** 9 detailed stages (same as current form) auto-bucketed into 3 categories for the adaptive logic

---

## Stage → Category mapping

The student picks from 9 specific stages. The survey backend buckets them into 3 categories that determine section order:

| Stage chosen | Category | Section order priority |
|---|---|---|
| רעיונאות | 🎓 Learning | Content first |
| ואלידציה | 🎓 Learning | Content first |
| מפתח/ת MVP | 🎓 Learning | Content first |
| בניתי MVP - עדיין בלי טסטרים | 🔨 Building | Mentors + zooms first |
| בניתי MVP - יש טסטרים | 🔨 Building | Mentors + zooms first |
| בפיתוח מוצר | 🔨 Building | Mentors + zooms first |
| משווק/ת - עדיין בלי מכירות | 📈 Selling | Mentors + community first |
| יש לקוחות משלמים | 📈 Selling | Mentors + community first |
| אחר | Uncategorized | Default order |

**Why 9 stages instead of 3:** granular data is more valuable for understanding the community (e.g., knowing how many are specifically in "ואלידציה" vs "רעיונאות"). The 3-category bucketing is purely for adaptive logic.

---

## Sections overview

The survey has **8 sections**. Sections 1, 2, 7, 8 are fixed. Sections 3-6 reorder based on category.

### Fixed sections
1. **Personal details** — name, phone
2. **Your journey** — stage (9 options), SaaS description
7. **Overall satisfaction** — general ncode rating + open feedback if low
8. **Anything else** — open textarea

### Adaptive sections (reorder by category)
3. **Training & content**
4. **Zooms & meetings**
5. **Mentors** (Eilon, Daniel, Ido) + **Orit**
6. **Community**

**Default order for 🎓 Learning:** 3 → 4 → 5 → 6
**Default order for 🔨 Building:** 5 → 4 → 3 → 6
**Default order for 📈 Selling:** 5 → 6 → 4 → 3

---

## Full question list

### Section 1 — Personal details (fixed, top)
1. **Full name** * (text, required)
2. **Phone** * (tel, required)

### Section 2 — Your journey (fixed, second)
3. **What stage are you at?** * (dropdown, 9 options — see mapping table)
   - "אחר" → free text input appears
4. **Tell us briefly about your SaaS** (textarea, optional)

### Section 3 — Training & content
5. **How satisfied are you with the training content?** (rating 1-10, required)
6. **Did you come across any module that felt outdated?** (yes / no)
   - If yes → "Which module?" (text)
7. **What topic would you most want to see added or improved?** (textarea, optional)
8. **Roughly what % of the training have you completed?** (dropdown: 0-25% / 25-50% / 50-75% / 75-100%)

### Section 4 — Zooms & meetings
9. **How many ncode zooms did you attend in the last month?** (radio: 0 / 1 / 2-3 / 4+)
10. **If 0 — why didn't you attend?** (textarea, conditional on Q9 = 0)
11. **If attended (Q9 ≥ 1) — how valuable were the zooms?** (rating 1-10)
12. **Did you attend Eilon's Wednesday Office Hours on Discord?** (yes / no)
13. **If no — why not?** (radio: timing / didn't know / didn't need / other, conditional on Q12 = no)

### Section 5 — Mentors

**Identical structure for each of: Eilon, Daniel, Ido, Orit**

For each person:
- **General experience with [Name]** — rating 1-10
- **Availability of [Name]** — rating 1-10
- **What would you improve with [Name]?** (textarea, optional)

Person blocks in order:
- **14a-c** — Eilon (technical mentor, day-to-day)
- **15a-c** — Daniel (technical mentor, deep consultation)
- **16a-c** — Ido Raam (business/mental/strategy)
- **17a-c** — Orit (community, onboarding)

**After all four:**
- **18.** When you have a question or need help — do you know where to turn? (radio: yes / no / depends)

### Section 6 — Community
19. **How satisfied are you with the community (WhatsApp group)?** (rating 1-10)
20. **How much does the community help you progress?** (radio: a lot / a little / not really / not at all)
21. **What's missing from the community?** (textarea, optional)

### Section 7 — Overall satisfaction (fixed, second-to-last)
22. **Overall, how satisfied are you with ncode?** (rating 1-10, required)
23. **If rating < 8 — what's the most important thing we should improve?** (textarea, required conditional)

### Section 8 — Anything else (fixed, last)
24. **Anything we didn't ask that you want us to know?** (textarea, optional)

---

## Conditional logic summary

| Trigger | Reveals |
|---|---|
| Q3 = "אחר" | Free-text "specify stage" input |
| Q6 = yes | "Which module?" input |
| Q9 = 0 | "Why didn't you attend?" textarea |
| Q9 ≥ 1 | Q11 (zoom value rating) |
| Q12 = no | Q13 (why not radio) |
| Q22 < 8 | Q23 (required improvement textarea) |

---

## Data model changes

The existing `survey_responses` table has these columns:
`id, full_name, phone, project_stage, project_stage_other, saas_description, stuck_areas, what_helps_progress, content_satisfaction, content_feedback, sessions_satisfaction, sessions_feedback, overall_satisfaction, overall_feedback, additional_notes, created_at`

**Columns to keep as-is:**
- `id, full_name, phone, project_stage, project_stage_other, saas_description`
- `content_satisfaction` (maps to Q5)
- `overall_satisfaction, overall_feedback` (maps to Q22, Q23)
- `additional_notes` (maps to Q24)
- `created_at`

**Columns to remove (not in new survey):**
- `stuck_areas` (replaced by stage + mentor-specific questions)
- `what_helps_progress` (replaced by Q7)
- `sessions_satisfaction, sessions_feedback` (replaced by per-mentor and per-zoom questions)
- `content_feedback` (replaced by specific Q6 + Q7)

**Columns to add:**
- `training_percent_complete` — text (Q8: 0-25 / 25-50 / 50-75 / 75-100)
- `outdated_module_flag` — boolean (Q6)
- `outdated_module_name` — text (Q6 follow-up)
- `content_improvement_suggestion` — text (Q7)
- `zooms_attended_last_month` — text ('0', '1', '2-3', '4+')
- `zoom_no_attend_reason` — text (Q10)
- `zoom_value_rating` — integer 1-10 (Q11)
- `office_hours_attended` — boolean (Q12)
- `office_hours_no_attend_reason` — text (Q13)
- `mentor_eilon_experience` — integer 1-10
- `mentor_eilon_availability` — integer 1-10
- `mentor_eilon_feedback` — text
- `mentor_daniel_experience` — integer 1-10
- `mentor_daniel_availability` — integer 1-10
- `mentor_daniel_feedback` — text
- `mentor_ido_experience` — integer 1-10
- `mentor_ido_availability` — integer 1-10
- `mentor_ido_feedback` — text
- `mentor_orit_experience` — integer 1-10
- `mentor_orit_availability` — integer 1-10
- `mentor_orit_feedback` — text
- `knows_where_to_turn` — text ('yes' / 'no' / 'depends')
- `community_satisfaction` — integer 1-10
- `community_helpfulness` — text ('a_lot' / 'a_little' / 'not_really' / 'not_at_all')
- `community_missing` — text

---

## UI / UX notes

- Keep existing visual language: dark zinc, gradient divider, fade-up animations, spotlight cards, pulse dot
- Section headers stay in the same style
- Rating 1-10 uses the existing `RatingButtons` component
- Add a **progress indicator** at the top (e.g. "Section 3 of 8") — long survey needs wayfinding
- Mentor sections: each mentor in its own card inside the mentors section, not 4 separate top-level sections
- Conditional textareas slide in/out smoothly (existing fade pattern)
- Submit button disabled until all required fields filled

---

## Out of scope

- Mentor-facing dashboard (viewing their own ratings)
- Email/WhatsApp automation for reaching out to unhappy students
- Historical comparison (this is the first structured survey at this granularity)
- Anonymity toggle (decision: fully identified, Orit follows up personally)
- "Would you recommend ncode?" NPS-style question (explicitly rejected)

---

## Implementation notes for plan phase

- New `/api/survey` endpoint logic must handle new columns
- Drizzle migration to alter `survey_responses` table
- Hybrid section ordering: compute category from `projectStage`, render sections in the right order
- Keep existing `/hackathon-survey` untouched — this spec is only for `/survey`
