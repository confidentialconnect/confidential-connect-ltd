import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface RequireAdminProps {
  children: ReactNode;
}

/**
 * Route guard for admin-only pages.
 *
 * Renders a loading state until auth has resolved, then either redirects
 * unauthenticated/non-admin users to /auth or renders the protected children.
 *
 * Because this guard wraps the page component instead of living inside it,
 * the protected page's hooks (useEffect, useState) never mount until the
 * user is confirmed as an admin — which avoids the temporal-dead-zone class
 * of bug where an effect fires before later `const fn = ...` declarations
 * are initialized.
 */
export const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;