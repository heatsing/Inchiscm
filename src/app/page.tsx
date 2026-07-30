import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { LengthConverter } from "@/components/LengthConverter";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { toolSeoContent } from "@/data/tools";
import { heightSlug, inchSlug } from "@/lib/conversions";
import { breadcrumbSchema, graphSchema, siteUrl, webApplicationSchema, webPageSchema } from "@/lib/seo";

const homeTool = toolSeoContent.home;

const popular = [1, 2, 5, 10, 12, 24, 36, 55];
const popularHeights = [[4, 7], [5, 5], [6, 1], [6, 4], [6, 11]];

export default function Home() {
  return (
    <>
      <JsonLd data={graphSchema([
        {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`,
          name: "Inch is CM",
          url: siteUrl,
          description: homeTool.introduction,
        },
        webPageSchema({ name: "Inch to CM Converter", description: homeTool.introduction, path: "/" }),
        webApplicationSchema({ name: "Inch to CM Converter", description: "Convert inches to centimeters and other common length units.", path: "/" }),
        breadcrumbSchema([{ name: "Home", path: "/" }]),
      ])} />
      <section className="hero">
        <div className="shell">
          <div className="eyebrow">Exact measurement conversion</div>
          <h1>Inch to CM Converter</h1>
          <p className="lead">Convert inches to centimeters instantly, with formulas, examples, and common size references.</p>
          <LengthConverter defaultFrom="in" defaultTo="cm" defaultValue={10} presets={[1, 10, 12, 24]} />
          <p className="converter-note">Also supports mm, m, km, feet, yards, and miles.</p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="quick-answer">
            <div><strong>1 inch = 2.54 cm</strong><div className="subtle">The inch has been defined as exactly 2.54 centimeters since 1959.</div></div>
            <code>inches × 2.54 = centimeters</code>
          </div>
          <p className="methodology-link">See the <Link href="/conversion-methodology">conversion methodology and authoritative sources</Link>.</p>

          <h2>Popular inch conversions</h2>
          <ul className="link-list">
            {popular.map((value) => <li key={value}><Link href={inchSlug(value)}>{value} {value === 1 ? "inch" : "inches"} in cm</Link></li>)}
          </ul>
          <h2>Popular height conversions</h2>
          <ul className="link-list">
            {popularHeights.map(([feet, inches]) => <li key={`${feet}-${inches}`}><Link href={heightSlug(feet, inches)}>{feet}&apos;{inches}&quot; in cm</Link></li>)}
          </ul>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <h2>Common conversion charts</h2>
          <div className="grid two">
            <div className="card">
              <h3>Inch to cm chart</h3>
              <p>Scan common values from 1 to 100 inches and open a detailed conversion.</p>
              <Link className="button" href="/inch-to-cm-chart">View inch chart</Link>
            </div>
            <div className="card">
              <h3>CM to inch chart</h3>
              <p>Compare centimeters with decimal and fractional inch equivalents.</p>
              <Link className="button" href="/cm-to-inch-chart">View cm chart</Link>
            </div>
          </div>
          <AdSlot />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <h2>Convert measurements for real life</h2>
          <div className="grid">
            {[
              ["Single length", "Convert one inch, centimeter, millimeter, foot, yard, or mile value with the main length converter.", "/inches-to-cm"],
              ["Length x width", "Convert flat product sizes, prints, frames, tablet cases, and panels by converting each side separately.", "/inches-to-cm-dimensions"],
              ["Length x width x height", "Convert boxes, luggage, furniture, shelves, and package specs without changing the dimension order.", "/inches-to-cm-dimensions"],
              ["Metric product dimensions", "Turn centimeter product specs into inches when a listing, room, box, or shelf uses imperial sizes.", "/cm-to-inches-dimensions"],
              ["Height conversion", "Enter feet and inches to get an exact height in centimeters.", "/height-converter"],
              ["Screen sizes", "Convert display diagonals and estimate width and height for laptops, monitors, tablets, and TVs.", "/screen-size-converter"],
            ].map(([title, text, href]) => (
              <div className="card" key={title}>
                <h3>{title}</h3><p>{text}</p><Link href={href}>Explore {title.toLowerCase()} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <h2>Related tools</h2>
          <ul className="link-list">
            <li><Link href="/cm-to-inches">CM to Inches</Link></li>
            <li><Link href="/height-converter">Feet & Inches to CM</Link></li>
            <li><Link href="/feet-to-cm">Feet to CM</Link></li>
            <li><Link href="/inches-to-mm">Inches to MM</Link></li>
            <li><Link href="/mm-to-inches">MM to Inches</Link></li>
            <li><Link href="/cm-to-feet-and-inches">CM to Feet and Inches</Link></li>
            <li><Link href="/inches-to-cm-dimensions">Inches to CM Dimensions</Link></li>
            <li><Link href="/cm-to-inches-dimensions">CM to Inches Dimensions</Link></li>
            <li><Link href="/screen-size-converter">Screen Size Converter</Link></li>
          </ul>
          <p style={{ marginTop: 18 }}>
            Learn the method in <Link href="/how-to-convert-inches-to-cm">the inch-to-cm formula guide</Link>,
            compare <Link href="/inch-vs-cm"> inches and centimeters</Link>, or see
            how large <Link href="/how-big-is-10-inches">10 inches</Link>, <Link href="/how-big-is-12-inches">12 inches</Link>,
            and <Link href="/how-big-is-15-inches">15 inches</Link> are.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="narrow">
          <ToolSEOContent config={homeTool} />
        </div>
      </section>
    </>
  );
}
