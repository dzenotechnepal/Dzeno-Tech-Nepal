import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleDashboard } from "@/components/admin/RoleDashboard";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" description="Your role-based overview">
      <RoleDashboard />
    </AdminLayout>
  );
}
