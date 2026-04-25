import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://benlavi-masterclass.vercel.app"),
  title: "פרונטלי ncode | 27.4",
  description: "שריון מקום למפגש הפרונטלי של ncode",
  openGraph: {
    title: "פרונטלי ncode | 27.4",
    description: "שריון מקום למפגש הפרונטלי של ncode",
    type: "website",
    locale: "he_IL",
    images: [
      {
        url: "/og-student-requests.jpeg",
        width: 1200,
        height: 630,
        alt: "פרונטלי ncode | 27.4",
      },
    ],
  },
};

export default function FrontalRsvpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
