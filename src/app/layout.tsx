import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inchiscm.com"),
  title: {
    default: "Inch to CM Converter - Convert Inches to Centimeters",
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
            <Link className="brand" href="/" aria-label="Inch is CM home">
              <span className="brand-mark" aria-hidden="true">↔</span>
              Inch is CM
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <Link className="brand" href="/">Inch is CM</Link>
            <p>Simple, exact measurement conversions.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
