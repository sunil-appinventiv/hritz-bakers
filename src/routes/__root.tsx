import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/context/CartContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hritz Baker Mart — Premium Baking Essentials & Cake Supplies" },
      { name: "description", content: "Shop premium cake mixes, baking tools, and decorating essentials at Hritz Baker Mart — your one-stop shop for perfect bakes." },
      { name: "author", content: "Hritz Baker Mart" },
      { property: "og:title", content: "Hritz Baker Mart — Premium Baking Essentials" },
      { property: "og:description", content: "Shop premium cake mixes, baking tools, and decorating essentials at Hritz Baker Mart — your one-stop shop for perfect bakes." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Hritz Baker Mart" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Hritz Baker Mart — Premium Baking Essentials" },
      { name: "twitter:description", content: "Shop premium cake mixes, baking tools, and decorating essentials at Hritz Baker Mart." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/47be2eba-51c7-40a6-9fb6-675ca391920d/id-preview-7f862c48--32558bd6-c099-4b8f-a400-65ac30aa975c.lovable.app-1781612648958.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/47be2eba-51c7-40a6-9fb6-675ca391920d/id-preview-7f862c48--32558bd6-c099-4b8f-a400-65ac30aa975c.lovable.app-1781612648958.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Hritz Baker Mart",
          url: "https://dash-dash-charts.lovable.app",
          email: "hritzbakermart@gmail.com",
          telephone: "+91-9465811668",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Mohali",
            addressRegion: "Punjab",
            addressCountry: "IN",
          },
          description:
            "Premium cake mixes, baking tools, and decorating essentials for home bakers and professionals.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </QueryClientProvider>
  );
}
