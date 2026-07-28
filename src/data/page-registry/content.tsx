import Link from "next/link";
import {
  cmToInches,
  formatNumber,
  heightToCm,
  inchesToCm,
} from "@/lib/conversions";
import contentProfiles from "./content-profiles.json";

type FaqItem = { question: string; answer: string };
type ExampleItem = { key: string; text: string };
type MeasurementProfile = {
  intent: string;
  examples: string[];
  tips: string[];
};

function inchProfile(value: number): MeasurementProfile {
  if (value < 3) return contentProfiles.inch.underThree;
  if (value <= 6) return contentProfiles.inch.threeToSix;
  if (value <= 12) return contentProfiles.inch.sevenToTwelve;
  if (value <= 24) return contentProfiles.inch.thirteenToTwentyFour;
  if (value <= 60) return contentProfiles.inch.twentyFiveToSixty;
  return contentProfiles.inch.overSixty;
}

function cmProfile(value: number): MeasurementProfile {
  if (value < 5) return contentProfiles.cm.underFive;
  if (value <= 15) return contentProfiles.cm.fiveToFifteen;
  if (value <= 30) return contentProfiles.cm.fifteenToThirty;
  if (value <= 100) return contentProfiles.cm.thirtyToOneHundred;
  return contentProfiles.cm.overOneHundred;
}

function heightProfile(totalInches: number): MeasurementProfile {
  if (totalInches < 60) return contentProfiles.height.underFiveFeet;
  if (totalInches <= 72) return contentProfiles.height.fiveToSixFeet;
  return contentProfiles.height.overSixFeet;
}

function nearestSixteenth(value: number) {
  const rounded = Math.round(value * 16) / 16;
  const whole = Math.floor(rounded);
  const numerator = Math.round((rounded - whole) * 16);
  if (numerator === 0) return `${whole} in`;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(numerator, 16);
  return `${whole ? `${whole} ` : ""}${numerator / divisor}/${16 / divisor} in`;
}

function heightLabels(feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  const label = inches === 0 ? `${feet} feet` : `${feet}'${inches}"`;
  const fullLabel = inches === 0 ? `${feet} feet` : `${feet} feet ${inches} inches`;
  return { totalInches, label, fullLabel };
}

export function heightRangeContext(totalInches: number) {
  return heightProfile(totalInches).intent;
}

export function getInchPageData(value: number) {
  const cm = inchesToCm(value);
  const valueText = formatNumber(value);
  const cmText = formatNumber(cm);
  const mmText = formatNumber(cm * 10);
  const singular = value === 1;
  const unit = singular ? "Inch" : "Inches";
  const profile = inchProfile(value);
  const examples = profile.examples.map((example, index) => ({
    key: `${valueText}-inch-example-${index}`,
    text: `${valueText} ${singular ? "inch" : "inches"} can describe ${example}; in metric terms, that is ${cmText} cm or ${mmText} millimeters.`,
  }));
  const title = `${valueText} ${unit} in CM: ${cmText} cm | Inch Converter`;
  return {
    title,
    description: `${valueText} ${singular ? "inch equals" : "inches equals"} exactly ${cmText} centimeters. View the formula, millimeter value, nearby conversions, and convert other measurements.`,
    h1: `${valueText} ${unit} in CM`,
    directAnswer: `${valueText} ${singular ? "inch is" : "inches is"} exactly ${cmText} centimeters.`,
    useCase: profile.intent,
    formula: `${valueText} × 2.54 = ${cmText} cm`,
    breadcrumbLabel: `${valueText} ${singular ? "inch" : "inches"} in cm`,
    examples,
    tips: [
      ...profile.tips,
      `${valueText} ${singular ? "inch" : "inches"} is ${mmText} millimeters.`,
      "For screen sizes, convert the diagonal first, then use aspect ratio to estimate width and height.",
    ],
    faq: [
      { question: `How many cm is ${valueText} ${singular ? "inch" : "inches"}?`, answer: `${valueText} ${singular ? "inch is" : "inches is"} exactly ${cmText} cm.` },
      { question: `What is ${valueText} ${singular ? "inch" : "inches"} in millimeters?`, answer: `${valueText} ${singular ? "inch" : "inches"} is ${mmText} millimeters because 1 inch equals 25.4 mm.` },
      { question: `Can I round ${cmText} cm?`, answer: "For everyday use you can round, but keep the exact value for specifications, forms, and product dimensions." },
    ] satisfies FaqItem[],
    keywords: [`${valueText} inches in cm`, `${valueText} inch to cm`, `${valueText} inches to centimeters`],
  };
}

export function getCmPageData(value: number) {
  const inches = cmToInches(value);
  const valueText = formatNumber(value);
  const inchText = formatNumber(inches);
  const profile = cmProfile(value);
  const examples: ExampleItem[] = profile.examples.map((example, index) => ({
    key: `${valueText}-cm-example-${index}`,
    text: `${valueText} cm can describe ${example}; converted to inches, it is about ${inchText} inches.`,
  }));
  return {
    title: `${valueText} CM in Inches: ${inchText} in | CM Converter`,
    description: `${valueText} cm equals ${inchText} inches. Convert centimeters to inches with the formula, rounded result, nearby values, and fractional inch guidance.`,
    h1: `${valueText} CM in Inches`,
    directAnswer: `${valueText} centimeters is approximately ${inchText} inches.`,
    useCase: profile.intent,
    formula: `${valueText} ÷ 2.54 = ${inchText} inches`,
    breadcrumbLabel: `${valueText} cm in inches`,
    examples,
    tips: [
      ...profile.tips,
      `Nearest 1/16 inch: about ${nearestSixteenth(inches)}.`,
      "Use decimal inches for product listings and fractional inches for tape-measure work.",
    ],
    faq: [
      { question: `How many inches is ${valueText} cm?`, answer: `${valueText} cm is approximately ${inchText} inches.` },
      { question: `What is ${valueText} cm as a fraction of an inch?`, answer: `Rounded to the nearest 1/16 inch, ${valueText} cm is about ${nearestSixteenth(inches)}.` },
      { question: `Why divide ${valueText} by 2.54?`, answer: "One inch equals exactly 2.54 centimeters, so centimeters are converted to inches by dividing by 2.54." },
    ] satisfies FaqItem[],
    keywords: [`${valueText} cm in inches`, `${valueText} cm to inches`, `${valueText} centimeters to inches`],
  };
}

export function getHeightPageData(feet: number, inches: number) {
  const { totalInches, label, fullLabel } = heightLabels(feet, inches);
  const result = heightToCm(feet, inches);
  const resultText = formatNumber(result);
  const decimalFeetText = formatNumber(feet + inches / 12, 2);
  const profile = heightProfile(totalInches);
  const examples: ExampleItem[] = profile.examples.map((example, index) => ({
    key: `${feet}-${inches}-height-example-${index}`,
    text: `${fullLabel} can appear in ${example}; metric forms would usually record it as ${resultText} cm.`,
  }));
  return {
    title: `${fullLabel} in cm: ${resultText} cm | Height Conversion`,
    description: `${fullLabel} equals ${resultText} centimeters. See the exact calculation, total inches, meters, nearby heights, and use the height converter.`,
    h1: `${label} in CM`,
    directAnswer: `${fullLabel} is ${resultText} centimeters.`,
    useCase: profile.intent,
    formula: `${totalInches} total inches × 2.54 = ${resultText} cm`,
    breadcrumbLabel: `${label} in cm`,
    examples,
    tips: [
      ...profile.tips,
      `${fullLabel} is ${totalInches} total inches and ${decimalFeetText} decimal feet.`,
      "For official height entries, follow the form's rounding instruction if it differs from the exact value.",
    ],
    faq: [
      { question: `How many cm is ${fullLabel}?`, answer: `${fullLabel} is ${resultText} centimeters.` },
      { question: `How many inches is ${label}?`, answer: `${fullLabel} is ${totalInches} total inches.` },
      { question: `What is ${label} in total inches?`, answer: `${label} equals ${totalInches} total inches before converting to centimeters.` },
    ] satisfies FaqItem[],
    keywords: [`${label} in cm`, `${fullLabel} to cm`, `${label} height in centimeters`],
  };
}

export const guides = {
  "how-to-convert-inches-to-cm": {
    title: "How to Convert Inches to CM",
    description: "Convert inches to centimeters with the exact formula, worked examples, and practical rounding advice.",
    initialValue: 10,
    sections: [
      { heading: "Use the exact inch-to-centimeter formula", body: <p>To convert inches to centimeters, multiply the inch value by 2.54. The factor is exact, so the only rounding happens when you choose how many decimals to display.</p> },
      { heading: "Example calculation", body: <p>For 10 inches, calculate 10 × 2.54 = 25.4 cm. For product dimensions, repeat the same calculation for length, width, and height.</p> },
    ],
  },
  "inch-vs-cm": {
    title: "Inch vs CM",
    description: "Compare inches and centimeters, see the exact relationship, and learn when each unit is commonly used.",
    initialValue: 1,
    sections: [
      { heading: "The exact difference", body: <p>An inch is an imperial length unit, while a centimeter is a metric unit. One inch equals exactly 2.54 centimeters.</p> },
      { heading: "When each unit is useful", body: <p>Inches are common in US product sizes and screen diagonals. Centimeters are common in metric forms, international dimensions, and height records.</p> },
    ],
  },
  "why-is-one-inch-2-54-cm": {
    title: "Why Is One Inch 2.54 CM?",
    description: "Learn why 1 inch equals exactly 2.54 centimeters and how that definition affects conversion accuracy.",
    initialValue: 1,
    sections: [
      { heading: "The modern definition", body: <p>The inch is defined by its metric relationship: 1 inch equals exactly 2.54 centimeters. This makes inch-to-centimeter conversion stable and repeatable.</p> },
      { heading: "Why it matters", body: <p>Because the factor is exact, calculator differences usually come from rounding display, not from the conversion factor itself.</p> },
    ],
  },
  "how-to-measure-inches-without-a-ruler": {
    title: "How to Measure Inches Without a Ruler",
    description: "Practical ways to estimate inches using common objects, then convert the result to centimeters.",
    initialValue: 6,
    sections: [
      { heading: "Use common objects carefully", body: <p>A phone, card, notebook, or sheet of paper can help you estimate size when precision is not critical. Check the object&apos;s real dimensions before relying on it.</p> },
      { heading: "Convert the estimate", body: <p>After estimating inches, multiply by 2.54 to get centimeters. Use the converter for a quick check before ordering, cutting, or comparing dimensions.</p> },
    ],
  },
  "how-big-is-10-inches": {
    title: "How Big Is 10 Inches?",
    description: "See what 10 inches looks like in centimeters, millimeters, and real-world object comparisons.",
    initialValue: 10,
    sections: [
      { heading: "Direct size answer", body: <p>Ten inches equals 25.4 centimeters, or 254 millimeters. It is a little shorter than the long side of US letter paper.</p> },
      { heading: "Useful comparisons", body: <p>Ten inches can be close to a large tablet diagonal, a compact notebook side, or a medium product dimension. Always check whether the measurement is length, width, or diagonal.</p> },
    ],
  },
  "how-big-is-12-inches": {
    title: "How Big Is 12 Inches?",
    description: "Understand 12 inches as 1 foot, 30.48 centimeters, and familiar real-world comparisons.",
    initialValue: 12,
    sections: [
      { heading: "Direct size answer", body: <p>Twelve inches equals exactly 1 foot and 30.48 centimeters. It is the length of a standard ruler.</p> },
      { heading: "Real-world uses", body: <p>Use this size for rulers, shelves, bags, packaging, and product dimensions where a one-foot reference is easier to visualize.</p> },
    ],
  },
  "how-big-is-15-inches": {
    title: "How Big Is 15 Inches?",
    description: "See 15 inches in centimeters and compare it with laptops, bags, packaging, and household items.",
    initialValue: 15,
    sections: [
      { heading: "Direct size answer", body: <p>Fifteen inches equals 38.1 centimeters. It is commonly used around laptop diagonals and medium product dimensions.</p> },
      { heading: "Important context", body: <p>For screens, 15 inches usually means diagonal size. For bags or boxes, check whether the listing means length, width, depth, or height.</p> },
    ],
  },
  "common-product-dimensions-in-cm": {
    title: "Common Product Dimensions in CM and Inches",
    description: "Convert product dimensions between centimeters and inches for listings, packaging, and fit checks.",
    initialValue: 20,
    sections: [
      { heading: "Read dimension order carefully", body: <p>Product dimensions may be listed as length × width × height, but some sellers use width × depth × height. Confirm labels before converting.</p> },
      { heading: "Convert each side separately", body: <p>For a 10 × 20 × 30 cm product, convert each number to inches rather than converting the total. This keeps fit checks accurate.</p> },
    ],
  },
  "screen-size-vs-width-height": {
    title: "Screen Size vs Width and Height",
    description: "Learn why a screen's advertised diagonal does not directly tell you its width and height.",
    initialValue: 15.6,
    sections: [
      { heading: "Aspect ratio changes the dimensions", body: <p>Screen size is measured diagonally. Two screens with the same diagonal can have different widths and heights if their aspect ratios differ.</p> },
      { heading: "Use the right tool", body: <p>Use the <Link href="/screen-size-converter">screen size converter</Link> when you need estimated width and height, not just diagonal centimeters.</p> },
    ],
  },
  "height-conversion-guide": {
    title: "Height Conversion Guide",
    description: "Convert feet and inches to centimeters with a clear formula, examples, and a height chart.",
    initialValue: 68,
    sections: [
      { heading: "Feet and inches formula", body: <p>Convert feet to inches, add the remaining inches, then multiply total inches by 2.54. For example, 5&apos;8&quot; is 68 total inches, so 68 × 2.54 = 172.72 cm.</p> },
      { heading: "When to use centimeters", body: <p>Centimeters are useful for international profiles, medical or school records, travel forms, and metric height charts.</p> },
    ],
  },
} as const;

export type GuideSlug = keyof typeof guides;
export type GuideData = (typeof guides)[GuideSlug];
export function isGuideSlug(slug: string): slug is GuideSlug {
  return Object.prototype.hasOwnProperty.call(guides, slug);
}

export const guideDirectAnswers: Record<string, string> = {
  "how-to-convert-inches-to-cm": "Multiply inches by 2.54 to convert inches to centimeters.",
  "inch-vs-cm": "One inch equals exactly 2.54 centimeters, so centimeters are the smaller metric unit.",
  "why-is-one-inch-2-54-cm": "One inch is exactly 2.54 cm because the modern inch is defined by that metric relationship.",
  "how-to-measure-inches-without-a-ruler": "Use a known object as a rough reference, then multiply the estimated inches by 2.54 for centimeters.",
  "how-big-is-10-inches": "10 inches equals exactly 25.4 cm.",
  "how-big-is-12-inches": "12 inches equals exactly 30.48 cm and exactly 1 foot.",
  "how-big-is-15-inches": "15 inches equals exactly 38.1 cm.",
  "common-product-dimensions-in-cm": "Convert each product side separately so length, width, and height stay accurate.",
  "screen-size-vs-width-height": "Screen size is the diagonal measurement; width and height depend on aspect ratio.",
  "height-conversion-guide": "Convert feet to total inches, then multiply by 2.54 to get centimeters.",
};

export const guideFaqs: Record<string, FaqItem[]> = {
  "how-to-convert-inches-to-cm": [
    { question: "What is the formula for inches to cm?", answer: "Multiply inches by 2.54." },
    { question: "Is 1 inch exactly 2.54 cm?", answer: "Yes. The inch is defined as exactly 2.54 centimeters." },
  ],
  "inch-vs-cm": [
    { question: "Which is bigger, inch or cm?", answer: "An inch is bigger. One inch equals 2.54 centimeters." },
    { question: "Are inches metric?", answer: "No. Inches are imperial; centimeters are metric." },
  ],
  "why-is-one-inch-2-54-cm": [
    { question: "Is 2.54 cm per inch exact?", answer: "Yes, it is an exact definition." },
    { question: "Why do converters round results?", answer: "The factor is exact, but displayed decimals may be rounded for readability." },
  ],
  "how-to-measure-inches-without-a-ruler": [
    { question: "Can I measure inches with a phone?", answer: "You can estimate if you know the phone's dimensions, but it is not as precise as a ruler." },
    { question: "Should I use estimates for product fit?", answer: "Use estimates only for rough checks; measure precisely before buying or cutting." },
  ],
  "how-big-is-10-inches": [
    { question: "How many cm is 10 inches?", answer: "10 inches equals exactly 25.4 cm." },
    { question: "Is 10 inches close to a tablet size?", answer: "It can be close to a large tablet diagonal, depending on the model." },
  ],
  "how-big-is-12-inches": [
    { question: "How many cm is 12 inches?", answer: "12 inches equals exactly 30.48 cm." },
    { question: "Is 12 inches 1 foot?", answer: "Yes, 12 inches equals exactly 1 foot." },
  ],
  "how-big-is-15-inches": [
    { question: "How many cm is 15 inches?", answer: "15 inches equals exactly 38.1 cm." },
    { question: "Is 15 inches a screen width?", answer: "Usually no. Screen inches normally describe the diagonal." },
  ],
  "common-product-dimensions-in-cm": [
    { question: "Should I convert all product dimensions separately?", answer: "Yes. Convert length, width, and height one by one." },
    { question: "What order are product dimensions listed in?", answer: "Often length × width × height, but sellers vary, so check the labels." },
  ],
  "screen-size-vs-width-height": [
    { question: "Is screen size measured diagonally?", answer: "Yes. Screen size is normally the diagonal measurement." },
    { question: "Can two screens with the same diagonal have different dimensions?", answer: "Yes. Different aspect ratios produce different widths and heights." },
  ],
  "height-conversion-guide": [
    { question: "How do you convert feet and inches to cm?", answer: "Multiply feet by 12, add inches, then multiply total inches by 2.54." },
    { question: "What is 5'8\" in cm?", answer: "5'8\" equals exactly 172.72 cm." },
  ],
};
