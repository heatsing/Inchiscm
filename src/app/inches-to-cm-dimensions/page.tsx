import { registryMetadata } from "@/data/page-registry";
import { focusedGuideGroups } from "@/data/page-registry/focused-guides";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DimensionsConverter } from "@/components/DimensionsConverter";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { breadcrumbSchema, faqSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/inches-to-cm-dimensions");

const faq: FaqItem[] = [
  {
    question: "How do I convert product dimensions from inches to cm?",
    answer: "Convert each side separately by multiplying length, width, and height in inches by exactly 2.54.",
  },
  {
    question: "Does this dimensions converter calculate volume?",
    answer: "No. It converts two or three linear dimensions only. It does not calculate cubic inches, cubic centimeters, or volume.",
  },
  {
    question: "What is 22 x 14 x 9 inches in cm?",
    answer: "22 x 14 x 9 inches equals 55.88 x 35.56 x 22.86 cm.",
  },
  {
    question: "Should I add extra space when checking whether an item fits?",
    answer: "Yes. Leave clearance for handles, packaging, cables, doors, fabric thickness, and measurement tolerance.",
  },
  {
    question: "Can I use this for length x width only?",
    answer: "Yes. Select 2D for length and width only, or paste a size such as 10 x 15. No height is required; 10 x 15 inches equals 25.4 x 38.1 cm.",
  },
];

const examples = [
  ["10 x 15 in", "25.4 x 38.1 cm", "Flat print, panel, or product footprint."],
  ["12 x 12 in", "30.48 x 30.48 cm", "Square panel, craft sheet, or print."],
  ["2 x 2 in", "5.08 x 5.08 cm", "Small square label, photo, or craft piece."],
  ["8 x 10 in", "20.32 x 25.4 cm", "Photo print, frame, paper, or small flat panel."],
  ["11 x 17 in", "27.94 x 43.18 cm", "Tabloid paper, poster, sign, or print layout."],
  ["22 x 14 x 9 in", "55.88 x 35.56 x 22.86 cm", "Common carry-on luggage size class."],
  ["12 x 8 x 4 in", "30.48 x 20.32 x 10.16 cm", "Small shipping box or product package."],
  ["36 x 18 x 72 in", "91.44 x 45.72 x 182.88 cm", "Furniture, shelving, or cabinet-style dimensions."],
];

const dimensionModes = [
  ["Length only", "Use the main inches to cm converter when the source is a single side, diameter, depth, or straight measurement."],
  ["Length x width", "Use two sides for flat items such as frames, prints, mats, screens, signs, boards, or tablet cases."],
  ["Length x width x height", "Use all three sides for boxes, luggage, furniture, shelves, packages, and storage bins."],
];

export default function InchesToCmDimensionsPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "Inches to CM Dimensions Converter", description: "Convert length, width, and height from inches to centimeters for products, boxes, luggage, furniture, and packaging.", path: "/inches-to-cm-dimensions" }),
        webApplicationSchema({ name: "Inches to CM Dimensions Converter", description: "Convert length, width, and height from inches to centimeters for products, boxes, luggage, furniture, and packaging.", path: "/inches-to-cm-dimensions" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Inches to CM Dimensions", path: "/inches-to-cm-dimensions" }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current="Inches to CM Dimensions" />
      <article className="narrow content-page">
        <div className="eyebrow">Product and package dimensions</div>
        <h1>Inches to CM Dimensions Converter</h1>
        <p className="lead">Convert length, width, and height from inches to centimeters for products, boxes, luggage, furniture, and packaging.</p>

        <DimensionsConverter direction="in-to-cm" defaultLength={22} defaultWidth={14} defaultHeight={9} />

        <div className="answer-box">
          <div className="answer">22 x 14 x 9 in = 55.88 x 35.56 x 22.86 cm</div>
          <div className="formula">length x 2.54, width x 2.54, height x 2.54</div>
        </div>

        <h2>How to convert L x W x H inches to cm</h2>
        <p>Multiply each dimension by exactly 2.54. Do not multiply the three sides together unless you specifically need volume; for fitting, shopping, and product specs, the side-by-side dimensions are usually what matter.</p>

        <h2>Choose length, 2D, or 3D dimensions</h2>
        <p>Select 2D for length × width or 3D for length × width × height. You can also paste a size such as 10 x 15 or 22 × 14 × 9 in inches; the calculator selects the matching mode. Keep the original dimension order, then copy the full conversion.</p>
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
            <caption>Common L x W x H inch dimensions converted to centimeters</caption>
            <thead><tr><th>Inches</th><th>Centimeters</th><th>Use case</th></tr></thead>
            <tbody>
              {examples.map(([input, result, note]) => (
                <tr key={input}><td>{input}</td><td>{result}</td><td>{note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Who this page is for</h2>
        <ul>
          <li>Shoppers comparing US product dimensions with metric product specs.</li>
          <li>People checking whether luggage, boxes, furniture, shelves, or storage bins will fit.</li>
          <li>Sellers and students who need length, width, and height in centimeters without changing the original dimension order.</li>
        </ul>

        <h2>Related tools</h2>
        <RelatedLinks sections={[
          {
            title: "Box, fit, and product measurement guides",
            links: focusedGuideGroups.dimensions.slice(10).map((page) => ({ href: "/" + page.slug, label: page.title })),
          },
          {
            title: "Dimension tools",
            links: [
              { href: "/cm-to-inches-dimensions", label: "CM to inches dimensions converter" },
              { href: "/common-product-dimensions-in-cm", label: "Common product dimensions in cm" },
              { href: "/a4-paper-size-in-inches-and-cm", label: "A4 and common paper sizes" },
            ],
          },
          {
            title: "Single-value converters",
            links: [
              { href: "/inches-to-cm", label: "Inches to cm converter" },
              { href: "/cm-to-inches", label: "CM to inches converter" },
              { href: "/inch-to-cm-chart", label: "Inch to cm chart" },
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

        <p className="methodology-link">For the exact inch definition, see the <Link href="/conversion-methodology">conversion methodology</Link>.</p>
        <Faq items={faq} />
      </article>
    </>
  );
}
