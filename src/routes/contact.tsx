import { createFileRoute } from "@tanstack/react-router";
import SiteLayout from "@/components/SiteLayout";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      {
        name: "description",
        content: `Get in touch with ${SITE.name}. We'd love to hear from you — questions, custom orders, or feedback.`,
      },
      { property: "og:title", content: `Contact — ${SITE.name}` },
      {
        property: "og:description",
        content: `Reach out to the ${SITE.name} team.`,
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", 
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Custom handling for phone input
    if (name === "phone") {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, "");
      
      // Ensure it doesn't exceed 10 digits
      if (numericValue.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      // Handle all other inputs normally
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    setSent(false);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Extra safeguard before sending data
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setSent(false);
    setLoading(true);

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbx1-gK3ufGz-2mhKORtADMalDpey2yZq3SQ-Tb_RqLbCpSbTpwH_ea_STqlw7hTQfJO/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      setSent(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We'd love to hear from you. Drop us a message anytime.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {[
            {
              icon: Mail,
              label: "Email",
              value: SITE.email,
              href: `mailto:${SITE.email}`,
            },
            {
              icon: Phone,
              label: "Phone",
              value: SITE.phone,
              href: `tel:+91${SITE.phoneRaw}`,
            },
            {
              icon: MapPin,
              label: "Address",
              value: SITE.address,
            },
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {c.label}
                </p>

                {c.href ? (
                  <a
                    href={c.href}
                    className="font-semibold hover:text-primary"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="font-semibold">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>

            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>

            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              minLength={10}
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Message
            </label>

            <textarea
              required
              rows={5}
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {sent && (
            <p className="text-center text-green-600 text-sm font-medium">
              Thank you! We will connect with you shortly.
            </p>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}