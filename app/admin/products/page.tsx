import { AdminShell } from "@/components/admin/admin-shell";
import { AdminProducts } from "@/components/admin/admin-products";

export default function AdminProductsPage() {
  return (
    <AdminShell
      title="Products"
      description="Manage your product catalog"
    >
      <AdminProducts />
    </AdminShell>
  );
}
