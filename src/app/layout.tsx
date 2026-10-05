import { Analytics } from "@vercel/analytics/next";
import { Archivo_Black } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ReviewModeBanner } from "@/components/analytics/ReviewModeBanner";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { VisitOriginTracker } from "@/components/analytics/VisitOriginTracker";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HideInGame } from "@/components/layout/HideInGame";
import {
  defaultMetadata,
  organizationJsonLd,
  websiteJsonLd
} from "@/lib/seo";

export const metadata = defaultMetadata;

// Archivo Black para los titulares (la misma de las imágenes para compartir).
// Next la descarga al compilar y la sirve desde el sitio, sin pedir nada a Google.
const displayFont = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={displayFont.variable} data-scroll-behavior="smooth" lang="es">
      <body className="min-h-screen font-sans antialiased">
        <ReviewModeBanner />
        <div className="flex min-h-screen flex-col">
          <HideInGame>
            <Header />
          </HideInGame>
          <main className="flex-1">{children}</main>
          <HideInGame>
            <Footer />
          </HideInGame>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [organizationJsonLd, websiteJsonLd]
            })
          }}
        />
        <Analytics />
        <VisitOriginTracker />
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  );
}
