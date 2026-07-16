import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LengthConverter } from "@/components/LengthConverter";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Inches to MM Converter - Convert Inches to Millimeters",
  "Convert inches to millimeters using the exact 25.4 conversion factor, with examples and related metric conversions.",
  "/inches-to-mm",
);

const faq = [
  { question: "How many millimeters are in one inch?", answer: "One inch equals exactly 25.4 millimeters." },
  { question: "How do you convert inches to millimeters?", answer: "Multiply the inch measurement by 25.4." },
  { question: "Is 10 inches exactly 254 mm?", answer: "Yes. Ten multiplied by the exact factor 25.4 equals 254 millimeters." },
];

export default function InchesToMmPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Inches to MM", path: "/inches-to-mm" }]), faqSchema(faq)]} />
      <Breadcrumbs current="Inches to MM Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Inch to millimeter conversion</div>
        <h1>Inches to MM Converter</h1>
        <p className="lead">Convert inches to millimeters for hardware, product dimensions, technical drawings, and small measurements.</p>
        <LengthConverter defaultFrom="in" defaultTo="mm" defaultValue={10} compact />
        <div className="answer-box"><div className="answer">1 inch = 25.4 mm</div><div className="formula">inches × 25.4 = millimeters</div></div>
        <h2>Common examples</h2>
        <p>A half inch is 12.7 mm, 2 inches is 50.8 mm, and 10 inches is exactly 254 mm. Millimeters are useful where centimeter precision is not detailed enough.</p>
        <h2>Related conversions</h2>
        <p>Use the <Link href="/inches-to-cm">inches-to-centimeters converter</Link>, compare values in the <Link href="/inch-to-cm-chart">inch-to-cm chart</Link>, or open <Link href="/10-inches-in-cm">10 inches in centimeters</Link>.</p>
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
