import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, Lock, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { isOpen, setOpen, items, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToAuth = (tab: "signin" | "signup") => {
    setOpen(false);
    navigate(`/auth?redirect=/checkout&tab=${tab}`);
  };

  const goCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        className="w-full sm:max-w-md flex flex-col p-0"
        aria-label="Carrito de compras"
      >
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-display text-2xl text-left">Tu bolsa</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" role="status">
            <p className="font-display text-2xl mb-2">Tu bolsa está vacía</p>
            <p className="text-sm text-muted-foreground mb-6">Empieza a explorar la selección editorial.</p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link to="/categoria/mujer">Descubrir</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-border list-none p-0 m-0" aria-label="Productos en tu bolsa">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 p-6">
                  <Link
                    to={`/producto/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="shrink-0 w-20 h-28 bg-white overflow-hidden rounded-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={`Ver detalles de ${item.name}`}
                  >
                    <img
                      src={item.image}
                      alt={`Imagen de ${item.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link
                        to={`/producto/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-display text-lg leading-tight line-clamp-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
                        aria-label={`Quitar ${item.name} del carrito`}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs tracking-editorial uppercase text-muted-foreground mt-1">
                      Talla {item.size}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-border rounded-sm" role="group" aria-label={`Cantidad de ${item.name}`}>
                        <button
                          className="p-1.5 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label={`Reducir cantidad de ${item.name}`}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="size-3" aria-hidden="true" />
                        </button>
                        <span className="px-3 text-sm tabular-nums" aria-live="polite" aria-label={`Cantidad: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          className="p-1.5 hover:bg-muted disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          <Plus className="size-3" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="text-sm tabular-nums" aria-label={`Subtotal de ${item.name}: ${formatPrice(item.price * item.quantity)}`}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between font-display text-xl">
                <span>Subtotal</span>
                <span className="tabular-nums" aria-label={`Subtotal: ${formatPrice(subtotal)}`}>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Envío e impuestos calculados al finalizar.</p>
              {user ? (
                <Button className="w-full h-12 focus:ring-2 focus:ring-ring focus:ring-offset-2" onClick={goCheckout}>
                  Ir al checkout
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 bg-bone p-3 text-xs text-muted-foreground rounded-md" role="note">
                    <Lock className="size-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Necesitas una cuenta para finalizar tu compra. Elige una opción:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-12 gap-2 focus:ring-2 focus:ring-ring" onClick={() => goToAuth("signin")}>
                      <LogIn className="size-4" aria-hidden="true" /> Iniciar sesión
                    </Button>
                    <Button className="h-12 gap-2 focus:ring-2 focus:ring-ring" onClick={() => goToAuth("signup")}>
                      <UserPlus className="size-4" aria-hidden="true" /> Crear cuenta
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
