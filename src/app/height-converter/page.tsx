import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Converter } from "@/components/Converter";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { heightSlug } from "@/lib/conversions";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Height Converter - Feet and Inches to CM", "Convert a height such as 5'8\" or 6 ft 2 in to centimeters instantly, with exact formulas and common height links.", "/height-converter");

const faq = [
  { question: "How do I convert feet and inches to cm?", answer: "Multiply feet by 12, add the remaining inches, then multiply total inches by 2.54." },
  { question: "What is 5'8\" in cm?", answer: "Five feet eight inches is exactly 172.72 cm." },
  { question: "Does the converter accept typed height formats?", answer: "Yes. You can enter formats such as 5'8\", 5 ft 8 in, or 6 feet." },
];

export default function HeightConverterPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Height Converter", path: "/height-converter" }]), faqSchema(faq)]} />
      <Breadcrumbs current="Height Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Feet and inches to centimeters</div>
        <h1>Height Converter</h1>
        <p className="lead">Type a height such as 5&apos;8&quot; or 6 ft 2 in to convert it to centimeters instantly.</p>
        <Converter initialValue={68} initialMode="in-to-cm" />
        <h2>Popular heights</h2>
        <ul className="link-list">
          {[[5, 4], [5, 6], [5, 8], [5, 10], [6, 0], [6, 2], [6, 4], [6, 6]].map(([feet, inches]) => <li key={`${feet}-${inches}`}><Link href={heightSlug(feet, inches)}>{feet}&apos;{inches}&quot; in cm</Link></li>)}
        </ul>
        <Faq items={faq} />
      </article>
    </>
  );
}
