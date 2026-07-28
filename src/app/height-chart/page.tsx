import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { toolSeoContent } from "@/data/tools";
import { formatNumber, heights, heightSlug, heightToCm } from "@/lib/conversions";
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
        <p className="lead">Compare heights from 4&apos;0&quot; through 7&apos;0&quot;. Every result uses the exact 2.54 cm-per-inch definition.</p>
        <div className="data-table-wrap">
          <table>
            <caption>Feet and inches to centimeters height conversions</caption>
            <thead><tr><th>Height</th><th>Total inches</th><th>Centimeters</th><th>Details</th></tr></thead>
            <tbody>{heights.map(({ feet, inches }) => <tr key={`${feet}-${inches}`}><td>{feet}&apos;{inches}&quot;</td><td>{feet * 12 + inches} in</td><td>{formatNumber(heightToCm(feet, inches))} cm</td><td><Link href={heightSlug(feet, inches)}>View {feet}&apos;{inches}&quot;</Link></td></tr>)}</tbody>
          </table>
        </div>
        <ToolSEOContent config={toolSeoContent.heightChart} />
      </article>
    </>
  );
}
