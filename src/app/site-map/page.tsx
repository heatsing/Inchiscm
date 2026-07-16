import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Site Map - Inch is CM",
  "Browse the main length converters, measurement charts, height and screen tools, guides, and website policies on Inch is CM.",
  "/site-map",
);

const sections = [
  {
    heading: "Conversion tools",
    links: [
      ["Inch to CM Converter", "/"],
      ["Inches to CM", "/inches-to-cm"],
      ["CM to Inches", "/cm-to-inches"],
      ["Feet to CM", "/feet-to-cm"],
      ["Inches to MM", "/inches-to-mm"],
      ["Height Converter", "/height-converter"],
      ["Screen Size Converter", "/screen-size-converter"],
    ],
  },
  {
    heading: "Charts",
    links: [
      ["Inch to CM Chart", "/inch-to-cm-chart"],
      ["CM to Inch Chart", "/cm-to-inch-chart"],
      ["Height Chart", "/height-chart"],
    ],
  },
  {
    heading: "Measurement guides",
    links: [
      ["How to Convert Inches to CM", "/how-to-convert-inches-to-cm"],
      ["Inch vs CM", "/inch-vs-cm"],
      ["Why Is One Inch 2.54 CM?", "/why-is-one-inch-2-54-cm"],
      ["How to Measure Without a Ruler", "/how-to-measure-inches-without-a-ruler"],
      ["Screen Size vs Width and Height", "/screen-size-vs-width-height"],
      ["Height Conversion Guide", "/height-conversion-guide"],
      ["Common Product Dimensions in CM", "/common-product-dimensions-in-cm"],
    ],
  },
  {
    heading: "Website policies",
    links: [
      ["Privacy Policy", "/privacy-policy"],
      ["Terms of Service", "/terms-of-service"],
      ["XML Sitemap", "/sitemap.xml"],
    ],
  },
] as const;

export default function SiteMapPage() {
  return (
    <>
      <Breadcrumbs current="Site Map" />
      <article className="shell content-page">
        <div className="eyebrow">Browse Inch is CM</div>
        <h1>Site Map</h1>
        <p className="lead">Find the main converters, charts, practical measurement guides, and website policies.</p>
        <div className="grid two site-map-grid">
          {sections.map((section) => (
            <section className="card" key={section.heading}>
              <h2>{section.heading}</h2>
              <ul>
                {section.links.map(([label, href]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
