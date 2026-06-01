import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin · We-Glow Aquarium",
  },
  description: "We-Glow Aquarium admin dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
