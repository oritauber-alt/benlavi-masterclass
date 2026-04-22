import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://benlavi-masterclass.vercel.app"),
  title: "האקתון Elite Builders | ncode",
  description:
    "שאלון מקדים לאקתון Elite Builders. ספרו לנו על המוצר שלכם כדי שנתאים לכם את החוויה הכי טובה.",
  openGraph: {
    title: "האקתון Elite Builders | ncode",
    description:
      "שאלון מקדים לאקתון Elite Builders. ספרו לנו על המוצר שלכם כדי שנתאים לכם את החוויה הכי טובה.",
    type: "website",
    locale: "he_IL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 1024,
        alt: "האקתון Elite Builders | ncode",
      },
    ],
  },
};

export default function HackathonSurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
