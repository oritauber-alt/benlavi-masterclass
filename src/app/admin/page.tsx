import { AdminActions } from "./admin-actions";
import { AdminTable } from "./admin-table";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">ניהול משתתפים</h1>
        </div>

        <AdminActions />

        <div className="mt-8">
          <AdminTable />
        </div>
      </div>
    </div>
  );
}
