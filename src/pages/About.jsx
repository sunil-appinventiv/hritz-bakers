import SiteLayout from "@/components/SiteLayout";
import { Cake, Users, Award } from "lucide-react";
import essentials from "@/assets/baking-essentials.jpg";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function About() {
  usePageTitle("About Us — Hritz Baker Mart");

  return (
    <SiteLayout>
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Hritz Baker Mart</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We're on a mission to make every kitchen a bakery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <img
          src={essentials}
          alt="Baking essentials"
          loading="lazy"
          className="rounded-3xl shadow-lg w-full h-auto object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Hritz Baker Mart started with a simple idea — quality baking shouldn't be a
            luxury. Founded by a small team of home bakers and pastry enthusiasts, we curate
            the finest ingredients, tools, and decorating supplies so you can create magic in
            your kitchen.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            From flavoring essences and premium mixes to professional-grade tools, every
            product we offer is tested by bakers like you.
          </p>
        </div>
      </section>

      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          {[
            { icon: Cake, title: "Quality First", desc: "Premium ingredients sourced responsibly." },
            { icon: Users, title: "Community", desc: "10,000+ happy bakers across India." },
            { icon: Award, title: "Trusted", desc: "Rated 4.8★ by our customers." },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl bg-card border border-border p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
