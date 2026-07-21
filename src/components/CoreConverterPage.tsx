import Link from "next/link";
import { AdSlot } from "./AdSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { Converter } from "./Converter";
import { Faq, type FaqItem } from "./Faq";
import { JsonLd } from "./JsonLd";
import { RelatedLinks, type RelatedLinkSection } from "./RelatedLinks";
import { cmSlug, inchSlug } from "@/lib/conversions";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

export function CoreConverterPage({
  title,
  intro,
  mode,
  formula,
  faq,
  path,
  initialValue = 10,
}: {
  title: string;
  intro: string;
  mode: "in-to-cm" | "cm-to-in";
  formula: string;
  faq: FaqItem[];
  path: string;
  initialValue?: number;
}) {
  const examples = mode === "in-to-cm" ? [1, 5, 10, 12, 24] : [1, 10, 25.4, 30, 50, 100];
  const relatedSections: RelatedLinkSection[] = mode === "in-to-cm"
    ? [
      {
        title: "Main tools",
        links: [
          { href: "/cm-to-inches", label: "CM to inches converter" },
          { href: "/inch-to-cm-chart", label: "Inch to cm chart" },
          { href: "/height-converter", label: "Height converter" },
        ],
      },
      {
        title: "Popular exact conversions",
        links: [1, 10, 12, 24].map((value) => ({ href: inchSlug(value), label: `${value} ${value === 1 ? "inch" : "inches"} in cm` })),
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
          { href: "/inches-to-cm", label: "Inches to cm converter" },
          { href: "/cm-to-inch-chart", label: "CM to inch chart" },
          { href: "/height-converter", label: "Height converter" },
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
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: title, path }]), faqSchema(faq)]} />
      <Breadcrumbs current={title} />
      <article className="narrow content-page">
        <div className="eyebrow">Conversion tool</div>
        <h1>{title}</h1>
        <p className="lead">{intro}</p>
        <Converter initialMode={mode} initialValue={initialValue} />
        <h2>Common examples</h2>
        <ul className="link-list">
          {examples.map((value) => (
            <li key={value}>
              <Link href={mode === "in-to-cm" ? inchSlug(value) : cmSlug(value)}>
                {value} {mode === "in-to-cm" ? `${value === 1 ? "inch" : "inches"} in cm` : "cm in inches"}
              </Link>
            </li>
          ))}
        </ul>
        <h2>The conversion formula</h2>
        <p>{mode === "in-to-cm" ? "One inch is exactly 2.54 centimeters." : "One centimeter is approximately 0.3937008 inches."} Use this formula:</p>
        <div className="formula">{formula}</div>
        <p className="methodology-link">Review the <Link href="/conversion-methodology">conversion factors, rounding, and authoritative sources</Link>.</p>
        <h2>Useful references</h2>
        <RelatedLinks sections={relatedSections} />
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
