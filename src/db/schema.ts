import { pgTable, uuid, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  businessName: text("business_name"),
  businessDomain: text("business_domain"),
  tempPassword: text("temp_password"),
  status: text("status").notNull().default("paid"),
  dailyWork: text("daily_work"),
  timeConsumingTask: text("time_consuming_task"),
  automatableTask: text("automatable_task"),
  aiExperience: integer("ai_experience"),
  brandColors: text("brand_colors"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  selectedSiteType: text("selected_site_type"),
  selectedDesignStyle: text("selected_design_style"),
  selectedAgentTrack: text("selected_agent_track"),
  currentStep: integer("current_step").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .unique()
    .references(() => participants.id),
  skillContent: text("skill_content").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteType: text("site_type").notNull(),
  designStyle: text("design_style").notNull(),
  promptTemplate: text("prompt_template").notNull(),
  displayNameHe: text("display_name_he"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agentTracks = pgTable("agent_tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  trackKey: text("track_key").notNull().unique(),
  titleHe: text("title_he").notNull(),
  subtitleHe: text("subtitle_he"),
  descriptionHe: text("description_he"),
  promptTemplate: text("prompt_template").notNull(),
  requiredMcps: text("required_mcps").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const surveyResponses = pgTable("survey_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  projectStage: text("project_stage").notNull(),
  projectStageOther: text("project_stage_other"),
  saasDescription: text("saas_description"),
  stuckAreas: text("stuck_areas").array(),
  whatHelpsProgress: text("what_helps_progress"),
  // Content section
  contentSatisfaction: integer("content_satisfaction"),
  trainingPercentComplete: text("training_percent_complete"),
  outdatedModuleFlag: boolean("outdated_module_flag"),
  outdatedModuleName: text("outdated_module_name"),
  contentImprovementSuggestion: text("content_improvement_suggestion"),
  // Zoom section
  zoomsAttendedLastMonth: text("zooms_attended_last_month"),
  zoomNoAttendReason: text("zoom_no_attend_reason"),
  zoomValueRating: integer("zoom_value_rating"),
  zoomFrequencyFeedback: text("zoom_frequency_feedback"),
  officeHoursAttended: boolean("office_hours_attended"),
  officeHoursNoAttendReason: text("office_hours_no_attend_reason"),
  // Frontal section
  frontalAttended: boolean("frontal_attended"),
  frontalSpeakersRating: integer("frontal_speakers_rating"),
  frontalContentPreferences: text("frontal_content_preferences").array(),
  frontalLastNegative: text("frontal_last_negative"),
  frontalNextWishes: text("frontal_next_wishes"),
  // Mentor: Eilon
  mentorEilonExperience: integer("mentor_eilon_experience"),
  mentorEilonProfessionalism: integer("mentor_eilon_professionalism"),
  mentorEilonAvailability: integer("mentor_eilon_availability"),
  mentorEilonFeedback: text("mentor_eilon_feedback"),
  // Mentor: Daniel
  mentorDanielExperience: integer("mentor_daniel_experience"),
  mentorDanielProfessionalism: integer("mentor_daniel_professionalism"),
  mentorDanielAvailability: integer("mentor_daniel_availability"),
  mentorDanielFeedback: text("mentor_daniel_feedback"),
  // Mentor: Ido
  mentorIdoExperience: integer("mentor_ido_experience"),
  mentorIdoProfessionalism: integer("mentor_ido_professionalism"),
  mentorIdoAvailability: integer("mentor_ido_availability"),
  mentorIdoFeedback: text("mentor_ido_feedback"),
  // Orit (community manager)
  mentorOritExperience: integer("mentor_orit_experience"),
  mentorOritProfessionalism: integer("mentor_orit_professionalism"),
  mentorOritAvailability: integer("mentor_orit_availability"),
  mentorOritFeedback: text("mentor_orit_feedback"),
  // Channel preference
  preferredSupportChannel: text("preferred_support_channel"),
  // Direction
  knowsWhereToTurn: text("knows_where_to_turn"),
  // Community
  communitySatisfaction: integer("community_satisfaction"),
  communityHelpfulness: text("community_helpfulness"),
  communityMissing: text("community_missing"),
  // Overall
  overallSatisfaction: integer("overall_satisfaction"),
  overallFeedback: text("overall_feedback"),
  additionalNotes: text("additional_notes"),
  // Legacy (kept for backwards compat with old responses)
  sessionsSatisfaction: integer("sessions_satisfaction"),
  sessionsFeedback: text("sessions_feedback"),
  contentFeedback: text("content_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mcpGuides = pgTable("mcp_guides", {
  id: uuid("id").primaryKey().defaultRandom(),
  mcpName: text("mcp_name").notNull().unique(),
  titleHe: text("title_he").notNull(),
  guideContentMd: text("guide_content_md").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
