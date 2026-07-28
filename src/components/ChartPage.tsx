import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { ConversionTable } from "./ConversionTable";
import { Converter } from "./Converter";
import { JsonLd } from "./JsonLd";
import { ToolSEOContent } from "./ToolSEOContent";
import { toolSeoContent } from "@/data/tools";
import { breadcrumbSchema, graphSchema, siteUrl, webApplicationSchema, webPageSchema } from "@/lib/seo";

export function ChartPage({ title, intro, path, direction, values }: { title: string; intro: string; path: string; direction: "in-to-cm" | "cm-to-in"; values: number[] }) {
  const isInches = direction === "in-to-cm";
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: title, description: intro, path }),
        webApplicationSchema({ name: title, description: intro, path }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: title, path }]),
        { "@context": "https://schema.org", "@type": "Dataset", name: title, description: intro, url: `${siteUrl}${path}`, creator: { "@type": "Organization", name: "Inch is CM" } },
      ])} />
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
        <ToolSEOContent config={isInches ? toolSeoContent.inchChart : toolSeoContent.cmChart} />
      </article>
    </>
  );
}
