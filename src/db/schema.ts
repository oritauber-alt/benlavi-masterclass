import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

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
  contentSatisfaction: integer("content_satisfaction"),
  contentFeedback: text("content_feedback"),
  sessionsSatisfaction: integer("sessions_satisfaction"),
  sessionsFeedback: text("sessions_feedback"),
  overallSatisfaction: integer("overall_satisfaction"),
  overallFeedback: text("overall_feedback"),
  additionalNotes: text("additional_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mcpGuides = pgTable("mcp_guides", {
  id: uuid("id").primaryKey().defaultRandom(),
  mcpName: text("mcp_name").notNull().unique(),
  titleHe: text("title_he").notNull(),
  guideContentMd: text("guide_content_md").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
