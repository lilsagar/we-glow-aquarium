import { AdminShell } from "@/components/admin/admin-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <AdminShell
      title="Dashboard"
      description="Overview of your aquarium store"
    >
      <AdminDashboard />
    </AdminShell>
  );
}
