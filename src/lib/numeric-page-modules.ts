import {
  allInchValues,
  centimeterValues,
  cmSlug,
  cmToInches,
  formatNumber,
  heightSlug,
  inchSlug,
  inchesToCm,
  isIndexedCmValue,
  isIndexedInchValue,
  screenInches,
} from "./conversions";
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
  feetAndInches: string | null;
  notable: string[];
  nearby: NearbyRow[];
  reverse: NumericLink | null;
  height: HeightEntry | null;
  screen: ScreenEntry | null;
  faq: NumericFaqItem[];
};

export type CmNumericModules = {
  kind: "cm";
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

export function fractionEquivalentForInches(inches: number): FractionEquivalent {
  const exact = exactDyadicInchFraction(inches);
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
      const dimensions = calculateScreenDimensions(inches, item.width, item.height);
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

function withCurrentNearby<T extends { value: number; href: string | null }>(
  neighbors: T[],
  current: T,
) {
  const before = neighbors.filter((item) => item.value < current.value);
  const after = neighbors.filter((item) => item.value > current.value);
  return [...before, current, ...after];
}

function cmHeightEntry(value: number, inches: number): HeightEntry | null {
  const rounded = Math.round(inches);
  const exact = Math.abs(inches - rounded) < 0.05 ? heightEntryFromTotalInches(rounded) : null;
  if (exact) return exact;
  if (value >= 140 && value <= 210) return heightEntryFromTotalInches(rounded);
  return null;
}

function uniqueFaq(items: NumericFaqItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.question)) return false;
    seen.add(item.question);
    return true;
  });
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
  const faq: NumericFaqItem[] = [];

  if (Number.isInteger(value) && value >= 12 && value % 12 === 0) {
    const feet = value / 12;
    faq.push({
      question: `Is ${valueText} inches exactly ${feet} ${feet === 1 ? "foot" : "feet"}?`,
      answer: `Yes. ${valueText} inches is exactly ${feet} ${feet === 1 ? "foot" : "feet"} because 12 inches equals 1 foot.`,
    });
  }
  if (value === 36) {
    faq.push({
      question: "Is 36 inches exactly 1 yard?",
      answer: "Yes. 36 inches is exactly 1 yard and also exactly 3 feet.",
    });
  }
  if (screen) {
    faq.push({
      question: `Is ${valueText} inches a screen width?`,
      answer: `No. Advertised ${valueText}-inch displays use the diagonal. Width and height depend on aspect ratio.`,
    });
  }
  if (height && !screen) {
    faq.push({
      question: `Is ${valueText} inches a height?`,
      answer: `Yes. ${valueText} inches is ${height.label.replace(" in cm", "")}, which converts to ${cmText} cm.`,
    });
  }

  return {
    kind: "inch",
    value,
    valueText,
    unitLabel,
    cmText,
    mmText: formatNumber(cm * 10),
    mText: formatLength(cm / 100, 4),
    formula: `${valueText} × 2.54 = ${cmText} cm`,
    fraction: exactFraction ? { exact: true, text: exactFraction } : null,
    feetAndInches: value >= 12 ? decimalInchesToFeetAndInches(value) : null,
    notable,
    nearby: withCurrentNearby(
      nearbyPublishedWindow(allInchValues, value, 2).map((item) => ({
        value: item,
        href: isIndexedInchValue(item) ? inchSlug(item) : null,
        label: inchPageLabel(item),
        primaryText: `${formatNumber(inchesToCm(item))} cm`,
        secondaryText: `${formatNumber(inchesToCm(item) * 10)} mm`,
      })),
      {
        value,
        href: null,
        label: `${valueText} ${unitLabel}`,
        primaryText: `${cmText} cm`,
        secondaryText: `${formatNumber(cm * 10)} mm`,
      },
    ),
    reverse,
    height,
    screen,
    faq: uniqueFaq(faq),
  };
}

export function getCmNumericModules(value: number): CmNumericModules {
  const inches = cmToInches(value);
  const valueText = formatNumber(value);
  const inchText = formatNumber(inches);
  const reverse = isIndexedInchValue(inches)
    ? { href: inchSlug(inches), label: inchPageLabel(inches) }
    : null;
  const height = cmHeightEntry(value, inches);
  const screen = screenEntryFromInches(matchingScreenInches(inches));
  const profile = getCmConversionProfile(value);
  const notable = profile.notableRelationships.filter((item) => !item.includes("nearest 1/16"));
  const fraction = fractionEquivalentForInches(inches);
  const faq: NumericFaqItem[] = [];

  if (reverse && Number.isInteger(inches)) {
    const inchUnit = inches === 1 ? "inch" : "inches";
    faq.push({
      question: `Is ${valueText} cm exactly ${inchText} ${inchUnit}?`,
      answer: `Yes. ${valueText} cm is exactly ${inchText} ${inchUnit} because 1 inch equals 2.54 cm.`,
    });
  }
  if (value === 100 || value % 100 === 0) {
    faq.push({
      question: `Is ${valueText} cm a whole-meter value?`,
      answer: `Yes. ${valueText} cm is exactly ${formatNumber(value / 100)} meter${value === 100 ? "" : "s"}.`,
    });
  }
  if (screen) {
    faq.push({
      question: `Is ${valueText} cm a screen diagonal?`,
      answer: `${valueText} cm is ${inchText} inches, a common advertised display diagonal. Width and height still depend on aspect ratio.`,
    });
  }
  if (height && !screen) {
    faq.push({
      question: `Is ${valueText} cm a height?`,
      answer: `${valueText} cm is about ${decimalInchesToFeetAndInches(inches)}, often used as a metric height entry.`,
    });
  }

  return {
    kind: "cm",
    value,
    valueText,
    inchText,
    mmText: formatNumber(value * 10),
    mText: formatLength(value / 100, 4),
    formula: `${valueText} ÷ 2.54 = ${inchText} inches`,
    fraction,
    notable,
    nearby: withCurrentNearby(
      nearbyPublishedWindow(centimeterValues, value, 2).map((item) => {
        const inchValue = cmToInches(item);
        return {
          value: item,
          href: isIndexedCmValue(item) ? cmSlug(item) : null,
          label: cmPageLabel(item),
          primaryText: `${formatNumber(inchValue)} in`,
          secondaryText: fractionEquivalentForInches(inchValue).text,
        };
      }),
      {
        value,
        href: null,
        label: `${valueText} cm`,
        primaryText: `${inchText} in`,
        secondaryText: fraction.text,
      },
    ),
    reverse,
    height,
    screen,
    faq: uniqueFaq(faq),
  };
}

function matchingScreenInches(inches: number) {
  return screenInches.find((item) => Math.abs(item - inches) < 0.05) ?? inches;
}
