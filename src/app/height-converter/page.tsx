import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
import { formatNumber, heightSlug, heightToCm } from "@/lib/conversions";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Height Converter - Feet and Inches to CM", "Convert a height such as 5'8\" or 6 ft 2 in to centimeters instantly, with exact formulas and common height links.", "/height-converter");

const faq = [
  { question: "How do I convert feet and inches to cm?", answer: "Multiply feet by 12, add the remaining inches, then multiply total inches by 2.54." },
  { question: "What is 5'8\" in cm?", answer: "Five feet eight inches is exactly 172.72 cm." },
  { question: "How should I enter a height?", answer: "Enter the feet and remaining inches in the two labeled fields. The inches field accepts values from 0 through 11." },
];

const commonHeights = [[4, 7], [4, 10], [5, 5], [6, 1], [6, 3], [6, 4], [6, 5], [6, 8], [6, 11]];

export default function HeightConverterPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Height Converter", path: "/height-converter" }]), faqSchema(faq)]} />
      <Breadcrumbs current="Height Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Feet and inches to centimeters</div>
        <h1>Height Converter - Feet and Inches to CM</h1>
        <p className="lead">Enter feet and inches in separate fields to convert a height to centimeters instantly.</p>
        <FeetToCmConverter defaultFeet={5} defaultInches={8} />
        <div className="answer-box">
          <div className="answer">5&apos;8&quot; = 172.72 cm</div>
          <div className="formula">(5 × 12 + 8) × 2.54 = 172.72 cm</div>
        </div>
        <h2>Height conversion formula</h2>
        <p>Multiply feet by 12, add the remaining inches, then multiply the total inches by 2.54 to get centimeters.</p>
        <div className="formula">feet × 12 + inches = total inches<br />total inches × 2.54 = cm</div>
        <h2>Why feet and inches are converted to centimeters</h2>
        <p>Feet and inches are common in US height listings, while centimeters are used in many international forms, profiles, charts, and measurement systems. Converting the height to total inches first keeps the calculation clear and exact.</p>
        <h2>Common height conversions</h2>
        <div className="data-table-wrap">
          <table>
            <caption>High-impression height conversions in centimeters</caption>
            <thead><tr><th>Height</th><th>Total inches</th><th>Centimeters</th><th>Details</th></tr></thead>
            <tbody>
              {commonHeights.map(([feet, inches]) => (
                <tr key={`${feet}-${inches}`}>
                  <td>{feet}&apos;{inches}&quot;</td>
                  <td>{feet * 12 + inches}</td>
                  <td>{formatNumber(heightToCm(feet, inches))} cm</td>
                  <td><Link href={heightSlug(feet, inches)}>{feet}&apos;{inches}&quot; in cm</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Related length tools</h2>
        <ul className="link-list">
          <li><Link href="/inches-to-cm">Inches to cm converter</Link></li>
          <li><Link href="/cm-to-inches">CM to inches converter</Link></li>
          <li><Link href="/inch-to-cm-chart">Inch to cm chart</Link></li>
        </ul>
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
