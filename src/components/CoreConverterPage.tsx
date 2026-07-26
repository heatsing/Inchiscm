import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { Converter } from "./Converter";
import { JsonLd } from "./JsonLd";
import { ToolSEOContent } from "./ToolSEOContent";
import { cmSlug, inchSlug } from "@/lib/conversions";
import { toolSeoContent, type ToolSEOKey } from "@/data/tools";
import { breadcrumbSchema } from "@/lib/seo";

export function CoreConverterPage({
  title,
  intro,
  mode,
  formula,
  path,
  toolKey,
  initialValue = 10,
}: {
  title: string;
  intro: string;
  mode: "in-to-cm" | "cm-to-in";
  formula: string;
  path: string;
  toolKey: ToolSEOKey;
  initialValue?: number;
}) {
  const examples = mode === "in-to-cm" ? [1, 5, 10, 12, 24] : [1, 10, 25.4, 30, 50, 100];
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: title, path }])]} />
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
        <ToolSEOContent config={toolSeoContent[toolKey]} />
      </article>
    </>
  );
}
