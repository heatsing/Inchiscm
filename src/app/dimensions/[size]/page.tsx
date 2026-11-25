import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DimensionsConverter } from "@/components/DimensionsConverter";
import { DimensionDiagram } from "@/components/DimensionDiagram";
import { DimensionFacts } from "@/components/DimensionFacts";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import {
  dimensionFaq, dimensionHub, dimensionPageSummary, dimensionReverseHref, formatDimensionMeasure,
  getDimensionEntry, nearbyDimensionEntries, publishedDimensionEntries,
} from "@/data/page-registry/dimension-catalog";
import { registryMetadata } from "@/data/page-registry";
import { breadcrumbSchema, faqSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

type Params = Promise<{ size: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedDimensionEntries.map((row) => ({ size: row.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const row = getDimensionEntry((await params).size);
  return row ? registryMetadata(row.href) : {};
}

export default async function ExactDimensionPage({ params }: { params: Params }) {
  const row = getDimensionEntry((await params).size);
  if (!row) notFound();

  const summary = dimensionPageSummary(row);
  const { answer, h1, mode, ratio, isRounded, description } = summary;
  const directions = mode === 2 ? ["Width", "Height"] : ["Length", "Width", "Height"];
  const operator = row.direction === "in-to-cm" ? "×" : "÷";
  const hub = dimensionHub(row.direction);
  const hubLabel = row.direction === "in-to-cm" ? "Inches to CM Dimensions" : "CM to Inches Dimensions";
  const reverse = dimensionReverseHref(row, summary.converted);
  const faq = dimensionFaq(row, summary);
  const nearby = nearbyDimensionEntries(row);
  const sideProduct = row.values.join(" × ");
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: h1, description, path: row.href }),
        webApplicationSchema({ name: h1, description, path: row.href }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: hubLabel, path: hub }, { name: h1, path: row.href }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current={h1} />
      <article className="narrow content-page dimension-detail">
        <h1>{h1}</h1>
        <div className="answer-box" id="direct-answer">
          <div className="answer">{answer}</div>
          <div>{isRounded ? "Converted sides are rounded to four decimal places." : "All converted sides are exact."}</div>
        </div>
        <DimensionsConverter direction={row.direction} defaultLength={row.values[0]} defaultWidth={row.values[1]} defaultHeight={row.values[2] ?? 1} defaultMode={mode} />
        <h2>Conversion formula</h2>
        <div className="formula">Each side in {row.from} {operator} 2.54 → that side in {row.to}</div>
        <h2>Calculation steps</h2>
        <ol>{row.values.map((side, index) => {
          const result = formatDimensionMeasure(summary.converted[index], row.to, 4);
          return <li key={directions[index]}><strong>{directions[index]}:</strong> {side} {operator} 2.54 {result.startsWith("≈") ? result : `= ${result}`}</li>;
        })}</ol>
        <h2>{mode === 2 ? "Area and aspect ratio" : "Volume and liters"}</h2>
        {mode === 2
          ? <p>Multiply the original width and height first: {sideProduct} = {formatDimensionMeasure(summary.sourceMeasure, `${row.from}²`)}. Convert the area using 1 in² = 6.4516 cm². Both sides scale equally, so the ratio stays {ratio}.</p>
          : <p>Multiply the original length, width, and height: {sideProduct} = {formatDimensionMeasure(summary.sourceMeasure, `${row.from}³`)}. Use 1 in³ = 16.387064 cm³ and 1 L = 1,000 cm³. A rectangular outside volume can differ from usable capacity.</p>}
        <DimensionFacts row={row} summary={summary} />
        <h2>Dimension diagram</h2>
        <DimensionDiagram sides={row.values} unit={row.from} />
        <h2>How to use this measurement</h2>
        <p>{row.example}</p>
        <p>{mode === 2 ? "For an actual fit, measure the full sheet and its available opening separately." : "Check the actual outside measurements, including protrusions, and compare them with the specific space or limits that apply."}</p>
        <h2>Nearby dimensions</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Compare other {mode}D sizes from the same chart</caption>
            <thead><tr><th scope="col">Size in {row.from}</th><th scope="col">Converted size in {row.to}</th>{mode === 3 && <th scope="col">Liters</th>}</tr></thead>
            <tbody>{nearby.map((item) => {
              const result = dimensionPageSummary(item);
              return <tr key={item.href}><th scope="row"><Link href={item.href}>{result.source}</Link></th><td>{result.isRounded ? "≈ " : ""}{result.target}</td>{mode === 3 && <td>{formatDimensionMeasure(result.liters!, "L", 9)}</td>}</tr>;
            })}</tbody>
          </table>
        </div>
        <h2>Related conversions</h2>
        <ul>
          <li><Link href={`${hub}#${mode}d`}>{mode}D {hubLabel} chart</Link></li>
          <li><Link href={reverse}>Convert this size back to {row.from === "in" ? "inches" : "centimeters"}</Link></li>
          <li><Link href={mode === 2 ? "/common-product-dimensions-in-cm" : "/how-to-read-box-dimensions"}>{mode === 2 ? "Common product measurements" : "How to read box dimensions"}</Link></li>
        </ul>
        <Faq items={faq} />
      </article>
    </>
  );
}
