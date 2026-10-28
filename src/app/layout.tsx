import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
import {
  businessJsonLd,
  defaultImage,
  indexable,
  websiteJsonLd,
} from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Marmoraria em Cotia e Região | Mármores e Granitos — Cipola",
    template: "%s | Cipola Mármores e Granitos",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    images: [defaultImage],
  },
  twitter: { card: "summary_large_image" },
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  verification: {
    ...(site.verification.google && { google: site.verification.google }),
    ...(site.verification.bing && {
      other: { "msvalidate.01": site.verification.bing },
    }),
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body id="top">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <JsonLd graph={[websiteJsonLd(), businessJsonLd()]} />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
