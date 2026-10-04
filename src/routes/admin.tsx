import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Guard component that redirects unauthenticated users to login
// (but allows the login page itself to pass through)
function AdminGuard() {
  const { user, isLoading } = useAuth();
  const routerState = useRouterState();
  const isLoginPage = routerState.location.pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      window.location.href = "/admin/login";
    }
  }, [user, isLoading, isLoginPage]);

  if (isLoading && !isLoginPage) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user && !isLoginPage) return null;

  return <Outlet />;
}

export const Route = createFileRoute("/admin")({
  component: AdminRoot,
});

function AdminRoot() {
  return (
    <AuthProvider>
      <AdminGuard />
    </AuthProvider>
  );
}
