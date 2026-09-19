import { formatNumber, heights, heightSlug, heightToCm } from "./conversions";
import { heightShortLabel } from "./height-seo";

/**
 * Curated GSC-priority height pages, ordered by aggregated impressions.
 * Keep this as a featured hub set (~20). Do not dump the full 61-height inventory
 * into converter/home above-the-fold modules.
 *
 * Impression counts from the owner GSC export (all listed pages already exist):
 * 6'11 (4865), 4'7 (1205), 5'5 (1022), 6'8 (829), 6'1 (745), 6'5 (715),
 * 4'10 (705), 6'3 (691), 6'6 (605), 6'4 (561), 6'10 (528), 6'7 (432),
 * 4'8 (293), 4'11 (202), 4'5 (181), 5'3 (180), then the next live-gap
 * heights called out from the same cluster. 5'7 stays as the existing
 * hub/recovery height so the curated set stays at ~20.
 */
export const GSC_PRIORITY_HEIGHTS = [
  [6, 11],
  [4, 7],
  [5, 5],
  [6, 8],
  [6, 1],
  [6, 5],
  [4, 10],
  [6, 3],
  [6, 6],
  [6, 4],
  [6, 10],
  [6, 7],
  [4, 8],
  [4, 11],
  [4, 5],
  [5, 3],
  [4, 2],
  [5, 4],
  [4, 9],
  [5, 7],
] as const;

export type HeightPair = readonly [feet: number, inches: number];

function isPublishedHeightPair(feet: number, inches: number) {
  return heights.some((height) => height.feet === feet && height.inches === inches);
}

export function heightPriorityLabel(feet: number, inches: number) {
  return `${heightShortLabel(feet, inches)} → cm`;
}

export function gscPriorityHeightEntries() {
  return GSC_PRIORITY_HEIGHTS.filter(([feet, inches]) => isPublishedHeightPair(feet, inches)).map(([feet, inches]) => {
    const cm = heightToCm(feet, inches);
    return {
      feet,
      inches,
      href: heightSlug(feet, inches),
      label: heightPriorityLabel(feet, inches),
      totalInches: feet * 12 + inches,
      cm,
      cmText: formatNumber(cm),
    };
  });
}

export function gscPriorityHeightHrefs() {
  return gscPriorityHeightEntries().map((entry) => entry.href);
}

export function gscPriorityHeightLinks() {
  return gscPriorityHeightEntries().map(({ href, label }) => ({ href, label }));
}
