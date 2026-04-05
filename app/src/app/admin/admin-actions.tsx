"use client";

import { useState } from "react";
import { createParticipant } from "./actions";

export function AdminActions() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await createParticipant(formData);
      setShowForm(false);
    } catch (err) {
      alert("שגיאה: " + (err as Error).message);
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        + צור משתתף חדש
      </button>

      {showForm && (
        <form
          action={handleSubmit}
          className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 max-w-md"
        >
          <div>
            <label className="block text-sm text-zinc-300 mb-1">שם מלא</label>
            <input
              name="fullName"
              required
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">אימייל</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">טלפון</label>
            <input
              name="phone"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">שם עסק</label>
            <input
              name="businessName"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 text-white rounded-lg text-sm font-medium"
          >
            {loading ? "יוצר..." : "צור משתתף (יקבל סיסמה אוטומטית)"}
          </button>
        </form>
      )}
    </div>
  );
}
