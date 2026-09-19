import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { toolSeoContent } from "@/data/tools";
import { gscPriorityHeightEntries } from "@/lib/gsc-priority-heights";
import { breadcrumbSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/height-converter");

const popularHeights = gscPriorityHeightEntries();

export default function HeightConverterPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "Height Converter - Feet and Inches to CM", description: "Enter feet and inches in separate fields to convert a height to centimeters instantly.", path: "/height-converter" }),
        webApplicationSchema({ name: "Height Converter - Feet and Inches to CM", description: "Enter feet and inches in separate fields to convert a height to centimeters instantly.", path: "/height-converter" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Height Converter", path: "/height-converter" }]),
      ])} />
      <Breadcrumbs current="Height Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Feet and inches to centimeters</div>
        <h1>Height Converter - Feet and Inches to CM</h1>
        <p className="lead">Convert feet and inches to centimeters, or enter centimeters to get total inches, meters, and feet-plus-inches notation.</p>
        <FeetToCmConverter defaultFeet={5} defaultInches={8} />
        <div className="answer-box">
          <div className="answer">5&apos;8&quot; = 172.72 cm</div>
          <div>5&apos;8&quot; is 68 total inches, 172.72 centimeters, or 1.7272 meters.</div>
          <div className="formula">(5 × 12 + 8) × 2.54 = 172.72 cm</div>
        </div>
        <h2>Height conversion formula</h2>
        <p>Multiply feet by 12, add the remaining inches, then multiply the total inches by 2.54 to get centimeters.</p>
        <div className="formula">feet × 12 + inches = total inches<br />total inches × 2.54 = cm</div>
        <h2>Why feet, inches, centimeters, and meters are shown together</h2>
        <p>Feet and inches are common in US height listings, while centimeters and meters are used in many international forms, profiles, charts, and measurement systems. Converting the height to total inches first keeps the calculation clear and exact.</p>
        <h2>Popular heights</h2>
        <p>These high-impression heights already have dedicated pages. Open one for the exact centimeter answer, or use the calculator above for any other value.</p>
        <div className="data-table-wrap">
          <table>
            <caption>Popular height conversions in centimeters</caption>
            <thead><tr><th>Height</th><th>Total inches</th><th>Centimeters</th><th>Details</th></tr></thead>
            <tbody>
              {popularHeights.map((height) => (
                <tr key={height.href}>
                  <td>{height.feet}&apos;{height.inches}&quot;</td>
                  <td>{height.totalInches}</td>
                  <td>{height.cmText} cm</td>
                  <td><Link href={height.href}>{height.label}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Related length tools</h2>
        <RelatedLinks sections={[
          {
            title: "Main tools",
            links: [
              { href: "/inches-to-cm", label: "Inches to cm converter" },
              { href: "/cm-to-inches", label: "CM to inches converter" },
              { href: "/inch-to-cm-chart", label: "Inch to cm chart" },
            ],
          },
          {
            title: "Helpful guides",
            links: [
              { href: "/height-conversion-guide", label: "Height conversion guide" },
              { href: "/height-chart", label: "Height chart" },
            ],
          },
        ]} />
        <AdSlot />
        <ToolSEOContent config={toolSeoContent.heightConverter} />
      </article>
    </>
  );
}
