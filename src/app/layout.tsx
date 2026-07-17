import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inchiscm.com"),
  title: {
    default: "Inch is CM - Inch to CM Converter",
    template: "%s",
  },
  description:
    "Convert inches to centimeters and centimeters to inches instantly with exact formulas, charts, height tools, and practical size references.",
  applicationName: "Inch is CM",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Inch is CM",
    url: "https://inchiscm.com",
    title: "Inch is CM - Inch to CM Converter",
    description:
      "Fast, exact inch and centimeter conversions with charts and practical examples.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
