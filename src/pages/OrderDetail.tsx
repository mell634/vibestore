import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/format";
import { CheckCircle2, Package, CreditCard, Truck, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMELINE = [
  { key: "pendiente", label: "Pedido recibido", icon: Package },
  { key: "pagado", label: "Pago verificado", icon: CreditCard },
  { key: "preparacion", label: "En preparación", icon: Package },
  { key: "enviado", label: "Enviado", icon: Truck },
  { key: "entregado", label: "Entregado", icon: Home },
] as const;

export default function OrderDetail() {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const confirmed = params.get("confirmed") === "1";
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: o } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      setOrder(o);
      const { data: its } = await supabase.from("order_items").select("*").eq("order_id", id);
      setItems(its ?? []);
      const { data: p } = await supabase.from("payments").select("*").eq("order_id", id).maybeSingle();
      setPayment(p);
    })();
  }, [id, user]);

  if (loading) return null;
  if (!user) return <div className="container py-32 text-center">Inicia sesión para ver este pedido.</div>;
  if (!order) return <div className="container py-32 text-center">Cargando pedido...</div>;

  const cancelled = order.status === "cancelado";
  const currentIdx = cancelled ? -1 : TIMELINE.findIndex((t) => t.key === order.status);

  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      {confirmed && (
        <div role="status" className="bg-bone border border-border rounded-md p-6 mb-8 flex items-start gap-4 shadow-pop-accent">
          <CheckCircle2 className="size-6 text-accent shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-display text-2xl">¡Pedido confirmado!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {order.payment_method === "transferencia"
                ? "Verificaremos tu comprobante en menos de 24 h y te avisaremos por email."
                : "Te enviaremos la confirmación al email indicado."}
            </p>
          </div>
        </div>
      )}

      <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Pedido</div>
      <h1 className="font-display text-4xl md:text-5xl mb-2 font-mono">{order.order_number}</h1>
      <div className="text-sm text-muted-foreground mb-10">
        {new Date(order.created_at).toLocaleString("en-US")}
      </div>

      {/* Timeline de estado */}
      <section aria-label="Estado del pedido" className="mb-12">
        <h2 className="font-display text-2xl mb-5">Estado</h2>
        {cancelled ? (
          <div className="border border-destructive bg-destructive/5 rounded-md p-5 text-sm">
            Este pedido ha sido <strong>cancelado</strong>.
          </div>
        ) : (
          <ol className="relative">
            {TIMELINE.map((t, idx) => {
              const Icon = t.icon;
              const done = idx <= currentIdx;
              const active = idx === currentIdx;
              return (
                <li key={t.key} className="flex items-start gap-4 pb-6 last:pb-0 relative">
                  {idx < TIMELINE.length - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-[19px] top-10 bottom-0 w-px",
                        idx < currentIdx ? "bg-accent" : "bg-border"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      done ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground",
                      active && "ring-2 ring-offset-2 ring-accent"
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <div className="pt-2">
                    <div className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                      {t.label}
                    </div>
                    {active && (
                      <div className="text-xs text-accent tracking-editorial uppercase mt-0.5">Estado actual</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Artículos</h2>
        <div className="border border-border rounded-md divide-y divide-border">
          {items.map((it) => (
            <div key={it.id} className="flex gap-4 p-4">
              {it.product_image && (
                <div className="w-16 h-20 bg-white shrink-0 rounded-sm overflow-hidden">
                  <img src={it.product_image} alt={it.product_name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium">{it.product_name}</div>
                <div className="text-xs text-muted-foreground">Talla {it.size} · ×{it.quantity}</div>
              </div>
              <div className="text-sm tabular-nums">{formatPrice(Number(it.line_total))}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatPrice(Number(order.subtotal))}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Envío</span><span className="tabular-nums">{formatPrice(Number(order.shipping_cost))}</span></div>
          <div className="flex justify-between font-display text-2xl pt-2 border-t border-border"><span>Total</span><span className="tabular-nums">{formatPrice(Number(order.total))}</span></div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Envío</h3>
          <p className="text-sm">{order.shipping_full_name}</p>
          <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
          <p className="text-sm text-muted-foreground">{order.shipping_city}, {order.shipping_country}</p>
          <p className="text-sm text-muted-foreground mt-1">{order.contact_phone}</p>
        </div>
        <div>
          <h3 className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Pago</h3>
          <p className="text-sm">
            {order.payment_method === "tarjeta" ? "Tarjeta" : "Transferencia bancaria"}
          </p>
          {payment && (
            <p className="text-xs text-muted-foreground mt-1">
              Estado: {payment.status.replace(/_/g, " ")}
            </p>
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/"
          className="text-xs tracking-editorial uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent"
        >
          ← Volver al inicio
        </Link>
        <Link
          to="/cuenta"
          className="text-xs tracking-editorial uppercase border-b border-transparent pb-0.5 text-muted-foreground hover:text-foreground hover:border-foreground"
        >
          Ver mis pedidos
        </Link>
      </div>
    </div>
  );
}
