import { formatNumber, heightSlug, heightToCm, inchesToCm } from "./conversions";
import { heightFeetInchesMark, heightFullLabel, heightShortLabel } from "./height-seo";
import { isPublishedHeight, nearbyPublishedHeights } from "./url-clusters";

/** Nearby chart spans ±5 inches (within the requested ±3 to ±6 window). */
export const HEIGHT_NEARBY_RADIUS = 5;

export type HeightFormulaStep = {
  label: string;
  expression: string;
};

export type HeightNearbyRow = {
  feet: number;
  inches: number;
  totalInches: number;
  href: string | null;
  label: string;
  cmText: string;
  isCurrent: boolean;
};

export type HeightFaqItem = {
  question: string;
  answer: string;
};

const HEIGHT_LANDMARKS = [
  { feet: 5, inches: 0 },
  { feet: 5, inches: 6 },
  { feet: 6, inches: 0 },
] as const;

function landmarkLabel(feet: number, inches: number) {
  return `${feet}'${inches}"`;
}

function heightBandLabel(totalInches: number) {
  if (totalInches < 60) return `under 5'0"`;
  if (totalInches <= 72) return `5'0" to 6'0"`;
  return `over 6'0"`;
}

function pickLandmark(feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  const others = HEIGHT_LANDMARKS.filter((item) => item.feet !== feet || item.inches !== inches);
  if (totalInches < 60) {
    return others.find((item) => item.feet === 5 && item.inches === 0) ?? others[0];
  }
  if (totalInches > 72) {
    return others.find((item) => item.feet === 6 && item.inches === 0) ?? others[0];
  }
  return others.reduce((best, item) => {
    const delta = Math.abs(item.feet * 12 + item.inches - totalInches);
    const bestDelta = Math.abs(best.feet * 12 + best.inches - totalInches);
    return delta < bestDelta ? item : best;
  });
}

export function getHeightFormula(feet: number, inches: number) {
  const feetToInches = feet * 12;
  const totalInches = feetToInches + inches;
  const resultText = formatNumber(heightToCm(feet, inches));
  const steps: HeightFormulaStep[] = [
    { label: "Convert feet to inches", expression: `${feet} × 12 = ${feetToInches}` },
    { label: "Add remaining inches", expression: `${feetToInches} + ${inches} = ${totalInches}` },
    { label: "Multiply by 2.54", expression: `${totalInches} × 2.54 = ${resultText} cm` },
  ];
  return {
    compact: `(${feet} × 12 + ${inches}) × 2.54 = ${totalInches} × 2.54 = ${resultText} cm`,
    steps,
    feetToInches,
    totalInches,
    resultText,
  };
}

export function getHeightNearbyRows(
  feet: number,
  inches: number,
  radius = HEIGHT_NEARBY_RADIUS,
): HeightNearbyRow[] {
  const current = { feet, inches };
  return [current, ...nearbyPublishedHeights(feet, inches, radius)]
    .sort((left, right) => (left.feet * 12 + left.inches) - (right.feet * 12 + right.inches))
    .map((height) => {
      const totalInches = height.feet * 12 + height.inches;
      const isCurrent = height.feet === feet && height.inches === inches;
      const published = isPublishedHeight(height.feet, height.inches);
      return {
        feet: height.feet,
        inches: height.inches,
        totalInches,
        href: !isCurrent && published ? heightSlug(height.feet, height.inches) : null,
        label: height.inches === 0 ? `${height.feet} feet` : `${height.feet}'${height.inches}"`,
        cmText: formatNumber(inchesToCm(totalInches)),
        isCurrent,
      };
    });
}

export function getHeightRelativeContext(feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  const cmText = formatNumber(heightToCm(feet, inches));
  const landmark = pickLandmark(feet, inches);
  const deltaInches = totalInches - (landmark.feet * 12 + landmark.inches);
  const absInches = Math.abs(deltaInches);
  const deltaCm = formatNumber(inchesToCm(absInches));
  const mark = landmarkLabel(landmark.feet, landmark.inches);
  const markCm = formatNumber(heightToCm(landmark.feet, landmark.inches));
  const band = heightBandLabel(totalInches);
  const inchWord = absInches === 1 ? "inch" : "inches";
  if (deltaInches === 0) {
    return `${cmText} cm is exactly ${mark}. This height sits in the ${band} range.`;
  }
  const relation = deltaInches > 0 ? "taller than" : "shorter than";
  return `${cmText} cm is ${deltaCm} cm (${absInches} ${inchWord}) ${relation} ${mark} (${markCm} cm). This height sits in the ${band} range.`;
}

export function getHeightFaq(feet: number, inches: number): HeightFaqItem[] {
  const label = heightShortLabel(feet, inches);
  const fullLabel = heightFullLabel(feet, inches);
  const formula = getHeightFormula(feet, inches);
  const meterText = formatNumber(heightToCm(feet, inches) / 100);
  return [
    {
      question: `How tall is ${label} in cm?`,
      answer: `${fullLabel} is exactly ${formula.resultText} centimeters.`,
    },
    {
      question: `How is ${label} converted to centimeters?`,
      answer: `Convert feet to inches (${formula.steps[0].expression}), add ${inches} to get ${formula.totalInches} total inches, then multiply by 2.54: ${formula.steps[2].expression}.`,
    },
    {
      question: `What is ${label} in total inches?`,
      answer: `${fullLabel} is ${formula.totalInches} total inches, or ${meterText} meters.`,
    },
  ];
}

export function getHeightPageModules(feet: number, inches: number) {
  const result = heightToCm(feet, inches);
  const resultText = formatNumber(result);
  const ftInText = heightFeetInchesMark(feet, inches);
  const formula = getHeightFormula(feet, inches);
  return {
    totalInches: feet * 12 + inches,
    result,
    resultText,
    meterText: formatNumber(result / 100),
    ftInText,
    ftInSpelled: `${feet} ft ${inches} in`,
    equalityText: `${ftInText} = ${resultText} cm`,
    formula,
    nearby: getHeightNearbyRows(feet, inches),
    context: getHeightRelativeContext(feet, inches),
    faq: getHeightFaq(feet, inches),
  };
}
