import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { toolSeoContent } from "@/data/tools";
import { breadcrumbSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/feet-to-cm");

export default function FeetToCmPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "Feet to CM Converter", description: "Convert feet and inches to centimeters with the exact international conversion factor.", path: "/feet-to-cm" }),
        webApplicationSchema({ name: "Feet to CM Converter", description: "Convert feet and inches to centimeters with the exact international conversion factor.", path: "/feet-to-cm" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Feet to CM", path: "/feet-to-cm" }]),
      ])} />
      <Breadcrumbs current="Feet to CM Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Height and length conversion</div>
        <h1>Feet to CM Converter</h1>
        <p className="lead">Convert feet and optional inches to centimeters with the exact international conversion factor.</p>
        <FeetToCmConverter />
        <div className="answer-box"><div className="answer">1 foot = 30.48 cm</div><div className="formula">feet × 30.48 = centimeters</div></div>
        <h2>Common examples</h2>
        <div className="data-table-wrap"><table><caption>Common feet and inches measurements in centimeters</caption><thead><tr><th>Height</th><th>Centimeters</th></tr></thead><tbody>
          <tr><td>5 feet</td><td>152.4 cm</td></tr><tr><td>5 feet 8 inches</td><td>172.72 cm</td></tr><tr><td>6 feet</td><td>182.88 cm</td></tr>
        </tbody></table></div>
        <h2>Related conversions</h2>
        <p><Link href="/height-converter">Use the height converter</Link>, browse the <Link href="/height-chart">feet-and-inches height chart</Link>, or learn <Link href="/how-to-convert-inches-to-cm">how inch conversion works</Link>.</p>
        <AdSlot />
        <ToolSEOContent config={toolSeoContent.feetToCm} />
      </article>
    </>
  );
}
