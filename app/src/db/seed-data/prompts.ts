// 16 prompt templates: 4 site types x 4 design styles
// Each template uses {{skill}} as placeholder for the participant's personal skill

const siteTypeInstructions: Record<string, string> = {
  landing: `סוג אתר: דף נחיתה (Landing Page)
- דף אחד ארוך עם סקשנים ברורים
- Hero section עם כותרת חזקה ו-CTA
- סקשן "למי זה מתאים"
- סקשן שירותים/יתרונות (3-4 פריטים)
- עדויות לקוחות (2-3)
- טופס יצירת קשר / CTA סופי
- Footer עם פרטי קשר`,

  info: `סוג אתר: אתר מידע / תדמית (About)
- דף ראשי עם היכרות קצרה
- סקשן "מי אנחנו" עם סיפור העסק
- סקשן צוות (אם רלוונטי)
- סקשן ערכים / גישה
- סקשן שירותים
- דף צור קשר
- Footer מלא`,

  portfolio: `סוג אתר: תיק עבודות (Portfolio)
- דף ראשי עם הצגה קצרה
- גלריית עבודות/פרויקטים (6-8 פריטים) עם תמונות placeholder
- כל פרויקט: שם, תי��ור קצר, קטגוריה
- סקשן "על עצמי"
- סקשן כישורים/שירותים
- טופס יצירת קשר
- Footer`,

  catalog: `סוג אתר: חנות / קטלוג מוצרים
- דף ראשי עם באנר וקטגוריות
- רשימת מוצרים/שירותים (6-8 פריטים) כ-grid
- כל מוצר: שם, תיאור, מחיר, תמונה placeholder
- סקשן "למה אנחנו"
- סקשן משלוחים/תנאים
- טופס יצירת קשר
- Footer`,
};

const designStyleInstructions: Record<string, string> = {
  "modern-minimal": `סגנון עיצוב: מודרני-מינימליסטי
- רקע לבן עם הרבה רווח לבן (whitespace)
- טיפוגרפיה גדולה ונקייה, sans-serif
- צבעים: שחור, לבן, וצבע אחד מרכזי מצבעי המותג
- אלמנטים מינימליים, ללא צלליות כבדות
- אייקונים דקים (outline style)
- אנימציות עדינות בסקרול
- השראה: Apple, Linear, Vercel`,

  "bold-colorful": `סגנון עיצוב: Bold וצבעוני
- צבעים חזקים ורוויים מצבעי המותג
- טיפוגרפיה גדולה ועבה (bold/black weight)
- רקעים צבעוניים עם טקסט לבן
- כפתורים גדולים ובולטים
- צורות גיאומטריות ברקע
- אנימציות מרשימות
- השראה: Stripe, Notion, Figma`,

  "elegant-business": `סגנון עיצוב: אלגנטי-עסקי
- רקע כהה (dark theme) עם אלמנטים בזהב/קרם
- טיפוגרפיה אלגנטית, serif לכותרות, sans-serif לטקסט
- צבעים: גוונים כהים, זהב/קרם, לבן
- borders ועיטורים עדינים
- spacing נדיב
- תמונות עם overlay כהה
- השראה: דפי יוקרה, מלונות בוטיק`,

  "creative-young": `סגנון עיצוב: קריאייטיבי-צעיר
- גרדיאנטים צבעוניים (סגול-ורוד-טורקיז)
- טיפוגרפיה מודרנית ומשחקית
- צורות אורגניות ו-blobs ברקע
- אלמנטים של glassmorphism (שקיפות + blur)
- אמוג'ים ואייקונים צבעוניים
- אנימציות כיפיות
- השראה: TikTok, Discord, Spotify`,
};

export type PromptSeed = {
  siteType: string;
  designStyle: string;
  promptTemplate: string;
  displayNameHe: string;
};

export function generatePromptSeeds(): PromptSeed[] {
  const siteTypes = [
    { key: "landing", he: "דף נחיתה" },
    { key: "info", he: "אתר מידע" },
    { key: "portfolio", he: "תיק עבודות" },
    { key: "catalog", he: "קטלוג מוצרים" },
  ];

  const designStyles = [
    { key: "modern-minimal", he: "מודרני-מינימליסטי" },
    { key: "bold-colorful", he: "Bold וצבעוני" },
    { key: "elegant-business", he: "אלגנטי-עסקי" },
    { key: "creative-young", he: "קריאייטיבי-צעיר" },
  ];

  const seeds: PromptSeed[] = [];

  for (const st of siteTypes) {
    for (const ds of designStyles) {
      seeds.push({
        siteType: st.key,
        designStyle: ds.key,
        displayNameHe: `${st.he} - ${ds.he}`,
        promptTemplate: `בנה לי אתר מקצועי לעסק שלי בעברית (RTL).

## פרטי העסק שלי:
{{skill}}

## דרישות:
${siteTypeInstructions[st.key]}

${designStyleInstructions[ds.key]}

## דרישות טכניות:
- עברית מלאה, כיוון RTL
- רספונסיבי למובייל
- השתמש בצבעי המותג שלי שמופיעים למעלה
- שים תמונות placeholder מ-unsplash (רלוונטיות לתחום)
- הוסף אנימציות כניסה עדינות לסקשנים
- כל הטקסטים צריכים להיות בעברית טבעית, לא תרגום מאנגלית
- הקוד צריך להיות נקי וקריא

תבנה את האתר בHTML + CSS + JS, קובץ אחד. תוודא שזה נראה מקצועי ברמה גבוהה.`,
      });
    }
  }

  return seeds;
}
