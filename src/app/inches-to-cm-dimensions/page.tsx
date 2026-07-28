import { registryMetadata } from "@/data/page-registry";
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
    answer: "No. It converts the three linear dimensions only. It does not calculate cubic inches, cubic centimeters, or volume.",
  },
  {
    question: "What is 22 x 14 x 9 inches in cm?",
    answer: "22 x 14 x 9 inches equals 55.88 x 35.56 x 22.86 cm.",
  },
  {
    question: "Should I add extra space when checking whether an item fits?",
    answer: "Yes. Leave clearance for handles, packaging, cables, doors, fabric thickness, and measurement tolerance.",
  },
];

const examples = [
  ["22 x 14 x 9 in", "55.88 x 35.56 x 22.86 cm", "Common carry-on luggage size class."],
  ["12 x 8 x 4 in", "30.48 x 20.32 x 10.16 cm", "Small shipping box or product package."],
  ["36 x 18 x 72 in", "91.44 x 45.72 x 182.88 cm", "Furniture, shelving, or cabinet-style dimensions."],
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
            title: "Dimension tools",
            links: [
              { href: "/cm-to-inches-dimensions", label: "CM to inches dimensions converter" },
              { href: "/common-product-dimensions-in-cm", label: "Common product dimensions in cm" },
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
