import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ScreenDimensionsCalculator } from "@/components/ScreenDimensionsCalculator";
import { inchSlug, screenInches } from "@/lib/conversions";
import { getScreenRelatedLinks } from "@/lib/internal-links";
import { formatLength } from "@/lib/length-units";
import { calculateScreenDimensions } from "@/lib/screen-dimensions";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Screen Size Converter - Inches to CM for TVs and Displays", "Convert a screen diagonal from inches to centimeters and estimate display width and height for common aspect ratios.", "/screen-size-converter");

const faq = [
  { question: "How are screen sizes measured?", answer: "Screen size is measured diagonally across the visible display area, from one corner to the opposite corner." },
  { question: "Does a 15.6-inch screen measure 15.6 inches wide?", answer: "No. The 15.6-inch figure is the diagonal. Width and height depend on the screen's aspect ratio." },
  { question: "Does screen size include the bezel?", answer: "Usually not. Advertised screen size describes the display panel, while the full device dimensions include the bezel and casing." },
  { question: "How do you calculate screen width and height?", answer: "Use the diagonal and aspect ratio with the Pythagorean theorem. The calculator applies that formula and converts the resulting dimensions to centimeters." },
];

const commonDisplaySizes = [13.3, 15.6, 24, 27, 32, 55].map((diagonal) => ({
  diagonal,
  ...calculateScreenDimensions(diagonal, 16, 9),
}));

export default function ScreenSizeConverterPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Screen Size Converter", path: "/screen-size-converter" }]),
        faqSchema(faq),
      ]} />
      <Breadcrumbs current="Screen Size Converter" />
      <article className="narrow content-page">
        <div className="eyebrow">Laptop, monitor, tablet, and TV sizes</div>
        <h1>Screen Size Converter</h1>
        <p className="lead">A 15.6-inch screen has a 39.624 cm diagonal. Enter any diagonal and aspect ratio to estimate the visible display width and height.</p>
        <ScreenDimensionsCalculator defaultDiagonal={15.6} defaultAspectRatio="16:9" />
        <div className="answer-box"><strong>Important:</strong> Two screens with the same diagonal can have different width and height dimensions when their aspect ratios differ. Bezels also add to the overall device size.</div>
        <h2>How screen width and height are calculated</h2>
        <p>The diagonal and aspect ratio form a right triangle. For an aspect ratio of width <em>w</em> to height <em>h</em>, use:</p>
        <div className="formula">
          width = diagonal × w ÷ √(w² + h²)<br />
          height = diagonal × h ÷ √(w² + h²)
        </div>
        <h2>Common screen sizes</h2>
        <ul className="link-list">
          {screenInches.map((value) => <li key={value}><Link href={inchSlug(value)}>{value}-inch screen in cm</Link></li>)}
        </ul>
        <h2>Approximate 16:9 display dimensions</h2>
        <p>These measurements describe the visible display area. The full device will be larger because of its bezel, stand, and casing.</p>
        <div className="data-table-wrap">
          <table>
            <caption>Approximate visible dimensions for common 16:9 displays</caption>
            <thead><tr><th>Diagonal</th><th>Width</th><th>Height</th></tr></thead>
            <tbody>
              {commonDisplaySizes.map((screen) => (
                <tr key={screen.diagonal}>
                  <td>{screen.diagonal} in ({formatLength(screen.diagonalCm, 2)} cm)</td>
                  <td>{formatLength(screen.widthInches, 2)} in ({formatLength(screen.widthCm, 2)} cm)</td>
                  <td>{formatLength(screen.heightInches, 2)} in ({formatLength(screen.heightCm, 2)} cm)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Choosing a screen by physical size</h2>
        <p>Use the converted diagonal to compare display panels, but check the manufacturer&apos;s full width, height, and depth specifications when fitting a laptop sleeve, monitor arm, cabinet, or TV wall.</p>
        <p><Link href="/screen-size-vs-width-height">Read the screen diagonal, width, and height guide →</Link></p>
        <h2>Related screen and length conversions</h2>
        <RelatedLinks sections={getScreenRelatedLinks(15.6)} />
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}
