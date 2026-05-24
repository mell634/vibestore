import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  payment_method: string;
}

export default function Account() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id, order_number, status, total, created_at, payment_method")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []).map((o: any) => ({ ...o, total: Number(o.total) }))));
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (loading || !user) return null;

  return (
    <div className="container py-12 md:py-20 max-w-4xl">
      <div className="flex justify-between items-end mb-12 border-b border-border pb-8">
        <div>
          <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">
            Tu cuenta
          </div>
          <h1 className="font-display text-4xl md:text-5xl">
            Hola{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>Cerrar sesión</Button>
      </div>

      <h2 className="font-display text-2xl mb-4">Tus pedidos</h2>
      {orders.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">Aún no has hecho ningún pedido.</p>
          <Button asChild>
            <Link to="/categoria/mujer-ropa">Empezar a comprar</Link>
          </Button>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {orders.map((o) => (
            <Link
              to={`/pedido/${o.id}`}
              key={o.id}
              className="flex justify-between items-center p-5 hover:bg-bone transition-colors"
            >
              <div>
                <div className="font-mono text-sm">{o.order_number}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(o.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  {" · "}
                  {o.payment_method === "tarjeta" ? "Tarjeta" : "Transferencia"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs tracking-editorial uppercase text-accent">{o.status}</div>
                <div className="text-sm tabular-nums mt-1">{formatPrice(o.total)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
