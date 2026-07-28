import { registryMetadata } from "@/data/page-registry";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graphSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/conversion-methodology");

const factors = [
  ["Millimeter (mm)", "0.001 meter", "Exact SI prefix relationship"],
  ["Centimeter (cm)", "0.01 meter", "Exact SI prefix relationship"],
  ["Meter (m)", "SI base unit of length", "Defined through the speed of light"],
  ["Kilometer (km)", "1,000 meters", "Exact SI prefix relationship"],
  ["Inch (in)", "0.0254 meter", "Exact international definition"],
  ["Foot (ft)", "0.3048 meter", "Exactly 12 international inches"],
  ["Yard (yd)", "0.9144 meter", "Exactly 3 international feet"],
  ["Mile (mi)", "1,609.344 meters", "Exactly 5,280 international feet"],
] as const;

export default function ConversionMethodologyPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "Conversion Methodology", description: "See the exact length conversion factors, rounding approach, screen dimension formula, and authoritative sources used by Inch is CM.", path: "/conversion-methodology" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Conversion Methodology", path: "/conversion-methodology" }]),
      ])} />
      <Breadcrumbs current="Conversion Methodology" />
      <article className="narrow content-page policy-page">
        <div className="eyebrow">Accuracy and sources</div>
        <h1>Conversion Methodology</h1>
        <p className="lead">
          Inch is CM converts every supported length through meters using defined SI and international
          conversion factors. The defined factors are used without intentional pre-rounding; formatting is applied
          only when a result is displayed.
        </p>
        <p className="policy-updated">Last reviewed: July 2026</p>

        <h2>Length conversion factors</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Exact meter relationships used by the converters</caption>
            <thead><tr><th>Unit</th><th>Meter relationship</th><th>Status</th></tr></thead>
            <tbody>
              {factors.map(([unit, relationship, status]) => (
                <tr key={unit}><td>{unit}</td><td>{relationship}</td><td>{status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How conversions are calculated</h2>
        <p>The converter first changes the source value to meters, then changes meters to the selected target unit.</p>
        <div className="formula">result = value × source unit in meters ÷ target unit in meters</div>
        <p>
          For the site&apos;s primary conversion, one inch is exactly 0.0254 meter and one centimeter is
          exactly 0.01 meter, so one inch equals exactly 2.54 centimeters.
        </p>

        <h2>Rounding and displayed precision</h2>
        <p>
          The main converter calculates with the underlying numeric value and normally displays up to eight decimal
          places. Exact conversion pages use shorter results where practical, and reverse centimeter-to-inch pages
          generally show up to four decimal places. A displayed rounded value is marked with an approximation sign
          or described as rounded when the exact decimal does not terminate within the displayed precision.
        </p>

        <h2>Screen width and height</h2>
        <p>
          Screen size is a diagonal. For an aspect ratio of width <em>w</em> to height <em>h</em>, the visible panel
          dimensions are estimated with the Pythagorean theorem. Bezels, stands, and device casings are excluded.
        </p>
        <div className="formula">
          width = diagonal × w ÷ √(w² + h²)<br />
          height = diagonal × h ÷ √(w² + h²)
        </div>

        <h2>Authoritative references</h2>
        <ul>
          <li>
            <a href="https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors">
              NIST Guide to the SI, Appendix B: Conversion Factors
            </a>
          </li>
          <li>
            <a href="https://www.bipm.org/en/publications/si-brochure">
              BIPM SI Brochure
            </a>
          </li>
        </ul>

        <h2>Use the tools</h2>
        <p>
          Try the <Link href="/">multi-unit length converter</Link>, the <Link href="/height-converter">height converter</Link>,
          or the <Link href="/screen-size-converter">screen size converter</Link>.
        </p>
      </article>
    </>
  );
}
