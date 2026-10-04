import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_META, getRolePermissions, type Role } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/roles")({
  component: RolesPage,
});

function RolesPage() {
  return (
          <AdminLayout
        title="Roles & Access Control"
        description="View permission matrix for each role"
      >
        <RolesContent />
      </AdminLayout>
  );
}

const ALL_PERMISSIONS_GROUPS: {
  group: string;
  permissions: Array<{ key: string; label: string }>;
}[] = [
  {
    group: "Dashboard & Analytics",
    permissions: [
      { key: "view:dashboard", label: "View Dashboard" },
      { key: "view:analytics", label: "View Analytics" },
      { key: "view:reports", label: "View Reports" },
    ],
  },
  {
    group: "Projects & Clients",
    permissions: [
      { key: "view:projects", label: "View Projects" },
      { key: "manage:projects", label: "Manage Projects" },
      { key: "view:clients", label: "View Clients" },
      { key: "manage:clients", label: "Manage Clients" },
    ],
  },
  {
    group: "People & HR",
    permissions: [
      { key: "view:users", label: "View Users" },
      { key: "manage:users", label: "Manage Users" },
      { key: "view:roles", label: "View Roles" },
      { key: "manage:roles", label: "Manage Roles" },
      { key: "view:hr", label: "View HR" },
      { key: "manage:hr", label: "Manage HR" },
    ],
  },
  {
    group: "Careers & Training",
    permissions: [
      { key: "view:careers", label: "View Careers" },
      { key: "manage:careers", label: "Manage Careers" },
      { key: "view:training", label: "View Training" },
      { key: "manage:training", label: "Manage Training" },
    ],
  },
  {
    group: "Contacts & Settings",
    permissions: [
      { key: "view:contacts", label: "View Contacts" },
      { key: "manage:contacts", label: "Manage Contacts" },
      { key: "view:settings", label: "View Settings" },
      { key: "manage:settings", label: "Manage Settings" },
    ],
  },
];

const ROLES: Role[] = ["ceo", "manager", "hr", "developer", "trainer"];

function RolesContent() {
  const { can } = useAuth();

  if (!can("view:roles")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You don't have permission to view role settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {ROLES.map((role) => {
          const meta = ROLE_META[role];
          const perms = getRolePermissions(role);
          return (
            <Card key={role} className="relative overflow-hidden">
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-1 rounded-t-xl",
                  role === "ceo"
                    ? "bg-purple-500"
                    : role === "manager"
                      ? "bg-blue-500"
                      : role === "hr"
                        ? "bg-green-500"
                        : role === "developer"
                          ? "bg-orange-500"
                          : "bg-teal-500",
                )}
              />
              <CardHeader className="pb-2 pt-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={cn(
                      "h-4 w-4",
                      role === "ceo"
                        ? "text-purple-600"
                        : role === "manager"
                          ? "text-blue-600"
                          : role === "hr"
                            ? "text-green-600"
                            : role === "developer"
                              ? "text-orange-600"
                              : "text-teal-600",
                    )}
                  />
                  <CardTitle className="text-sm font-semibold">
                    {meta.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{perms.length}</p>
                <p className="text-xs text-muted-foreground">permissions granted</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permission matrix */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide min-w-[200px]">
                    Permission
                  </th>
                  {ROLES.map((role) => (
                    <th
                      key={role}
                      className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      <span
                        className={cn(
                          "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold",
                          ROLE_META[role].badge,
                        )}
                      >
                        {role.toUpperCase()}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMISSIONS_GROUPS.map((group) => (
                  <>
                    <tr
                      key={group.group}
                      className="bg-muted/30 border-y border-border"
                    >
                      <td
                        colSpan={ROLES.length + 1}
                        className="px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide"
                      >
                        {group.group}
                      </td>
                    </tr>
                    {group.permissions.map((perm) => (
                      <tr
                        key={perm.key}
                        className="border-b border-border hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-5 py-2.5 text-sm text-foreground">
                          {perm.label}
                        </td>
                        {ROLES.map((role) => {
                          const hasIt = getRolePermissions(role).includes(
                            perm.key as any,
                          );
                          return (
                            <td
                              key={role}
                              className="px-4 py-2.5 text-center"
                            >
                              {hasIt ? (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              ) : (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mx-auto">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
