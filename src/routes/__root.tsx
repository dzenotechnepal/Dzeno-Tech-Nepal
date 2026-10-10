import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-semibold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-accent px-5 py-2.5 text-sm font-medium text-primary-foreground"
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
            className="inline-flex items-center justify-center rounded-full bg-gradient-accent px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
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
      { title: "Dzeno Tech Nepal — Software, IT Services & IT Training" },
      {
        name: "description",
        content:
          "Dzeno Tech Nepal Pvt. Ltd. builds software, delivers IT services, and runs practical IT training for growing businesses in Kathmandu, Nepal.",
      },
      { name: "keywords", content: "software development, IT services, IT training, web development, mobile app development, cloud solutions, digital marketing, SEO, Nepal, Kathmandu" },
      { name: "author", content: "Dzeno Tech Nepal Pvt. Ltd." },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Dzeno Tech Nepal — Software, IT Services & IT Training" },
      { property: "og:description", content: "Dzeno Tech Nepal Pvt. Ltd. builds software, delivers IT services, and runs practical IT training for growing businesses in Kathmandu, Nepal." },
      { property: "og:url", content: "https://dzenotechnepal.com.np/" },
      { property: "og:image", content: "https://dzenotechnepal.com.np/logo.png" },
      { property: "og:site_name", content: "Dzeno Tech Nepal" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dzeno Tech Nepal — Software, IT Services & IT Training" },
      { name: "twitter:description", content: "Dzeno Tech Nepal Pvt. Ltd. builds software, delivers IT services, and runs practical IT training for growing businesses in Kathmandu, Nepal." },
      { name: "twitter:image", content: "https://dzenotechnepal.com.np/logo.png" },
      { name: "twitter:site", content: "@dzenotechnepal" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.png" },
      { rel: "canonical", href: "https://dzenotechnepal.com.np/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Dzeno Tech Nepal Pvt. Ltd.",
          "url": "https://dzenotechnepal.com.np",
          "logo": "https://dzenotechnepal.com.np/logo.png",
          "description": "Dzeno Tech Nepal Pvt. Ltd. builds software, delivers IT services, and runs practical IT training for growing businesses in Kathmandu, Nepal.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kathmandu",
            "addressCountry": "NP"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+977-9744621447",
            "contactType": "customer service",
            "email": "dzenotechnepal77@gmail.com"
          },
          "sameAs": [
            "https://www.linkedin.com/company/dzeno-tech-nepal/",
            "https://www.facebook.com/profile.php?id=61594519552480",
            "https://www.instagram.com/dzenotechnepal",
            "https://www.tiktok.com/@dzenotechnepal",
            "https://github.com/dzenotechnepal",
            "https://gitlab.com/dzenotechnepal"
          ]
        })
      }
    ]
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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9JD0EJ9ELZ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9JD0EJ9ELZ');
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
              (function () {
                var s1 = document.createElement("script");
                var s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = "https://embed.tawk.to/6aa645849f6293344272202c/1k2cnv3os";
                s1.charset = "UTF-8";
                s1.setAttribute("crossorigin", "*");
                s0.parentNode.insertBefore(s1, s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const isAdmin = routerState.location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? undefined : "min-h-screen"}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      <Toaster />
    </QueryClientProvider>
  );
}
