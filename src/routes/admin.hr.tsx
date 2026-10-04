import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Plus, ShieldAlert, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/hr")({
  component: HrPage,
});

const MOCK_EMPLOYEES = [
  { id: "1", name: "Aashis Rijal", department: "Executive", role: "CEO", joinDate: "Jan 2022", status: "Active", leave: null },
  { id: "2", name: "Suman Karki", department: "Operations", role: "Manager", joinDate: "Mar 2022", status: "Active", leave: null },
  { id: "3", name: "Priya Shrestha", department: "HR", role: "HR Officer", joinDate: "Jun 2022", status: "Active", leave: "Leave Pending" },
  { id: "4", name: "Bikash Thapa", department: "Engineering", role: "Sr. Developer", joinDate: "Aug 2022", status: "Active", leave: null },
  { id: "5", name: "Anita Gurung", department: "Training", role: "IT Trainer", joinDate: "Oct 2022", status: "Active", leave: null },
  { id: "6", name: "Roshan Pandey", department: "Engineering", role: "Developer", joinDate: "Jan 2023", status: "Active", leave: null },
  { id: "7", name: "Sunita Rai", department: "Design", role: "UI/UX Designer", joinDate: "Apr 2023", status: "Active", leave: null },
];

function HrPage() {
  return (
          <AdminLayout title="Human Resources" description="Employee records and HR management">
        <HrContent />
      </AdminLayout>
  );
}

function HrContent() {
  const { can } = useAuth();
  if (!can("view:hr")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view HR data.</p>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Total Employees</p><p className="text-2xl font-bold">{MOCK_EMPLOYEES.length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Departments</p><p className="text-2xl font-bold">5</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Leave Requests</p><p className="text-2xl font-bold">1</p></CardContent></Card>
      </div>
      <div className="flex justify-end">
        {can("manage:hr") && (
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        )}
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Employee Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Joined</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{emp.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{emp.department}</td>
                    <td className="px-5 py-3 text-muted-foreground">{emp.role}</td>
                    <td className="px-5 py-3 text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />{emp.joinDate}
                    </td>
                    <td className="px-5 py-3">
                      {emp.leave ? (
                        <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-200 bg-amber-50">{emp.leave}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-200 bg-emerald-50">Active</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
