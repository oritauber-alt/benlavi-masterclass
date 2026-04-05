import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-l from-white to-zinc-400 bg-clip-text text-transparent">
          אקתון AI לבעלי עסקים
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto">
          בנה אייג&apos;נט AI שעובד בשביל העסק שלך. יום אחד. תוצאה אמיתית.
        </p>
        <p className="text-zinc-500">30 באפריל 2026 | בית הצעירים, מזא&quot;ה 9</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            כניסה למערכת
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors"
          >
            ניהול
          </Link>
        </div>
      </div>
    </div>
  );
}
