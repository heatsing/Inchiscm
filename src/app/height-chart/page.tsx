import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { toolSeoContent } from "@/data/tools";
import { PopularHeightLinks } from "@/components/PopularHeightLinks";
import { formatNumber, heights, heightSlug, heightToCm } from "@/lib/conversions";
import { heightFeetInchesMark } from "@/lib/height-seo";
import { heightSpelledLabel } from "@/lib/url-clusters";
import { breadcrumbSchema, graphSchema, siteUrl, webApplicationSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/height-chart");

export default function HeightChartPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "Feet and Inches to CM Height Chart", description: "Compare heights from 4 feet to 7 feet in centimeters, with one-inch increments and detailed conversion pages.", path: "/height-chart" }),
        webApplicationSchema({ name: "Height Chart", description: "Compare heights from 4 feet to 7 feet in centimeters.", path: "/height-chart" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Height Chart", path: "/height-chart" }]),
        { "@type": "Dataset", name: "Feet and Inches to CM Height Chart", url: `${siteUrl}/height-chart` },
      ])} />
      <Breadcrumbs current="Height Chart" wide />
      <article className="shell content-page">
        <div className="eyebrow">Height reference</div>
        <h1>Feet and Inches to CM Height Chart</h1>
        <p className="lead">Compare heights from {heightFeetInchesMark(4, 0)} through {heightFeetInchesMark(7, 0)}. Every result uses the exact 2.54 cm-per-inch definition.</p>
        <PopularHeightLinks
          heading="Popular heights"
          description="Start with the highest-impression heights, then scan the full chart for every one-inch step."
        />
        <h2>Full height chart</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Feet and inches to centimeters height conversions</caption>
            <thead><tr><th>Height</th><th>Total inches</th><th>Centimeters</th><th>Details</th></tr></thead>
            <tbody>{heights.map(({ feet, inches }) => <tr key={`${feet}-${inches}`}><td>{heightFeetInchesMark(feet, inches)}</td><td>{feet * 12 + inches} in</td><td>{formatNumber(heightToCm(feet, inches))} cm</td><td><Link href={heightSlug(feet, inches)}>{heightSpelledLabel(feet, inches)}</Link></td></tr>)}</tbody>
          </table>
        </div>
        <ToolSEOContent config={toolSeoContent.heightChart} />
      </article>
    </>
  );
}
