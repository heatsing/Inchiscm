import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Converter } from "@/components/Converter";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { inchSlug, screenInches } from "@/lib/conversions";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Screen Size Converter - Inches to CM for Displays", "Convert laptop, monitor, tablet, and TV screen diagonals from inches to centimeters and understand screen sizing.", "/screen-size-converter");

const faq = [
  { question: "How are screen sizes measured?", answer: "Screen size is measured diagonally across the visible display area, from one corner to the opposite corner." },
  { question: "Does a 15.6-inch screen measure 15.6 inches wide?", answer: "No. The 15.6-inch figure is the diagonal. Width and height depend on the screen's aspect ratio." },
  { question: "Does screen size include the bezel?", answer: "Usually not. Advertised screen size describes the display panel, while the full device dimensions include the bezel and casing." },
];

export default function ScreenSizeConverterPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Screen Size Converter", path: "/screen-size-converter" }])} />
      <Breadcrumbs current="Screen Size Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Laptop, monitor, tablet, and TV sizes</div>
        <h1>Screen Size Converter</h1>
        <p className="lead">Convert a screen&apos;s advertised diagonal from inches to centimeters. Screen size describes the display diagonal, not the device width.</p>
        <Converter initialValue={15.6} compact />
        <div className="answer-box">
          <div className="answer">15.6 inches = 39.624 cm</div>
          <div className="formula">15.6 × 2.54 = 39.624 cm diagonal</div>
        </div>
        <div className="answer-box"><strong>Important:</strong> Two screens with the same diagonal can have different width and height dimensions when their aspect ratios differ. Bezels also add to the overall device size.</div>
        <h2>Common screen sizes</h2>
        <ul className="link-list">
          {screenInches.map((value) => <li key={value}><Link href={inchSlug(value)}>{value}-inch screen in cm</Link></li>)}
        </ul>
        <h2>Choosing a screen by physical size</h2>
        <p>Use the converted diagonal to compare display panels, but check the manufacturer&apos;s full width, height, and depth specifications when fitting a laptop sleeve, monitor arm, cabinet, or TV wall.</p>
        <p><Link href="/screen-size-vs-width-height">Read the screen diagonal, width, and height guide →</Link></p>
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
