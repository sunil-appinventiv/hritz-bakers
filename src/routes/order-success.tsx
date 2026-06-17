import { createFileRoute, Link } from "@tanstack/react-router";
import SiteLayout from "@/components/SiteLayout";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/products";
import { z } from "zod";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/order-success")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Order Confirmed — Hritz Baker Mart" },
      { name: "description", content: "Your Hritz Baker Mart order has been successfully placed — thank you for choosing us for your baking needs." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

type StoredOrder = {
  orderId: string;
  total: number;
  name: string;
  email: string;
  payment: string;
};

function SuccessPage() {
  const { id } = Route.useSearch();
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bakesto.lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  const orderId = order?.orderId || id || "—";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="mt-6 text-3xl md:text-4xl font-bold">Thank you for your order!</h1>
        <p className="mt-3 text-muted-foreground">
          Your order has been placed successfully. A confirmation has been sent to your email.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Order ID</dt>
            <dd className="font-semibold text-right">{orderId}</dd>
            {order && (
              <>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-semibold text-right">{order.name}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-semibold text-right truncate">{order.email}</dd>
                <dt className="text-muted-foreground">Payment</dt>
                <dd className="font-semibold text-right uppercase">{order.payment}</dd>
                <dt className="text-muted-foreground">Total Paid</dt>
                <dd className="font-bold text-right text-primary">{formatINR(order.total)}</dd>
              </>
            )}
          </dl>
        </div>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          Continue Shopping
        </Link>
      </section>
    </SiteLayout>
  );
}
