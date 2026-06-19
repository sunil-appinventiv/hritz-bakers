import { Link, useNavigate, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { getProduct, products, formatINR } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Star, Minus, Plus, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id);
  const { add, setQty, items } = useCart();
  const navigate = useNavigate();
  const [qty, setLocalQty] = useState(1);

  usePageTitle(
    product
      ? `${product.name} — Hritz Baker Mart`
      : "Product not found — Hritz Baker Mart",
  );

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-3xl font-bold">Product not found</h1>
          <Link to="/products" className="mt-6 inline-block text-primary hover:underline">
            ← Back to shop
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const inCart = items.find((it) => it.id === product.id);
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16 grid md:grid-cols-2 gap-10">
        <div className="rounded-3xl overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover aspect-square"
          />
        </div>
        <div>
          {product.tag && (
            <span className="inline-block rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              {product.tag}
            </span>
          )}
          <h1 className="mt-3 text-3xl md:text-4xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
            </div>
            <span>·</span>
            <span>{product.stock} in stock</span>
          </div>
          <div className="mt-4 text-3xl font-bold text-primary">{formatINR(product.price)}</div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            {inCart ? (
              <>
                <div className="inline-flex items-center rounded-full border border-primary bg-primary/5">
                  <button
                    onClick={() => setQty(product.id, inCart.qty - 1)}
                    className="h-11 w-11 inline-flex items-center justify-center text-primary hover:bg-primary/10 rounded-l-full"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-primary">{inCart.qty}</span>
                  <button
                    onClick={() => setQty(product.id, Math.min(product.stock, inCart.qty + 1))}
                    className="h-11 w-11 inline-flex items-center justify-center text-primary hover:bg-primary/10 rounded-r-full"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Link
                  to="/cart"
                  className="flex-1 min-w-[160px] text-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  Go to Cart
                </Link>
              </>
            ) : (
              <>
                <div className="inline-flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 inline-flex items-center justify-center hover:bg-muted rounded-l-full"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setLocalQty((q) => Math.min(product.stock, q + 1))}
                    className="h-10 w-10 inline-flex items-center justify-center hover:bg-muted rounded-r-full"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    add(product, qty);
                    toast.success(`${product.name} added to cart`);
                  }}
                  className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    add(product, qty);
                    navigate("/checkout");
                  }}
                  className="hidden sm:inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition"
                >
                  Buy Now
                </button>
              </>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-xl border border-border p-4">
              <Truck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border p-4">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Quality Assured</p>
                <p className="text-xs text-muted-foreground">100% authentic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold leading-snug line-clamp-2">{p.name}</h3>
                    <p className="mt-2 text-primary font-bold">{formatINR(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
