"use client";

import { useEffect, useState } from "react";

type Participant = {
  id: string;
  fullName: string;
  email: string;
  businessName: string | null;
  status: string;
  tempPassword: string | null;
  hasSkill: boolean;
  currentStep: number;
};

export function AdminTable() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/participants")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setParticipants(data.participants ?? []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("DB לא מחובר. חברו Supabase ב-.env.local");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-zinc-500 text-center py-8">טוען...</p>;
  }

  if (error) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-yellow-400 mb-2">DB לא מחובר</p>
        <p className="text-zinc-500 text-sm">
          כדי לראות משתתפים, צרו פרויקט Supabase והכניסו את ה-keys ב-
          <code className="bg-zinc-800 px-1 rounded">.env.local</code>
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-zinc-500 mb-4">{participants.length} / 40 משתתפים</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="text-right p-3">שם</th>
              <th className="text-right p-3">אימייל</th>
              <th className="text-right p-3">עסק</th>
              <th className="text-right p-3">סטטוס</th>
              <th className="text-right p-3">סיסמה</th>
              <th className="text-right p-3">סקיל</th>
              <th className="text-right p-3">שלב</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr
                key={p.id}
                className="border-b border-zinc-900 hover:bg-zinc-900/50"
              >
                <td className="p-3 text-zinc-200">{p.fullName}</td>
                <td className="p-3 text-zinc-400">{p.email}</td>
                <td className="p-3 text-zinc-400">{p.businessName ?? "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "ready"
                        ? "bg-green-600/20 text-green-400"
                        : p.status === "skill_generated"
                        ? "bg-blue-600/20 text-blue-400"
                        : p.status === "brief_submitted"
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "bg-zinc-700/50 text-zinc-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-zinc-500 font-mono text-xs">
                  {p.tempPassword ?? "-"}
                </td>
                <td className="p-3">
                  {p.hasSkill ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-zinc-600">-</span>
                  )}
                </td>
                <td className="p-3 text-zinc-400">{p.currentStep}</td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">
                  אין משתתפים עדיין
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
