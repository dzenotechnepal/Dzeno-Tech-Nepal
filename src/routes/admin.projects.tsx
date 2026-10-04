import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsPage,
});

const MOCK_PROJECTS = [
  { id: "1", name: "E-commerce Platform", client: "RetailCo Nepal", status: "On Track", progress: 72, due: "Oct 15, 2026" },
  { id: "2", name: "Mobile Banking App", client: "Himalayan Bank Ltd.", status: "At Risk", progress: 45, due: "Oct 8, 2026" },
  { id: "3", name: "ERP Integration", client: "TechBridge Pvt. Ltd.", status: "On Track", progress: 30, due: "Nov 1, 2026" },
  { id: "4", name: "School Management Portal", client: "Everest Academy", status: "Delayed", progress: 88, due: "Oct 20, 2026" },
  { id: "5", name: "HR Management System", client: "Global Staffing Nepal", status: "Completed", progress: 100, due: "Sep 30, 2026" },
];

const statusStyle: Record<string, string> = {
  "On Track": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "At Risk": "text-amber-700 bg-amber-50 border-amber-200",
  "Delayed": "text-red-700 bg-red-50 border-red-200",
  "Completed": "text-blue-700 bg-blue-50 border-blue-200",
};

function ProjectsPage() {
  return (
          <AdminLayout title="Projects" description="Track all active and completed projects">
        <ProjectsContent />
      </AdminLayout>
  );
}

function ProjectsContent() {
  const { can } = useAuth();
  if (!can("view:projects")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view projects.</p>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        {can("manage:projects") && (
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PROJECTS.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-violet-500 shrink-0" />
                  <CardTitle className="text-sm font-semibold leading-snug">{p.name}</CardTitle>
                </div>
                <span className={cn("shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-medium", statusStyle[p.status])}>
                  {p.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{p.client}</p>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{p.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-violet-500 transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Due: <span className="text-foreground font-medium">{p.due}</span></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
