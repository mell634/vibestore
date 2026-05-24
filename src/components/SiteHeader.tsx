import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search as SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Mujer", to: "/categoria/mujer" },
  { label: "Hombre", to: "/categoria/hombre" },
];

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/buscar?q=${encodeURIComponent(q)}`);
  };

  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-background border-b border-transparent"
      )}
    >
      <div className="container flex items-center gap-3 md:gap-6 h-16 md:h-20">
        {/* Menú móvil + logo */}
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú de navegación"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
          <Link
            to="/"
            className="font-display text-2xl md:text-3xl tracking-tight focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
            aria-label="VibeStore — Inicio"
          >
            VibeStore
          </Link>
        </div>

        {/* Nav principal desktop */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-xs tracking-editorial uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "text-xs tracking-editorial uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Buscador */}
        <form
          onSubmit={onSubmit}
          role="search"
          className="hidden md:flex items-center flex-1 max-w-xs border border-border rounded-full px-3 py-1.5 gap-2 bg-muted/40 focus-within:ring-2 focus-within:ring-ring"
        >
          <label htmlFor="search-input" className="sr-only">Buscar productos</label>
          <SearchIcon className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="bg-transparent text-xs w-full outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
        </form>

        {/* Iconos derecha */}
        <div className="ml-auto flex items-center gap-1">
          <Link
            to={user ? "/cuenta" : "/auth"}
            className="p-2 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={user ? "Ir a mi cuenta" : "Iniciar sesión"}
          >
            <User className="size-5" aria-hidden="true" />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={count > 0 ? `Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}` : "Abrir carrito vacío"}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums"
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <nav
        id="mobile-nav"
        aria-label="Menú móvil"
        aria-hidden={!mobileOpen}
        className={cn(
          "md:hidden border-t border-border bg-background overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-screen py-4" : "max-h-0"
        )}
      >
        <div className="container space-y-1">
          {/* Buscador móvil */}
          <form
            onSubmit={onSubmit}
            role="search"
            className="flex items-center border border-border rounded-full px-3 py-2 gap-2 bg-muted/40 mb-4 focus-within:ring-2 focus-within:ring-ring"
          >
            <label htmlFor="search-mobile" className="sr-only">Buscar productos</label>
            <SearchIcon className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            <input
              id="search-mobile"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground"
              autoComplete="off"
            />
          </form>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "block px-2 py-3 text-sm tracking-editorial uppercase transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
                  isActive ? "text-foreground font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "block px-2 py-3 text-sm tracking-editorial uppercase transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
                  isActive ? "text-foreground font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              Admin
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
