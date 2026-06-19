import { Link } from "react-router-dom";
import { Sparkles, Truck, ShieldCheck, Heart } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import hero from "@/assets/hero-cupcake.jpg";
import essentials from "@/assets/baking-essentials.jpg";
import cake from "@/assets/cake-product.jpg";

export default function Home() {
  usePageTitle("Hritz Baker Mart — Premium Baking Essentials & Cake Supplies");

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/60 via-background to-accent/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> New Launch — Baking Essentials
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
              Bake with confidence.{" "}
              <span className="text-primary">Create with love.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              From cake mixing essentials to flavoring extracts, Hritz Baker Mart brings you
              everything you need to make every baking moment unforgettable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted transition"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Pink frosted cupcakes"
              width={1280}
              height={896}
              className="rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="sr-only">Why bake with Hritz Baker Mart</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
            { icon: ShieldCheck, title: "Quality Assured", desc: "Premium ingredients only" },
            { icon: Heart, title: "Loved by Bakers", desc: "Trusted across India" },
            { icon: Sparkles, title: "Fresh Stock", desc: "New arrivals weekly" },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-md transition"
            >
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Explore Our Collection</h2>
            <p className="mt-2 text-muted-foreground">
              Daily on-sale products, featuring a rotating selection of bakery favorites.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="group relative rounded-3xl overflow-hidden bg-card border border-border">
              <img
                src={essentials}
                alt="Baking essentials"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold">Baking Essentials</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Mixing bowls, spoons, measuring cups & flavoring essence.
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  Browse essentials →
                </Link>
              </div>
            </article>
            <article className="group relative rounded-3xl overflow-hidden bg-card border border-border">
              <img
                src={cake}
                alt="Chocolate cake"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold">Cakes & Decor</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pre-mixes, fondant, sprinkles, and decorating tools.
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  Browse cakes →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-accent text-primary-foreground p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to start baking?</h2>
          <p className="mt-3 opacity-90">
            Join thousands of happy bakers. Shop premium essentials today.
          </p>
          <Link
            to="/products"
            className="inline-flex mt-6 items-center justify-center rounded-full bg-background text-foreground px-6 py-3 text-sm font-semibold hover:bg-background/90 transition"
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
