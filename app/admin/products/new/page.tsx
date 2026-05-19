import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

export default function AdminNewProductPage() {
  return (
    <AdminShell title="Add product" description="Create a new catalog item">
      <ProductForm mode="create" />
    </AdminShell>
  );
}
