import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, Save, Building2, Mail, Phone, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
          <AdminLayout title="Settings" description="Manage system and company settings">
        <SettingsContent />
      </AdminLayout>
  );
}

function SettingsContent() {
  const { can } = useAuth();
  if (!can("view:settings")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">Settings are restricted to administrators.</p>
      </div>
    );
  }

  const readOnly = !can("manage:settings");

  return (
    <div className="space-y-6 max-w-2xl">
      {readOnly && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          You have read-only access to settings. Contact the CEO to make changes.
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-violet-500" />
            <CardTitle className="text-sm font-semibold">Company Information</CardTitle>
          </div>
          <CardDescription className="text-xs">Basic details about Dzeno Tech Nepal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Company Name</Label>
              <Input defaultValue="Dzeno Tech Nepal Pvt. Ltd." readOnly={readOnly} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Registration No.</Label>
              <Input defaultValue="PVT-2022-XXXX" readOnly={readOnly} className="text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Address</Label>
            <Input defaultValue="Putalisadak, Kathmandu, Nepal" readOnly={readOnly} className="text-sm" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
              <Input defaultValue="info@dzenotechnepal.com" readOnly={readOnly} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</Label>
              <Input defaultValue="+977-1-4XXXXXX" readOnly={readOnly} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1"><Globe className="h-3 w-3" /> Website</Label>
              <Input defaultValue="dzenotechnepal.com" readOnly={readOnly} className="text-sm" />
            </div>
          </div>
          {!readOnly && (
            <div className="pt-2 flex justify-end">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Admin Portal</CardTitle>
          <CardDescription className="text-xs">System settings for the admin panel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Session Timeout (minutes)</Label>
              <Input defaultValue="60" type="number" readOnly={readOnly} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Max Login Attempts</Label>
              <Input defaultValue="5" type="number" readOnly={readOnly} className="text-sm" />
            </div>
          </div>
          {!readOnly && (
            <div className="pt-2 flex justify-end">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
