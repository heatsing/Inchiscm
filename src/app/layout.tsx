import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inchiscm.com"),
  title: {
    default: "Inches to CM Converter | InchesCM",
    template: "%s | InchesCM",
  },
  description:
    "Convert inches to centimeters and centimeters to inches instantly with exact formulas, charts, height tools, and practical size references.",
  applicationName: "InchesCM",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "InchesCM",
    url: "https://inchiscm.com",
    title: "Inches to CM Converter",
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
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/" aria-label="InchesCM home">
              <span className="brand-mark" aria-hidden="true">↔</span>
              InchesCM
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/inches-to-cm">Inches to CM</Link>
              <Link href="/cm-to-inches">CM to Inches</Link>
              <Link href="/height-converter">Height</Link>
              <Link href="/inch-to-cm-chart">Charts</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="shell footer-grid">
            <div>
              <Link className="brand" href="/">InchesCM</Link>
              <p>Simple, exact measurement conversions for everyday use.</p>
            </div>
            <div className="footer-links">
              <Link href="/how-to-convert-inches-to-cm">Conversion guide</Link>
              <Link href="/inch-vs-cm">Inch vs CM</Link>
              <Link href="/screen-size-converter">Screen sizes</Link>
              <Link href="/height-chart">Height chart</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
