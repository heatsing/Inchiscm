import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LengthConverter } from "@/components/LengthConverter";
import { RelatedLinks } from "@/components/RelatedLinks";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "MM to Inches Converter - Convert Millimeters to Inches",
  "Convert millimeters to inches for hardware, small parts, product dimensions, drawings, and metric-to-imperial size checks.",
  "/mm-to-inches",
);

const faq: FaqItem[] = [
  { question: "How do I convert mm to inches?", answer: "Divide the millimeter value by 25.4 to get inches." },
  { question: "How many inches is 10 mm?", answer: "10 mm is approximately 0.3937 inches." },
  { question: "Is 25.4 mm exactly 1 inch?", answer: "Yes. One inch is defined as exactly 25.4 millimeters." },
  { question: "When should I use millimeters instead of centimeters?", answer: "Use millimeters for small parts, hardware, drawings, and dimensions where centimeter rounding is too coarse." },
];

const examples = [
  ["2 mm", "0.0787 inches", "Thin parts, small gaps, and close tolerances."],
  ["5 mm", "0.1969 inches", "Small hardware and compact product details."],
  ["10 mm", "0.3937 inches", "A common metric size close to four-tenths of an inch."],
  ["25.4 mm", "1 inch", "Exact inch reference."],
  ["100 mm", "3.937 inches", "One-tenth of a meter in inches."],
];

export default function MmToInchesPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "MM to Inches", path: "/mm-to-inches" }]),
        faqSchema(faq),
      ]} />
      <Breadcrumbs current="MM to Inches Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Millimeter to inch conversion</div>
        <h1>MM to Inches Converter</h1>
        <p className="lead">Convert millimeters to inches for hardware, small parts, technical drawings, product specs, and metric-to-imperial size checks.</p>

        <LengthConverter defaultFrom="mm" defaultTo="in" defaultValue={10} compact presets={[2, 5, 10, 25.4, 100]} />

        <div className="answer-box">
          <div className="answer">10 mm = 0.3937 inches</div>
          <div className="formula">millimeters / 25.4 = inches</div>
        </div>

        <h2>How to convert millimeters to inches</h2>
        <p>Divide the millimeter value by exactly 25.4. The factor is exact because one inch is defined as exactly 25.4 millimeters.</p>

        <h2>Common mm to inches examples</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Common millimeter values converted to inches</caption>
            <thead><tr><th>Millimeters</th><th>Inches</th><th>Use case</th></tr></thead>
            <tbody>
              {examples.map(([input, result, note]) => (
                <tr key={input}><td>{input}</td><td>{result}</td><td>{note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Who this tool is for</h2>
        <ul>
          <li>People comparing metric hardware, fasteners, small parts, and product dimensions with inch-based specs.</li>
          <li>Makers, repair users, students, and shoppers who need readable decimal inches from millimeters.</li>
          <li>Anyone checking whether a small metric measurement is close to a familiar inch or fractional-inch size.</li>
        </ul>

        <h2>Related tools</h2>
        <RelatedLinks sections={[
          {
            title: "Metric and inch tools",
            links: [
              { href: "/inches-to-mm", label: "Inches to mm converter" },
              { href: "/inches-to-cm", label: "Inches to cm converter" },
              { href: "/cm-to-inches", label: "CM to inches converter" },
            ],
          },
          {
            title: "Reference pages",
            links: [
              { href: "/conversion-methodology", label: "Conversion methodology" },
              { href: "/inch-to-cm-chart", label: "Inch to cm chart" },
            ],
          },
        ]} />

        <p className="methodology-link">For exact factors and rounding, review the <Link href="/conversion-methodology">conversion methodology</Link>.</p>
        <Faq items={faq} />
      </article>
    </>
  );
}
