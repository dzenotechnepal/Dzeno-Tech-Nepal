import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ShieldAlert, Mail, Phone, Clock, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/contacts")({
  component: ContactsPage,
});

const MOCK_CONTACTS = [
  { id: "1", name: "Ram Sharma", email: "ram@example.com", phone: "+977-9841000001", subject: "Web Development Inquiry", date: "Oct 3, 2026", status: "New" },
  { id: "2", name: "Sita Adhikari", email: "sita@example.com", phone: "+977-9841000002", subject: "IT Training Enrollment", date: "Oct 2, 2026", status: "Replied" },
  { id: "3", name: "Hari Poudel", email: "hari@example.com", phone: "+977-9841000003", subject: "IT Support Services", date: "Oct 1, 2026", status: "New" },
  { id: "4", name: "Gita Tamang", email: "gita@example.com", phone: "+977-9841000004", subject: "Custom Software Quote", date: "Sep 30, 2026", status: "Replied" },
  { id: "5", name: "Mohan KC", email: "mohan@example.com", phone: "+977-9841000005", subject: "Partnership Inquiry", date: "Sep 28, 2026", status: "New" },
];

function ContactsPage() {
  return (
          <AdminLayout title="Contact Leads" description="Manage incoming inquiries and leads">
        <ContactsContent />
      </AdminLayout>
  );
}

function ContactsContent() {
  const { can } = useAuth();
  if (!can("view:contacts")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view contacts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">New Leads</p><p className="text-2xl font-bold">{MOCK_CONTACTS.filter(c => c.status === "New").length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Total This Month</p><p className="text-2xl font-bold">{MOCK_CONTACTS.length}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">All Inquiries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                  {can("manage:contacts") && (
                    <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_CONTACTS.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" />{c.email}</span>
                        <span className="text-xs flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{c.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{c.subject}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{c.date}
                    </td>
                    <td className="px-5 py-3">
                      {c.status === "New" ? (
                        <Badge variant="outline" className="text-[11px] text-violet-600 border-violet-200 bg-violet-50">New</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-200 bg-emerald-50 gap-1">
                          <CheckCircle className="h-2.5 w-2.5" />Replied
                        </Badge>
                      )}
                    </td>
                    {can("manage:contacts") && (
                      <td className="px-5 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">Reply</Button>
                      </td>
                    )}
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
