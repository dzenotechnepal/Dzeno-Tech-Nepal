import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, TrendingUp, Users, FolderKanban, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
          <AdminLayout title="Analytics" description="Business performance metrics">
        <AnalyticsContent />
      </AdminLayout>
  );
}

function AnalyticsContent() {
  const { can } = useAuth();
  if (!can("view:analytics")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view analytics.</p>
      </div>
    );
  }

  const monthlyData = [
    { month: "May", leads: 8, projects: 9, revenue: 3.1 },
    { month: "Jun", leads: 10, projects: 9, revenue: 3.4 },
    { month: "Jul", leads: 9, projects: 10, revenue: 3.6 },
    { month: "Aug", leads: 12, projects: 10, revenue: 3.8 },
    { month: "Sep", leads: 11, projects: 11, revenue: 4.0 },
    { month: "Oct", leads: 14, projects: 11, revenue: 4.2 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-emerald-500" /><p className="text-xs font-medium text-muted-foreground">Revenue Growth</p></div>
          <p className="text-2xl font-bold text-foreground">+12%</p>
          <p className="text-xs text-muted-foreground mt-0.5">vs last month</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-2"><MessageSquare className="h-4 w-4 text-violet-500" /><p className="text-xs font-medium text-muted-foreground">Monthly Leads</p></div>
          <p className="text-2xl font-bold text-foreground">14</p>
          <p className="text-xs text-emerald-500 mt-0.5">+6 vs last month</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-2"><FolderKanban className="h-4 w-4 text-blue-500" /><p className="text-xs font-medium text-muted-foreground">Active Projects</p></div>
          <p className="text-2xl font-bold text-foreground">11</p>
          <p className="text-xs text-muted-foreground mt-0.5">+1 this month</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-orange-500" /><p className="text-xs font-medium text-muted-foreground">Client Base</p></div>
          <p className="text-2xl font-bold text-foreground">18</p>
          <p className="text-xs text-emerald-500 mt-0.5">+3 this month</p>
        </CardContent></Card>
      </div>

      {/* Revenue chart (bar chart via divs) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Monthly Revenue (NPR Lakhs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] font-semibold text-foreground">
                  {d.revenue}L
                </span>
                <div
                  className="w-full rounded-t-md bg-violet-500 transition-all hover:bg-violet-600"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                />
                <span className="text-[11px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead & project trend table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Monthly KPI Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Month", "Leads", "Projects", "Revenue"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...monthlyData].reverse().map((d) => (
                  <tr key={d.month} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{d.month} 2026</td>
                    <td className="px-5 py-3 text-muted-foreground">{d.leads}</td>
                    <td className="px-5 py-3 text-muted-foreground">{d.projects}</td>
                    <td className="px-5 py-3 font-semibold text-violet-600">NPR {d.revenue}L</td>
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
