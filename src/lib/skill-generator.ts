import Anthropic from "@anthropic-ai/sdk";

type SkillInput = {
  businessName: string;
  businessDomain: string;
  dailyWork: string;
  timeConsumingTask: string;
  automatableTask: string;
  brandColors?: string;
};

export async function generateSkill(input: SkillInput): Promise<string> {
  // If no API key, return a template skill
  if (!process.env.ANTHROPIC_API_KEY) {
    return generateFallbackSkill(input);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `צור SKILL.md מותאם אישית לעסק הבא. הסקיל צריך להיות בעברית ולכלול את כל המידע שהעסק סיפק.

שם העסק: ${input.businessName}
תחום: ${input.businessDomain}
מה עושים ביום יום: ${input.dailyWork}
מה הכי גוזל זמן: ${input.timeConsumingTask}
מה היו רוצים לאוטמט: ${input.automatableTask}
צבעי מותג: ${input.brandColors || "לא צוין"}

כתוב SKILL.md שכולל:
1. שם העסק ותחום
2. תיאור קצר של מה העסק עושה
3. קהל היעד
4. טון דיבור מומלץ (על בסיס התחום)
5. שירותים/מוצרים עיקריים
6. צבעי מותג (אם צוינו)
7. הנחיות ספציפיות ל-Claude איך לעזור לעסק הזה

התשובה צריכה להיות רק תוכן ה-SKILL.md, בלי הסברים נוספים.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock ? textBlock.text : generateFallbackSkill(input);
}

function generateFallbackSkill(input: SkillInput): string {
  return `---
name: ${input.businessName}
description: סקיל מותאם לעסק ${input.businessName}
---

# ${input.businessName}

## תחום
${input.businessDomain}

## מה העסק עושה
${input.dailyWork}

## צבעי מותג
${input.brandColors || "לא צוינו - השתמש בצבעים מקצועיים"}

## הנחיות
- כתוב תמיד בעברית
- השתמש בטון מקצועי וחברי
- התמקד בפתרון הבעיות של העסק: ${input.timeConsumingTask}
- עזור באוטומציה של: ${input.automatableTask}
`;
}
