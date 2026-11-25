import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { ConversionTable } from "./ConversionTable";
import { Converter } from "./Converter";
import { JsonLd } from "./JsonLd";
import { RelatedLinks, type RelatedLink } from "./RelatedLinks";
import { ToolSEOContent } from "./ToolSEOContent";
import { toolSeoContent } from "@/data/tools";
import { breadcrumbSchema, graphSchema, siteUrl, webApplicationSchema, webPageSchema } from "@/lib/seo";
import { ChartActions } from "./ChartActions";
import { inchChartRows, inchChartCsv } from "@/lib/inch-chart-data";

export function ChartPage({
  title,
  intro,
  path,
  direction,
  values,
  extraLinkSections = [],
}: {
  title: string;
  intro: string;
  path: string;
  direction: "in-to-cm" | "cm-to-in";
  values: number[];
  extraLinkSections?: { title: string; links: RelatedLink[] }[];
}) {
  const isInches = direction === "in-to-cm";
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: title, description: intro, path }),
        webApplicationSchema({ name: title, description: intro, path }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: title, path }]),
        { "@type": "Dataset", name: title, description: intro, url: `${siteUrl}${path}`, creator: { "@type": "Organization", name: "Inch is CM" } },
      ])} />
      <Breadcrumbs current={title} wide />
      <article className={`shell content-page${isInches ? " inch-chart-page" : ""}`}>
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
        {isInches && <p>The reference includes 1–100 whole inches plus common ruler fractions and decimal sizes. Centimeters and millimeters use the same exact 2.54 cm per inch factor.</p>}
        {isInches && (
          <section id="printable-inch-cm" aria-labelledby="printable-inch-cm-title">
            <h2 id="printable-inch-cm-title">Printable Inch to CM Chart</h2>
            <p>Print the full two-column chart, or choose Save as PDF in your browser.</p>
            <ChartActions csv={inchChartCsv} filename="inches-to-cm-mm-chart.csv" allowCopy printLabel="Print / Save as PDF" />
          </section>
        )}
        <ConversionTable direction={direction} values={values} inchRows={isInches ? inchChartRows : undefined} />
        {extraLinkSections.length > 0 && (
          <>
            <h2>More published conversions</h2>
            <RelatedLinks sections={extraLinkSections} />
          </>
        )}
        <ToolSEOContent config={isInches ? toolSeoContent.inchChart : toolSeoContent.cmChart} />
      </article>
    </>
  );
}
