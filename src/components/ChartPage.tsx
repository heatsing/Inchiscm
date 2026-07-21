import Link from "next/link";
import { AdSlot } from "./AdSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { ConversionTable } from "./ConversionTable";
import { Converter } from "./Converter";
import { Faq } from "./Faq";
import { JsonLd } from "./JsonLd";
import { RelatedLinks, type RelatedLinkSection } from "./RelatedLinks";
import { cmSlug, inchSlug } from "@/lib/conversions";
import { breadcrumbSchema, siteUrl } from "@/lib/seo";

export function ChartPage({ title, intro, path, direction, values }: { title: string; intro: string; path: string; direction: "in-to-cm" | "cm-to-in"; values: number[] }) {
  const isInches = direction === "in-to-cm";
  const relatedSections: RelatedLinkSection[] = isInches
    ? [
      {
        title: "Main tools",
        links: [
          { href: "/inches-to-cm", label: "Inches to cm converter" },
          { href: "/cm-to-inches", label: "CM to inches converter" },
          { href: "/height-converter", label: "Height converter" },
        ],
      },
      {
        title: "Popular exact conversions",
        links: [10, 12, 24, 36].map((value) => ({ href: inchSlug(value), label: `${value} inches in cm` })),
      },
      {
        title: "Helpful guides",
        links: [
          { href: "/how-to-convert-inches-to-cm", label: "Inch to cm formula guide" },
          { href: "/inch-vs-cm", label: "Inch vs cm explained" },
        ],
      },
    ]
    : [
      {
        title: "Main tools",
        links: [
          { href: "/cm-to-inches", label: "CM to inches converter" },
          { href: "/inches-to-cm", label: "Inches to cm converter" },
          { href: "/inch-to-cm-chart", label: "Inch to cm chart" },
        ],
      },
      {
        title: "Popular exact conversions",
        links: [10, 25.4, 30, 100].map((value) => ({ href: cmSlug(value), label: `${value} cm in inches` })),
      },
      {
        title: "Helpful guides",
        links: [
          { href: "/inch-vs-cm", label: "Inch vs cm explained" },
          { href: "/conversion-methodology", label: "Conversion methodology" },
        ],
      },
    ];
  const faq = [
    {
      question: isInches ? "How do I use the inch to cm chart?" : "How do I use the cm to inch chart?",
      answer: isInches ? "Find the inch value in the first column and read its exact centimeter equivalent beside it." : "Find the centimeter value in the first column and read its rounded inch equivalent beside it.",
    },
    {
      question: isInches ? "Is one inch exactly 2.54 cm?" : "Why are cm-to-inch results rounded?",
      answer: isInches ? "Yes. One inch is defined as exactly 2.54 centimeters." : "Most centimeter values produce repeating decimal inches, so the chart displays up to four decimal places.",
    },
  ];
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: title, path }]),
        { "@context": "https://schema.org", "@type": "Dataset", name: title, description: intro, url: `${siteUrl}${path}`, creator: { "@type": "Organization", name: "Inch is CM" } },
      ]} />
      <Breadcrumbs current={title} wide />
      <article className="shell content-page">
        <div className="eyebrow">Reference chart</div>
        <h1>{title}</h1>
        <p className="lead">{intro}</p>
        <Converter initialMode={direction} compact />
        <div className="answer-box">
          <div className="answer">{isInches ? "1 inch = 2.54 cm" : "1 cm ≈ 0.3937 inches"}</div>
          <div className="formula">{isInches ? "inches × 2.54 = centimeters" : "centimeters ÷ 2.54 = inches"}</div>
        </div>
        <p className="methodology-link">Review the <Link href="/conversion-methodology">conversion factors, rounding, and authoritative sources</Link>.</p>
        <p>
          <Link href={isInches ? "/cm-to-inch-chart" : "/inch-to-cm-chart"}>
            View the reverse conversion chart →
          </Link>
        </p>
        <ConversionTable direction={direction} values={values} />
        <h2>Related conversion tools</h2>
        <RelatedLinks sections={relatedSections} />
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
