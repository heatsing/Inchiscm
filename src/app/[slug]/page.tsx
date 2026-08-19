import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { Converter } from "@/components/Converter";
import { AlternateUnits, HeightScale, MeasurementRuler } from "@/components/ConversionInsights";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LengthConverter } from "@/components/LengthConverter";
import { OnThisPage, type OnThisPageItem } from "@/components/OnThisPage";
import { PpiCalculator } from "@/components/PpiCalculator";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ScreenDimensionsCalculator } from "@/components/ScreenDimensionsCalculator";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
import {
  cmToInches,
  formatNumber,
  heightToCm,
  inchesToCm,
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
import {
  breadcrumbSchema,
  faqSchema,
  graphSchema,
  pageMetadata,
  webApplicationSchema,
  webPageSchema,
} from "@/lib/seo";
import { dynamicSlugParams, getPageDefinition } from "@/data/page-registry";
import { getCmConversionProfile, getHeightConversionProfile, getInchConversionProfile } from "@/data/conversion-page-profiles";
import {
  type GuideData,
  getCmPageData,
  getHeightPageData,
  getInchPageData,
  guideDirectAnswers,
  guideFaqs,
  guides,
  isGuideSlug,
} from "@/data/page-registry/content";

type Params = Promise<{ slug: string }>;

function parsePage(slug: string) {
  const definition = getPageDefinition(`/${slug}`);
  if (!definition) return null;
  if (definition.conversionValue?.kind === "inch") {
    return { type: "inch" as const, value: definition.conversionValue.value };
  }
  if (definition.conversionValue?.kind === "cm") {
    return { type: "cm" as const, value: definition.conversionValue.value };
  }
  if (definition.conversionValue?.kind === "height") {
    return {
      type: "height" as const,
      feet: definition.conversionValue.feet,
      inches: definition.conversionValue.inches,
    };
  }
  if (definition.type === "guide" && isGuideSlug(slug)) {
    return { type: "guide" as const, guide: guides[slug] };
  }
  return null;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return dynamicSlugParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const definition = getPageDefinition(`/${slug}`);
  if (!definition) return {};
  return pageMetadata(definition.title, definition.description, definition.path);
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

function sectionAnchor(heading: string): `#${string}` {
  const id = heading
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `#${id || "section"}`;
}

function uniqueNumbers(values: number[]) {
  return [...new Set(values.filter((value) => Number.isFinite(value) && value > 0))].sort((a, b) => a - b);
}

function nearbyInchTableValues(value: number) {
  return uniqueNumbers([
    value - 2,
    value - 1,
    value,
    value + 1,
    value + 2,
  ]);
}

function nearbyCmTableValues(value: number) {
  return uniqueNumbers([
    value - 10,
    value - 5,
    value,
    value + 5,
    value + 10,
  ]);
}

function nearbyHeightTableValues(feet: number, inches: number) {
  const total = feet * 12 + inches;
  return [-2, -1, 0, 1, 2].map((offset) => total + offset).filter((value) => value > 0);
}

const recoveryHeightSlugs = new Set(["6-11-in-cm", "4-7-in-cm", "6-8-in-cm", "4-10-in-cm", "6-4-in-cm", "6-10-in-cm"]);
const decimalNotationSlugs = new Set(["6-11-in-cm", "4-10-in-cm", "6-10-in-cm"]);

function heightNotationClarification(feet: number, inches: number, slug: string) {
  const label = `${feet}'${inches}"`;
  const fullLabel = `${feet} feet and ${inches} inches`;
  const totalInches = feet * 12 + inches;
  if (decimalNotationSlugs.has(slug)) {
    const decimalFeetText = `${feet}.${String(inches).padStart(2, "0")}`;
    const decimalFeet = Number(decimalFeetText);
    const decimalTotalInches = decimalFeet * 12;
    const decimalCm = inchesToCm(decimalTotalInches);
    return `${label} means ${fullLabel}, which is ${totalInches} total inches. ${decimalFeetText} decimal feet is not the same measurement; it equals ${formatNumber(decimalTotalInches, 2)} total inches, or about ${formatNumber(decimalCm)} cm.`;
  }
  return `${label} means ${fullLabel}. The apostrophe marks feet and the quote mark marks inches, so this page converts ${totalInches} total inches into centimeters.`;
}

function ExactInchPage({ value, slug }: { value: number; slug: string }) {
  const result = inchesToCm(value);
  const valueText = formatNumber(value);
  const resultText = formatNumber(result);
  const singular = value === 1;
  const pageData = getInchPageData(value);
  const profile = getInchConversionProfile(value);
  const faq: FaqItem[] = [
    { question: `How many centimeters is ${valueText} ${singular ? "inch" : "inches"}?`, answer: `${valueText} ${singular ? "inch equals" : "inches equal"} exactly ${resultText} centimeters.` },
    { question: `How do you convert ${valueText} ${singular ? "inch" : "inches"} to cm?`, answer: `Multiply ${valueText} by 2.54. The calculation is ${valueText} × 2.54 = ${resultText} cm.` },
    ...(value === 24 ? [{ question: "Is 24 inches exactly 2 feet?", answer: "Yes. Twelve inches equals one foot, so 24 inches equals exactly 2 feet." }] : []),
    { question: `Is ${resultText} cm an exact result?`, answer: "Yes. One inch is defined as exactly 2.54 cm, so this multiplication is exact." },
  ];
  faq.push(...pageData.faq.filter((item) => !faq.some((existing) => existing.question === item.question)));
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: pageData.title.replace(" | Inch Converter", ""), description: pageData.description, path: `/${slug}` }),
        webApplicationSchema({ name: pageData.title, description: pageData.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: pageData.breadcrumbLabel, path: `/${slug}` }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current={pageData.h1} />
      <article className="narrow content-page">
        <div className="eyebrow">Inch to centimeter conversion</div>
        <h1>{pageData.h1}</h1>
        <h2 className="question-heading">How many centimeters is {valueText} {singular ? "inch" : "inches"}?</h2>
        <div className="answer-box"><div className="answer">{pageData.directAnswer}</div><div>Exact result using 1 inch = 2.54 cm</div></div>
        <Converter initialValue={value} initialMode="in-to-cm" compact />
        <h2>Conversion formula</h2>
        <p>Multiply the length in inches by 2.54:</p>
        <div className="formula">{pageData.formula}</div>
        <h2>Other units for {valueText} {singular ? "inch" : "inches"}</h2>
        <AlternateUnits value={value} unit="in" />
        <p className="subtle">{profile.precisionNote}</p>
        {profile.notableRelationships.length > 0 && (
          <>
            <h2>Notable relationships</h2>
            <ul>
              {profile.notableRelationships.map((relationship) => <li key={relationship}>{relationship}</li>)}
            </ul>
          </>
        )}
        {value <= 12 && <MeasurementRuler inches={value} label={`${valueText} ${singular ? "inch" : "inches"}`} />}
        <h2>{valueText} {singular ? "inch" : "inches"} conversion table</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Nearby inches converted to centimeters and millimeters</caption>
            <thead><tr><th>Inches</th><th>Centimeters</th><th>Millimeters</th></tr></thead>
            <tbody>
              {nearbyInchTableValues(value).map((item) => (
                <tr key={item}>
                  <td>{formatNumber(item)} {item === 1 ? "inch" : "inches"}</td>
                  <td>{formatNumber(inchesToCm(item))} cm</td>
                  <td>{formatNumber(inchesToCm(item) * 10)} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>How big is {valueText} {singular ? "inch" : "inches"} in real life?</h2>
        <p>{realWorldNote(value)}</p>
        {screenSizeContext(value) && (
          <p>{screenSizeContext(value)} Screen sizes are diagonal measurements, not width. Use the <Link href="/screen-size-converter">screen size converter</Link> to estimate width and height.</p>
        )}
        <h2>What is {valueText} {singular ? "inch" : "inches"} commonly used to measure?</h2>
        <p>{commonUseNote(value)}</p>
        <h2>Value-specific examples for {valueText} {singular ? "inch" : "inches"}</h2>
        <ul>
          {pageData.examples.map((example) => <li key={example.key}>{example.text}</li>)}
        </ul>
        <h2>Rounding and fit tips</h2>
        <ul>
          {pageData.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
        <h2>Common inch to cm conversions</h2>
        <ul className="link-list">
          {[1, 2, 5, 10, 12, 20, 24].filter((item) => item !== value).map((item) => (
            <li key={item}><Link href={`/${item}-${item === 1 ? "inch" : "inches"}-in-cm`}>{item} {item === 1 ? "inch" : "inches"} in cm</Link></li>
          ))}
        </ul>
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
  const pageData = getCmPageData(value);
  const profile = getCmConversionProfile(value);
  const faq = [
    { question: `How many inches is ${valueText} cm?`, answer: `${valueText} centimeters is approximately ${resultText} inches.` },
    { question: `How do you convert ${valueText} cm to inches?`, answer: `Divide ${valueText} by 2.54. The result is approximately ${resultText} inches.` },
    { question: "Why is the inch result rounded?", answer: "Most centimeter values produce repeating decimals in inches, so the displayed result is rounded to four decimal places." },
  ];
  faq.push(...pageData.faq.filter((item) => !faq.some((existing) => existing.question === item.question)));
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: pageData.title.replace(" | CM Converter", ""), description: pageData.description, path: `/${slug}` }),
        webApplicationSchema({ name: pageData.title, description: pageData.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: pageData.breadcrumbLabel, path: `/${slug}` }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current={pageData.h1} />
      <article className="narrow content-page">
        <div className="eyebrow">Centimeter to inch conversion</div>
        <h1>{pageData.h1}</h1>
        <h2 className="question-heading">How many inches is {valueText} cm?</h2>
        <div className="answer-box"><div className="answer">{pageData.directAnswer}</div><div>Rounded to four decimal places</div></div>
        <Converter initialValue={value} initialMode="cm-to-in" compact />
        <h2>Conversion formula</h2>
        <div className="formula">{pageData.formula}</div>
        <h2>Other units for {valueText} cm</h2>
        <AlternateUnits value={value} unit="cm" />
        <p className="subtle">{profile.precisionNote}</p>
        <h2>Practical inch reference</h2>
        <ul>
          {profile.notableRelationships.map((relationship) => <li key={relationship}>{relationship}</li>)}
        </ul>
        {result <= 12 && <MeasurementRuler inches={result} label={`${valueText} cm`} />}
        <h2>{valueText} cm conversion table</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Nearby centimeters converted to inches</caption>
            <thead><tr><th>Centimeters</th><th>Decimal inches</th><th>Approximate fraction</th></tr></thead>
            <tbody>
              {nearbyCmTableValues(value).map((item) => {
                const inchValue = cmToInches(item);
                return (
                  <tr key={item}>
                    <td>{formatNumber(item)} cm</td>
                    <td>{formatNumber(inchValue)} inches</td>
                    <td>about {formatNumber(inchValue, 2)} in</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h2>How big is {valueText} cm in real life?</h2>
        <p>{centimeterContext(value)}</p>
        <h2>Value-specific examples for {valueText} cm</h2>
        <ul>
          {pageData.examples.map((example) => <li key={example.key}>{example.text}</li>)}
        </ul>
        <h2>Fraction and rounding tips</h2>
        <ul>
          {pageData.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
        <h2>Common cm to inches conversions</h2>
        <ul className="link-list">
          {[1, 10, 25.4, 30, 50, 100].filter((item) => item !== value).map((item) => (
            <li key={item}><Link href={`/${String(item).replace(".", "-")}-cm-in-inches`}>{formatNumber(item)} cm in inches</Link></li>
          ))}
        </ul>
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
  const meterText = formatNumber(result / 100);
  const pageData = getHeightPageData(feet, inches);
  const profile = getHeightConversionProfile(feet, inches);
  const isRecoveryPage = recoveryHeightSlugs.has(slug);
  const faq = [
    { question: `How tall is ${label} in cm?`, answer: `${fullLabel} is exactly ${resultText} centimeters.` },
    { question: `How is ${label} converted to centimeters?`, answer: `First convert the height to ${totalInches} total inches, then multiply by 2.54 to get ${resultText} cm.` },
    { question: `What is ${label} in total inches?`, answer: `${fullLabel} is ${totalInches} total inches.` },
    ...(isRecoveryPage ? [{ question: `What does ${label} mean?`, answer: `${label} means ${fullLabel}, not decimal feet notation.` }] : []),
  ];
  faq.push(...pageData.faq.filter((item) => !faq.some((existing) => existing.question === item.question)));
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: pageData.title.replace(" | Height Converter", ""), description: pageData.description, path: `/${slug}` }),
        webApplicationSchema({ name: pageData.title, description: pageData.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: pageData.breadcrumbLabel, path: `/${slug}` }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current={pageData.h1} />
      <article className="narrow content-page">
        <div className="eyebrow">Height conversion</div>
        <h1>{pageData.h1}</h1>
        <h2 className="question-heading">How tall is {label} in centimeters?</h2>
        <div className="answer-box">
          <div className="answer">{pageData.directAnswer}</div>
          <div>{totalInches} total inches</div>
          {isRecoveryPage && <div>{meterText} meters</div>}
          <div>{decimalFeetText} decimal feet</div>
          <div className="formula">{pageData.formula}</div>
        </div>
        <FeetToCmConverter defaultFeet={feet} defaultInches={inches} />
        <h2>How many cm is {fullLabel}?</h2>
        <p>{fullLabel} equals exactly {resultText} centimeters. The conversion first changes the height to {totalInches} total inches, then multiplies by 2.54.</p>
        <h2>How many inches is {label}?</h2>
        <p>{label} is {totalInches} total inches because {feet} feet equals {feet * 12} inches and the remaining {inches} inches are added after that.</p>
        <HeightScale feet={feet} inches={inches} centimeters={result} />
        <h2>{label} measurement summary</h2>
        <ul>
          {profile.notableRelationships.map((relationship) => <li key={relationship}>{relationship}</li>)}
        </ul>
        <p className="subtle">{profile.precisionNote}</p>
        <h2>How to convert {label} to cm</h2>
        <div className="formula">{feet} feet = {feet * 12} inches<br />{feet * 12} + {inches} = {totalInches} inches<br />{pageData.formula}</div>
        {isRecoveryPage && (
          <>
            <h2>Height notation for {label}</h2>
            <p>{heightNotationClarification(feet, inches, slug)}</p>
            <h2>Precision for {label} in centimeters</h2>
            <p>The centimeter result uses the exact inch definition: 1 inch = 2.54 cm. The displayed value is suitable for most forms and charts; round only if the form asks for a whole centimeter.</p>
          </>
        )}
        <h2>{label} nearby height conversion table</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Nearby heights converted to centimeters</caption>
            <thead><tr><th>Height</th><th>Total inches</th><th>Centimeters</th></tr></thead>
            <tbody>
              {nearbyHeightTableValues(feet, inches).map((total) => {
                const rowFeet = Math.floor(total / 12);
                const rowInches = total % 12;
                const rowLabel = rowInches === 0 ? `${rowFeet} feet` : `${rowFeet}'${rowInches}"`;
                return (
                  <tr key={total}>
                    <td>{rowLabel}</td>
                    <td>{total}</td>
                    <td>{formatNumber(inchesToCm(total))} cm</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h2>When this height conversion is useful</h2>
        <p>{heightRangeContext(totalInches)}</p>
        <p>This height is {totalInches} total inches, or {formatNumber(result / 100)} meters. Use the exact centimeter value when a form, profile, chart, or specification expects metric units.</p>
        <h2>Value-specific height examples</h2>
        <ul>
          {pageData.examples.map((example) => <li key={example.key}>{example.text}</li>)}
        </ul>
        <h2>Height rounding tips</h2>
        <ul>
          {pageData.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
        <h2>Related length conversions</h2>
        <RelatedLinks sections={getHeightRelatedLinks(feet, inches)} />
        <AdSlot />
        <Faq items={faq} />
      </article>
    </>
  );
}

function GuidePage({ guide, slug }: { guide: GuideData; slug: string }) {
  const faq = guideFaqs[slug];
  const showMethodology = ["how-to-convert-inches-to-cm", "inch-vs-cm", "why-is-one-inch-2-54-cm"].includes(slug);
  const tocItems: OnThisPageItem[] = [
    { href: "#direct-answer", label: "Direct answer" },
    { href: "#tool", label: "Converter" },
    ...guide.sections.map((section) => ({ href: sectionAnchor(section.heading), label: section.heading })),
    { href: "#related-tools", label: "Related tools" },
    { href: "#faq", label: "FAQ" },
  ];
  const guideTool = "screenTool" in guide && guide.screenTool === "ppi"
    ? <PpiCalculator />
    : "screenTool" in guide
      ? <ScreenDimensionsCalculator defaultDiagonal={guide.screenTool === "aspect-ratio" ? 27 : 15.6} defaultAspectRatio="16:9" />
      : "tool" in guide
    ? <LengthConverter defaultFrom={guide.tool.defaultFrom} defaultTo={guide.tool.defaultTo} defaultValue={guide.tool.defaultValue} compact presets={guide.tool.presets} />
    : slug === "height-conversion-guide"
    ? <FeetToCmConverter defaultFeet={5} defaultInches={8} />
    : slug === "screen-size-vs-width-height"
      ? <ScreenDimensionsCalculator defaultDiagonal={15.6} defaultAspectRatio="16:9" />
      : <Converter compact initialValue={guide.initialValue ?? 10} />;
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: guide.title, description: guide.description, path: `/${slug}` }),
        webApplicationSchema({ name: guide.title, description: guide.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: guide.title, path: `/${slug}` }]),
        faqSchema(faq),
      ])} />
      <Breadcrumbs current={guide.title} />
      <article className="narrow content-page">
        <div className="eyebrow">Practical measurement guide</div>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.description}</p>
        <div className="answer-box" id="direct-answer"><div className="answer">{guideDirectAnswers[slug]}</div></div>
        {showMethodology && <p className="methodology-link">Review the <Link href="/conversion-methodology">exact factors, rounding method, and authoritative sources</Link>.</p>}
        <div id="tool">{guideTool}</div>
        <OnThisPage items={tocItems} />
        {guide.sections.map((section) => {
          const href = sectionAnchor(section.heading);
          return <section id={href.slice(1)} key={section.heading}><h2>{section.heading}</h2>{section.body}</section>;
        })}
        <h2 id="related-tools">Related measurement tools</h2>
        <RelatedLinks sections={getGuideRelatedLinks(slug)} />
        <AdSlot />
        <div id="faq"><Faq items={faq} /></div>
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
