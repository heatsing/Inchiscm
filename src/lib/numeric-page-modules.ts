import {
  allInchValues,
  centimeterValues,
  cmSlug,
  cmToInches,
  formatNumber,
  heightSlug,
  inchSlug,
  inchesToCm,
  integerInches,
  isIndexedCmValue,
  isIndexedInchValue,
  isRoundedCmToInches,
  screenInches,
  wholeCentimeterValues,
} from "./conversions";
import { cmHeightReference } from "./cm-seo";
import { getCmConversionProfile, getInchConversionProfile } from "@/data/conversion-page-profiles";
import { isCommonScreenSize } from "./internal-links";
import { decimalInchesToFeetAndInches, decimalInchesToFraction, exactDyadicInchFraction, formatLength } from "./length-units";
import { calculateScreenDimensions } from "./screen-dimensions";
import {
  cmPageLabel,
  heightPageLabel,
  inchPageLabel,
  isPublishedHeight,
  nearbyPublishedWindow,
} from "./url-clusters";

export type NumericFaqItem = { question: string; answer: string };

export type NumericLink = { href: string; label: string };

export type NearbyRow = {
  value: number;
  href: string | null;
  isCurrent: boolean;
  label: string;
  primaryText: string;
  secondaryText: string;
};

export type FractionEquivalent = {
  exact: boolean;
  text: string;
};

export type HeightEntry = {
  feet: number;
  inches: number;
  isApproximate: boolean;
  href: string;
  label: string;
};

export type ScreenRatioRow = {
  ratio: string;
  widthInches: string;
  heightInches: string;
  widthCm: string;
  heightCm: string;
};

export type ScreenEntry = {
  diagonalInches: number;
  diagonalCm: string;
  ratios: ScreenRatioRow[];
  converterHref: "/screen-size-converter";
};

export type InchNumericModules = {
  kind: "inch";
  value: number;
  valueText: string;
  unitLabel: string;
  cmText: string;
  mmText: string;
  mText: string;
  formula: string;
  fraction: FractionEquivalent | null;
  feetAndInches: string;
  notable: string[];
  nearby: NearbyRow[];
  reverse: NumericLink | null;
  height: HeightEntry | null;
  screen: ScreenEntry | null;
  faq: NumericFaqItem[];
};

export type CmNumericModules = {
  kind: "cm";
  isRounded: boolean;
  value: number;
  valueText: string;
  inchText: string;
  mmText: string;
  mText: string;
  formula: string;
  fraction: FractionEquivalent;
  notable: string[];
  nearby: NearbyRow[];
  reverse: NumericLink | null;
  height: HeightEntry | null;
  screen: ScreenEntry | null;
  faq: NumericFaqItem[];
};

function fractionEquivalentForInches(inches: number, isRounded: boolean): FractionEquivalent {
  const exact = !isRounded && (Number.isInteger(inches) ? `${inches}"` : exactDyadicInchFraction(inches));
  if (exact) return { exact: true, text: exact };
  return { exact: false, text: decimalInchesToFraction(inches) };
}

function heightEntryFromTotalInches(totalInches: number): HeightEntry | null {
  if (!Number.isInteger(totalInches) || totalInches <= 0) return null;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  if (!isPublishedHeight(feet, inches)) return null;
  return {
    feet,
    inches,
    isApproximate: false,
    href: heightSlug(feet, inches),
    label: heightPageLabel(feet, inches),
  };
}

function screenEntryFromInches(inches: number): ScreenEntry | null {
  if (!isCommonScreenSize(inches)) return null;
  const ratioDefs = inches <= 17.3
    ? [{ ratio: "16:9", width: 16, height: 9 }, { ratio: "16:10", width: 16, height: 10 }]
    : [{ ratio: "16:9", width: 16, height: 9 }];
  return {
    diagonalInches: inches,
    diagonalCm: formatNumber(inchesToCm(inches)),
    converterHref: "/screen-size-converter",
    ratios: ratioDefs.map((item) => {
      const dimensions = calculateScreenDimensions(inches, item.width, item.height)!;
      return {
        ratio: item.ratio,
        widthInches: formatNumber(dimensions.widthInches),
        heightInches: formatNumber(dimensions.heightInches),
        widthCm: formatNumber(dimensions.widthCm),
        heightCm: formatNumber(dimensions.heightCm),
      };
    }),
  };
}

function nearbyConversionValues(values: number[], wholeValues: number[], current: number) {
  if (wholeValues.includes(current)) {
    const first = Math.max(1, current - 5);
    return Array.from({ length: current + 5 - first + 1 }, (_, index) => first + index);
  }
  return [...nearbyPublishedWindow(values, current, 2), current].sort((a, b) => a - b);
}

export function getInchNumericModules(value: number): InchNumericModules {
  const cm = inchesToCm(value);
  const valueText = formatNumber(value);
  const cmText = formatNumber(cm);
  const unitLabel = value === 1 ? "inch" : "inches";
  const exactFraction = exactDyadicInchFraction(value);
  const reverse = isIndexedCmValue(cm)
    ? { href: cmSlug(cm), label: cmPageLabel(cm) }
    : null;
  const height = heightEntryFromTotalInches(value);
  const screen = screenEntryFromInches(value);
  const notable = getInchConversionProfile(value).notableRelationships;

  return {
    kind: "inch",
    value,
    valueText,
    unitLabel,
    cmText,
    mmText: formatNumber(cm * 10),
    mText: formatLength(cm / 100, 6),
    formula: `${valueText} × 2.54 = ${cmText} cm`,
    fraction: exactFraction ? { exact: true, text: exactFraction } : null,
    feetAndInches: decimalInchesToFeetAndInches(value),
    notable,
    nearby: nearbyConversionValues(allInchValues, integerInches, value).map((item) => {
      const isCurrent = item === value;
      return {
        value: item,
        href: !isCurrent && isIndexedInchValue(item) ? inchSlug(item) : null,
        isCurrent,
        label: isCurrent ? `${valueText} ${unitLabel}` : inchPageLabel(item),
        primaryText: `${formatNumber(inchesToCm(item))} cm`,
        secondaryText: `${formatNumber(inchesToCm(item) * 10)} mm`,
      };
    }),
    reverse,
    height,
    screen,
    faq: [],
  };
}

export function getCmNumericModules(value: number): CmNumericModules {
  const inches = cmToInches(value);
  const isRounded = isRoundedCmToInches(value, inches);
  const valueText = formatNumber(value);
  const inchText = formatNumber(inches);
  const reverse = !isRounded && isIndexedInchValue(inches)
    ? { href: inchSlug(inches), label: inchPageLabel(inches) }
    : null;
  const heightReference = cmHeightReference(value, inches);
  const height = heightReference ? {
    ...heightReference,
    href: heightSlug(heightReference.feet, heightReference.inches),
    label: heightPageLabel(heightReference.feet, heightReference.inches),
  } : null;
  const screen = screenEntryFromInches(matchingScreenInches(inches));
  const profile = getCmConversionProfile(value);
  const notable = profile.notableRelationships.filter((item) => !item.includes("nearest 1/16"));
  const fraction = fractionEquivalentForInches(inches, isRounded);

  return {
    kind: "cm",
    isRounded,
    value,
    valueText,
    inchText,
    mmText: formatNumber(value * 10),
    mText: formatLength(value / 100, 4),
    formula: `${valueText} ÷ 2.54 ${isRounded ? "≈" : "="} ${inchText} ${inches === 1 ? "inch" : "inches"}`,
    fraction,
    notable,
    nearby: nearbyConversionValues(centimeterValues, wholeCentimeterValues, value).map((item) => {
      const isCurrent = item === value;
      const inchValue = cmToInches(item);
      const isRoundedNeighbor = isRoundedCmToInches(item, inchValue);
      const neighborFraction = fractionEquivalentForInches(inchValue, isRoundedNeighbor);
      return {
        value: item,
        href: !isCurrent && isIndexedCmValue(item) ? cmSlug(item) : null,
        isCurrent,
        label: isCurrent ? `${valueText} cm` : cmPageLabel(item),
        primaryText: `${isRoundedNeighbor ? "≈ " : ""}${formatNumber(inchValue)} in`,
        secondaryText: `${neighborFraction.exact ? "" : "≈ "}${neighborFraction.text}`,
      };
    }),
    reverse,
    height,
    screen,
    faq: [],
  };
}

function matchingScreenInches(inches: number) {
  return screenInches.find((item) => Math.abs(item - inches) < 0.05) ?? inches;
}
