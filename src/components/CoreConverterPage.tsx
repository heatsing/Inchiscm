import Link from "next/link";
import { AdSlot } from "./AdSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { Converter } from "./Converter";
import { Faq, type FaqItem } from "./Faq";
import { JsonLd } from "./JsonLd";
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
        <h2>Useful references</h2>
        <div className="grid two">
          <div className="card"><h3>Browse a chart</h3><p>Compare many common measurements at a glance.</p><Link href={mode === "in-to-cm" ? "/inch-to-cm-chart" : "/cm-to-inch-chart"}>Open the chart →</Link></div>
          <div className="card"><h3>Convert height</h3><p>Enter a height such as 5&apos;8&quot; or 6 ft 2 in.</p><Link href="/height-converter">Open height converter →</Link></div>
        </div>
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
