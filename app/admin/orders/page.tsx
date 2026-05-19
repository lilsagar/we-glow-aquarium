import { AdminShell } from "@/components/admin/admin-shell";
import { AdminOrders } from "@/components/admin/admin-orders";

export default function AdminOrdersPage() {
  return (
    <AdminShell title="Orders" description="View and update customer orders">
      <AdminOrders />
    </AdminShell>
  );
}
