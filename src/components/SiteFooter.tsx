import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer role="contentinfo" className="border-t border-border mt-24">
      <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="font-display text-3xl tracking-tight focus:outline-none focus:ring-2 focus:ring-ring rounded-sm" aria-label="VibeStore — Inicio">
            VibeStore
          </Link>
          <p className="text-sm text-muted-foreground mt-4 max-w-sm leading-relaxed">
            Una selección editorial de prendas y calzado pensada para vestir el día con calma y carácter.
          </p>
        </div>

        <nav aria-label="Secciones de la tienda">
          <h2 className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-4">Tienda</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-none p-0">
            <li><Link to="/categoria/mujer" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Mujer</Link></li>
            <li><Link to="/categoria/hombre" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Hombre</Link></li>
            <li><Link to="/buscar" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Buscar</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-4">Atención</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-none p-0">
            <li>Envíos en 48–72 h</li>
            <li>Cambios y devoluciones en 30 días</li>
            <li>
              <a
                href="mailto:contacto@vibestore.com"
                className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
              >
                contacto@vibestore.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] tracking-editorial uppercase text-muted-foreground">
          <span>© {new Date().getFullYear()} VibeStore</span>
          <span>Una pieza, una historia.</span>
        </div>
      </div>
    </footer>
  );
}
