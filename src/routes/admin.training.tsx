import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, ShieldAlert, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/training")({
  component: TrainingPage,
});

const MOCK_COURSES = [
  { id: "1", name: "React.js Bootcamp", instructor: "Anita Gurung", students: 15, startDate: "Sep 20, 2026", endDate: "Oct 25, 2026", status: "Active", fee: "NPR 15,000" },
  { id: "2", name: "Python Fundamentals", instructor: "Anita Gurung", students: 12, startDate: "Sep 25, 2026", endDate: "Oct 18, 2026", status: "Active", fee: "NPR 10,000" },
  { id: "3", name: "Node.js Advanced", instructor: "Bikash Thapa", students: 15, startDate: "Oct 5, 2026", endDate: "Nov 10, 2026", status: "Active", fee: "NPR 18,000" },
  { id: "4", name: "Web Dev Bootcamp", instructor: "Anita Gurung", students: 20, startDate: "Aug 1, 2026", endDate: "Sep 30, 2026", status: "Completed", fee: "NPR 25,000" },
  { id: "5", name: "Data Science Basics", instructor: "Roshan Pandey", students: 10, startDate: "Nov 1, 2026", endDate: "Dec 15, 2026", status: "Upcoming", fee: "NPR 20,000" },
];

function TrainingPage() {
  return (
          <AdminLayout title="Training" description="IT training courses and batch management">
        <TrainingContent />
      </AdminLayout>
  );
}

function TrainingContent() {
  const { can } = useAuth();
  if (!can("view:training")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view training data.</p>
      </div>
    );
  }

  const statusStyle: Record<string, string> = {
    Active: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Completed: "text-blue-700 bg-blue-50 border-blue-200",
    Upcoming: "text-amber-700 bg-amber-50 border-amber-200",
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Active Batches</p><p className="text-2xl font-bold">{MOCK_COURSES.filter(c => c.status === "Active").length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{MOCK_COURSES.reduce((s, c) => s + c.students, 0)}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Upcoming Courses</p><p className="text-2xl font-bold">{MOCK_COURSES.filter(c => c.status === "Upcoming").length}</p></CardContent></Card>
      </div>
      <div className="flex justify-end">
        {can("manage:training") && (
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
            <Plus className="h-4 w-4" /> New Course
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_COURSES.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-teal-500 shrink-0" />
                  <CardTitle className="text-sm font-semibold leading-snug">{course.name}</CardTitle>
                </div>
                <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-medium ${statusStyle[course.status]}`}>
                  {course.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">Instructor: <span className="text-foreground font-medium">{course.instructor}</span></p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />{course.students} enrolled
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />{course.startDate} → {course.endDate}
              </div>
              <p className="text-xs font-semibold text-violet-600">{course.fee}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
