import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { Eye, CheckCircle2, XCircle } from "lucide-react";

const STATUSES = ["pendiente", "pagado", "preparacion", "enviado", "entregado", "cancelado"] as const;

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pendingPayments: 0, revenue: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/", { replace: true });
  }, [user, isAdmin, loading, navigate]);

  const load = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, payments(*)")
      .order("created_at", { ascending: false });
    const list = (data ?? []).map((o: any) => ({
      ...o,
      total: Number(o.total),
    }));
    setOrders(list);
    const pendingPayments = list.filter((o: any) =>
      o.payments?.some((p: any) => p.status === "pendiente_verificacion")
    ).length;
    const revenue = list
      .filter((o: any) => ["pagado", "preparacion", "enviado", "entregado"].includes(o.status))
      .reduce((s: number, o: any) => s + Number(o.total), 0);
    setStats({ total: list.length, pendingPayments, revenue });
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", orderId);
    if (error) {
      toast.error("No se pudo actualizar");
      return;
    }
    toast.success("Estado actualizado");
    load();
  };

  const verifyPayment = async (paymentId: string, status: "verificado" | "rechazado", orderId: string) => {
    const { error } = await supabase
      .from("payments")
      .update({
        status,
        verified_at: new Date().toISOString(),
        verified_by: user!.id,
      })
      .eq("id", paymentId);
    if (error) {
      toast.error("No se pudo verificar el pago");
      return;
    }
    if (status === "verificado") {
      await supabase.from("orders").update({ status: "pagado" }).eq("id", orderId);
    }
    toast.success(status === "verificado" ? "Pago verificado" : "Pago rechazado");
    load();
  };

  const viewProof = async (proofUrl: string) => {
    const { data, error } = await supabase.storage.from("payment-proofs").createSignedUrl(proofUrl, 60);
    if (error || !data) {
      toast.error("No se pudo abrir el comprobante");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="container py-12 md:py-16">
      <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Panel</div>
      <h1 className="font-display text-4xl md:text-5xl mb-10">Administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="border border-border p-6">
          <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Pedidos totales</div>
          <div className="font-display text-4xl tabular-nums">{stats.total}</div>
        </div>
        <div className="border border-border p-6">
          <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Pagos por verificar</div>
          <div className="font-display text-4xl tabular-nums text-accent">{stats.pendingPayments}</div>
        </div>
        <div className="border border-border p-6">
          <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Ingresos confirmados</div>
          <div className="font-display text-4xl tabular-nums">{formatPrice(stats.revenue)}</div>
        </div>
      </div>

      <h2 className="font-display text-2xl mb-4">Pedidos</h2>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bone">
            <tr className="text-left">
              <th className="p-3 text-[10px] tracking-editorial uppercase">Pedido</th>
              <th className="p-3 text-[10px] tracking-editorial uppercase">Fecha</th>
              <th className="p-3 text-[10px] tracking-editorial uppercase">Cliente</th>
              <th className="p-3 text-[10px] tracking-editorial uppercase">Total</th>
              <th className="p-3 text-[10px] tracking-editorial uppercase">Pago</th>
              <th className="p-3 text-[10px] tracking-editorial uppercase">Estado</th>
              <th className="p-3 text-[10px] tracking-editorial uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Aún no hay pedidos.</td></tr>
            ) : (
              orders.map((o) => {
                const payment = o.payments?.[0];
                return (
                  <tr key={o.id} className="hover:bg-bone/50">
                    <td className="p-3 font-mono text-xs">
                      <Link to={`/pedido/${o.id}`} className="hover:text-accent">{o.order_number}</Link>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="p-3 text-xs">
                      <div>{o.shipping_full_name}</div>
                      <div className="text-muted-foreground">{o.contact_email}</div>
                    </td>
                    <td className="p-3 tabular-nums">{formatPrice(o.total)}</td>
                    <td className="p-3 text-xs">
                      <div className="capitalize">{o.payment_method}</div>
                      {payment && (
                        <div className={`text-[10px] uppercase tracking-editorial ${
                          payment.status === "verificado" ? "text-accent" :
                          payment.status === "rechazado" ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          {payment.status.replace(/_/g, " ")}
                        </div>
                      )}
                      {payment?.proof_url && (
                        <button onClick={() => viewProof(payment.proof_url)} className="inline-flex items-center gap-1 text-[10px] mt-1 text-accent hover:underline">
                          <Eye className="size-3" /> Ver comprobante
                        </button>
                      )}
                      {payment?.status === "pendiente_verificacion" && o.payment_method === "transferencia" && (
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => verifyPayment(payment.id, "verificado", o.id)}
                            className="text-[10px] text-accent flex items-center gap-0.5 hover:underline"
                          >
                            <CheckCircle2 className="size-3" /> Aprobar
                          </button>
                          <button
                            onClick={() => verifyPayment(payment.id, "rechazado", o.id)}
                            className="text-[10px] text-destructive flex items-center gap-0.5 hover:underline"
                          >
                            <XCircle className="size-3" /> Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="text-xs border border-border bg-background px-2 py-1"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/pedido/${o.id}`}>Ver</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Para gestionar el catálogo (productos, stock, imágenes), avísame y construimos esa sección con un editor visual.
      </p>
    </div>
  );
}
