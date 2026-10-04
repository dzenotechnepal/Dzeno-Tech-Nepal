import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Plus, ShieldAlert, Globe, Phone } from "lucide-react";

export const Route = createFileRoute("/admin/clients")({
  component: ClientsPage,
});

const MOCK_CLIENTS = [
  { id: "1", name: "RetailCo Nepal", industry: "Retail", contact: "+977-1-4412345", website: "retailco.com.np", projects: 2, status: "Active" },
  { id: "2", name: "Himalayan Bank Ltd.", industry: "Finance", contact: "+977-1-4512222", website: "himalayandbank.com", projects: 1, status: "Active" },
  { id: "3", name: "TechBridge Pvt. Ltd.", industry: "Technology", contact: "+977-1-4223344", website: "techbridge.np", projects: 1, status: "Active" },
  { id: "4", name: "Everest Academy", industry: "Education", contact: "+977-1-4445566", website: "everestacademy.edu.np", projects: 1, status: "Active" },
  { id: "5", name: "Global Staffing Nepal", industry: "HR Services", contact: "+977-1-4778899", website: "globalstaffingnepal.com", projects: 1, status: "Inactive" },
];

function ClientsPage() {
  return (
          <AdminLayout title="Clients" description="Manage client relationships">
        <ClientsContent />
      </AdminLayout>
  );
}

function ClientsContent() {
  const { can } = useAuth();
  if (!can("view:clients")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view clients.</p>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        {can("manage:clients") && (
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CLIENTS.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-violet-500 shrink-0" />
                  <CardTitle className="text-sm font-semibold">{c.name}</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={c.status === "Active" ? "text-emerald-600 border-emerald-200 bg-emerald-50 text-[11px]" : "text-muted-foreground text-[11px]"}
                >
                  {c.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary" className="text-[11px]">{c.industry}</Badge>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {c.contact}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                {c.website}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{c.projects}</span> active project{c.projects !== 1 && "s"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
