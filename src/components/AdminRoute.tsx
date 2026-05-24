import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

/**
 * Wraps admin-only routes. Renders a 403 page (never the admin UI) when the
 * visitor is not an authenticated admin. RLS on the database is the actual
 * source of truth; this wrapper just makes sure the privileged UI is never
 * mounted client-side for non-admins.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-24 text-center text-sm text-muted-foreground">
        Comprobando permisos…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="container py-24 max-w-md text-center">
        <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">
          403
        </div>
        <h1 className="font-display text-4xl mb-3">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Esta sección solo está disponible para administradores.
        </p>
        <Button asChild>
          <Link to="/">Volver a la tienda</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}