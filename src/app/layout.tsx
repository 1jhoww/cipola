import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: new URL(site.url || "http://localhost:3000"),
  title: {
    default: "Cipola — Da natureza ao seu espaço",
    template: "%s | Cipola Mármores e Granitos",
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/cozinha.jpg",
        width: 1536,
        height: 1024,
        alt: "Ambiente ilustrativo com ilha de pedra natural",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: site.url
    ? { index: true, follow: true }
    : { index: false, follow: false },
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
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
