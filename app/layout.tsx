import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Toaster from "@/components/ui/Toaster";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://redcat.lk"),
  alternates: {
    canonical: "https://redcat.lk",
  },
  title: {
    default: "RedCat | Next Day Delivery across Sri Lanka",
    template: "%s | RedCat",
  },
  description:
    "RedCat is Sri Lanka's next day delivery network: 57 regional hubs across 25 districts and 930+ express points.",
  icons: { icon: "/brand/mascot-peek.svg" },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "https://redcat.lk",
    siteName: "RedCat",
    title: "RedCat | Next Day Delivery across Sri Lanka",
    description:
      "RedCat is Sri Lanka's next day delivery network: 57 regional hubs across 25 districts and 930+ express points.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RedCat | Next Day Delivery across Sri Lanka",
    description:
      "RedCat is Sri Lanka's next day delivery network: 57 regional hubs across 25 districts and 930+ express points.",
  },
};

export const viewport: Viewport = {
  themeColor: "#e12222",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            if (!/^\\/dealers\\/(?:hub-franchise|point\\/application(?:-notice)?)(?:\\/|$)/.test(location.pathname)) {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
              var script = document.createElement('script');
              script.async = true;
              script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-K6G4P8TP';
              document.head.appendChild(script);
            }
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            if (!/^\\/dealers\\/(?:hub-franchise|point\\/application(?:-notice)?)(?:\\/|$)/.test(location.pathname)) {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2271290716935198');
              fbq('track', 'PageView');
            }
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            if (!/^\\/dealers\\/(?:hub-franchise|point\\/application(?:-notice)?)(?:\\/|$)/.test(location.pathname)) {
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "zfi5massi4");
            }
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K6G4P8TP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2271290716935198&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        {/* Hidden form definition for Netlify Forms indexing on static export */}
        <form name="enquiry" data-netlify="true" data-netlify-honeypot="website" hidden>
          <input type="hidden" name="form-name" value="enquiry" />
          <input type="text" name="name" />
          <input type="tel" name="phone" />
          <input type="email" name="email" />
          <input type="text" name="district" />
          <input type="text" name="kind" />
          <input type="text" name="role" />
          <input type="text" name="topic" />
          <input type="text" name="from" />
          <input type="text" name="to" />
          <input type="text" name="size" />
          <textarea name="message"></textarea>
        </form>
        <Footer />
        <CommandPalette />
        <Toaster />
      </body>
    </html>
  );
}
