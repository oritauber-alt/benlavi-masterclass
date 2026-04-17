import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "האקתון AI לבעלי עסקים | 30 באפריל 2026",
  description:
    "שאלון מקדים לאקתון. עזרו לנו להכיר את העסק שלכם כדי שנבנה לכם חבילת סוכן AI אישית.",
  openGraph: {
    title: "האקתון AI לבעלי עסקים | 30 באפריל 2026",
    description:
      "שאלון מקדים לאקתון. עזרו לנו להכיר את העסק שלכם כדי שנבנה לכם חבילת סוכן AI אישית.",
    type: "website",
    locale: "he_IL",
  },
};

export default function BusinessIntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
