import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockDb } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { CreditCard, Check, ChevronLeft, AlertCircle, Lock, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

const SHIPPING = 6.95;

const shippingSchema = z.object({
  fullName: z.string().trim().min(2, "Escribe tu nombre completo").max(100),
  email: z.string().trim().email("Revisa el formato del email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"),
  address: z.string().trim().min(5, "Indica una dirección válida").max(255),
  city: z.string().trim().min(2, "Indica la ciudad").max(100),
  country: z.string().trim().min(2, "Indica el país").max(100),
  notes: z.string().max(500).optional(),
});
type ShippingData = z.infer<typeof shippingSchema>;

const cardSchema = z.object({
  number: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{13,19}$/, "Número de tarjeta inválido")),
  holder: z.string().trim().min(2, "Escribe el nombre del titular").max(100),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
});
type CardData = { number: string; holder: string; expiry: string; cvv: string };

function detectBrand(num: string): string {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(?:011|5)/.test(n)) return "Discover";
  return "Card";
}

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

type Step = 1 | 2 | 3;
const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Envío" },
  { n: 2, label: "Pago" },
  { n: 3, label: "Éxito" },
];

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="size-3" aria-hidden /> {msg}
    </p>
  );
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState<ShippingData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Colombia",
    notes: "",
  });
  const [shipErrors, setShipErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const [card, setCard] = useState<CardData>({ number: "", holder: "", expiry: "", cvv: "" });
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardData, string>>>({});

  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState<string>("");
  const [paidTotal, setPaidTotal] = useState<number>(0);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/checkout", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setShipping((s) => ({
        ...s,
        fullName: s.fullName || (user.user_metadata?.full_name ?? ""),
        email: s.email || (user.email ?? ""),
      }));
    }
  }, [user]);

  const total = useMemo(
    () => subtotal + (items.length > 0 ? SHIPPING : 0),
    [subtotal, items.length]
  );

  if (loading || !user) return null;

  // Permite ver el paso 3 de éxito incluso con carrito vacío
  if (items.length === 0 && step !== 3) {
    return (
      <div className="container py-32 text-center">
        <p className="font-display text-3xl mb-4">Tu bolsa está vacía</p>
        <Button onClick={() => navigate("/")}>Volver a la tienda</Button>
      </div>
    );
  }

  const validateShipping = (): boolean => {
    const r = shippingSchema.safeParse(shipping);
    if (r.success) {
      setShipErrors({});
      return true;
    }
    const errs: Partial<Record<keyof ShippingData, string>> = {};
    r.error.issues.forEach((i) => {
      const k = i.path[0] as keyof ShippingData;
      if (!errs[k]) errs[k] = i.message;
    });
    setShipErrors(errs);
    toast.error("Revisa los campos resaltados en rojo");
    return false;
  };

  const validateCard = (): boolean => {
    const r = cardSchema.safeParse(card);
    if (!r.success) {
      const errs: Partial<Record<keyof CardData, string>> = {};
      r.error.issues.forEach((i) => {
        const k = i.path[0] as keyof CardData;
        if (!errs[k]) errs[k] = i.message;
      });
      setCardErrors(errs);
      toast.error("Revisa los datos de la tarjeta");
      return false;
    }
    setCardErrors({});
    return true;
  };

  const goNext = () => {
    if (step === 1) {
      if (!validateShipping()) return;
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePay = async () => {
    if (!validateShipping()) {
      setStep(1);
      return;
    }
    if (!validateCard()) return;

    // Verificar stock en la base de datos simulada
    const cartItems = items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
    }));
    const productoSinStock = cartItems.find(item => item.quantity > item.maxStock);
    if (productoSinStock) {
      toast.error(`Sin stock suficiente para "${productoSinStock.name}"`);
      return;
    }

    setSubmitting(true);
    try {
      // Simula procesamiento de pasarela
      await new Promise((r) => setTimeout(r, 1200));

      // Restar 1 unidad por cada item (qty en carrito)
      mockDb.decrementStock(cartItems);

      const digits = card.number.replace(/\D/g, "");
      const ref = `VS-${Date.now().toString(36).toUpperCase()}`;
      setOrderRef(ref);
      setPaidTotal(total);

      toast.success(`¡Pago aprobado con ${detectBrand(digits)} ****${digits.slice(-4)}!`);
      clear();
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      toast.error("No se pudo procesar tu pago.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (hasErr?: string) =>
    cn(
      "h-12 mt-1",
      hasErr && "border-destructive focus-visible:ring-destructive bg-destructive/5"
    );

  return (
    <div className="container py-10 md:py-16 max-w-6xl">
      <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Checkout</div>
      <h1 className="font-display text-4xl md:text-5xl mb-8">Finalizar pedido</h1>

      <nav aria-label="Pasos del checkout" className="mb-10">
        <ol className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, idx) => {
            const done = step > s.n;
            const active = step === s.n;
            return (
              <li key={s.n} className="flex-1 flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "size-8 sm:size-9 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-colors",
                      done && "bg-accent text-accent-foreground",
                      active && "bg-foreground text-background ring-2 ring-offset-2 ring-foreground",
                      !done && !active && "bg-secondary text-muted-foreground"
                    )}
                  >
                    {done ? <Check className="size-4" aria-hidden /> : s.n}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] sm:text-xs tracking-editorial uppercase truncate",
                      active || done ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-px", done ? "bg-accent" : "bg-border")} aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={cn("grid grid-cols-1 gap-10 lg:gap-12", step !== 3 && "lg:grid-cols-3")}>
        <div className={cn("space-y-8", step !== 3 && "lg:col-span-2")}>
          {/* PASO 1: ENVÍO */}
          {step === 1 && (
            <section aria-labelledby="step-shipping">
              <h2 id="step-shipping" className="font-display text-2xl mb-5">Datos de envío</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input id="fullName" value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    aria-invalid={!!shipErrors.fullName}
                    className={inputCls(shipErrors.fullName)} />
                  <FieldError msg={shipErrors.fullName} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    aria-invalid={!!shipErrors.email}
                    className={inputCls(shipErrors.email)} />
                  <FieldError msg={shipErrors.email} />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" inputMode="numeric" maxLength={10} placeholder="3001234567"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    aria-invalid={!!shipErrors.phone}
                    className={inputCls(shipErrors.phone)} />
                  <FieldError msg={shipErrors.phone} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    aria-invalid={!!shipErrors.address}
                    className={inputCls(shipErrors.address)} />
                  <FieldError msg={shipErrors.address} />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    aria-invalid={!!shipErrors.city}
                    className={inputCls(shipErrors.city)} />
                  <FieldError msg={shipErrors.city} />
                </div>
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input id="country" value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    aria-invalid={!!shipErrors.country}
                    className={inputCls(shipErrors.country)} />
                  <FieldError msg={shipErrors.country} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Textarea id="notes" value={shipping.notes}
                    onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                    className="mt-1" rows={2} />
                </div>
              </div>
            </section>
          )}

          {/* PASO 2: PAGO con tarjeta */}
          {step === 2 && (
            <section aria-labelledby="step-payment">
              <h2 id="step-payment" className="font-display text-2xl mb-5">Pago con tarjeta</h2>

              {/* Tarjeta visual */}
              <div className="relative bg-gradient-to-br from-foreground to-foreground/80 text-background rounded-xl p-6 shadow-pop mb-6 overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <CreditCard className="size-7" />
                  <span className="text-xs tracking-editorial uppercase opacity-80">
                    {card.number ? detectBrand(card.number.replace(/\D/g, "")) : "Tarjeta"}
                  </span>
                </div>
                <div className="font-mono text-xl tracking-widest mb-6">
                  {card.number || "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <div>
                    <div className="opacity-60 mb-1">Titular</div>
                    <div className="font-medium">{card.holder || "Nombre Apellido"}</div>
                  </div>
                  <div>
                    <div className="opacity-60 mb-1">Vence</div>
                    <div className="font-medium">{card.expiry || "MM/AA"}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input id="card-number" inputMode="numeric" placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    aria-invalid={!!cardErrors.number}
                    className={inputCls(cardErrors.number)} />
                  <FieldError msg={cardErrors.number} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="card-holder">Nombre del titular</Label>
                  <Input id="card-holder" placeholder="Como aparece en la tarjeta"
                    value={card.holder}
                    onChange={(e) => setCard({ ...card, holder: e.target.value.toUpperCase() })}
                    aria-invalid={!!cardErrors.holder}
                    className={inputCls(cardErrors.holder)} />
                  <FieldError msg={cardErrors.holder} />
                </div>
                <div>
                  <Label htmlFor="card-expiry">Fecha de vencimiento</Label>
                  <Input id="card-expiry" placeholder="MM/AA" inputMode="numeric" maxLength={5}
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    aria-invalid={!!cardErrors.expiry}
                    className={inputCls(cardErrors.expiry)} />
                  <FieldError msg={cardErrors.expiry} />
                </div>
                <div>
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input id="card-cvv" type="password" inputMode="numeric" maxLength={4} placeholder="123"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    aria-invalid={!!cardErrors.cvv}
                    className={inputCls(cardErrors.cvv)} />
                  <FieldError msg={cardErrors.cvv} />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground bg-bone p-3 rounded-md">
                <Lock className="size-3.5 mt-0.5 shrink-0" />
                <span>Pasarela de demostración. Puedes ingresar datos ficticios para simular la transacción.</span>
              </div>
            </section>
          )}

          {/* PASO 3: ÉXITO */}
          {step === 3 && (
            <section aria-labelledby="step-success" className="text-center py-10">
              <div className="inline-flex items-center justify-center size-20 rounded-full bg-accent text-accent-foreground mb-6 shadow-pop-accent">
                <PartyPopper className="size-10" />
              </div>
              <h2 id="step-success" className="font-display text-4xl md:text-5xl mb-3">
                ¡Pago aprobado!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Tu pedido fue confirmado y el stock se actualizó. Te enviaremos un correo con el detalle de tu compra.
              </p>
              <div className="inline-block border border-border rounded-md px-6 py-4 text-left text-sm mb-8">
                <div className="text-[10px] tracking-editorial uppercase text-muted-foreground">Referencia</div>
                <div className="font-mono text-lg">{orderRef}</div>
                <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mt-3">Total pagado</div>
                <div className="tabular-nums text-lg font-medium">{formatPrice(paidTotal)}</div>
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                <Button onClick={() => navigate("/")} className="h-12 px-6 text-xs tracking-editorial uppercase">
                  Seguir comprando
                </Button>
                <Button variant="outline" onClick={() => navigate("/cuenta")} className="h-12 px-6 text-xs tracking-editorial uppercase">
                  Ir a mi cuenta
                </Button>
              </div>
            </section>
          )}

          {/* Navegación */}
          {step !== 3 && (
            <div className="flex items-center justify-between gap-3 pt-4">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={goBack} className="gap-2">
                  <ChevronLeft className="size-4" /> Atrás
                </Button>
              ) : <div />}
              {step === 1 ? (
                <Button type="button" onClick={goNext} className="h-12 px-8 text-xs tracking-editorial uppercase">
                  Continuar
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handlePay}
                  disabled={submitting}
                  className="h-12 px-8 text-xs tracking-editorial uppercase shadow-pop-accent"
                >
                  {submitting ? "Procesando pago..." : `Confirmar pago · ${formatPrice(total)}`}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Resumen lateral */}
        {step !== 3 && (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border rounded-md p-6 space-y-5 bg-card">
              <h2 className="font-display text-2xl">Resumen</h2>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {items.map((it) => (
                  <div key={it.variantId} className="flex gap-3 text-sm">
                    <div className="w-12 h-16 bg-bone shrink-0 rounded-sm overflow-hidden">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="line-clamp-1">{it.name}</div>
                      <div className="text-xs text-muted-foreground">×{it.quantity}</div>
                    </div>
                    <div className="text-sm tabular-nums">{formatPrice(it.price * it.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="tabular-nums">{formatPrice(SHIPPING)}</span>
                </div>
                <div className="flex justify-between font-display text-2xl pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
