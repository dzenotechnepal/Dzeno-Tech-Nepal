import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, ShieldAlert, Users } from "lucide-react";

export const Route = createFileRoute("/admin/careers")({
  component: CareersAdminPage,
});

const MOCK_JOBS = [
  { id: "1", title: "Senior Full Stack Developer", dept: "Engineering", type: "Full-time", apps: 4, status: "Open" },
  { id: "2", title: "UI/UX Designer", dept: "Design", type: "Full-time", apps: 7, status: "Open" },
  { id: "3", title: "IT Trainer", dept: "Training", type: "Full-time", apps: 2, status: "Open" },
  { id: "4", title: "Project Manager", dept: "Operations", type: "Full-time", apps: 3, status: "Open" },
  { id: "5", title: "IT Support Engineer", dept: "IT Services", type: "Full-time", apps: 1, status: "Open" },
  { id: "6", title: "React.js Intern", dept: "Engineering", type: "Internship", apps: 12, status: "Closed" },
];

function CareersAdminPage() {
  return (
          <AdminLayout title="Careers" description="Manage job postings and applications">
        <CareersContent />
      </AdminLayout>
  );
}

function CareersContent() {
  const { can } = useAuth();
  if (!can("view:careers")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view careers.</p>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Open Positions</p><p className="text-2xl font-bold">{MOCK_JOBS.filter(j => j.status === "Open").length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Total Applications</p><p className="text-2xl font-bold">{MOCK_JOBS.reduce((s, j) => s + j.apps, 0)}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Departments Hiring</p><p className="text-2xl font-bold">{new Set(MOCK_JOBS.filter(j => j.status === "Open").map(j => j.dept)).size}</p></CardContent></Card>
      </div>
      <div className="flex justify-end">
        {can("manage:careers") && (
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
            <Plus className="h-4 w-4" /> Post Job
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_JOBS.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-violet-500 shrink-0" />
                  <CardTitle className="text-sm font-semibold leading-snug">{job.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[11px]">{job.dept}</Badge>
                <Badge variant="outline" className="text-[11px]">{job.type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {job.apps} application{job.apps !== 1 && "s"}
                </div>
                <Badge
                  variant="outline"
                  className={job.status === "Open" ? "text-[11px] text-emerald-600 border-emerald-200 bg-emerald-50" : "text-[11px] text-muted-foreground"}
                >
                  {job.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
