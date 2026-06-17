import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import SiteLayout from "@/components/SiteLayout";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/products";
import { useState } from "react";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Hritz Baker Mart" },
      { name: "description", content: "Securely complete your Hritz Baker Mart order for premium baking essentials and cake supplies." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type Form = {
  email: string;
  name: string;
  phone: string;
  address: string;
  landmark: string; 
  city: string;
  pincode: string;
  state: string;
  payment: "cod" | "card" | "upi";
};

function CheckoutPage() {
  const { detailedItems, subtotal, shipping, total, count, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState<Form>({
    email: "",
    name: "",
    phone: "",
    address: "",
    landmark: "", 
    city: "",
    pincode: "",
    state: "",
    payment: "upi",
  });

  if (count === 0 && !submitting) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link to="/products" className="mt-6 inline-block text-primary hover:underline">
            ← Continue shopping
          </Link>
        </section>
      </SiteLayout>
    );
  }

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const orderId = "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    
    // 1. Prepare the data payload for Google Sheets
    const orderData = {
      orderId,
      date: new Date().toLocaleString(),
      ...form, // spread name, email, phone, address, etc.
      total: total,
      // Format cart items as a single readable string, e.g., "Vanilla Cake (x2), Cocoa Powder (x1)"
      items: detailedItems.map(it => `${it.product.name} (x${it.qty})`).join(" | ")
    };

    try {
      // Save locally to show on success page
      sessionStorage.setItem(
        "bakesto.lastOrder",
        JSON.stringify({ orderId, total, name: form.name, email: form.email, payment: form.payment }),
      );

      // 2. Send data to Google Apps Script
      // IMPORTANT: Replace the URL below with your deployed Web App URL
      await fetch("https://script.google.com/macros/s/AKfycbx2qumlvzw7FKfItfoeuptAL1KYCfrrJoL9HSeGaQ2dS-6qQPyWG96sB0FyEL-SUpFpsQ/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      // Clear cart and redirect
      clear();
      navigate({ to: "/order-success", search: { id: orderId } });

    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an issue processing your order. Please try again.");
      setSubmitting(false); // allow them to try again if it fails
    }
  };

  const inputCls =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={update("email")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input required value={form.name} onChange={update("name")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input required type="tel" value={form.phone} onChange={update("phone")} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input required value={form.address} onChange={update("address")} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Landmark <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input value={form.landmark} onChange={update("landmark")} placeholder="e.g. Near Apollo Hospital" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input required value={form.city} onChange={update("city")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input required value={form.state} onChange={update("state")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PIN Code</label>
                  <input required value={form.pincode} onChange={update("pincode")} pattern="[0-9]{6}" className={inputCls} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: "upi", label: "UPI", desc: "Pay using any UPI app" },
                  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay" },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                      form.payment === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={p.id}
                      checked={form.payment === p.id}
                      onChange={() => setForm((f) => ({ ...f, payment: p.id as Form["payment"] }))}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <p className="font-semibold text-sm">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Demo checkout — no real payment processed.
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-20">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <ul className="mt-4 space-y-3 max-h-72 overflow-auto">
              {detailedItems.map((it) => (
                <li key={it.id} className="flex gap-3 text-sm">
                  <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img src={it.product.image} alt={it.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2">{it.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {it.qty}</p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">{formatINR(it.product.price * it.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold">{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-border">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold text-primary">{formatINR(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60"
            >
              {submitting ? "Placing order..." : `Place Order · ${formatINR(total)}`}
            </button>
          </aside>
        </form>
      </section>
    </SiteLayout>
  );
}