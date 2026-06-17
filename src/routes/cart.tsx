import { createFileRoute, Link } from "@tanstack/react-router";
import SiteLayout from "@/components/SiteLayout";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Hritz Baker Mart" },
      { name: "description", content: "Review the items in your Hritz Baker Mart cart and proceed to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { detailedItems, setQty, remove, subtotal, shipping, total, count } = useCart();

  if (count === 0) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Start Shopping
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">Your Cart</h1>
        <p className="mt-1 text-muted-foreground">{count} item{count > 1 ? "s" : ""}</p>

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {detailedItems.map((it) => (
              <div
                key={it.id}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <Link
                  to="/products/$id"
                  params={{ id: it.id }}
                  className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-muted"
                >
                  <img src={it.product.image} alt={it.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/products/$id"
                      params={{ id: it.id }}
                      className="font-semibold hover:text-primary line-clamp-2"
                    >
                      {it.product.name}
                    </Link>
                    <button
                      onClick={() => remove(it.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-primary font-bold">{formatINR(it.product.price)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted rounded-l-full"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                      <button
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted rounded-r-full"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold">{formatINR(it.product.price * it.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-20">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold">{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatINR(999 - subtotal)} more for free shipping.
                </p>
              )}
              <div className="border-t border-border pt-3 flex justify-between text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold text-primary">{formatINR(total)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="mt-3 w-full inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
