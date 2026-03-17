import { AuthGuard } from "@/components/admin/auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
