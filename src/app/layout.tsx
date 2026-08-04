import type { Metadata } from "next";
import Link from "next/link";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { requirePageDefinition } from "@/data/page-registry";
import { defaultSocialImage } from "@/lib/seo";
import "./globals.css";

const homePage = requirePageDefinition("/");

export const metadata: Metadata = {
  metadataBase: new URL("https://inchiscm.com"),
  title: {
    default: homePage.title,
    template: "%s",
  },
  description: homePage.description,
  applicationName: "Inch is CM",
  alternates: { canonical: homePage.canonical },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Inch is CM",
    url: homePage.canonical,
    title: homePage.title,
    description: homePage.description,
    images: [
      {
        url: defaultSocialImage.path,
        width: defaultSocialImage.width,
        height: defaultSocialImage.height,
        alt: defaultSocialImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homePage.title,
    description: homePage.description,
    images: [defaultSocialImage.path],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/" aria-label="Inch is CM home">
              <span className="brand-mark" aria-hidden="true">↔</span>
              Inch is CM
            </Link>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <p>Copyright © 2026 <Link href="/">Inch is CM</Link> · Last updated July 2026</p>
            <nav className="footer-links" aria-label="Website policies">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/site-map">Site Map</Link>
            </nav>
          </div>
        </footer>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
