import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DimensionsConverter } from "@/components/DimensionsConverter";
import { DimensionGuideReferences } from "@/components/DimensionGuideReferences";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { registryMetadata } from "@/data/page-registry";
import { breadcrumbSchema, faqSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

const path = "/a4-paper-size-in-inches-and-cm";
export const metadata = registryMetadata(path);

// Nominal sheet dimensions in millimeters; inch figures below are derived, not separately maintained.
const sheets = [
  { name: "A5", width: 148, height: 210, use: "Small handouts and notebooks" },
  { name: "A4", width: 210, height: 297, use: "Documents and standard office printing" },
  { name: "A3", width: 297, height: 420, use: "Larger drawings and posters" },
  { name: "US Letter", width: 215.9, height: 279.4, use: "US office documents" },
];

function centimeters(mm: number) {
  return (mm / 10).toFixed(2).replace(/\.?0+$/, "");
}

const faq: FaqItem[] = [
  { question: "How large is A4 paper in inches?", answer: "A4 is 210 × 297 mm, or 21 × 29.7 cm. Dividing each centimeter measurement by 2.54 gives approximately 8.27 × 11.69 inches." },
  { question: "Is A4 the same as US Letter?", answer: "No. A4 is 210 × 297 mm; US Letter is 215.9 × 279.4 mm. Letter is slightly wider and shorter, so check printer and frame settings before substituting one for the other." },
  { question: "Does landscape A4 have different dimensions?", answer: "No. Landscape orientation swaps the width and height: 297 × 210 mm instead of 210 × 297 mm." },
];

export default function A4PaperSizePage() {
  return <>
    <JsonLd data={graphSchema([
      webPageSchema({ name: "A4 Paper Size in Inches and CM", description: "A4 paper measures 210 × 297 mm; compare A3, A5, and US Letter sheet dimensions.", path }),
      webApplicationSchema({ name: "Paper Dimensions Converter", description: "Convert paper width and height from centimeters to inches.", path }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "A4 Paper Size", path }]),
      faqSchema(faq),
    ])} />
    <Breadcrumbs current="A4 Paper Size" />
    <article className="narrow content-page">
      <div className="eyebrow">Paper and print dimensions</div>
      <h1>A4 Paper Size in Inches and CM</h1>
      <p className="lead">A4 paper is 210 × 297 mm, or 21 × 29.7 cm. In inches, it is approximately 8.27 × 11.69. These are the sheet dimensions, not the printable area.</p>
      <DimensionsConverter direction="cm-to-in" defaultLength={21} defaultWidth={29.7} defaultHeight={1} defaultMode={2} />
      <div className="answer-box">
        <div className="answer">A4: 21 × 29.7 cm ≈ 8.27 × 11.69 in</div>
        <div className="formula">21 ÷ 2.54 ≈ 8.27; 29.7 ÷ 2.54 ≈ 11.69</div>
      </div>

      <h2>Compare common sheet sizes</h2>
      <p>Choose the sheet size before ordering a frame, printing a document, or checking whether paper fits a folder. Keep width and height in the same orientation.</p>
      <div className="data-table-wrap"><table>
        <caption>Nominal paper width × height; inch values rounded to two decimals</caption>
        <thead><tr><th scope="col">Sheet</th><th scope="col">Millimeters</th><th scope="col">Centimeters</th><th scope="col">Inches</th></tr></thead>
        <tbody>{sheets.map((sheet) => <tr key={sheet.name}>
          <th scope="row">{sheet.name}</th>
          <td>{sheet.width} × {sheet.height} mm</td>
          <td>{centimeters(sheet.width)} × {centimeters(sheet.height)} cm</td>
          <td>{(sheet.width / 25.4).toFixed(2)} × {(sheet.height / 25.4).toFixed(2)} in</td>
        </tr>)}</tbody>
      </table></div>
      <h2>When the conversion matters</h2>
      <ul>
        {sheets.map((sheet) => <li key={sheet.name}><strong>{sheet.name}:</strong> {sheet.use}.</li>)}
      </ul>
      <p>A4 and US Letter are not interchangeable for precise print margins. Printer non-printable borders, bleed, and frame openings can also reduce the usable area; verify those separately.</p>
      <p>The nominal A-series and Letter dimensions are listed by the <a href="https://www.iso.org/standard/75388.html">ISO office-equipment reference</a>. Inch conversions use the exact 25.4 mm per inch definition.</p>
      <DimensionGuideReferences path={path} />
      <h2>Related dimension tools</h2>
      <RelatedLinks sections={[{ title: "Convert another size", links: [
        { href: "/cm-to-inches-dimensions", label: "Convert sheet dimensions from cm to inches" },
        { href: "/inches-to-cm-dimensions", label: "Convert sheet dimensions from inches to cm" },
        { href: "/common-product-dimensions-in-cm", label: "Compare other product dimensions" },
      ] }]} />
      <p>For one side only, use the <Link href="/cm-to-inches">cm to inches converter</Link>.</p>
      <Faq items={faq} />
    </article>
  </>;
}
