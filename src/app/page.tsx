import Link from "next/link";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LengthConverter } from "@/components/LengthConverter";
import { PopularHeightLinks } from "@/components/PopularHeightLinks";
import { requirePageDefinition } from "@/data/page-registry";
import { focusedGuideSpecs } from "@/data/page-registry/focused-guides";
import { formatNumber, inchSlug, inchesToCm } from "@/lib/conversions";
import { convertProductDimensions } from "@/lib/product-dimensions";
import { absoluteUrl, breadcrumbSchema, faqSchema, graphSchema, siteUrl, webApplicationSchema, webPageSchema } from "@/lib/seo";
import styles from "./home.module.css";

const homePage = requirePageDefinition("/");
const intro = "Convert individual measurements or complete product dimensions between inches and centimeters. Use the length converter, 2D and 3D dimension tools, and height conversion charts.";

const tools = [
  ["Inches to CM", "/inches-to-cm"],
  ["CM to Inches", "/cm-to-inches"],
  ["2D Dimensions: Inches to CM", "/inches-to-cm-dimensions#2d"],
  ["2D Dimensions: CM to Inches", "/cm-to-inches-dimensions#2d"],
  ["3D Dimensions: Inches to CM", "/inches-to-cm-dimensions#3d"],
  ["3D Dimensions: CM to Inches", "/cm-to-inches-dimensions#3d"],
  ["Feet & Inches to CM", "/height-converter"],
  ["CM to Feet & Inches", "/cm-to-feet-and-inches"],
] as const;

const popularInches = [1, 2.5, 5, 6.5, 10, 12, 24, 36, 40, 55];

const dimensionExamples = {
  2: [
    ["Photo print", "4x6-photo-size-in-cm", 0],
    ["Picture frame", "11x14-frame-size-in-cm", 0],
    ["Poster", "24x36-poster-size-in-cm", 0],
    ["Desk top", "desk-dimensions-in-cm-and-inches", 0],
  ],
  3: [
    ["Shipping box", "18x14x12-box-size-in-cm", 0],
    ["Luggage", "21x14x9-luggage-size-in-cm", 0],
    ["Packed parcel", "how-to-measure-a-box-for-shipping", 0],
    ["Desk exterior", "desk-dimensions-in-cm-and-inches", 2],
  ],
} as const;

const charts = [
  ["Inches to CM Chart", "/inch-to-cm-chart"],
  ["CM to Inches Chart", "/cm-to-inch-chart"],
  ["MM to Inches Chart", "/mm-to-inch-chart"],
  ["Height Conversion Chart", "/height-chart"],
] as const;

const measurementGuides = [
  ["How to Read a Ruler", "/how-to-read-a-ruler"],
  ["How to Measure Product Dimensions", "/how-to-measure-product-dimensions"],
  ["Length, Width, and Height Order", "/length-width-height-order"],
  ["Frame Opening vs. Photo Size", "/frame-opening-vs-photo-size"],
  ["Box Interior vs. Exterior Dimensions", "/box-interior-vs-exterior-dimensions"],
  ["Conversion Methodology", "/conversion-methodology"],
] as const;

const faq = [
  {
    question: "Can I enter a mixed number like 1 1/2 inches?",
    answer: "Yes. The length converter accepts decimals, simple fractions, and mixed numbers. Enter 1 1/2 or 1.5 to convert one and a half inches.",
  },
  {
    question: "Which dimensions tool should I use for a product listing?",
    answer: "Use 2D for width and height, such as a print or frame opening. Use 3D for length, width, and height, such as a box or bag. Keep the sides in the same order as the listing.",
  },
  {
    question: "How much should I round when checking whether something fits?",
    answer: "Keep the unrounded converted measurements until you have compared all relevant sides. For a tight fit, measure the actual opening and allow for clearance before rounding.",
  },
];

function HomeLinks({ items }: { items: readonly (readonly [label: string, href: string])[] }) {
  return (
    <ul className={styles.cards}>
      {items.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
    </ul>
  );
}

function DimensionExampleLinks({ sides }: { sides: 2 | 3 }) {
  return (
    <ul className={`${styles.cards} ${styles.dimensionExamples}`}>
      {dimensionExamples[sides].map(([label, slug, rowIndex]) => {
        const guide = focusedGuideSpecs.find((item) => item.slug === slug && item.group === "dimensions");
        const inches = guide?.rows[rowIndex]?.[1];
        if (!Array.isArray(inches) || inches.length !== sides) throw new Error(`Invalid homepage dimension example: ${slug}`);
        const centimeters = convertProductDimensions(inches, "in-to-cm");
        if (!centimeters) throw new Error(`Unable to convert homepage dimension example: ${slug}`);

        return (
          <li key={label}>
            <Link href={`/${slug}`}>
              <span>{label}</span>
              <span className="subtle">{inches.join(" × ")} in</span>
              <span className="subtle">{centimeters.map((value) => formatNumber(value)).join(" × ")} cm</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={graphSchema([
        {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`,
          name: "Inch is CM",
          url: absoluteUrl("/"),
          description: homePage.description,
        },
        webPageSchema({ name: homePage.h1, description: homePage.description, path: "/" }),
        webApplicationSchema({
          name: "Inch is CM Length Converter",
          description: "Convert individual lengths between inches, centimeters, millimeters, meters, kilometers, feet, yards, and miles.",
          path: "/",
        }),
        {
          "@type": "Dataset",
          name: "Popular inch conversions",
          description: "Common inch measurements and their exact centimeter equivalents.",
          url: absoluteUrl("/"),
          variableMeasured: ["inches", "centimeters"],
          creator: { "@type": "Organization", name: "Inch is CM" },
        },
        breadcrumbSchema([{ name: "Home", path: "/" }]),
        faqSchema(faq),
      ])} />

      <section className={`hero ${styles.hero}`}>
        <div className="shell">
          <h1>{homePage.h1}</h1>
          <p className="lead">{intro}</p>
          <LengthConverter defaultFrom="in" defaultTo="cm" defaultValue={10} presets={[1, 10, 12, 24]} />
        </div>
      </section>

      <section className={`${styles.band} ${styles.tinted}`}>
        <div className="shell">
          <h2>Conversion Tools</h2>
          <HomeLinks items={tools} />
        </div>
      </section>

      <section className={styles.band}>
        <div className="narrow">
          <h2>Popular Inch Conversions</h2>
          <div className={`data-table-wrap ${styles.conversionTable}`}>
            <table>
              <caption>{homePage.directAnswer}</caption>
              <thead><tr><th scope="col">Inches</th><th scope="col">Centimeters</th></tr></thead>
              <tbody>
                {popularInches.map((value) => (
                  <tr key={value}>
                    <th scope="row"><Link href={inchSlug(value)}>{value} {value === 1 ? "inch" : "inches"} in cm</Link></th>
                    <td>{formatNumber(inchesToCm(value))} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="methodology-link"><Link href="/inch-to-cm-chart">View the complete inches to CM chart</Link>.</p>
        </div>
      </section>

      <section className={`${styles.band} ${styles.tinted}`}>
        <div className="shell">
          <h2>2D Dimensions</h2>
          <DimensionExampleLinks sides={2} />
        </div>
      </section>

      <section className={styles.band}>
        <div className="shell">
          <h2>3D Dimensions</h2>
          <DimensionExampleLinks sides={3} />
        </div>
      </section>

      <section className={`${styles.band} ${styles.tinted}`}>
        <div className="shell">
          <PopularHeightLinks heading="Popular Heights" order="ascending" />
        </div>
      </section>

      <section className={styles.band}>
        <div className="shell">
          <h2>Conversion Charts</h2>
          <HomeLinks items={charts} />
        </div>
      </section>

      <section className={`${styles.band} ${styles.tinted}`}>
        <div className="shell">
          <h2>Measurement Guides</h2>
          <HomeLinks items={measurementGuides} />
        </div>
      </section>

      <div className={`${styles.band} ${styles.questions}`}>
        <div className="narrow">
          <Faq items={faq} />
        </div>
      </div>
    </>
  );
}
