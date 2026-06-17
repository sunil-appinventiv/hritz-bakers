import { Link } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import { Menu, X, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SITE } from "@/lib/site";
import Logo from '../assets/logo1.jpg';
function NavLinks({ onClick }: { onClick?: () => void }) {
  const items = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;
  return (
    <>
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          onClick={onClick}
          activeOptions={{ exact: it.to === "/" }}
          className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          activeProps={{ className: "text-primary font-semibold" }}
        >
          {it.label}
        </Link>
      ))}
    </>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt={SITE.name}
              className="h-14 w-auto object-contain"
            />
             {/* <span className="text-xl font-bold tracking-tight">{SITE.name}</span> */}
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              Products
            </Link>
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4">
              <NavLinks onClick={() => setOpen(false)} />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-secondary/40 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3">
          <div>
           <img
              src={Logo}
              alt={SITE.name}
              className="h-20 w-auto object-contain"
            />
            <p className="text-sm text-muted-foreground">
              Premium baking essentials, cake mixes, and decorating tools for home
              bakers and professionals.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary">Products</Link></li>
              <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a></li>
              <li><a href={`tel:+91${SITE.phoneRaw}`} className="hover:text-primary">{SITE.phone}</a></li>
              <li>{SITE.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
