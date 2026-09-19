import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { Converter } from "@/components/Converter";
import { HeightScale, MeasurementRuler } from "@/components/ConversionInsights";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LiteralText } from "@/components/LiteralText";
import { LengthConverter } from "@/components/LengthConverter";
import { NumericPageModules } from "@/components/NumericPageModules";
import { FractionCmPageModules } from "@/components/FractionCmPageModules";
import { OnThisPage, type OnThisPageItem } from "@/components/OnThisPage";
import { PpiCalculator } from "@/components/PpiCalculator";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ScreenDimensionsCalculator } from "@/components/ScreenDimensionsCalculator";
import { HeightResultActions } from "@/components/HeightResultActions";
import { FeetToCmConverter } from "@/components/SpecializedConverters";
import {
  cmToInches,
  formatNumber,
  inchesToCm,
} from "@/lib/conversions";
import {
  getCmRelatedLinks,
  getFractionCmRelatedLinks,
  getGuideRelatedLinks,
  getHeightRelatedLinks,
  getInchRelatedLinks,
} from "@/lib/internal-links";
import { getHeightPageModules } from "@/lib/height-page-modules";
import { getCmNumericModules, getInchNumericModules } from "@/lib/numeric-page-modules";
import { getFractionCmModules } from "@/lib/fraction-cm-modules";
import { getFractionCmPageData, parseFractionCmSlug } from "@/lib/fraction-cm";
import {
  absoluteUrl,
  breadcrumbSchema,
  faqSchema,
  graphSchema,
  pageMetadata,
  webApplicationSchema,
  webPageSchema,
} from "@/lib/seo";
import { isGeneratedGuideSlug } from "@/data/page-registry/generated-guides";
import { dynamicSlugParams, getPageDefinition } from "@/data/page-registry";
import { getHeightConversionProfile } from "@/data/conversion-page-profiles";
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
  if (definition.conversionValue?.kind === "fraction-cm") {
    return {
      type: "fraction-cm" as const,
      numerator: definition.conversionValue.numerator,
      denominator: definition.conversionValue.denominator,
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

function decimalFeet(feet: number, inches: number) {
  return formatNumber(feet + inches / 12, 2);
}

function sectionAnchor(heading: string): `#${string}` {
  const id = heading
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `#${id || "section"}`;
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
  const pageData = getInchPageData(value);
  const modules = getInchNumericModules(value);
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: pageData.title.replace(" | Inch Converter", ""), description: pageData.description, path: `/${slug}` }),
        webApplicationSchema({ name: pageData.title, description: pageData.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: pageData.breadcrumbLabel, path: `/${slug}` }]),
      ])} />
      <Breadcrumbs current={pageData.h1} />
      <article className="narrow content-page">
        <div className="eyebrow">Inch to centimeter conversion</div>
        <h1>{pageData.h1}</h1>
        <h2 className="question-heading">How many centimeters is {modules.valueText} {modules.unitLabel}?</h2>
        <div className="answer-box">
          <div className="answer">{pageData.directAnswer}</div>
          <div>Exact result using 1 inch = 2.54 cm</div>
          <div className="answer-equivalents">
            <span><strong>{modules.mmText} mm</strong></span>
            <span><strong>{modules.mText} m</strong></span>
            {modules.fraction ? <span><strong>{modules.fraction.text}</strong></span> : null}
            {modules.feetAndInches ? <span><strong>{modules.feetAndInches}</strong></span> : null}
          </div>
        </div>
        <Converter initialValue={value} initialMode="in-to-cm" compact />
        <h2>Conversion formula</h2>
        <p>Multiply the length in inches by 2.54:</p>
        <div className="formula">{pageData.formula}</div>
        {value <= 12 && <MeasurementRuler inches={value} label={`${modules.valueText} ${modules.unitLabel}`} />}
        <NumericPageModules modules={modules} />
        <h2>Related inch conversions</h2>
        <RelatedLinks sections={getInchRelatedLinks(value)} />
        <AdSlot />
        <Faq items={modules.faq} />
      </article>
    </>
  );
}

function ExactCmPage({ value, slug }: { value: number; slug: string }) {
  const pageData = getCmPageData(value);
  const modules = getCmNumericModules(value);
  const inches = cmToInches(value);
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: pageData.title.replace(" | CM Converter", ""), description: pageData.description, path: `/${slug}` }),
        webApplicationSchema({ name: pageData.title, description: pageData.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: pageData.breadcrumbLabel, path: `/${slug}` }]),
      ])} />
      <Breadcrumbs current={pageData.h1} />
      <article className="narrow content-page">
        <div className="eyebrow">Centimeter to inch conversion</div>
        <h1>{pageData.h1}</h1>
        <h2 className="question-heading">How many inches is {modules.valueText} cm?</h2>
        <div className="answer-box">
          <div className="answer">{pageData.directAnswer}</div>
          <div>Rounded to four decimal places</div>
          <div className="answer-equivalents">
            <span><strong>{modules.mmText} mm</strong></span>
            <span><strong>{modules.mText} m</strong></span>
            <span><strong>{modules.fraction.text}</strong></span>
          </div>
        </div>
        <Converter initialValue={value} initialMode="cm-to-in" compact />
        <h2>Conversion formula</h2>
        <div className="formula">{pageData.formula}</div>
        {inches <= 12 && <MeasurementRuler inches={inches} label={`${modules.valueText} cm`} />}
        <NumericPageModules modules={modules} />
        <h2>Related centimeter conversions</h2>
        <RelatedLinks sections={getCmRelatedLinks(value)} />
        <AdSlot />
        <Faq items={modules.faq} />
      </article>
    </>
  );
}

function FractionCmPage({ slug }: { slug: string }) {
  const spec = parseFractionCmSlug(slug);
  if (!spec) notFound();
  const pageData = getFractionCmPageData(spec);
  const modules = getFractionCmModules(spec);
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: pageData.title.replace(" | Fraction Converter", ""), description: pageData.description, path: `/${slug}` }),
        webApplicationSchema({ name: pageData.title, description: pageData.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: pageData.breadcrumbLabel, path: `/${slug}` }]),
      ])} />
      <Breadcrumbs current={pageData.h1} />
      <article className="narrow content-page">
        <div className="eyebrow">Fraction inch to centimeter conversion</div>
        <h1>{pageData.h1}</h1>
        <h2 className="question-heading">How many centimeters is {pageData.fraction} inch?</h2>
        <div className="answer-box">
          <div className="answer">{pageData.directAnswer}</div>
          <div>Exact result using 1 inch = 2.54 cm</div>
          <div className="answer-equivalents">
            <span><strong>{modules.mmText} mm</strong></span>
            <span><strong>{modules.decimalText} in</strong></span>
          </div>
        </div>
        <Converter initialValue={pageData.inches} initialMode="in-to-cm" compact />
        <h2>Conversion formula</h2>
        <p>Convert {pageData.fraction} to decimal inches, then multiply by 2.54:</p>
        <div className="formula">{pageData.formula}</div>
        <MeasurementRuler inches={pageData.inches} label={`${pageData.fraction} inch`} />
        <FractionCmPageModules modules={modules} />
        <h2>Related fraction conversions</h2>
        <RelatedLinks sections={getFractionCmRelatedLinks(spec)} />
        <AdSlot />
      </article>
    </>
  );
}

function HeightPage({ feet, inches, slug }: { feet: number; inches: number; slug: string }) {
  const label = inches === 0 ? `${feet} feet` : `${feet}'${inches}"`;
  const fullLabel = inches === 0 ? `${feet} feet` : `${feet} feet ${inches} inches`;
  const decimalFeetText = decimalFeet(feet, inches);
  const pageData = getHeightPageData(feet, inches);
  const profile = getHeightConversionProfile(feet, inches);
  const modules = getHeightPageModules(feet, inches);
  const isRecoveryPage = recoveryHeightSlugs.has(slug);
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: pageData.title.replace(" | Height", ""), description: pageData.description, path: `/${slug}` }),
        webApplicationSchema({ name: pageData.title, description: pageData.description, path: `/${slug}` }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: pageData.breadcrumbLabel, path: `/${slug}` }]),
      ])} />
      <Breadcrumbs current={pageData.h1} />
      <article className="narrow content-page height-page">
        <div className="eyebrow">Height conversion (feet and inches)</div>
        <LiteralText as="h1" text={pageData.h1} />
        <div className="height-answer-hero answer-box" id="direct-answer">
          <div className="height-answer-dual">
            <p className="height-answer-cm">{`${modules.resultText} cm`}</p>
            <LiteralText as="p" className="height-answer-ftin" text={modules.ftInText} />
          </div>
          <p className="height-answer-alt">{`${modules.ftInSpelled} · ${modules.meterText} m · ${modules.totalInches} total inches`}</p>
          <div className="formula height-answer-formula">{modules.formula.compact}</div>
          <div className="answer">{pageData.directAnswer}</div>
          <HeightResultActions
            copyText={`${modules.equalityText}\n${modules.formula.compact}\n${absoluteUrl(`/${slug}`)}`}
            shareUrl={absoluteUrl(`/${slug}`)}
            shareTitle={pageData.title}
            shareText={modules.equalityText}
          />
        </div>
        <FeetToCmConverter defaultFeet={feet} defaultInches={inches} />
        <h2 id="height-formula">How to convert {label} to cm</h2>
        <ol className="height-formula-steps">
          {modules.formula.steps.map((step) => (
            <li key={step.label}><strong>{step.label}:</strong> {step.expression}</li>
          ))}
        </ol>
        <div className="formula">{modules.formula.compact}</div>
        <p>{fullLabel} is a height in feet and inches and equals exactly {modules.resultText} centimeters because {feet} feet is {modules.formula.feetToInches} inches, plus {inches} inches is {modules.totalInches} total inches.</p>
        <h2 id="nearby-heights">{label} nearby height conversion table</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Nearby heights within {modules.nearby.length - 1} published one-inch steps</caption>
            <thead><tr><th>Height</th><th>Centimeters</th><th>Total inches</th></tr></thead>
            <tbody>
              {modules.nearby.map((height) => (
                <tr key={height.totalInches} className={height.isCurrent ? "height-nearby-current" : undefined}>
                  <td>
                    {height.href
                      ? <Link href={height.href}>{height.label}</Link>
                      : height.label}
                  </td>
                  <td>{`${height.cmText} cm`}</td>
                  <td>{height.totalInches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 id="height-context">{label} height context</h2>
        <p className="height-context">{modules.context}</p>
        <p>This height is {modules.totalInches} total inches, or {modules.meterText} meters ({decimalFeetText} decimal feet). Use the exact centimeter value when a form, profile, chart, or specification expects metric units.</p>
        <HeightScale feet={feet} inches={inches} centimeters={modules.result} />
        <h2>{label} measurement summary</h2>
        <ul>
          {profile.notableRelationships.map((relationship) => <li key={relationship}>{relationship}</li>)}
        </ul>
        <p className="subtle">{profile.precisionNote}</p>
        {isRecoveryPage && (
          <>
            <h2>Height notation for {label}</h2>
            <p>{heightNotationClarification(feet, inches, slug)}</p>
            <h2>Precision for {label} in centimeters</h2>
            <p>The centimeter result uses the exact inch definition: 1 inch = 2.54 cm. The displayed value is suitable for most forms and charts; round only if the form asks for a whole centimeter.</p>
          </>
        )}
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
        <Faq items={modules.faq} />
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
        ...(isGeneratedGuideSlug(slug) || !faq?.length ? [] : [faqSchema(faq)]),
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
  if (page.type === "fraction-cm") return <FractionCmPage slug={slug} />;
  return <GuidePage guide={page.guide} slug={slug} />;
}
