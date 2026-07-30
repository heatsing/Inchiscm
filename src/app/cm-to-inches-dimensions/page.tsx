import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DimensionsConverter } from "@/components/DimensionsConverter";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { breadcrumbSchema, faqSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/cm-to-inches-dimensions");

const faq: FaqItem[] = [
  {
    question: "How do I convert dimensions from cm to inches?",
    answer: "Divide each centimeter dimension by exactly 2.54. Convert length, width, and height separately.",
  },
  {
    question: "What is 55.88 x 35.56 x 22.86 cm in inches?",
    answer: "55.88 x 35.56 x 22.86 cm equals 22 x 14 x 9 inches.",
  },
  {
    question: "Why are cm to inch dimensions often rounded?",
    answer: "Most centimeter values do not divide evenly by 2.54, so inch results are usually shown as rounded decimals.",
  },
  {
    question: "Can I use this for furniture or package fit?",
    answer: "Yes, but convert every side and leave clearance for packaging, handles, hinges, cables, and measurement tolerance.",
  },
  {
    question: "Can I convert only length and width from cm to inches?",
    answer: "Yes. Enter 0 for height when the item is flat, or divide the two sides by 2.54 and keep the original order.",
  },
];

const examples = [
  ["20 x 30 cm", "7.874 x 11.811 in", "Print, frame, sign, or flat product panel."],
  ["40 x 60 cm", "15.748 x 23.622 in", "Poster, shelf panel, mat, or artwork size."],
  ["55.88 x 35.56 x 22.86 cm", "22 x 14 x 9 in", "Common carry-on luggage size class."],
  ["30 x 20 x 10 cm", "11.811 x 7.874 x 3.937 in", "Compact box or product package."],
  ["100 x 50 x 75 cm", "39.37 x 19.685 x 29.528 in", "Furniture, table, or storage dimensions."],
];

const dimensionModes = [
  ["Length only", "Use the main cm to inches converter when the source is one side, diameter, depth, or straight measurement."],
  ["Length x width", "Use two sides for flat items such as prints, frames, signs, boards, tablet cases, or panels."],
  ["Length x width x height", "Use all three sides for boxes, furniture, packages, luggage, shelves, and storage bins."],
];

export default function CmToInchesDimensionsPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "CM to Inches Dimensions Converter", description: "Convert length, width, and height from centimeters to inches for product specs, package sizes, furniture, and international listings.", path: "/cm-to-inches-dimensions" }),
        webApplicationSchema({ name: "CM to Inches Dimensions Converter", description: "Convert length, width, and height from centimeters to inches for product specs, package sizes, furniture, and international listings.", path: "/cm-to-inches-dimensions" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "CM to Inches Dimensions", path: "/cm-to-inches-dimensions" }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current="CM to Inches Dimensions" />
      <article className="narrow content-page">
        <div className="eyebrow">Product and package dimensions</div>
        <h1>CM to Inches Dimensions Converter</h1>
        <p className="lead">Convert length, width, and height from centimeters to inches for product specs, package sizes, furniture, and international listings.</p>

        <DimensionsConverter direction="cm-to-in" defaultLength={55.88} defaultWidth={35.56} defaultHeight={22.86} />

        <div className="answer-box">
          <div className="answer">55.88 x 35.56 x 22.86 cm = 22 x 14 x 9 in</div>
          <div className="formula">length / 2.54, width / 2.54, height / 2.54</div>
        </div>

        <h2>How to convert L x W x H cm to inches</h2>
        <p>Divide each side by exactly 2.54. Keep the dimension order the same so length, width, and height do not get mixed up when comparing product specs or checking physical fit.</p>

        <h2>Choose length, 2D, or 3D dimensions</h2>
        <p>Metric product listings may describe a single length, a flat size, or a full box-style size. Convert the same number of sides and keep the original order.</p>
        <div className="data-table-wrap">
          <table>
            <caption>Which dimension format should you convert?</caption>
            <thead><tr><th>Format</th><th>Best use</th></tr></thead>
            <tbody>
              {dimensionModes.map(([format, use]) => (
                <tr key={format}><td>{format}</td><td>{use}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Common dimension examples</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Common L x W x H centimeter dimensions converted to inches</caption>
            <thead><tr><th>Centimeters</th><th>Inches</th><th>Use case</th></tr></thead>
            <tbody>
              {examples.map(([input, result, note]) => (
                <tr key={input}><td>{input}</td><td>{result}</td><td>{note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Who this page is for</h2>
        <ul>
          <li>US shoppers reading metric product dimensions from international listings.</li>
          <li>People checking furniture, packages, storage boxes, shelves, or luggage against inch-based spaces.</li>
          <li>Sellers and product teams converting metric dimension specs into readable inch values.</li>
        </ul>

        <h2>Related tools</h2>
        <RelatedLinks sections={[
          {
            title: "Dimension tools",
            links: [
              { href: "/inches-to-cm-dimensions", label: "Inches to cm dimensions converter" },
              { href: "/common-product-dimensions-in-cm", label: "Common product dimensions in cm" },
            ],
          },
          {
            title: "Single-value converters",
            links: [
              { href: "/cm-to-inches", label: "CM to inches converter" },
              { href: "/inches-to-cm", label: "Inches to cm converter" },
              { href: "/cm-to-inch-chart", label: "CM to inch chart" },
            ],
          },
          {
            title: "Practical size tools",
            links: [
              { href: "/screen-size-converter", label: "Screen size converter" },
              { href: "/height-converter", label: "Height converter" },
            ],
          },
        ]} />

        <p className="methodology-link">For rounding and exact factors, see the <Link href="/conversion-methodology">conversion methodology</Link>.</p>
        <Faq items={faq} />
      </article>
    </>
  );
}
