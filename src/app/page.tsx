import Link from "next/link";
import { Converter } from "@/components/Converter";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { cmSlug, inchSlug } from "@/lib/conversions";
import { faqSchema, siteUrl } from "@/lib/seo";

const faq = [
  { question: "How many cm is 1 inch?", answer: "One inch is exactly 2.54 centimeters. This is a defined international conversion, not an estimate." },
  { question: "How do you convert inches to cm?", answer: "Multiply the number of inches by 2.54. For example, 10 × 2.54 = 25.4 cm." },
  { question: "Is 10 inches exactly 25.4 cm?", answer: "Yes. Because one inch is exactly 2.54 cm, 10 inches is exactly 25.4 cm." },
  { question: "Why do some websites round inch to cm conversions?", answer: "Long decimal results are often rounded for readability. The converter here keeps up to four decimal places while using the exact 2.54 conversion factor." },
  { question: "What is the easiest way to convert inches to cm?", answer: "Use the converter above for an instant answer, or multiply inches by 2.54 when calculating by hand." },
];

const popular = [1, 2, 5, 10, 12, 24, 36, 55];

export default function Home() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Inch to CM Converter",
          url: siteUrl,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: "Convert inches to centimeters and centimeters to inches instantly.",
        },
        faqSchema(faq),
      ]} />
      <section className="hero">
        <div className="shell">
          <div className="eyebrow">Exact measurement conversion</div>
          <h1>Inch to CM Converter</h1>
          <p className="lead">Convert inches to centimeters instantly, with formulas, examples, and common size references.</p>
          <Converter />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="quick-answer">
            <div><strong>1 inch = 2.54 cm</strong><div className="subtle">The inch has been defined as exactly 2.54 centimeters since 1959.</div></div>
            <code>inches × 2.54 = centimeters</code>
          </div>

          <h2>Popular inch conversions</h2>
          <ul className="link-list">
            {popular.map((value) => <li key={value}><Link href={inchSlug(value)}>{value} {value === 1 ? "inch" : "inches"} in cm</Link></li>)}
          </ul>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <h2>Common conversion charts</h2>
          <div className="grid two">
            <div className="card">
              <h3>Inch to cm chart</h3>
              <p>Scan common values from 1 to 100 inches and open a detailed conversion.</p>
              <Link className="button" href="/inch-to-cm-chart">View inch chart</Link>
            </div>
            <div className="card">
              <h3>CM to inch chart</h3>
              <p>Compare centimeters with decimal and fractional inch equivalents.</p>
              <Link className="button" href="/cm-to-inch-chart">View cm chart</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <h2>Convert measurements for real life</h2>
          <div className="grid">
            {[
              ["Product dimensions", "Switch package and product measurements between US and metric units.", "/common-product-dimensions-in-cm"],
              ["Screen sizes", "Understand laptop, monitor, tablet, and TV diagonal measurements.", "/screen-size-converter"],
              ["Height conversion", "Enter feet and inches to get an exact height in centimeters.", "/height-converter"],
              ["Furniture", "Check whether furniture dimensions fit a room or doorway.", inchSlug(36)],
              ["Clothing and body", "Convert body measurements when comparing international size charts.", cmSlug(80)],
              ["DIY and construction", "Translate plans and material sizes without losing precision.", "/how-to-convert-inches-to-cm"],
            ].map(([title, text, href]) => (
              <div className="card" key={title}>
                <h3>{title}</h3><p>{text}</p><Link href={href}>Explore →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="narrow">
          <Faq items={faq} />
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <h2>Related tools</h2>
          <ul className="link-list">
            <li><Link href="/cm-to-inches">CM to Inches</Link></li>
            <li><Link href="/height-converter">Feet & Inches to CM</Link></li>
            <li><Link href="/height-chart">Height Chart</Link></li>
            <li><Link href="/screen-size-converter">Screen Size Converter</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
