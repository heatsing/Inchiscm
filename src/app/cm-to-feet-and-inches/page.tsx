import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { CmToFeetAndInchesConverter } from "@/components/SpecializedConverters";
import { breadcrumbSchema, faqSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/cm-to-feet-and-inches");

const faq: FaqItem[] = [
  { question: "How do I convert cm to feet and inches?", answer: "Divide centimeters by 2.54 to get total inches, then divide total inches by 12 to separate feet and remaining inches." },
  { question: "What is 170 cm in feet and inches?", answer: "170 cm is approximately 5 ft 6.9291 in, often rounded to about 5 ft 7 in." },
  { question: "Is cm to feet and inches exact?", answer: "The centimeter-to-inch factor is exact, but the final feet-and-inches display is usually rounded." },
  { question: "Should I round height to the nearest inch?", answer: "For casual height descriptions, nearest inch is common. For forms or records, use the precision requested by that form." },
];

const examples = [
  ["150 cm", "4 ft 11.0551 in", "Common height reference."],
  ["160 cm", "5 ft 2.9921 in", "Often rounded to about 5 ft 3 in."],
  ["170 cm", "5 ft 6.9291 in", "Often rounded to about 5 ft 7 in."],
  ["180 cm", "5 ft 10.8661 in", "Often rounded to about 5 ft 11 in."],
  ["190 cm", "6 ft 2.8031 in", "Often rounded to about 6 ft 3 in."],
];

export default function CmToFeetAndInchesPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "CM to Feet and Inches Converter", description: "Convert centimeters to feet and inches for height values, profiles, forms, sports references, and metric-to-imperial height checks.", path: "/cm-to-feet-and-inches" }),
        webApplicationSchema({ name: "CM to Feet and Inches Converter", description: "Convert centimeters to feet and inches for height values, profiles, forms, sports references, and metric-to-imperial height checks.", path: "/cm-to-feet-and-inches" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "CM to Feet and Inches", path: "/cm-to-feet-and-inches" }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current="CM to Feet and Inches" />
      <article className="narrow content-page">
        <div className="eyebrow">Metric height conversion</div>
        <h1>CM to Feet and Inches Converter</h1>
        <p className="lead">Convert centimeters to feet and inches for height values, profiles, forms, sports references, and metric-to-imperial height checks.</p>

        <CmToFeetAndInchesConverter defaultCm={170} />

        <div className="answer-box">
          <div className="answer">170 cm = 5 ft 6.9291 in</div>
          <div className="formula">170 / 2.54 = 66.9291 total inches</div>
        </div>

        <h2>How to convert cm to feet and inches</h2>
        <p>First divide centimeters by 2.54 to get total inches. Then divide total inches by 12. The whole number is feet, and the remaining value is inches.</p>

        <h2>Common cm height conversions</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Common centimeter heights converted to feet and inches</caption>
            <thead><tr><th>Centimeters</th><th>Feet and inches</th><th>Note</th></tr></thead>
            <tbody>
              {examples.map(([input, result, note]) => (
                <tr key={input}><td>{input}</td><td>{result}</td><td>{note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Who this tool is for</h2>
        <ul>
          <li>People reading metric height values and needing the equivalent in feet and inches.</li>
          <li>Users filling profiles, sports bios, school records, travel forms, or comparison charts.</li>
          <li>Anyone checking values such as 160 cm, 170 cm, 180 cm, or 190 cm in feet and inches.</li>
        </ul>

        <h2>Related tools</h2>
        <RelatedLinks sections={[
          {
            title: "Height tools",
            links: [
              { href: "/height-converter", label: "Feet and inches to cm converter" },
              { href: "/height-chart", label: "Height chart" },
              { href: "/feet-to-cm", label: "Feet to cm converter" },
            ],
          },
          {
            title: "Length tools",
            links: [
              { href: "/cm-to-inches", label: "CM to inches converter" },
              { href: "/inches-to-cm", label: "Inches to cm converter" },
              { href: "/conversion-methodology", label: "Conversion methodology" },
            ],
          },
        ]} />

        <p className="methodology-link">Need the reverse direction? Use the <Link href="/height-converter">feet and inches to cm converter</Link>.</p>
        <Faq items={faq} />
      </article>
    </>
  );
}
