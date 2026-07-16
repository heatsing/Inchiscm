import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Converter } from "@/components/Converter";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import {
  allInchValues,
  centimeterValues,
  cmSlug,
  cmToInches,
  formatNumber,
  heights,
  heightSlug,
  heightToCm,
  inchSlug,
  inchesToCm,
  parseSlugNumber,
  screenInches,
} from "@/lib/conversions";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

const guides: Record<string, { title: string; description: string; sections: { heading: string; body: React.ReactNode }[] }> = {
  "how-to-convert-inches-to-cm": {
    title: "How to Convert Inches to CM",
    description: "Learn the exact inches-to-centimeters formula, work through examples, and avoid common rounding mistakes.",
    sections: [
      { heading: "The exact formula", body: <><p>Multiply the inch measurement by <strong>2.54</strong>. The factor is exact, so any rounding comes from how the final result is displayed.</p><div className="formula">inches × 2.54 = centimeters</div></> },
      { heading: "Worked example", body: <p>For 12 inches, calculate 12 × 2.54. The result is exactly 30.48 centimeters. For 5.5 inches, 5.5 × 2.54 = 13.97 centimeters.</p> },
      { heading: "When precision matters", body: <p>Keep extra decimal places while calculating product tolerances, technical drawings, or body measurements. Round only the final result to the precision your task requires.</p> },
    ],
  },
  "inch-vs-cm": {
    title: "Inch vs CM: What Is the Difference?",
    description: "Compare inches and centimeters, including their size, systems of measurement, and common uses.",
    sections: [
      { heading: "How large is each unit?", body: <p>An inch is longer than a centimeter: one inch equals exactly 2.54 cm, while one centimeter equals about 0.3937 inches.</p> },
      { heading: "Where they are used", body: <p>Inches belong to the US customary and imperial measurement traditions. Centimeters are part of the metric system and are used broadly around the world.</p> },
      { heading: "Which unit should you use?", body: <p>Use the unit expected by your audience, product specification, or standard. When comparing international dimensions, show both units to reduce ambiguity.</p> },
    ],
  },
  "why-is-one-inch-2-54-cm": {
    title: "Why Is One Inch 2.54 CM?",
    description: "Understand why one inch is exactly 2.54 centimeters and what that exact definition means.",
    sections: [
      { heading: "An exact definition", body: <p>In 1959, countries using the yard and pound agreed on an international yard equal to exactly 0.9144 meters. Because a yard contains 36 inches, one inch became exactly 0.0254 meters, or 2.54 centimeters.</p> },
      { heading: "Exact does not mean every result is short", body: <p>The conversion factor is exact, but converting centimeters back to inches often creates repeating decimals. Displayed values are therefore commonly rounded.</p> },
    ],
  },
  "how-to-measure-inches-without-a-ruler": {
    title: "How to Measure Inches Without a Ruler",
    description: "Estimate inches using common objects, paper, or a phone, while understanding the limits of improvised measurements.",
    sections: [
      { heading: "Use a known-size object", body: <p>A US quarter is just under one inch wide, while a standard credit card is 3.375 inches wide. Printer paper is 8.5 by 11 inches in the US and can provide a useful reference edge.</p> },
      { heading: "Use a calibrated screen carefully", body: <p>A phone can display a ruler, but only after calibration because screen density and browser scaling vary. Compare the display with an object of known size first.</p> },
      { heading: "Know when an estimate is not enough", body: <p>Improvised references are suitable for rough checks, not precise cutting, fitting, medical measurements, or technical work. Use a physical measuring tool for those tasks.</p> },
    ],
  },
  "how-big-is-10-inches": {
    title: "How Big Is 10 Inches?",
    description: "See how long 10 inches is in centimeters and compare it with familiar everyday objects.",
    sections: [
      { heading: "The exact size", body: <p>Ten inches equals exactly 25.4 cm. It is a little shorter than the long side of US letter paper, which measures 11 inches.</p> },
      { heading: "Useful comparisons", body: <p>Ten inches is close to the height of a large tablet and slightly longer than the short side of US letter paper. Object dimensions vary, so use these as visual references rather than specifications.</p> },
    ],
  },
  "how-big-is-12-inches": {
    title: "How Big Is 12 Inches?",
    description: "See how long 12 inches is in centimeters, feet, and familiar real-world references.",
    sections: [
      { heading: "The exact size", body: <p>Twelve inches equals exactly 30.48 cm and exactly one foot.</p> },
      { heading: "Useful comparisons", body: <p>A standard school ruler is commonly 12 inches long. The long side of US letter paper is one inch shorter at 11 inches.</p> },
    ],
  },
  "common-product-dimensions-in-cm": {
    title: "Common Product Dimensions in CM",
    description: "Understand how product dimensions are listed and convert common package, furniture, and device measurements into centimeters.",
    sections: [
      { heading: "Read dimension order carefully", body: <p>Product dimensions may be listed as length × width × height, but some sellers use width × depth × height. Confirm the labels instead of relying on order alone.</p> },
      { heading: "Convert every dimension", body: <p>Multiply each inch value by 2.54 separately. A 12 × 8 × 4 inch box is 30.48 × 20.32 × 10.16 cm.</p> },
      { heading: "Allow space for fit", body: <p>For shelves, doorways, cases, and shipping cartons, leave clearance beyond the stated product size. Handles, cables, packaging, and measurement tolerances can add space.</p> },
    ],
  },
  "screen-size-vs-width-height": {
    title: "Screen Size vs Width and Height",
    description: "Learn why a screen's advertised diagonal does not directly tell you its width and height.",
    sections: [
      { heading: "Screen size means diagonal", body: <p>A 15.6-inch laptop screen is measured from one visible corner to the opposite corner. It does not mean the device is 15.6 inches wide.</p> },
      { heading: "Aspect ratio changes the dimensions", body: <p>Two screens with the same diagonal can have different widths and heights when their aspect ratios differ. A 16:9 display is wider and shorter than a 4:3 display with the same diagonal.</p> },
      { heading: "Bezels are separate", body: <p>Screen diagonal normally describes the display panel, not the full device. Check the manufacturer&apos;s product dimensions when fitting a laptop, monitor, or TV into a space.</p> },
    ],
  },
  "height-conversion-guide": {
    title: "Height Conversion Guide",
    description: "Convert feet and inches to centimeters with a clear formula, examples, and a height chart.",
    sections: [
      { heading: "Feet and inches to total inches", body: <p>Multiply feet by 12, then add the remaining inches. For 5 feet 8 inches: 5 × 12 + 8 = 68 inches.</p> },
      { heading: "Total inches to centimeters", body: <p>Multiply total inches by 2.54. For 5&apos;8&quot;: 68 × 2.54 = 172.72 cm.</p> },
    ],
  },
};

type Params = Promise<{ slug: string }>;

function parsePage(slug: string) {
  const inchMatch = slug.match(/^(\d+(?:-\d+)?)-(inch|inches)-in-cm$/);
  if (inchMatch) {
    const value = parseSlugNumber(inchMatch[1]);
    if (value !== null && value > 0 && value <= 1000) return { type: "inch" as const, value };
  }
  const badPlural = slug.match(/^1-inches-in-cm$/);
  if (badPlural) return { type: "redirect" as const, path: "/1-inch-in-cm" };
  const oldFormat = slug.match(/^(\d+(?:-\d+)?)-inch-to-cm$/);
  if (oldFormat) {
    const value = parseSlugNumber(oldFormat[1]);
    if (value !== null) return { type: "redirect" as const, path: inchSlug(value) };
  }
  const cmMatch = slug.match(/^(\d+(?:-\d+)?)-cm-in-inches$/);
  if (cmMatch) {
    const value = parseSlugNumber(cmMatch[1]);
    if (value !== null && value > 0 && value <= 3000) return { type: "cm" as const, value };
  }
  const feetMatch = slug.match(/^(\d+)-feet-in-cm$/);
  if (feetMatch) return { type: "height" as const, feet: Number(feetMatch[1]), inches: 0 };
  const heightMatch = slug.match(/^(\d+)-(\d+)-in-cm$/);
  if (heightMatch && Number(heightMatch[2]) < 12) return { type: "height" as const, feet: Number(heightMatch[1]), inches: Number(heightMatch[2]) };
  if (guides[slug]) return { type: "guide" as const, guide: guides[slug] };
  return null;
}

export function generateStaticParams() {
  return [
    ...allInchValues.map((value) => ({ slug: inchSlug(value).slice(1) })),
    ...centimeterValues.map((value) => ({ slug: cmSlug(value).slice(1) })),
    ...heights.map(({ feet, inches }) => ({ slug: heightSlug(feet, inches).slice(1) })),
    ...Object.keys(guides).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = parsePage(slug);
  if (!page || page.type === "redirect") return {};
  if (page.type === "inch") {
    const value = formatNumber(page.value);
    const result = formatNumber(inchesToCm(page.value));
    return pageMetadata(`${value} ${page.value === 1 ? "Inch" : "Inches"} in CM - Convert to Centimeters`, `${value} ${page.value === 1 ? "inch equals" : "inches equal"} ${result} cm. See the exact formula, examples, and nearby inch-to-cm conversions.`, `/${slug}`);
  }
  if (page.type === "cm") {
    const value = formatNumber(page.value);
    const result = formatNumber(cmToInches(page.value));
    return pageMetadata(`${value} CM in Inches - Convert Centimeters to Inches`, `${value} cm equals approximately ${result} inches. See the formula, rounded result, and nearby conversions.`, `/${slug}`);
  }
  if (page.type === "height") {
    const label = page.inches === 0 ? `${page.feet} Feet` : `${page.feet}'${page.inches}"`;
    const result = formatNumber(heightToCm(page.feet, page.inches));
    return pageMetadata(`${label} in CM - Height Conversion`, `${page.feet} feet ${page.inches} inches equals ${result} cm. See the exact height conversion formula and nearby heights.`, `/${slug}`);
  }
  return pageMetadata(page.guide.title, page.guide.description, `/${slug}`);
}

function realWorldNote(value: number) {
  if (screenInches.includes(value)) return `${formatNumber(value)} inches is a common advertised screen diagonal. The device's width and height depend on its aspect ratio and bezel.`;
  if (value === 12) return "Twelve inches is exactly one foot and is the length of a standard 12-inch ruler.";
  if (value === 10) return "Ten inches is slightly shorter than the 11-inch long edge of US letter paper.";
  if (value <= 3) return "This is a small measurement often used for hardware, craft materials, and compact product details.";
  if (value <= 24) return "Measurements in this range are common for devices, shelves, storage products, and household items.";
  return "For furniture, screens, and building materials, check whether the stated measurement is width, height, depth, or diagonal.";
}

function ExactInchPage({ value, slug }: { value: number; slug: string }) {
  const result = inchesToCm(value);
  const valueText = formatNumber(value);
  const resultText = formatNumber(result);
  const singular = value === 1;
  const previous = Math.max(0.5, value - (Number.isInteger(value) ? 1 : 0.5));
  const next = value + (Number.isInteger(value) ? 1 : 0.5);
  const faq: FaqItem[] = [
    { question: `How many cm is ${valueText} ${singular ? "inch" : "inches"}?`, answer: `${valueText} ${singular ? "inch equals" : "inches equal"} exactly ${resultText} centimeters.` },
    { question: `How do you convert ${valueText} inches to cm?`, answer: `Multiply ${valueText} by 2.54. The calculation is ${valueText} × 2.54 = ${resultText} cm.` },
    { question: `Is ${resultText} cm an exact result?`, answer: "Yes. One inch is defined as exactly 2.54 cm, so this multiplication is exact." },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: `${valueText} inches in cm`, path: `/${slug}` }]), faqSchema(faq)]} />
      <Breadcrumbs current={`${valueText} ${singular ? "Inch" : "Inches"} in CM`} />
      <article className="narrow content-page">
        <div className="eyebrow">Inch to centimeter conversion</div>
        <h1>{valueText} {singular ? "Inch" : "Inches"} in CM</h1>
        <div className="answer-box"><div className="answer">{valueText} {singular ? "inch" : "inches"} = {resultText} cm</div><div>Exact result using 1 inch = 2.54 cm</div></div>
        <Converter initialValue={value} initialMode="in-to-cm" compact />
        <h2>Conversion formula</h2>
        <p>Multiply the length in inches by 2.54:</p>
        <div className="formula">{valueText} × 2.54 = {resultText} cm</div>
        <h2>What does {valueText} inches look like?</h2>
        <p>{realWorldNote(value)}</p>
        {screenInches.includes(value) && <p><Link href="/screen-size-vs-width-height">Learn how screen diagonal relates to width and height →</Link></p>}
        <h2>Nearby conversions</h2>
        <ul className="link-list">
          <li><Link href={inchSlug(previous)}>{formatNumber(previous)} inches in cm</Link></li>
          <li><Link href={inchSlug(next)}>{formatNumber(next)} inches in cm</Link></li>
          <li><Link href={cmSlug(result)}>{resultText} cm in inches</Link></li>
          <li><Link href="/inch-to-cm-chart">Inch to cm chart</Link></li>
        </ul>
        <Faq items={faq} />
      </article>
    </>
  );
}

function ExactCmPage({ value, slug }: { value: number; slug: string }) {
  const result = cmToInches(value);
  const valueText = formatNumber(value);
  const resultText = formatNumber(result);
  const faq = [
    { question: `How many inches is ${valueText} cm?`, answer: `${valueText} centimeters is approximately ${resultText} inches.` },
    { question: `How do you convert ${valueText} cm to inches?`, answer: `Divide ${valueText} by 2.54. The result is approximately ${resultText} inches.` },
    { question: "Why is the inch result rounded?", answer: "Most centimeter values produce repeating decimals in inches, so the displayed result is rounded to four decimal places." },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: `${valueText} cm in inches`, path: `/${slug}` }]), faqSchema(faq)]} />
      <Breadcrumbs current={`${valueText} CM in Inches`} />
      <article className="narrow content-page">
        <div className="eyebrow">Centimeter to inch conversion</div>
        <h1>{valueText} CM in Inches</h1>
        <div className="answer-box"><div className="answer">{valueText} cm ≈ {resultText} inches</div><div>Rounded to four decimal places</div></div>
        <Converter initialValue={value} initialMode="cm-to-in" compact />
        <h2>Conversion formula</h2>
        <div className="formula">{valueText} ÷ 2.54 = {resultText} inches</div>
        <h2>Nearby conversions</h2>
        <ul className="link-list">
          <li><Link href={cmSlug(Math.max(0.5, value - 1))}>{formatNumber(Math.max(0.5, value - 1))} cm in inches</Link></li>
          <li><Link href={cmSlug(value + 1)}>{formatNumber(value + 1)} cm in inches</Link></li>
          <li><Link href={inchSlug(result)}>{resultText} inches in cm</Link></li>
          <li><Link href="/cm-to-inch-chart">CM to inch chart</Link></li>
        </ul>
        <Faq items={faq} />
      </article>
    </>
  );
}

function HeightPage({ feet, inches, slug }: { feet: number; inches: number; slug: string }) {
  const totalInches = feet * 12 + inches;
  const result = heightToCm(feet, inches);
  const resultText = formatNumber(result);
  const label = inches === 0 ? `${feet} feet` : `${feet}'${inches}"`;
  const previousTotal = totalInches - 1;
  const nextTotal = totalInches + 1;
  const previous = { feet: Math.floor(previousTotal / 12), inches: previousTotal % 12 };
  const next = { feet: Math.floor(nextTotal / 12), inches: nextTotal % 12 };
  const faq = [
    { question: `How tall is ${label} in cm?`, answer: `${feet} feet ${inches} inches equals exactly ${resultText} centimeters.` },
    { question: `How is ${label} converted to centimeters?`, answer: `First convert the height to ${totalInches} total inches, then multiply by 2.54 to get ${resultText} cm.` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: `${label} in cm`, path: `/${slug}` }]), faqSchema(faq)]} />
      <Breadcrumbs current={`${label} in CM`} />
      <article className="narrow content-page">
        <div className="eyebrow">Height conversion</div>
        <h1>{label} in CM</h1>
        <div className="answer-box"><div className="answer">{feet} ft {inches} in = {resultText} cm</div></div>
        <h2>Height formula</h2>
        <div className="formula">{feet} feet = {feet * 12} inches<br />{feet * 12} + {inches} = {totalInches} inches<br />{totalInches} × 2.54 = {resultText} cm</div>
        <h2>Nearby heights</h2>
        <ul className="link-list">
          <li><Link href={heightSlug(previous.feet, previous.inches)}>{previous.feet}&apos;{previous.inches}&quot; in cm</Link></li>
          <li><Link href={heightSlug(next.feet, next.inches)}>{next.feet}&apos;{next.inches}&quot; in cm</Link></li>
          <li><Link href="/height-chart">Height chart</Link></li>
          <li><Link href="/height-converter">Height converter</Link></li>
        </ul>
        <Faq items={faq} />
      </article>
    </>
  );
}

function GuidePage({ guide, slug }: { guide: (typeof guides)[string]; slug: string }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: guide.title, path: `/${slug}` }])} />
      <Breadcrumbs current={guide.title} />
      <article className="narrow content-page">
        <div className="eyebrow">Practical measurement guide</div>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.description}</p>
        {guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body}</section>)}
        <div className="answer-box">
          <h2>Convert a measurement now</h2>
          <p>Use the exact converter without leaving this guide.</p>
          <Converter compact />
        </div>
        <p><Link href="/inch-to-cm-chart">Browse the complete inch-to-cm chart →</Link></p>
      </article>
    </>
  );
}

export default async function DynamicSeoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = parsePage(slug);
  if (!page) notFound();
  if (page.type === "redirect") permanentRedirect(page.path);
  if (page.type === "inch") return <ExactInchPage value={page.value} slug={slug} />;
  if (page.type === "cm") return <ExactCmPage value={page.value} slug={slug} />;
  if (page.type === "height") return <HeightPage feet={page.feet} inches={page.inches} slug={slug} />;
  return <GuidePage guide={page.guide} slug={slug} />;
}
