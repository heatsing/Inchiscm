import {
  allInchValues,
  centimeterValues,
  cmSlug,
  cmToInches,
  formatNumber,
  heightSlug,
  heightToCm,
  inchSlug,
  inchesToCm,
  isIndexedCmValue,
  isIndexedInchValue,
  screenInches,
} from "./conversions";
import type { LinkSection } from "./url-clusters";
import {
  chartIndexLinks,
  cmPageLabel,
  expansionChartSlugs,
  expansionFractionSlugs,
  expansionMeasurementGuideSlugs,
  expansionScreenSlugs,
  expansionUnitSlugs,
  fractionConverterLinks,
  heightPageLabel,
  inchPageLabel,
  isCleanInchFraction,
  labelFromSlug,
  lengthUnitConverterSections,
  link,
  measurementGuideLinks,
  nearbyPublishedHeights,
  nearbyPublishedWindow,
  screenToolLinks,
} from "./url-clusters";
import { findFractionCmPage, fractionCmPageLabel, fractionCmPath, fractionLabel, FRACTION_CM_PAGES } from "./fraction-cm";
import { publishedFractionMmHref } from "./fraction-cm-modules";
import type { FractionCmSpec } from "./fraction-cm";

const commonScreenSizes = new Set([13.3, 14, 15.6, 17.3, 21.5, 24, 27, 32, 43, 55, 65, 75, 85]);

function circularSiblings(slugs: string[], slug: string) {
  const index = slugs.indexOf(slug);
  if (index < 0 || slugs.length < 2) return [];
  const previous = slugs[(index - 1 + slugs.length) % slugs.length];
  const next = slugs[(index + 1) % slugs.length];
  const near = slugs[(index + 2) % slugs.length];
  return [previous, next, near]
    .filter((item, itemIndex, items) => item !== slug && items.indexOf(item) === itemIndex)
    .map((item) => link(`/${item}`, labelFromSlug(item)));
}

function expansionRelatedLinks(slug: string): LinkSection[] | null {
  if (slug === "conversion-charts") {
    return uniqueSections([
      { title: "Published charts", links: chartIndexLinks() },
      { title: "Core tools", links: [link("/length-converters", "Length converters"), link("/height-tools", "Height tools"), link("/fraction-converters", "Fraction converters"), link("/site-map", "Full HTML site map")] },
    ]);
  }
  if (expansionUnitSlugs.includes(slug)) {
    return uniqueSections([
      { title: "Parent hub", links: [link("/length-converters", "Length converters")] },
      { title: "Related unit converters", links: circularSiblings(expansionUnitSlugs, slug) },
      { title: "Core tools", links: [link("/", "Inch is CM home"), link("/inches-to-cm", "Inches to cm hub"), link("/conversion-charts", "Conversion charts")] },
    ]);
  }
  if (expansionFractionSlugs.includes(slug)) {
    const mmMatch = slug.match(/^fraction-(\d+)-(\d+)-inch-to-mm$/);
    const cmTwin = mmMatch
      ? FRACTION_CM_PAGES.find((page) => page.numerator === Number(mmMatch[1]) && page.denominator === Number(mmMatch[2]))
      : null;
    return uniqueSections([
      { title: "Parent hub", links: [link("/fraction-converters", "Fraction converters")] },
      {
        title: "Centimeter landing",
        links: cmTwin
          ? [link(fractionCmPath(cmTwin.numerator, cmTwin.denominator), fractionCmPageLabel(cmTwin))]
          : [link("/fraction-inch-to-cm-chart", "Fraction inch to cm chart")],
      },
      { title: "Nearby fraction references", links: circularSiblings(expansionFractionSlugs, slug) },
      { title: "Core tools", links: [link("/decimal-inches-to-fractions", "Decimal inches to fractions"), link("/fraction-inch-to-mm-chart", "Fraction inch to mm chart"), link("/inches-to-mm", "Inches to mm")] },
    ]);
  }
  if (slug === "fraction-inch-to-cm-chart") {
    return uniqueSections([
      { title: "Common fraction inch to cm pages", links: FRACTION_CM_PAGES.map((page) => link(fractionCmPath(page.numerator, page.denominator), fractionCmPageLabel(page))) },
      { title: "Parent hub", links: [link("/conversion-charts", "Conversion charts"), link("/fraction-converters", "Fraction converters")] },
      { title: "Related charts", links: [link("/fraction-inch-to-mm-chart", "Fraction inch to mm chart"), link("/inch-to-cm-chart", "Inch to cm chart")] },
    ]);
  }
  if (expansionScreenSlugs.includes(slug)) {
    return uniqueSections([
      { title: "Parent hub", links: [link("/screen-tools", "Screen tools")] },
      { title: "Related screen calculators", links: circularSiblings(expansionScreenSlugs, slug) },
      { title: "Core tools", links: [link("/screen-size-converter", "Screen size converter"), link("/screen-dimensions-calculator", "Screen dimensions calculator"), link("/ppi-calculator", "PPI calculator")] },
    ]);
  }
  if (expansionChartSlugs.includes(slug)) {
    return uniqueSections([
      { title: "Parent hub", links: [link("/conversion-charts", "Conversion charts")] },
      { title: "Related charts", links: circularSiblings(expansionChartSlugs, slug) },
      { title: "Core tools", links: [link("/length-converters", "Length converters"), link("/height-tools", "Height tools"), link("/fraction-converters", "Fraction converters")] },
    ]);
  }
  if (expansionMeasurementGuideSlugs.includes(slug)) {
    return uniqueSections([
      { title: "Parent hub", links: [link("/measurement-guides", "Measurement guides")] },
      { title: "Related guides", links: circularSiblings(expansionMeasurementGuideSlugs, slug) },
      { title: "Core tools", links: [link("/length-converters", "Length converters"), link("/conversion-charts", "Conversion charts"), link("/conversion-methodology", "Conversion methodology")] },
    ]);
  }
  return null;
}

function uniqueSections(sections: LinkSection[]): LinkSection[] {
  const seen = new Set<string>();
  return sections.map((section) => ({
    ...section,
    links: section.links.filter((item) => {
      const key = `${item.href}|${item.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  }));
}

export function isCommonScreenSize(value: number) {
  return commonScreenSizes.has(value) && screenInches.includes(value);
}

export function getHeightContext(feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  if (totalInches < 60) {
    return "This conversion is useful for height records, character profiles, school forms, and international measurement references where centimeters are expected.";
  }
  if (totalInches <= 72) {
    return "This conversion is useful for personal height conversion, fitness profiles, clothing references, and travel or ID forms.";
  }
  return "This conversion is useful for sports profiles, athlete bios, clearance references, and international height conversion.";
}

export function getInchContext(value: number) {
  if (value === 1) return "One inch is about the width of the top segment of an adult thumb, though hands vary and this is only a visual estimate.";
  if (value === 2) return "Two inches is a common reference for small hardware, labels, and compact product details.";
  if (value === 24) return "Twenty-four inches is exactly 2 feet. It is a common size reference for monitor diagonals, cabinet depth, small shelves, luggage dimensions, and product specifications.";
  if (value < 3) return "This is a small measurement often used for hardware, craft materials, labels, and compact product details.";
  if (value <= 6) return "This range often appears in phones, hand tools, small notebooks, craft pieces, and product specification details.";
  if (value <= 12) return value === 12
    ? "Twelve inches is exactly one foot and is the length of a standard 12-inch ruler."
    : "Measurements from 7 to 12 inches are common for tablets, rulers, paper edges, packaging, and small shelves.";
  if (isCommonScreenSize(value)) return `${formatNumber(value)} inches is a common advertised screen diagonal. The device width and height depend on its aspect ratio and bezel.`;
  if (value <= 24) return "Measurements from 13 to 24 inches often appear in laptops, monitors, bags, shelves, and compact furniture.";
  if (value <= 60) return "Measurements from 25 to 60 inches are common for screens, furniture, doorways, and larger product dimensions.";
  return "For long measurements over 60 inches, compare the result with feet or meters when that makes the scale easier to understand.";
}

export function getUseCasesByMeasurement(type: "inch" | "cm" | "height" | "screen", value: number) {
  if (type === "height") return "Use this value for profiles, forms, charts, fitness records, sports references, or any place where height must be listed in metric units.";
  if (type === "screen") return "Use this value when comparing laptop, monitor, tablet, or TV display diagonals. Check width and height separately for fit.";
  if (type === "cm") {
    if (value < 5) return "This centimeter size is common for small components, craft pieces, labels, and close product details.";
    if (value <= 15) return "This range is useful for compact objects, phone dimensions, stationery, and household items.";
    if (value <= 30) return "This range often appears in tablets, notebooks, packaging, shelves, and product dimensions.";
    if (value <= 100) return "This range is useful for furniture, screens, storage, shipping boxes, and room planning.";
    return "For larger centimeter values, compare the result with meters, feet, or inches when communicating the size.";
  }
  return getInchContext(value);
}

export function getCmContext(value: number) {
  if (value === 2.54) return "This is exactly one inch, making it a useful reference point between metric and imperial units.";
  if (value === 10) return "Ten centimeters is one-tenth of a meter and is a common reference for compact product dimensions.";
  if (value === 25.4) return "This is exactly 10 inches.";
  if (value === 30.48) return "This is exactly one foot.";
  if (value === 50) return "Fifty centimeters is exactly half a meter.";
  if (value === 100) return "One hundred centimeters is exactly one meter.";
  if (value === 152.4) return "This is exactly 5 feet.";
  if (value === 182.88) return "This is exactly 6 feet.";
  if (value === 254) return "This is exactly 100 inches.";
  return getUseCasesByMeasurement("cm", value);
}

export function getInchRelatedLinks(value: number): LinkSection[] {
  const result = inchesToCm(value);
  const nearby = nearbyPublishedWindow(allInchValues, value, 3);
  const screenLinks = isCommonScreenSize(value)
    ? [link("/screen-size-converter", "Screen size converter"), link("/screen-size-vs-width-height", "Screen diagonal vs width and height")]
    : [];
  const sizeGuideLinks = value === 24 ? [link("/how-big-is-24-inches", "How big is 24 inches?")] : [];
  const fractionPage = findFractionCmPage(value);
  const fractionLandingLinks = fractionPage
    ? [link(fractionCmPath(fractionPage.numerator, fractionPage.denominator), fractionCmPageLabel(fractionPage))]
    : [];
  const fractionChartLinks = isCleanInchFraction(value)
    ? [link("/fraction-inch-to-cm-chart", "Fraction inch to cm chart")]
    : [];

  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/inches-to-cm", "Inches to cm converter"),
        link("/inch-to-cm-chart", "Inch to cm chart"),
        ...fractionChartLinks,
        ...fractionLandingLinks,
        link("/cm-to-inches", "CM to inches converter"),
        ...screenLinks.slice(0, 1),
      ],
    },
    {
      title: "Related exact conversions",
      links: [
        ...(isIndexedCmValue(result) ? [link(cmSlug(result), cmPageLabel(result))] : []),
        link("/how-to-convert-inches-to-cm", "Inch to cm formula guide"),
        link("/inch-vs-cm", "Inch vs cm explained"),
        ...sizeGuideLinks,
        ...screenLinks.slice(1),
      ],
    },
    {
      title: "Nearby published conversions",
      links: nearby.map((item) => link(inchSlug(item), inchPageLabel(item))),
    },
  ]);
}

export function getCmRelatedLinks(value: number): LinkSection[] {
  const result = cmToInches(value);
  const nearby = nearbyPublishedWindow(centimeterValues, value, 3);

  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/cm-to-inches", "CM to inches converter"),
        link("/inches-to-cm", "Inches to cm converter"),
        link("/cm-to-inch-chart", "CM to inch chart"),
      ],
    },
    {
      title: "Related exact conversions",
      links: [
        ...(isIndexedInchValue(result) ? [link(inchSlug(result), inchPageLabel(result))] : []),
        link("/inch-vs-cm", "Inch vs cm guide"),
        link("/how-to-convert-cm-to-inches", "CM to inches formula guide"),
        link("/metric-vs-imperial-units", "Metric vs imperial units"),
      ],
    },
    {
      title: "Nearby published conversions",
      links: nearby.map((item) => link(cmSlug(item), cmPageLabel(item))),
    },
  ]);
}

export function getHeightRelatedLinks(feet: number, inches: number): LinkSection[] {
  const totalInches = feet * 12 + inches;
  const result = heightToCm(feet, inches);
  const nearby = nearbyPublishedHeights(feet, inches, 3);

  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/height-converter", "Height converter"),
        link("/height-chart", "Height chart"),
        link("/height-tools", "Height tools"),
        link("/inches-to-cm", "Inches to cm converter"),
      ],
    },
    {
      title: "Related exact conversions",
      links: [
        ...(isIndexedInchValue(totalInches) ? [link(inchSlug(totalInches), inchPageLabel(totalInches))] : []),
        ...(isIndexedCmValue(result) ? [link(cmSlug(result), cmPageLabel(result))] : []),
        link("/height-conversion-guide", "Height conversion guide"),
        link("/cm-to-feet-and-inches", "CM to feet and inches"),
      ],
    },
    {
      title: "Nearby height conversions",
      links: nearby.map((height) => link(heightSlug(height.feet, height.inches), heightPageLabel(height.feet, height.inches))),
    },
  ]);
}

export function getScreenRelatedLinks(value?: number): LinkSection[] {
  const relatedSizes = [13.3, 15.6, 24, 27, 55].filter((size) => size !== value && isIndexedInchValue(size));
  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/screen-size-converter", "Screen size converter"),
        link("/inches-to-cm", "Inches to cm converter"),
        link("/inch-to-cm-chart", "Inch to cm chart"),
      ],
    },
    {
      title: "Related screen sizes",
      links: [
        ...(value && isIndexedInchValue(value) ? [link(inchSlug(value), `${formatNumber(value)}-inch screen in cm`)] : []),
        ...relatedSizes.slice(0, 4).map((size) => link(inchSlug(size), `${formatNumber(size)}-inch screen in cm`)),
      ],
    },
    {
      title: "Helpful guides",
      links: [
        link("/screen-size-vs-width-height", "Screen size vs width and height"),
        link("/laptop-screen-size-in-cm", "Laptop screen size in cm"),
        link("/tv-size-in-cm", "TV size in cm"),
        link("/common-product-dimensions-in-cm", "Product dimensions in cm"),
      ],
    },
  ]);
}

export function getFractionCmRelatedLinks(spec: FractionCmSpec): LinkSection[] {
  const inches = spec.numerator / spec.denominator;
  const nearby = nearbyPublishedWindow(FRACTION_CM_PAGES.map((page) => page.numerator / page.denominator), inches, 2)
    .flatMap((value) => {
      const page = findFractionCmPage(value);
      return page ? [link(fractionCmPath(page.numerator, page.denominator), fractionCmPageLabel(page))] : [];
    });
  const mmHref = publishedFractionMmHref(spec);
  const decimalTwin = isIndexedInchValue(inches)
    ? [link(inchSlug(inches), inchPageLabel(inches))]
    : [];

  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/inches-to-cm", "Inches to cm converter"),
        link("/fraction-inch-to-cm-chart", "Fraction inch to cm chart"),
        link("/fraction-converters", "Fraction converters"),
      ],
    },
    {
      title: "Related exact conversions",
      links: [
        ...decimalTwin,
        ...(mmHref ? [link(mmHref, `${fractionLabel(spec)} inch to mm`)] : []),
        link("/1-inch-in-cm", "1 inch in cm"),
      ],
    },
    {
      title: "Nearby published fractions",
      links: nearby,
    },
  ]);
}

export function getRelatedLinksForPage(
  page:
    | { type: "height"; feet: number; inches: number }
    | { type: "inch"; value: number }
    | { type: "cm"; value: number }
    | { type: "screen"; value?: number }
    | { type: "guide"; slug: string },
) {
  if (page.type === "height") return getHeightRelatedLinks(page.feet, page.inches);
  if (page.type === "inch") return getInchRelatedLinks(page.value);
  if (page.type === "cm") return getCmRelatedLinks(page.value);
  if (page.type === "screen") return getScreenRelatedLinks(page.value);
  return getGuideRelatedLinks(page.slug);
}

export function getGuideRelatedLinks(slug: string): LinkSection[] {
  const expansionLinks = expansionRelatedLinks(slug);
  if (expansionLinks) return expansionLinks;

  const fractionTools = [
    link("/decimal-inches-to-fractions", "Decimal inches to fractions"),
    link("/fractions-to-decimal-inches", "Fractions to decimal inches"),
    link("/tape-measure-fractions-guide", "Tape measure fractions"),
  ];
  const screenTools = [
    link("/screen-dimensions-calculator", "Screen dimensions calculator"),
    link("/screen-aspect-ratio-calculator", "Screen aspect ratio calculator"),
    link("/ppi-calculator", "PPI calculator"),
    link("/laptop-screen-size-in-cm", "Laptop screen size in cm"),
    link("/tv-size-in-cm", "TV size in cm"),
  ];
  const guideHubs = [
    link("/length-converters", "Length converters"),
    link("/fraction-converters", "Fraction converters"),
    link("/height-tools", "Height tools"),
    link("/screen-tools", "Screen tools"),
    link("/measurement-guides", "Measurement guides"),
  ];
  const unitPairSlugs = new Set([
    "feet-to-inches", "inches-to-feet", "meters-to-feet", "feet-to-meters",
    "yards-to-meters", "meters-to-yards", "miles-to-km", "km-to-miles",
    "meters-to-cm", "cm-to-meters", "mm-to-cm", "cm-to-mm",
  ]);

  if (slug === "length-converters") {
    return uniqueSections([
      { title: "Main tools", links: [link("/", "Inch is CM home"), link("/inches-to-cm", "Inches to cm hub"), link("/cm-to-inches", "CM to inches")] },
      ...lengthUnitConverterSections(),
      { title: "Related hubs", links: [link("/fraction-converters", "Fraction converters"), link("/height-tools", "Height tools"), link("/screen-tools", "Screen tools"), link("/site-map", "Full HTML site map")] },
    ]);
  }
  if (slug === "fraction-converters") {
    return uniqueSections([
      { title: "Published fraction pages", links: fractionConverterLinks() },
      { title: "Related converters", links: [link("/inches-to-cm", "Inches to cm"), link("/inches-to-mm", "Inches to mm"), link("/fraction-inch-to-cm-chart", "Fraction inch to cm chart"), link("/length-converters", "Length converters")] },
    ]);
  }
  if (slug === "height-tools") {
    return uniqueSections([
      { title: "Height tools", links: [link("/height-converter", "Height converter"), link("/height-chart", "Height chart"), link("/cm-to-feet-and-inches", "CM to feet and inches"), link("/feet-to-cm", "Feet to cm")] },
      { title: "Popular height conversions", links: [link("/5-5-in-cm", "5'5\" in cm"), link("/5-7-in-cm", "5'7\" in cm"), link("/5-10-in-cm", "5'10\" in cm"), link("/6-feet-in-cm", "6 feet in cm"), link("/6-2-in-cm", "6'2\" in cm")] },
      { title: "Related unit converters", links: [link("/feet-to-inches", "Feet to inches"), link("/inches-to-feet", "Inches to feet"), link("/cm-to-meters", "CM to meters"), link("/site-map", "Full HTML site map")] },
    ]);
  }
  if (slug === "screen-tools") {
    return uniqueSections([
      { title: "Published screen calculators", links: screenToolLinks().filter((item) => item.href !== "/screen-tools") },
      { title: "Related tools", links: [link("/inch-to-cm-chart", "Inch to cm chart"), link("/length-converters", "Length converters")] },
    ]);
  }
  if (slug === "measurement-guides") {
    return uniqueSections([
      { title: "Guide hubs", links: guideHubs.filter((item) => item.href !== "/measurement-guides") },
      { title: "Published measurement guides", links: measurementGuideLinks() },
      { title: "Practical guides", links: [link("/how-to-measure-inches-without-a-ruler", "Measure inches without a ruler"), link("/tape-measure-fractions-guide", "Tape measure fractions"), link("/metric-vs-imperial-units", "Metric vs imperial units")] },
    ]);
  }
  if (unitPairSlugs.has(slug)) {
    return uniqueSections([
      { title: "Parent hub", links: [link("/length-converters", "Length converters")] },
      { title: "Related unit converters", links: [link("/feet-to-inches", "Feet to inches"), link("/inches-to-feet", "Inches to feet"), link("/meters-to-feet", "Meters to feet"), link("/feet-to-meters", "Feet to meters"), link("/miles-to-km", "Miles to km"), link("/km-to-miles", "KM to miles")].filter((item) => !item.href.includes(slug)) },
      { title: "Core tools", links: [link("/inches-to-cm", "Inches to cm"), link("/cm-to-inches", "CM to inches"), link("/metric-vs-imperial-units", "Metric vs imperial units")] },
    ]);
  }
  if (["decimal-inches-to-fractions", "fractions-to-decimal-inches", "tape-measure-fractions-guide"].includes(slug)) {
    return uniqueSections([
      { title: "Parent hub", links: [link("/fraction-converters", "Fraction converters")] },
      { title: "Related fraction pages", links: fractionTools.filter((item) => !item.href.includes(slug)) },
      { title: "Core tools", links: [link("/inches-to-cm", "Inches to cm"), link("/inches-to-mm", "Inches to mm"), link("/length-converters", "Length converters")] },
    ]);
  }
  if (["ppi-calculator", "screen-aspect-ratio-calculator", "screen-dimensions-calculator"].includes(slug)) {
    return uniqueSections([
      { title: "Parent hub", links: [link("/screen-tools", "Screen tools")] },
      { title: "Related screen tools", links: screenTools.filter((item) => !item.href.includes(slug)) },
      { title: "Core tools", links: [link("/screen-size-converter", "Screen size converter"), link("/screen-size-vs-width-height", "Screen size vs width and height"), link("/length-converters", "Length converters")] },
    ]);
  }
  if (slug === "height-conversion-guide") {
    return uniqueSections([
      { title: "Main tools", links: [link("/height-converter", "Height converter"), link("/height-chart", "Height chart"), link("/inches-to-cm", "Inches to cm converter")] },
      { title: "Popular height conversions", links: [link("/5-8-in-cm", "5'8\" in cm"), link("/6-feet-in-cm", "6 feet in cm"), link("/6-2-in-cm", "6'2\" in cm")] },
    ]);
  }
  if (slug === "screen-size-vs-width-height") {
    return getScreenRelatedLinks(15.6);
  }
  if (slug.startsWith("how-big-is-")) {
    const value = Number(slug.replace("how-big-is-", "").replace("-inches", ""));
    const siblingGuides = [10, 12, 15, 24]
      .filter((sibling) => sibling !== value)
      .map((sibling) => link(`/how-big-is-${sibling}-inches`, `How big is ${sibling} inches?`));
    return uniqueSections([
      { title: "Main tools", links: [link("/inches-to-cm", "Inches to cm converter"), link("/inch-to-cm-chart", "Inch to cm chart"), link("/screen-size-converter", "Screen size converter")] },
      { title: "Related exact conversions", links: Number.isFinite(value) && isIndexedInchValue(value) ? [link(inchSlug(value), `${value} inches in cm`)] : [] },
      { title: "Helpful guides", links: [link("/how-to-measure-inches-without-a-ruler", "Measure inches without a ruler"), link("/common-product-dimensions-in-cm", "Product dimensions in cm"), ...siblingGuides] },
    ]);
  }
  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/inches-to-cm", "Inches to cm converter"),
        link("/cm-to-inches", "CM to inches converter"),
        link("/inch-to-cm-chart", "Inch to cm chart"),
      ],
    },
    {
      title: "Related exact conversions",
      links: [
        link("/10-inches-in-cm", "10 inches in cm"),
        link("/12-inches-in-cm", "12 inches in cm"),
        link("/25-4-cm-in-inches", "25.4 cm in inches"),
      ],
    },
    {
      title: "Helpful guides",
      links: [
        link("/inch-vs-cm", "Inch vs cm"),
        link("/metric-vs-imperial-units", "Metric vs imperial units"),
        link("/why-is-one-inch-2-54-cm", "Why one inch equals 2.54 cm"),
        link("/conversion-methodology", "Conversion methodology"),
      ],
    },
  ]);
}
