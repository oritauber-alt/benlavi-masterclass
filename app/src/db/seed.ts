import { db } from "./index";
import { prompts, agentTracks, mcpGuides } from "./schema";
import { generatePromptSeeds } from "./seed-data/prompts";
import { agentTrackSeeds } from "./seed-data/agent-tracks";
import { mcpGuideSeeds } from "./seed-data/mcp-guides";

async function seed() {
  console.log("Seeding prompts...");
  const promptSeeds = generatePromptSeeds();
  for (const p of promptSeeds) {
    await db.insert(prompts).values(p).onConflictDoNothing();
  }
  console.log(`  ${promptSeeds.length} prompts seeded`);

  console.log("Seeding agent tracks...");
  for (const t of agentTrackSeeds) {
    await db.insert(agentTracks).values(t).onConflictDoNothing();
  }
  console.log(`  ${agentTrackSeeds.length} agent tracks seeded`);

  console.log("Seeding MCP guides...");
  for (const g of mcpGuideSeeds) {
    await db.insert(mcpGuides).values(g).onConflictDoNothing();
  }
  console.log(`  ${mcpGuideSeeds.length} MCP guides seeded`);

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
