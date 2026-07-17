import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Feet to CM Converter - Feet and Inches to Centimeters",
  "Convert feet and inches to centimeters. Use the exact formula, common height examples, and nearby conversion tools.",
  "/feet-to-cm",
);

const faq = [
  { question: "How do you convert feet to centimeters?", answer: "Multiply feet by 30.48. If a height also includes inches, multiply those inches by 2.54 and add both results." },
  { question: "How many centimeters are in one foot?", answer: "One foot equals exactly 30.48 centimeters." },
  { question: "What is 5 feet 8 inches in centimeters?", answer: "Five feet eight inches equals exactly 172.72 centimeters." },
];

export default function FeetToCmPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Feet to CM", path: "/feet-to-cm" }]), faqSchema(faq)]} />
      <Breadcrumbs current="Feet to CM Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Height and length conversion</div>
        <h1>Feet to CM Converter</h1>
        <p className="lead">Convert feet and optional inches to centimeters with the exact international conversion factor.</p>
        <FeetToCmConverter />
        <div className="answer-box"><div className="answer">1 foot = 30.48 cm</div><div className="formula">feet × 30.48 = centimeters</div></div>
        <h2>Common examples</h2>
        <div className="data-table-wrap"><table><caption>Common feet and inches measurements in centimeters</caption><thead><tr><th>Height</th><th>Centimeters</th></tr></thead><tbody>
          <tr><td>5 feet</td><td>152.4 cm</td></tr><tr><td>5 feet 8 inches</td><td>172.72 cm</td></tr><tr><td>6 feet</td><td>182.88 cm</td></tr>
        </tbody></table></div>
        <h2>Related conversions</h2>
        <p><Link href="/height-converter">Use the height converter</Link>, browse the <Link href="/height-chart">feet-and-inches height chart</Link>, or learn <Link href="/how-to-convert-inches-to-cm">how inch conversion works</Link>.</p>
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
