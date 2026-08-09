import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { Converter } from "./Converter";
import { JsonLd } from "./JsonLd";
import { ToolSEOContent } from "./ToolSEOContent";
import { cmSlug, cmToInches, formatNumber, inchSlug, inchesToCm } from "@/lib/conversions";
import { toolSeoContent, type ToolSEOKey } from "@/data/tools";
import { graphSchema, breadcrumbSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

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
  const instantResult = mode === "in-to-cm"
    ? `${formatNumber(initialValue)} ${initialValue === 1 ? "inch" : "inches"} = ${formatNumber(inchesToCm(initialValue))} cm`
    : `${formatNumber(initialValue)} cm = ${formatNumber(cmToInches(initialValue))} inches`;
  const isFocusedInchesToCm = path === "/inches-to-cm";
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: title, description: intro, path }),
        webApplicationSchema({ name: title, description: intro, path }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: title, path }]),
      ])} />
      <Breadcrumbs current={title} />
      <article className="narrow content-page">
        <div className="eyebrow">Conversion tool</div>
        <h1>{title}</h1>
        <p className="lead">{intro}</p>
        <div className="answer-box">
          <div className="answer">{instantResult}</div>
          <div>{mode === "in-to-cm" ? "Example result using the exact 1 inch = 2.54 cm definition." : "Example result using centimeters ÷ 2.54 = inches."}</div>
          {isFocusedInchesToCm && <div>Use the homepage as the broad length-converter hub; use this page for inch-specific examples, chart links, and exact-value inch pages.</div>}
        </div>
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
        <h2>Conversion table</h2>
        <div className="data-table-wrap">
          <table>
            <caption>{mode === "in-to-cm" ? "Common inches converted to centimeters" : "Common centimeters converted to inches"}</caption>
            <thead><tr><th>Input</th><th>Result</th><th>Detailed page</th></tr></thead>
            <tbody>
              {examples.map((value) => (
                <tr key={value}>
                  <td>{value} {mode === "in-to-cm" ? (value === 1 ? "inch" : "inches") : "cm"}</td>
                  <td>{mode === "in-to-cm" ? `${formatNumber(inchesToCm(value))} cm` : `${formatNumber(cmToInches(value))} inches`}</td>
                  <td>
                    <Link href={mode === "in-to-cm" ? inchSlug(value) : cmSlug(value)}>
                      View calculation
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="methodology-link">Review the <Link href="/conversion-methodology">conversion factors, rounding, and authoritative sources</Link>.</p>
        <ToolSEOContent config={toolSeoContent[toolKey]} />
      </article>
    </>
  );
}
