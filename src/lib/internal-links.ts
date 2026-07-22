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
  isIndexedCmValue,
  isIndexedInchValue,
  nearbyValues,
  screenInches,
} from "./conversions";
import type { RelatedLinkSection } from "@/components/RelatedLinks";

const commonScreenSizes = new Set([13.3, 14, 15.6, 17.3, 21.5, 24, 27, 32, 43, 55, 65, 75, 85]);

function link(href: string, label: string) {
  return { href, label };
}

function uniqueSections(sections: RelatedLinkSection[]): RelatedLinkSection[] {
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

export function getInchRelatedLinks(value: number): RelatedLinkSection[] {
  const result = inchesToCm(value);
  const { previous, next } = nearbyValues(allInchValues, value);
  const screenLinks = isCommonScreenSize(value)
    ? [link("/screen-size-converter", "Screen size converter"), link("/screen-size-vs-width-height", "Screen diagonal vs width and height")]
    : [];

  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/inches-to-cm", "Inches to cm converter"),
        link("/inch-to-cm-chart", "Inch to cm chart"),
        link("/cm-to-inches", "CM to inches converter"),
        ...screenLinks.slice(0, 1),
      ],
    },
    {
      title: "Related exact conversions",
      links: [
        ...(isIndexedCmValue(result) ? [link(cmSlug(result), `${formatNumber(result)} cm in inches`)] : []),
        link("/how-to-convert-inches-to-cm", "Inch to cm formula guide"),
        link("/inch-vs-cm", "Inch vs cm explained"),
        ...screenLinks.slice(1),
      ],
    },
    {
      title: "Nearby values",
      links: [
        ...(previous !== null ? [link(inchSlug(previous), `${formatNumber(previous)} inches in cm`)] : []),
        ...(next !== null ? [link(inchSlug(next), `${formatNumber(next)} inches in cm`)] : []),
      ],
    },
  ]);
}

export function getCmRelatedLinks(value: number): RelatedLinkSection[] {
  const result = cmToInches(value);
  const { previous, next } = nearbyValues(centimeterValues, value);

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
        ...(isIndexedInchValue(result) ? [link(inchSlug(result), `${formatNumber(result)} inches in cm`)] : []),
        link("/inch-vs-cm", "Inch vs cm guide"),
        link("/how-to-convert-inches-to-cm", "Inch to cm formula guide"),
      ],
    },
    {
      title: "Nearby values",
      links: [
        ...(previous !== null ? [link(cmSlug(previous), `${formatNumber(previous)} cm in inches`)] : []),
        ...(next !== null ? [link(cmSlug(next), `${formatNumber(next)} cm in inches`)] : []),
      ],
    },
  ]);
}

export function getHeightRelatedLinks(feet: number, inches: number): RelatedLinkSection[] {
  const totalInches = feet * 12 + inches;
  const result = heightToCm(feet, inches);
  const heightIndex = heights.findIndex((height) => height.feet === feet && height.inches === inches);
  const previous = heightIndex > 0 ? heights[heightIndex - 1] : null;
  const next = heightIndex >= 0 && heightIndex < heights.length - 1 ? heights[heightIndex + 1] : null;
  const sameFeetNearby = heights.filter((height) => (
    height.feet === feet
    && height.inches !== inches
    && Math.abs(height.inches - inches) <= 2
    && !(previous && height.feet === previous.feet && height.inches === previous.inches)
    && !(next && height.feet === next.feet && height.inches === next.inches)
  )).slice(0, 2);

  return uniqueSections([
    {
      title: "Main tools",
      links: [
        link("/height-converter", "Height converter"),
        link("/inches-to-cm", "Inches to cm converter"),
        link("/cm-to-inches", "CM to inches converter"),
        link("/inch-to-cm-chart", "Inch to cm chart"),
      ],
    },
    {
      title: "Related exact conversions",
      links: [
        ...(isIndexedInchValue(totalInches) ? [link(inchSlug(totalInches), `${totalInches} inches in cm`)] : []),
        ...(isIndexedCmValue(result) ? [link(cmSlug(result), `${formatNumber(result)} cm in inches`)] : []),
        link("/height-conversion-guide", "Height conversion guide"),
      ],
    },
    {
      title: "Nearby height conversions",
      links: [
        ...(previous ? [link(heightSlug(previous.feet, previous.inches), `${previous.feet}'${previous.inches}" in cm`)] : []),
        ...(next ? [link(heightSlug(next.feet, next.inches), `${next.feet}'${next.inches}" in cm`)] : []),
        ...sameFeetNearby.map((height) => link(heightSlug(height.feet, height.inches), `${height.feet}'${height.inches}" in cm`)),
        link("/height-chart", "Height chart"),
      ],
    },
  ]);
}

export function getScreenRelatedLinks(value?: number): RelatedLinkSection[] {
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
        link("/common-product-dimensions-in-cm", "Product dimensions in cm"),
      ],
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

export function getGuideRelatedLinks(slug: string): RelatedLinkSection[] {
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
    return uniqueSections([
      { title: "Main tools", links: [link("/inches-to-cm", "Inches to cm converter"), link("/inch-to-cm-chart", "Inch to cm chart"), link("/screen-size-converter", "Screen size converter")] },
      { title: "Related exact conversions", links: Number.isFinite(value) && isIndexedInchValue(value) ? [link(inchSlug(value), `${value} inches in cm`)] : [] },
      { title: "Helpful guides", links: [link("/how-to-measure-inches-without-a-ruler", "Measure inches without a ruler"), link("/common-product-dimensions-in-cm", "Product dimensions in cm")] },
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
        link("/conversion-methodology", "Conversion methodology"),
      ],
    },
  ]);
}
