import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { Converter } from "@/components/Converter";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ScreenDimensionsCalculator } from "@/components/ScreenDimensionsCalculator";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
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
} from "@/lib/conversions";
import {
  getCmContext,
  getCmRelatedLinks,
  getGuideRelatedLinks,
  getHeightContext,
  getHeightRelatedLinks,
  getInchContext,
  getInchRelatedLinks,
  getUseCasesByMeasurement,
  isCommonScreenSize,
} from "@/lib/internal-links";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

const guides: Record<string, { title: string; description: string; initialValue?: number; sections: { heading: string; body: React.ReactNode }[] }> = {
  "how-to-convert-inches-to-cm": {
    title: "How to Convert Inches to CM - Formula and Examples",
    description: "Learn the exact inches-to-centimeters formula, work through examples, and avoid common rounding mistakes.",
    sections: [
      { heading: "The exact formula", body: <><p>Multiply the inch measurement by <strong>2.54</strong>. The factor is exact, so any rounding comes from how the final result is displayed.</p><div className="formula">inches × 2.54 = centimeters</div></> },
      { heading: "Worked example", body: <p>For 12 inches, calculate 12 × 2.54. The result is exactly 30.48 centimeters. For 5.5 inches, 5.5 × 2.54 = 13.97 centimeters.</p> },
      { heading: "When precision matters", body: <p>Keep extra decimal places while calculating product tolerances, technical drawings, or body measurements. Round only the final result to the precision your task requires.</p> },
    ],
  },
  "inch-vs-cm": {
    title: "Inch vs CM - Difference, Formula, and Examples",
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
    initialValue: 10,
    sections: [
      { heading: "The exact size", body: <p>Ten inches equals exactly 25.4 cm. It is a little shorter than the long side of US letter paper, which measures 11 inches.</p> },
      { heading: "Useful comparisons", body: <p>Ten inches is close to the height of a large tablet and slightly longer than the short side of US letter paper. Object dimensions vary, so use these as visual references rather than specifications.</p> },
    ],
  },
  "how-big-is-12-inches": {
    title: "How Big Is 12 Inches?",
    description: "See how long 12 inches is in centimeters, feet, and familiar real-world references.",
    initialValue: 12,
    sections: [
      { heading: "The exact size", body: <p>Twelve inches equals exactly 30.48 cm and exactly one foot.</p> },
      { heading: "Useful comparisons", body: <p>A standard school ruler is commonly 12 inches long. The long side of US letter paper is one inch shorter at 11 inches.</p> },
    ],
  },
  "how-big-is-15-inches": {
    title: "How Big Is 15 Inches? Size and Examples",
    description: "See how long 15 inches is in centimeters and compare it with familiar screens, notebooks, packaging, and furniture dimensions.",
    initialValue: 15,
    sections: [
      { heading: "The direct answer", body: <p>Fifteen inches equals exactly 38.1 cm. It is also 1.25 feet, or one foot and three inches.</p> },
      { heading: "Everyday size comparisons", body: <p>Fifteen inches is close to the diagonal class of many laptops, a little longer than a standard 12-inch ruler, and similar to one dimension of some large notebooks and compact packages. Product sizes vary, so verify specifications before buying or fitting an item.</p> },
      { heading: "Screens and physical width", body: <p>A 15-inch display measurement is diagonal, not width. The actual width depends on the aspect ratio, while the full laptop or monitor also includes its bezel and casing.</p> },
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

const guideDirectAnswers: Record<string, string> = {
  "how-to-convert-inches-to-cm": "Multiply inches by exactly 2.54 to get centimeters.",
  "inch-vs-cm": "One inch is exactly 2.54 centimeters, so an inch is longer than a centimeter.",
  "why-is-one-inch-2-54-cm": "One inch equals exactly 2.54 cm because the international inch was standardized as 0.0254 meter in 1959.",
  "how-to-measure-inches-without-a-ruler": "For a rough estimate, compare the object with paper, a credit card, or another item of known size; use a ruler when precision matters.",
  "how-big-is-10-inches": "10 inches equals exactly 25.4 cm and is one inch shorter than the long side of US letter paper.",
  "how-big-is-12-inches": "12 inches equals exactly 30.48 cm and exactly one foot.",
  "how-big-is-15-inches": "15 inches equals exactly 38.1 cm, or one foot and three inches.",
  "common-product-dimensions-in-cm": "Convert every listed product dimension separately by multiplying inches by 2.54.",
  "screen-size-vs-width-height": "Screen size is the diagonal measurement; width and height depend on the display aspect ratio.",
  "height-conversion-guide": "Convert feet to inches, add the remaining inches, then multiply the total by 2.54.",
};

const guideFaqs: Record<string, FaqItem[]> = {
  "how-to-convert-inches-to-cm": [
    { question: "Is the 2.54 conversion factor exact?", answer: "Yes. One inch is defined as exactly 2.54 centimeters." },
    { question: "When should I round the result?", answer: "Keep the full calculation and round only the final value to the precision your task needs." },
  ],
  "inch-vs-cm": [
    { question: "Which is larger, an inch or a centimeter?", answer: "An inch is larger. One inch contains exactly 2.54 centimeters." },
    { question: "Are inches part of the metric system?", answer: "No. Centimeters are metric units; inches are used in US customary and imperial measurement." },
  ],
  "why-is-one-inch-2-54-cm": [
    { question: "Is 2.54 cm an approximation?", answer: "No. The international inch is defined as exactly 2.54 centimeters." },
    { question: "When was the international inch standardized?", answer: "The current international definition was adopted in 1959." },
  ],
  "how-to-measure-inches-without-a-ruler": [
    { question: "Can a phone screen work as a ruler?", answer: "Only after calibration, because screen size, pixel density, and browser scaling vary." },
    { question: "Are object comparisons accurate enough for cutting?", answer: "No. Use them only for estimates and use a real measuring tool for precise work." },
  ],
  "how-big-is-10-inches": [
    { question: "How many centimeters is 10 inches?", answer: "Ten inches is exactly 25.4 centimeters." },
    { question: "Is a 10-inch screen 10 inches wide?", answer: "Usually not. Screen size is measured diagonally." },
  ],
  "how-big-is-12-inches": [
    { question: "Is 12 inches exactly one foot?", answer: "Yes. Twelve inches equals exactly one foot." },
    { question: "How many centimeters is one foot?", answer: "One foot is exactly 30.48 centimeters." },
  ],
  "how-big-is-15-inches": [
    { question: "How many centimeters is 15 inches?", answer: "Fifteen inches is exactly 38.1 centimeters." },
    { question: "Is a 15-inch laptop 15 inches wide?", answer: "No. The advertised screen size is diagonal, and the full device also includes its bezel." },
  ],
  "common-product-dimensions-in-cm": [
    { question: "What order are product dimensions listed in?", answer: "Often length × width × height, but sellers vary, so always check the labels." },
    { question: "Should I add clearance when checking fit?", answer: "Yes. Allow room for packaging, handles, cables, doors, and measurement tolerances." },
  ],
  "screen-size-vs-width-height": [
    { question: "Does screen size include the bezel?", answer: "Usually not. It normally describes the visible display diagonal." },
    { question: "Can two screens with the same diagonal have different dimensions?", answer: "Yes. Different aspect ratios produce different widths and heights." },
  ],
  "height-conversion-guide": [
    { question: "What is 5 feet 8 inches in centimeters?", answer: "Five feet eight inches is exactly 172.72 centimeters." },
    { question: "How many inches are in one foot?", answer: "One foot contains exactly 12 inches." },
  ],
};

type Params = Promise<{ slug: string }>;

function parsePage(slug: string) {
  const inchMatch = slug.match(/^(\d+(?:-\d+)?)-(inch|inches)-in-cm$/);
  if (inchMatch) {
    const value = parseSlugNumber(inchMatch[1]);
    if (value !== null && allInchValues.includes(value) && inchSlug(value).slice(1) === slug) return { type: "inch" as const, value };
  }
  const cmMatch = slug.match(/^(\d+(?:-\d+)?)-cm-in-inches$/);
  if (cmMatch) {
    const value = parseSlugNumber(cmMatch[1]);
    if (value !== null && centimeterValues.includes(value)) return { type: "cm" as const, value };
  }
  const feetMatch = slug.match(/^(\d+)-feet-in-cm$/);
  if (feetMatch && heights.some(({ feet, inches }) => feet === Number(feetMatch[1]) && inches === 0)) return { type: "height" as const, feet: Number(feetMatch[1]), inches: 0 };
  const heightMatch = slug.match(/^(\d+)-(\d+)-in-cm$/);
  if (heightMatch && heights.some(({ feet, inches }) => feet === Number(heightMatch[1]) && inches === Number(heightMatch[2]))) return { type: "height" as const, feet: Number(heightMatch[1]), inches: Number(heightMatch[2]) };
  if (guides[slug]) return { type: "guide" as const, guide: guides[slug] };
  return null;
}

export const dynamicParams = false;

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
  if (!page) return {};
  if (page.type === "inch") {
    const value = formatNumber(page.value);
    const result = formatNumber(inchesToCm(page.value));
    return pageMetadata(`${value} ${page.value === 1 ? "Inch" : "Inches"} in CM - Formula and Real-Life Examples`, `${value} ${page.value === 1 ? "inch equals" : "inches equal"} ${result} cm. See the exact formula, nearby conversions, and real-life size examples.`, `/${slug}`);
  }
  if (page.type === "cm") {
    const value = formatNumber(page.value);
    const result = formatNumber(cmToInches(page.value));
    return pageMetadata(`${value} CM in Inches - Formula and Size Examples`, `${value} cm equals ${result} inches. See the formula, rounded result, nearby values, and everyday size examples.`, `/${slug}`);
  }
  if (page.type === "height") {
    const label = page.inches === 0 ? `${page.feet} Feet` : `${page.feet}'${page.inches}"`;
    const fullLabel = page.inches === 0 ? `${page.feet} feet` : `${page.feet} feet ${page.inches} inches`;
    const result = formatNumber(heightToCm(page.feet, page.inches));
    const totalInches = page.feet * 12 + page.inches;
    return pageMetadata(`${label} in cm: ${result} cm | Height Conversion`, `${fullLabel} is ${result} cm. ${totalInches} total inches × 2.54 = ${result} cm, with nearby height conversions.`, `/${slug}`);
  }
  return pageMetadata(page.guide.title, page.guide.description, `/${slug}`);
}

function realWorldNote(value: number) {
  return getInchContext(value);
}

function commonUseNote(value: number) {
  return getUseCasesByMeasurement(isCommonScreenSize(value) ? "screen" : "inch", value);
}

function screenSizeContext(value: number) {
  if (!isCommonScreenSize(value)) return null;
  if (value <= 14) return "This is a common laptop or tablet diagonal.";
  if (value <= 17.3) return "This is a common laptop display diagonal.";
  if (value <= 32) return "This is a common monitor display diagonal.";
  return "This is a common TV display diagonal.";
}

function heightRangeContext(totalInches: number) {
  return getHeightContext(Math.floor(totalInches / 12), totalInches % 12);
}

function decimalFeet(feet: number, inches: number) {
  return formatNumber(feet + inches / 12, 2);
}

function centimeterContext(value: number) {
  return getCmContext(value);
}

function ExactInchPage({ value, slug }: { value: number; slug: string }) {
  const result = inchesToCm(value);
  const valueText = formatNumber(value);
  const resultText = formatNumber(result);
  const singular = value === 1;
  const faq: FaqItem[] = [
    { question: `How many centimeters is ${valueText} ${singular ? "inch" : "inches"}?`, answer: `${valueText} ${singular ? "inch equals" : "inches equal"} exactly ${resultText} centimeters.` },
    { question: `How do you convert ${valueText} ${singular ? "inch" : "inches"} to cm?`, answer: `Multiply ${valueText} by 2.54. The calculation is ${valueText} × 2.54 = ${resultText} cm.` },
    ...(value === 24 ? [{ question: "Is 24 inches exactly 2 feet?", answer: "Yes. Twelve inches equals one foot, so 24 inches equals exactly 2 feet." }] : []),
    { question: `Is ${resultText} cm an exact result?`, answer: "Yes. One inch is defined as exactly 2.54 cm, so this multiplication is exact." },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: `${valueText} inches in cm`, path: `/${slug}` }]), faqSchema(faq)]} />
      <Breadcrumbs current={`${valueText} ${singular ? "Inch" : "Inches"} in CM`} />
      <article className="narrow content-page">
        <div className="eyebrow">Inch to centimeter conversion</div>
        <h1>{valueText} {singular ? "Inch" : "Inches"} in CM</h1>
        <h2 className="question-heading">How many centimeters is {valueText} {singular ? "inch" : "inches"}?</h2>
        <div className="answer-box"><div className="answer">{valueText} {singular ? "inch" : "inches"} = {resultText} cm</div><div>Exact result using 1 inch = 2.54 cm</div></div>
        <Converter initialValue={value} initialMode="in-to-cm" compact />
        <h2>Conversion formula</h2>
        <p>Multiply the length in inches by 2.54:</p>
        <div className="formula">{valueText} × 2.54 = {resultText} cm</div>
        <h2>How big is {valueText} {singular ? "inch" : "inches"} in real life?</h2>
        <p>{realWorldNote(value)}</p>
        {screenSizeContext(value) && (
          <p>{screenSizeContext(value)} Screen sizes are diagonal measurements, not width. Use the <Link href="/screen-size-converter">screen size converter</Link> to estimate width and height.</p>
        )}
        <h2>What is {valueText} {singular ? "inch" : "inches"} commonly used to measure?</h2>
        <p>{commonUseNote(value)}</p>
        <h2>Related inch conversions</h2>
        <RelatedLinks sections={getInchRelatedLinks(value)} />
        <AdSlot />
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
        <h2 className="question-heading">How many inches is {valueText} cm?</h2>
        <div className="answer-box"><div className="answer">{valueText} cm ≈ {resultText} inches</div><div>Rounded to four decimal places</div></div>
        <Converter initialValue={value} initialMode="cm-to-in" compact />
        <h2>Conversion formula</h2>
        <div className="formula">{valueText} ÷ 2.54 = {resultText} inches</div>
        <h2>How big is {valueText} cm in real life?</h2>
        <p>{centimeterContext(value)}</p>
        <h2>Related centimeter conversions</h2>
        <RelatedLinks sections={getCmRelatedLinks(value)} />
        <AdSlot />
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
  const fullLabel = inches === 0 ? `${feet} feet` : `${feet} feet ${inches} inches`;
  const decimalFeetText = decimalFeet(feet, inches);
  const faq = [
    { question: `How tall is ${label} in cm?`, answer: `${fullLabel} is exactly ${resultText} centimeters.` },
    { question: `How is ${label} converted to centimeters?`, answer: `First convert the height to ${totalInches} total inches, then multiply by 2.54 to get ${resultText} cm.` },
    { question: `What is ${label} in total inches?`, answer: `${fullLabel} is ${totalInches} total inches.` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: `${label} in cm`, path: `/${slug}` }]), faqSchema(faq)]} />
      <Breadcrumbs current={`${label} in CM`} />
      <article className="narrow content-page">
        <div className="eyebrow">Height conversion</div>
        <h1>{label} in CM</h1>
        <h2 className="question-heading">How tall is {label} in centimeters?</h2>
        <div className="answer-box">
          <div className="answer">{fullLabel} is {resultText} centimeters.</div>
          <div>{totalInches} total inches</div>
          <div>{decimalFeetText} decimal feet</div>
          <div className="formula">{totalInches} × 2.54 = {resultText} cm</div>
        </div>
        <FeetToCmConverter defaultFeet={feet} defaultInches={inches} />
        <h2>How many cm is {fullLabel}?</h2>
        <p>{fullLabel} equals exactly {resultText} centimeters. The conversion first changes the height to {totalInches} total inches, then multiplies by 2.54.</p>
        <h2>How many inches is {label}?</h2>
        <p>{label} is {totalInches} total inches because {feet} feet equals {feet * 12} inches and the remaining {inches} inches are added after that.</p>
        <h2>How to convert {label} to cm</h2>
        <div className="formula">{feet} feet = {feet * 12} inches<br />{feet * 12} + {inches} = {totalInches} inches<br />{totalInches} × 2.54 = {resultText} cm</div>
        <h2>When this height conversion is useful</h2>
        <p>{heightRangeContext(totalInches)}</p>
        <p>This height is {totalInches} total inches, or {formatNumber(result / 100)} meters. Use the exact centimeter value when a form, profile, chart, or specification expects metric units.</p>
        <h2>Related length conversions</h2>
        <RelatedLinks sections={getHeightRelatedLinks(feet, inches)} />
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}

function GuidePage({ guide, slug }: { guide: (typeof guides)[string]; slug: string }) {
  const faq = guideFaqs[slug];
  const showMethodology = ["how-to-convert-inches-to-cm", "inch-vs-cm", "why-is-one-inch-2-54-cm"].includes(slug);
  const guideTool = slug === "height-conversion-guide"
    ? <FeetToCmConverter defaultFeet={5} defaultInches={8} />
    : slug === "screen-size-vs-width-height"
      ? <ScreenDimensionsCalculator defaultDiagonal={15.6} defaultAspectRatio="16:9" />
      : <Converter compact initialValue={guide.initialValue ?? 10} />;
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: guide.title, path: `/${slug}` }]), faqSchema(faq)]} />
      <Breadcrumbs current={guide.title} />
      <article className="narrow content-page">
        <div className="eyebrow">Practical measurement guide</div>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.description}</p>
        <div className="answer-box"><div className="answer">{guideDirectAnswers[slug]}</div></div>
        {showMethodology && <p className="methodology-link">Review the <Link href="/conversion-methodology">exact factors, rounding method, and authoritative sources</Link>.</p>}
        {guideTool}
        {guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body}</section>)}
        <h2>Related measurement tools</h2>
        <RelatedLinks sections={getGuideRelatedLinks(slug)} />
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}

export default async function DynamicSeoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = parsePage(slug);
  if (!page) notFound();
  if (page.type === "inch") return <ExactInchPage value={page.value} slug={slug} />;
  if (page.type === "cm") return <ExactCmPage value={page.value} slug={slug} />;
  if (page.type === "height") return <HeightPage feet={page.feet} inches={page.inches} slug={slug} />;
  return <GuidePage guide={page.guide} slug={slug} />;
}
