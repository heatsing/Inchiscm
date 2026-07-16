import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
import { heightSlug } from "@/lib/conversions";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Height Converter - Feet and Inches to CM", "Convert a height such as 5'8\" or 6 ft 2 in to centimeters instantly, with exact formulas and common height links.", "/height-converter");

const faq = [
  { question: "How do I convert feet and inches to cm?", answer: "Multiply feet by 12, add the remaining inches, then multiply total inches by 2.54." },
  { question: "What is 5'8\" in cm?", answer: "Five feet eight inches is exactly 172.72 cm." },
  { question: "How should I enter a height?", answer: "Enter the feet and remaining inches in the two labeled fields. The inches field accepts values from 0 through 11." },
];

export default function HeightConverterPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Height Converter", path: "/height-converter" }]), faqSchema(faq)]} />
      <Breadcrumbs current="Height Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Feet and inches to centimeters</div>
        <h1>Height Converter</h1>
        <p className="lead">Enter feet and inches in separate fields to convert a height to centimeters instantly.</p>
        <FeetToCmConverter defaultFeet={5} defaultInches={8} />
        <div className="answer-box">
          <div className="answer">5&apos;8&quot; = 172.72 cm</div>
          <div className="formula">(5 × 12 + 8) × 2.54 = 172.72 cm</div>
        </div>
        <h2>Popular heights</h2>
        <ul className="link-list">
          {[[5, 4], [5, 6], [5, 8], [5, 10], [6, 0], [6, 2], [6, 4], [6, 6]].map(([feet, inches]) => <li key={`${feet}-${inches}`}><Link href={heightSlug(feet, inches)}>{feet}&apos;{inches}&quot; in cm</Link></li>)}
        </ul>
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
