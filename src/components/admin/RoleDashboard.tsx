import {
  Users,
  FolderKanban,
  Building2,
  TrendingUp,
  GraduationCap,
  Briefcase,
  UserCheck,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_META } from "@/lib/auth";

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}

function StatCard({ title, value, change, positive, icon: Icon, accent = "violet" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p
                className={cn(
                  "mt-1 flex items-center gap-1 text-xs font-medium",
                  positive ? "text-emerald-600" : "text-red-500",
                )}
              >
                <TrendingUp className={cn("h-3 w-3", !positive && "rotate-180")} />
                {change} vs last month
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              `bg-${accent}-100 dark:bg-${accent}-950`,
            )}
          >
            <Icon className={cn("h-5 w-5", `text-${accent}-600`)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Activity item ────────────────────────────────────────────────────────────

interface ActivityItem {
  title: string;
  desc: string;
  time: string;
  type: "success" | "info" | "warning";
}

const activityIcon = {
  success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  info: <Clock className="h-4 w-4 text-blue-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
};

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">{activityIcon[item.type]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Per-role dashboard views ─────────────────────────────────────────────────

function CeoDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Employees" value={24} change="+2" positive icon={Users} accent="violet" />
        <StatCard title="Active Projects" value={11} change="+1" positive icon={FolderKanban} accent="blue" />
        <StatCard title="Active Clients" value={18} change="+3" positive icon={Building2} accent="emerald" />
        <StatCard title="Monthly Revenue" value="NPR 4.2L" change="+12%" positive icon={DollarSign} accent="amber" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Open Job Positions" value={5} icon={Briefcase} accent="rose" />
        <StatCard title="Training Batches" value={3} icon={GraduationCap} accent="teal" />
        <StatCard title="New Contact Leads" value={14} change="+6" positive icon={MessageSquare} accent="indigo" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityFeed
          items={[
            { title: "New client onboarded", desc: "Himalayan Ventures Pvt. Ltd.", time: "1h ago", type: "success" },
            { title: "Project milestone reached", desc: "E-commerce Platform v2.0", time: "3h ago", type: "success" },
            { title: "HR review pending", desc: "Q3 performance appraisals due", time: "1d ago", type: "warning" },
            { title: "New job application", desc: "Senior Developer – Bikram Rai", time: "2d ago", type: "info" },
          ]}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                { role: "Developers", count: 8, accent: "orange" },
                { role: "Trainers", count: 4, accent: "teal" },
                { role: "HR", count: 2, accent: "green" },
                { role: "Managers", count: 3, accent: "blue" },
                { role: "Support", count: 7, accent: "violet" },
              ].map((t) => (
                <li key={t.role} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.role}</span>
                  <Badge variant="secondary" className="font-mono text-xs">{t.count}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Projects" value={11} change="+1" positive icon={FolderKanban} accent="blue" />
        <StatCard title="Active Clients" value={18} change="+3" positive icon={Building2} accent="emerald" />
        <StatCard title="Team Members" value={24} icon={Users} accent="violet" />
        <StatCard title="Contact Leads" value={14} change="+6" positive icon={MessageSquare} accent="indigo" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityFeed
          items={[
            { title: "Project deadline approaching", desc: "Mobile App – 3 days left", time: "Now", type: "warning" },
            { title: "Client feedback received", desc: "Positive review from TechBridge", time: "2h ago", type: "success" },
            { title: "New lead inquiry", desc: "Web platform project inquiry", time: "5h ago", type: "info" },
            { title: "Team meeting scheduled", desc: "Sprint retrospective – Monday", time: "1d ago", type: "info" },
          ]}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { name: "E-commerce Platform", status: "On Track", color: "text-emerald-600 bg-emerald-50" },
                { name: "Mobile Banking App", status: "At Risk", color: "text-amber-600 bg-amber-50" },
                { name: "ERP Integration", status: "On Track", color: "text-emerald-600 bg-emerald-50" },
                { name: "School Portal", status: "Delayed", color: "text-red-600 bg-red-50" },
              ].map((p) => (
                <li key={p.name} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{p.name}</span>
                  <span className={cn("rounded px-2 py-0.5 text-[11px] font-medium", p.color)}>{p.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HrDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Employees" value={24} change="+2" positive icon={Users} accent="violet" />
        <StatCard title="Open Positions" value={5} icon={Briefcase} accent="rose" />
        <StatCard title="Pending Reviews" value={8} icon={UserCheck} accent="amber" />
        <StatCard title="New Applications" value={12} change="+4" positive icon={MessageSquare} accent="blue" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityFeed
          items={[
            { title: "Application received", desc: "Full Stack Developer – Bikram Rai", time: "1h ago", type: "info" },
            { title: "Interview scheduled", desc: "UI Designer – Monday 10 AM", time: "3h ago", type: "success" },
            { title: "Leave request pending", desc: "Priya Shrestha – 3 days", time: "5h ago", type: "warning" },
            { title: "Onboarding complete", desc: "Suman Karki joined today", time: "1d ago", type: "success" },
          ]}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { title: "Senior Developer", dept: "Engineering", apps: 4 },
                { title: "UI/UX Designer", dept: "Design", apps: 7 },
                { title: "IT Trainer", dept: "Training", apps: 2 },
                { title: "Project Manager", dept: "Operations", apps: 3 },
                { title: "Support Engineer", dept: "IT Services", apps: 1 },
              ].map((pos) => (
                <li key={pos.title} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pos.title}</p>
                    <p className="text-xs text-muted-foreground">{pos.dept}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{pos.apps} apps</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DeveloperDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="My Projects" value={4} icon={FolderKanban} accent="blue" />
        <StatCard title="Tasks Due Today" value={3} icon={Clock} accent="amber" />
        <StatCard title="Completed Tasks" value={18} change="+5" positive icon={CheckCircle} accent="emerald" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityFeed
          items={[
            { title: "PR review requested", desc: "Feature/auth-module – review needed", time: "30m ago", type: "info" },
            { title: "Bug fixed", desc: "Payment gateway timeout resolved", time: "2h ago", type: "success" },
            { title: "Deployment scheduled", desc: "v2.3 → staging tonight", time: "3h ago", type: "info" },
            { title: "Code review done", desc: "Merged: feat/dashboard-refactor", time: "1d ago", type: "success" },
          ]}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">My Assigned Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { name: "E-commerce Platform", due: "Oct 15", progress: 72 },
                { name: "Mobile Banking App", due: "Oct 8", progress: 45 },
                { name: "ERP Integration", due: "Nov 1", progress: 30 },
                { name: "School Portal", due: "Oct 20", progress: 88 },
              ].map((p) => (
                <li key={p.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground">Due {p.due}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrainerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Active Batches" value={3} icon={GraduationCap} accent="teal" />
        <StatCard title="Total Students" value={42} change="+8" positive icon={Users} accent="violet" />
        <StatCard title="Courses Running" value={5} icon={Briefcase} accent="blue" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityFeed
          items={[
            { title: "New enrollment", desc: "React.js Bootcamp – 3 students enrolled", time: "1h ago", type: "success" },
            { title: "Exam results ready", desc: "Python Basics – Batch 4", time: "3h ago", type: "info" },
            { title: "Session scheduled", desc: "Node.js Advanced – Thursday 9 AM", time: "5h ago", type: "info" },
            { title: "Certificate issued", desc: "Web Dev Bootcamp – 12 certificates", time: "2d ago", type: "success" },
          ]}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { name: "React.js Bootcamp", students: 15, ends: "Oct 25" },
                { name: "Python Fundamentals", students: 12, ends: "Oct 18" },
                { name: "Node.js Advanced", students: 15, ends: "Nov 10" },
              ].map((b) => (
                <li key={b.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.students} students · ends {b.ends}</p>
                  </div>
                  <Badge className="bg-teal-100 text-teal-700 border-teal-200 text-[11px]">Active</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const roleMeta = ROLE_META[user.role];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 dark:border-violet-900 dark:from-violet-950 dark:to-indigo-950 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Good day, {user.name.split(" ")[0]} 👋
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Here's your {roleMeta.label} overview for today.
            </p>
          </div>
          <span
            className={cn(
              "hidden sm:inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold",
              roleMeta.badge,
            )}
          >
            {roleMeta.label}
          </span>
        </div>
      </div>

      {/* Role-specific content */}
      {user.role === "ceo" && <CeoDashboard />}
      {user.role === "manager" && <ManagerDashboard />}
      {user.role === "hr" && <HrDashboard />}
      {user.role === "developer" && <DeveloperDashboard />}
      {user.role === "trainer" && <TrainerDashboard />}
    </div>
  );
}
