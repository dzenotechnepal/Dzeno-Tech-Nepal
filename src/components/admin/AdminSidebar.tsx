import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  GraduationCap,
  Settings,
  BarChart3,
  MessageSquare,
  FolderKanban,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_META, type Permission } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  permission: Permission;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    permission: "view:dashboard",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    permission: "view:analytics",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "/admin/projects",
    permission: "view:projects",
  },
  {
    label: "Clients",
    icon: Building2,
    href: "/admin/clients",
    permission: "view:clients",
  },
  {
    label: "Human Resources",
    icon: UserCheck,
    href: "/admin/hr",
    permission: "view:hr",
  },
  {
    label: "Careers",
    icon: Briefcase,
    href: "/admin/careers",
    permission: "view:careers",
  },
  {
    label: "Training",
    icon: GraduationCap,
    href: "/admin/training",
    permission: "view:training",
  },
  {
    label: "Contacts",
    icon: MessageSquare,
    href: "/admin/contacts",
    permission: "view:contacts",
  },
  {
    label: "User Management",
    icon: Users,
    href: "/admin/users",
    permission: "view:users",
  },
  {
    label: "Roles & Access",
    icon: ShieldCheck,
    href: "/admin/roles",
    permission: "view:roles",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    permission: "view:settings",
  },
];

export function AdminSidebar() {
  const { user, logout, can } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (!user) return null;

  const roleMeta = ROLE_META[user.role];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const visibleNavItems = NAV_ITEMS.filter((item) => can(item.permission));

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
          <span className="text-sm font-bold">DT</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Dzeno Tech</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {visibleNavItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? currentPath === "/admin"
                : currentPath.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-violet-600"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-violet-400" />
                  )}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* User profile footer */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              {user.name}
            </p>
            <span
              className={cn(
                "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium",
                roleMeta.badge,
              )}
            >
              {roleMeta.label}
            </span>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
