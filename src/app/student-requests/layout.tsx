import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://benlavi-masterclass.vercel.app"),
  title: "בקשות סטודנטים | ncode",
  description:
    "שלחו לנו בקשות, הצעות ומשוב - אנחנו כאן בשבילכם.",
  openGraph: {
    title: "בקשות סטודנטים | ncode",
    description:
      "שלחו לנו בקשות, הצעות ומשוב - אנחנו כאן בשבילכם.",
    type: "website",
    locale: "he_IL",
    images: [
      {
        url: "/og-student-requests.jpeg",
        width: 1200,
        height: 630,
        alt: "בקשות סטודנטים | ncode",
      },
    ],
  },
};

export default function StudentRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
