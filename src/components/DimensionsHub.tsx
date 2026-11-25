import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { DimensionChart } from "./DimensionChart";
import { DimensionDiagram } from "./DimensionDiagram";
import { DimensionsConverter } from "./DimensionsConverter";
import { Faq, type FaqItem } from "./Faq";
import { JsonLd } from "./JsonLd";
import { OnThisPage } from "./OnThisPage";
import { RelatedLinks } from "./RelatedLinks";
import { requirePageDefinition } from "@/data/page-registry";
import { dimensionHub, dimensionText, oppositeDimensionDirection } from "@/data/page-registry/dimension-catalog";
import { focusedGuideGroups } from "@/data/page-registry/focused-guides";
import { convertProductDimensions, dimensionValueIsRounded, type DimensionDirection, type DimensionMode } from "@/lib/product-dimensions";
import { breadcrumbSchema, faqSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

type ReferenceSize = readonly [sides: readonly number[], context: string];

const directionContent = {
  "in-to-cm": {
    from: "in",
    to: "cm",
    name: "Inches to CM",
    reverseName: "CM to Inches",
    singlePath: "/inches-to-cm",
    chartPath: "/inch-to-cm-chart",
    description: "Convert length, width, and height from inches to centimeters for products, boxes, luggage, furniture, and packaging.",
    method: "Multiply each side by exactly 2.54. Keep the original dimension order when comparing sizes.",
    defaults: { 2: [8, 10], 3: [22, 14, 9] },
    extraSizes: {
      2: [
        [[10, 15], "Flat print or panel"],
        [[12, 12], "Square sheet or print"],
        [[2, 2], "Small label or craft piece"],
      ],
      3: [[[36, 18, 72], "Furniture or shelving example"]],
    },
    faq: [
      { question: "How do I convert product dimensions from inches to cm?", answer: "Multiply each side in inches by exactly 2.54." },
      { question: "Does this dimensions converter calculate volume?", answer: "Yes. The 3D calculator gives the volume of a rectangular box based on the three sides you enter. Measure the inside of a box if you need usable capacity." },
      { question: "What is 22 × 14 × 9 inches in cm?", answer: "22 × 14 × 9 inches equals exactly 55.88 × 35.56 × 22.86 cm." },
      { question: "Should I add extra space when checking whether an item fits?", answer: "Yes. Leave clearance for handles, packaging, cables, doors, fabric thickness, and measurement tolerance." },
      { question: "Can I convert just two sides?", answer: "Yes. Use the 2D calculator for width and height. Pasting 10 × 15 inches gives 25.4 × 38.1 cm." },
    ],
  },
  "cm-to-in": {
    from: "cm",
    to: "in",
    name: "CM to Inches",
    reverseName: "Inches to CM",
    singlePath: "/cm-to-inches",
    chartPath: "/cm-to-inch-chart",
    description: "Convert length, width, and height from centimeters to inches for product specs, package sizes, furniture, and international listings.",
    method: "Divide each side by exactly 2.54. Inch results that need rounding are marked with ≈.",
    defaults: { 2: [20, 30], 3: [55.88, 35.56, 22.86] },
    extraSizes: {
      2: [],
      3: [
        [[30, 20, 10], "Compact box or package"],
        [[100, 50, 75], "Furniture or table example"],
      ],
    },
    faq: [
      { question: "How do I convert dimensions from cm to inches?", answer: "Divide each centimeter dimension by exactly 2.54. Convert the sides separately and keep their original order." },
      { question: "What is 55.88 × 35.56 × 22.86 cm in inches?", answer: "55.88 × 35.56 × 22.86 cm equals exactly 22 × 14 × 9 inches." },
      { question: "Why are cm to inch dimensions often rounded?", answer: "Many centimeter values convert to repeating inch decimals. For a tight fit, keep more precision and round only after comparing the sides." },
      { question: "Can I use this for furniture or package fit?", answer: "Yes. Convert every side and leave clearance for packaging, handles, hinges, cables, and measurement tolerance." },
      { question: "Can I convert just two sides from cm to inches?", answer: "Yes. Use the 2D calculator for width and height. Pasting 25.4 × 38.1 cm gives 10 × 15 inches." },
    ],
  },
} satisfies Record<DimensionDirection, {
  from: "in" | "cm";
  to: "in" | "cm";
  name: string;
  reverseName: string;
  singlePath: string;
  chartPath: string;
  description: string;
  method: string;
  defaults: Record<DimensionMode, readonly number[]>;
  extraSizes: Record<DimensionMode, readonly ReferenceSize[]>;
  faq: FaqItem[];
}>;

const modes = [2, 3] as const;
const headings = {
  2: "2D Dimensions (Width × Height)",
  3: "3D Dimensions (Length × Width × Height)",
} as const;

export function DimensionsHub({ direction }: { direction: DimensionDirection }) {
  const path = dimensionHub(direction);
  const reversePath = dimensionHub(oppositeDimensionDirection(direction));
  const data = directionContent[direction];
  const { h1 } = requirePageDefinition(path);
  const breadcrumb = `${data.name} Dimensions`;
  const schema = { name: h1, description: data.description, path };

  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema(schema),
        webApplicationSchema(schema),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: breadcrumb, path }]),
        faqSchema(data.faq),
      ])} />
      <Breadcrumbs current={breadcrumb} />
      <article className="narrow content-page">
        <h1>{h1}</h1>
        <p className="lead">{data.description}</p>
        <OnThisPage items={[
          { href: "#2d", label: "2D Dimensions" },
          { href: "#3d", label: "3D Dimensions" },
        ]} />
        <p>{data.method} Paste a two- or three-side measurement to select the matching mode, or use the <Link href={data.singlePath}>{data.name} converter</Link> for a single length.</p>

        {modes.map((mode) => {
          const defaults = data.defaults[mode];
          const extraSizes: readonly ReferenceSize[] = data.extraSizes[mode];
          return (
            <section key={mode} className="dimension-block" id={`${mode}d`} aria-labelledby={`dimensions-${mode}d-heading`}>
              <h2 id={`dimensions-${mode}d-heading`}>{headings[mode]}</h2>
              {mode === 2
                ? <p>Use width and height for photo prints, frames, posters, and flat product panels. Area is the product of the two converted sides.</p>
                : <p>Use all three sides for boxes, luggage, furniture, and packages. A rectangular volume uses all three measurements. One cubic inch is exactly 16.387064 cm³, and 1 L is exactly 1,000 cm³.</p>}
              <DimensionsConverter
                direction={direction}
                defaultMode={mode}
                defaultLength={defaults[0]}
                defaultWidth={defaults[1]}
                defaultHeight={data.defaults[3][2]}
                matchSharedMode
              />
              <DimensionDiagram sides={defaults} unit={data.from} />
              <h3>{mode}D {data.name} Chart</h3>
              <DimensionChart direction={direction} mode={mode} />
              {extraSizes.length > 0 && (
                <>
                  <h3>Other {mode}D size examples</h3>
                  <ul>
                    {extraSizes.map(([sides, context]) => {
                      const converted = convertProductDimensions(sides, direction)!;
                      const sign = converted.some((side) => dimensionValueIsRounded(side, 4)) ? "≈" : "=";
                      return <li key={context}>{dimensionText(sides)} {data.from} {sign} {dimensionText(converted)} {data.to} ({context.toLowerCase()})</li>;
                    })}
                  </ul>
                </>
              )}
              <p className="methodology-link"><Link href={`${reversePath}#${mode}d`}>{mode}D Dimensions: {data.reverseName}</Link></p>
            </section>
          );
        })}

        <h2>Related tools</h2>
        <RelatedLinks sections={[
          {
            title: "Dimension tools",
            links: [
              { href: reversePath, label: `${data.reverseName} dimensions converter` },
              { href: "/common-product-dimensions-in-cm", label: "Common product dimensions in cm" },
              { href: "/a4-paper-size-in-inches-and-cm", label: "A4 and common paper sizes" },
            ],
          },
          {
            title: "Single-value converters",
            links: [
              { href: "/inches-to-cm", label: "Inches to cm converter" },
              { href: "/cm-to-inches", label: "CM to inches converter" },
              { href: data.chartPath, label: `${data.name} chart` },
            ],
          },
          {
            title: "Practical size tools",
            links: [
              { href: "/screen-size-converter", label: "Screen size converter" },
              { href: "/height-converter", label: "Height converter" },
            ],
          },
          ...(direction === "in-to-cm" ? [{
            title: "Box, fit, and product measurement guides",
            links: focusedGuideGroups.dimensions.slice(10).map(({ slug, title }) => ({ href: `/${slug}`, label: title })),
          }] : []),
        ]} />
        <p className="methodology-link">See the <Link href="/conversion-methodology">conversion methodology</Link> for the exact inch definition and rounding guidance.</p>
        <Faq items={data.faq} />
      </article>
    </>
  );
}
