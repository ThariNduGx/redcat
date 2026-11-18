import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Toaster from "@/components/ui/Toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RedCat | Next Day Delivery across Sri Lanka",
    template: "%s | RedCat",
  },
  description:
    "RedCat is Sri Lanka's next day delivery network: 4 zones, 57 regional hubs and 930+ express points covering the island.",
  icons: { icon: "/brand/mascot-peek.svg" },
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
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-WF62Q5VP"
          strategy="afterInteractive"
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "zfi5massi4");
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
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
          <input type="hidden" name="_to" value="info@redcat.lk" />
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
