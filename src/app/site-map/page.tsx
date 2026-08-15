import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graphSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/site-map");

const sections = [
  {
    heading: "Conversion tools",
    links: [
      ["Inch to CM Converter", "/"],
      ["Length Converters", "/length-converters"],
      ["Inches to CM", "/inches-to-cm"],
      ["CM to Inches", "/cm-to-inches"],
      ["Feet to CM", "/feet-to-cm"],
      ["Feet to Inches", "/feet-to-inches"],
      ["Inches to Feet", "/inches-to-feet"],
      ["Meters to Feet", "/meters-to-feet"],
      ["Feet to Meters", "/feet-to-meters"],
      ["Yards to Meters", "/yards-to-meters"],
      ["Meters to Yards", "/meters-to-yards"],
      ["Miles to KM", "/miles-to-km"],
      ["KM to Miles", "/km-to-miles"],
      ["Meters to CM", "/meters-to-cm"],
      ["CM to Meters", "/cm-to-meters"],
      ["MM to CM", "/mm-to-cm"],
      ["CM to MM", "/cm-to-mm"],
      ["Inches to MM", "/inches-to-mm"],
      ["MM to Inches", "/mm-to-inches"],
      ["CM to Feet and Inches", "/cm-to-feet-and-inches"],
      ["Inches to CM Dimensions", "/inches-to-cm-dimensions"],
      ["CM to Inches Dimensions", "/cm-to-inches-dimensions"],
      ["Height Converter", "/height-converter"],
      ["Screen Size Converter", "/screen-size-converter"],
    ],
  },
  {
    heading: "Topic hubs",
    links: [
      ["Length Converters", "/length-converters"],
      ["Fraction Converters", "/fraction-converters"],
      ["Height Tools", "/height-tools"],
      ["Screen Tools", "/screen-tools"],
      ["Conversion Charts", "/conversion-charts"],
      ["Measurement Guides", "/measurement-guides"],
    ],
  },
  {
    heading: "Charts",
    links: [
      ["Inch to CM Chart", "/inch-to-cm-chart"],
      ["CM to Inch Chart", "/cm-to-inch-chart"],
      ["Height Chart", "/height-chart"],
      ["Length Conversion Chart", "/length-conversion-chart"],
      ["Fraction Inch to MM Chart", "/fraction-inch-to-mm-chart"],
      ["Feet and Inches to CM Chart", "/feet-and-inches-to-cm-chart"],
    ],
  },
  {
    heading: "Measurement guides",
    links: [
      ["How to Convert Inches to CM", "/how-to-convert-inches-to-cm"],
      ["Inch vs CM", "/inch-vs-cm"],
      ["Why Is One Inch 2.54 CM?", "/why-is-one-inch-2-54-cm"],
      ["How to Measure Without a Ruler", "/how-to-measure-inches-without-a-ruler"],
      ["How Big Is 24 Inches?", "/how-big-is-24-inches"],
      ["Screen Size vs Width and Height", "/screen-size-vs-width-height"],
      ["Laptop Screen Size in CM", "/laptop-screen-size-in-cm"],
      ["TV Size in CM", "/tv-size-in-cm"],
      ["Height Conversion Guide", "/height-conversion-guide"],
      ["How to Convert CM to Inches", "/how-to-convert-cm-to-inches"],
      ["Metric vs Imperial Units", "/metric-vs-imperial-units"],
      ["Common Product Dimensions in CM", "/common-product-dimensions-in-cm"],
      ["Conversion Methodology and Sources", "/conversion-methodology"],
      ["Decimal Inches to Fractions", "/decimal-inches-to-fractions"],
      ["Fractions to Decimal Inches", "/fractions-to-decimal-inches"],
      ["Tape Measure Fractions Guide", "/tape-measure-fractions-guide"],
      ["PPI Calculator", "/ppi-calculator"],
      ["Screen Aspect Ratio Calculator", "/screen-aspect-ratio-calculator"],
      ["Screen Dimensions Calculator", "/screen-dimensions-calculator"],
      ["How to Read a Ruler", "/how-to-read-a-ruler"],
      ["How to Round Measurements", "/how-to-round-measurements"],
      ["Common Length Conversion Formulas", "/common-length-conversion-formulas"],
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
      <JsonLd data={graphSchema([
        webPageSchema({ name: "Site Map", description: "Browse the main length converters, measurement charts, height and screen tools, guides, and website policies on Inch is CM.", path: "/site-map" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Site Map", path: "/site-map" }]),
      ])} />
      <Breadcrumbs current="Site Map" wide />
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
