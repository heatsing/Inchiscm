import Link from "next/link";
import {
  cmToInches,
  formatNumber,
  heightToCm,
  inchesToCm,
} from "@/lib/conversions";
import contentProfiles from "./content-profiles.json";
import { generatedGuideDirectAnswers, generatedGuideFaqs, generatedGuides } from "./generated-guides";

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

function inchNoun(value: number) {
  return value === 1 ? "inch" : "inches";
}

function inchVerb() {
  return "is";
}

function footNoun(value: number) {
  return value === 1 ? "foot" : "feet";
}

function heightLabels(feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  const label = inches === 0 ? `${feet} feet` : `${feet}'${inches}"`;
  const fullLabel = inches === 0 ? `${feet} feet` : `${feet} ${footNoun(feet)} ${inches} ${inchNoun(inches)}`;
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
  const unitLower = inchNoun(value);
  const profile = inchProfile(value);
  const examples = profile.examples.map((example, index) => ({
    key: `${valueText}-inch-example-${index}`,
    text: `${valueText} ${unitLower} can describe ${example}; in metric terms, that is ${cmText} cm or ${mmText} millimeters.`,
  }));
  const title = `${valueText} ${unit} in CM: ${cmText} cm | Inch Converter`;
  return {
    title,
    description: `${valueText} ${unitLower} equals exactly ${cmText} centimeters. See the inch-to-cm formula, millimeter value, nearby conversions, and size context.`,
    h1: `${valueText} ${unit} in CM`,
    directAnswer: `${valueText} ${unitLower} ${inchVerb()} exactly ${cmText} centimeters.`,
    useCase: profile.intent,
    formula: `${valueText} × 2.54 = ${cmText} cm`,
    breadcrumbLabel: `${valueText} ${singular ? "inch" : "inches"} in cm`,
    examples,
    tips: [
      ...profile.tips,
      `${valueText} ${unitLower} ${inchVerb()} ${mmText} millimeters.`,
      "For screen sizes, convert the diagonal first, then use aspect ratio to estimate width and height.",
    ],
    faq: [
      { question: `How many cm is ${valueText} ${unitLower}?`, answer: `${valueText} ${unitLower} ${inchVerb()} exactly ${cmText} cm.` },
      { question: `What is ${valueText} ${unitLower} in millimeters?`, answer: `${valueText} ${unitLower} ${inchVerb()} ${mmText} millimeters because 1 inch equals 25.4 mm.` },
      { question: `Can I round ${cmText} cm?`, answer: "For everyday use you can round, but keep the exact value for specifications, forms, and product dimensions." },
    ] satisfies FaqItem[],
    keywords: [`${valueText} inches in cm`, `${valueText} inch to cm`, `${valueText} inches to centimeters`],
  };
}

export function getCmPageData(value: number) {
  const inches = cmToInches(value);
  const valueText = formatNumber(value);
  const inchText = formatNumber(inches);
  const inchUnit = inchNoun(inches);
  const profile = cmProfile(value);
  const examples: ExampleItem[] = profile.examples.map((example, index) => ({
    key: `${valueText}-cm-example-${index}`,
    text: `${valueText} cm can describe ${example}; converted to inches, it is about ${inchText} ${inchUnit}.`,
  }));
  return {
    title: `${valueText} CM in Inches: ${inchText} in | CM Converter`,
    description: `${valueText} cm equals ${inchText} ${inchUnit}. See the cm-to-inches formula, rounded result, nearby values, and fractional inch guidance.`,
    h1: `${valueText} CM in Inches`,
    directAnswer: `${valueText} centimeters is approximately ${inchText} ${inchUnit}.`,
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
      { question: `How many inches is ${valueText} cm?`, answer: `${valueText} cm is approximately ${inchText} ${inchUnit}.` },
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
    title: `${label} in CM: ${resultText} cm | Height Converter`,
    description: `${fullLabel} equals ${resultText} centimeters. See total inches, meters, the height formula, nearby heights, and a prefilled converter.`,
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

const baseGuides = {
  "how-to-convert-inches-to-cm": {
    title: "How to Convert Inches to CM",
    description: "Learn the exact inches-to-cm formula, see worked examples, and understand when to round centimeter results.",
    initialValue: 10,
    sections: [
      { heading: "Use the exact inch-to-centimeter formula", body: <p>To convert inches to centimeters, multiply the inch value by 2.54. The factor is exact, so the only rounding happens when you choose how many decimals to display.</p> },
      { heading: "Example calculation", body: <p>For 10 inches, calculate 10 × 2.54 = 25.4 cm. For product dimensions, repeat the same calculation for length, width, and height.</p> },
    ],
  },
  "inch-vs-cm": {
    title: "Inch vs CM",
    description: "Compare inches and centimeters, learn that 1 inch equals 2.54 cm, and see when each unit is commonly used.",
    initialValue: 1,
    sections: [
      { heading: "The exact difference", body: <p>An inch is an imperial length unit, while a centimeter is a metric unit. One inch equals exactly 2.54 centimeters.</p> },
      { heading: "When each unit is useful", body: <p>Inches are common in US product sizes and screen diagonals. Centimeters are common in metric forms, international dimensions, and height records.</p> },
    ],
  },
  "why-is-one-inch-2-54-cm": {
    title: "Why Is One Inch 2.54 CM?",
    description: "Learn why 1 inch equals exactly 2.54 centimeters and why the fixed definition keeps conversions accurate.",
    initialValue: 1,
    sections: [
      { heading: "The modern definition", body: <p>The inch is defined by its metric relationship: 1 inch equals exactly 2.54 centimeters. This makes inch-to-centimeter conversion stable and repeatable.</p> },
      { heading: "Why it matters", body: <p>Because the factor is exact, calculator differences usually come from rounding display, not from the conversion factor itself.</p> },
    ],
  },
  "how-to-measure-inches-without-a-ruler": {
    title: "How to Measure Inches Without a Ruler",
    description: "Estimate inches with common objects, check the limits of rough measuring, and convert your estimate to centimeters.",
    initialValue: 6,
    sections: [
      { heading: "Use common objects carefully", body: <p>A phone, card, notebook, or sheet of paper can help you estimate size when precision is not critical. Check the object&apos;s real dimensions before relying on it.</p> },
      { heading: "Convert the estimate", body: <p>After estimating inches, multiply by 2.54 to get centimeters. Use the converter for a quick check before ordering, cutting, or comparing dimensions.</p> },
    ],
  },
  "how-big-is-10-inches": {
    title: "How Big Is 10 Inches?",
    description: "10 inches equals 25.4 cm. See millimeters, real-world object comparisons, and related size conversions.",
    initialValue: 10,
    sections: [
      { heading: "Direct size answer", body: <p>Ten inches equals 25.4 centimeters, or 254 millimeters. It is a little shorter than the long side of US letter paper.</p> },
      { heading: "Useful comparisons", body: <p>Ten inches can be close to a large tablet diagonal, a compact notebook side, or a medium product dimension. Always check whether the measurement is length, width, or diagonal.</p> },
    ],
  },
  "how-big-is-12-inches": {
    title: "How Big Is 12 Inches?",
    description: "12 inches equals 1 foot and 30.48 cm. Compare the size with rulers, shelves, packaging, and product dimensions.",
    initialValue: 12,
    sections: [
      { heading: "Direct size answer", body: <p>Twelve inches equals exactly 1 foot and 30.48 centimeters. It is the length of a standard ruler.</p> },
      { heading: "Real-world uses", body: <p>Use this size for rulers, shelves, bags, packaging, and product dimensions where a one-foot reference is easier to visualize.</p> },
    ],
  },
  "how-big-is-15-inches": {
    title: "How Big Is 15 Inches?",
    description: "15 inches equals 38.1 cm. Compare it with laptop diagonals, bags, packaging, and household dimensions.",
    initialValue: 15,
    sections: [
      { heading: "Direct size answer", body: <p>Fifteen inches equals 38.1 centimeters. It is commonly used around laptop diagonals and medium product dimensions.</p> },
      { heading: "Important context", body: <p>For screens, 15 inches usually means diagonal size. For bags or boxes, check whether the listing means length, width, depth, or height.</p> },
    ],
  },
  "common-product-dimensions-in-cm": {
    title: "Common Product Dimensions in CM and Inches",
    description: "Convert product length, width, and height between cm and inches for listings, packaging, furniture, and fit checks.",
    initialValue: 20,
    sections: [
      { heading: "Read dimension order carefully", body: <p>Product dimensions may be listed as length × width × height, but some sellers use width × depth × height. Confirm labels before converting.</p> },
      { heading: "Convert each side separately", body: <p>For a 10 × 20 × 30 cm product, convert each number to inches rather than converting the total. This keeps fit checks accurate.</p> },
    ],
  },
  "screen-size-vs-width-height": {
    title: "Screen Size vs Width and Height",
    description: "Learn why screen size is measured diagonally and how aspect ratio affects display width and height.",
    initialValue: 15.6,
    sections: [
      { heading: "Aspect ratio changes the dimensions", body: <p>Screen size is measured diagonally. Two screens with the same diagonal can have different widths and heights if their aspect ratios differ.</p> },
      { heading: "Use the right tool", body: <p>Use the <Link href="/screen-size-converter">screen size converter</Link> when you need estimated width and height, not just diagonal centimeters.</p> },
    ],
  },
  "height-conversion-guide": {
    title: "Height Conversion Guide",
    description: "Convert feet and inches to centimeters with the total-inches formula, worked examples, and a height chart.",
    initialValue: 68,
    sections: [
      { heading: "Feet and inches formula", body: <p>Convert feet to inches, add the remaining inches, then multiply total inches by 2.54. For example, 5&apos;8&quot; is 68 total inches, so 68 × 2.54 = 172.72 cm.</p> },
      { heading: "When to use centimeters", body: <p>Centimeters are useful for international profiles, medical or school records, travel forms, and metric height charts.</p> },
    ],
  },
  "laptop-screen-size-in-cm": {
    title: "Laptop Screen Size in CM",
    description: "Convert common laptop screen diagonals from inches to centimeters and understand what the diagonal measurement means.",
    initialValue: 15.6,
    sections: [
      { heading: "Direct laptop screen size answer", body: <p>Laptop screen size is normally the diagonal measurement. For example, a 15.6-inch laptop screen has a diagonal of 39.624 cm, but the visible width and height depend on aspect ratio.</p> },
      { heading: "Why diagonal size is not width", body: <p>A laptop advertised as 13.3, 14, 15.6, or 17.3 inches is measured from one corner of the display area to the opposite corner. Use the screen size converter when you need estimated width and height for sleeves, stands, or desk fit.</p> },
    ],
  },
  "tv-size-in-cm": {
    title: "TV Size in CM",
    description: "Convert common TV sizes from inches to centimeters and estimate display width and height by aspect ratio.",
    initialValue: 55,
    sections: [
      { heading: "Direct TV size answer", body: <p>TV size is measured diagonally. A 55-inch TV has a screen diagonal of 139.7 cm, while a 65-inch TV has a diagonal of 165.1 cm.</p> },
      { heading: "Check width before fitting a TV", body: <p>The diagonal does not include bezels, stands, or wall clearance. Convert the diagonal first, then use aspect ratio and manufacturer dimensions when checking whether a TV fits a cabinet or wall space.</p> },
    ],
  },
  "metric-vs-imperial-units": {
    title: "Metric vs Imperial Units",
    description: "Compare metric and imperial length units, including centimeters, meters, inches, feet, yards, and miles.",
    initialValue: 1,
    sections: [
      { heading: "The practical difference", body: <p>Metric length units use powers of ten, such as millimeters, centimeters, meters, and kilometers. Imperial length units include inches, feet, yards, and miles, which are still common in US product sizes, height, and screen diagonals.</p> },
      { heading: "Common length relationships", body: <p>One inch equals exactly 2.54 cm. One foot equals 12 inches, or 30.48 cm. For everyday size checks, convert the original measurement first, then round only the displayed result.</p> },
    ],
  },
  "how-to-convert-cm-to-inches": {
    title: "How to Convert CM to Inches",
    description: "Convert centimeters to inches with the exact formula, examples, rounding guidance, and related conversion tools.",
    initialValue: 25.4,
    sections: [
      { heading: "Use the exact cm-to-inches formula", body: <p>To convert centimeters to inches, divide the centimeter value by 2.54. For example, 25.4 cm ÷ 2.54 = 10 inches.</p> },
      { heading: "When rounding matters", body: <p>Centimeter values often convert to long decimal inch results. Use decimal inches for product specifications, and use fractional inches only when the task is tape-measure work or a rough physical estimate.</p> },
    ],
  },
  "how-big-is-24-inches": {
    title: "How Big Is 24 Inches?",
    description: "24 inches equals 60.96 cm and 2 feet. Compare the size with monitors, furniture, shelves, and product dimensions.",
    initialValue: 24,
    sections: [
      { heading: "Direct size answer", body: <p>Twenty-four inches equals exactly 60.96 centimeters, 609.6 millimeters, or 2 feet. It is a common size for monitors, shelves, compact furniture, and product dimensions.</p> },
      { heading: "Real-world context", body: <p>For screens, 24 inches usually means diagonal size. For furniture, boxes, or shelves, check whether the measurement means width, height, depth, or length before converting.</p> },
    ],
  },
  "length-converters": {
    title: "Length Converters",
    description: "Browse focused length converters for inches, centimeters, millimeters, meters, kilometers, feet, yards, and miles.",
    initialValue: 10,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 10, presets: [1, 10, 12, 24] },
    sections: [
      { heading: "Length conversion hub", body: <p>Use this hub when the task is a length or size conversion. It keeps the site focused on measurement units instead of unrelated calculators.</p> },
      { heading: "Choose the right converter", body: <p>Use exact inch and centimeter pages for a single known value, unit-pair converters for changing unit systems, and chart pages when you need to scan many values.</p> },
    ],
  },
  "fraction-converters": {
    title: "Fraction Converters",
    description: "Convert decimal inches and fractional inches with ruler-friendly precision, nearby fractions, and metric equivalents.",
    initialValue: 0.5,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 0.5, presets: [0.125, 0.25, 0.5, 0.75] },
    sections: [
      { heading: "Fraction conversion hub", body: <p>Fraction pages are for ruler and workshop increments such as halves, quarters, eighths, sixteenths, thirty-seconds, and sixty-fourths.</p> },
      { heading: "How to avoid rounding mistakes", body: <p>Convert the fraction to decimal inches first, then convert to centimeters or millimeters. Keep the nearest fraction separate from the exact decimal value.</p> },
    ],
  },
  "height-tools": {
    title: "Height Tools",
    description: "Find height converters, height charts, feet-and-inches pages, and centimeter height references.",
    initialValue: 68,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 68, presets: [55, 65, 68, 72] },
    sections: [
      { heading: "Height conversion hub", body: <p>Height tools convert feet-and-inches notation into centimeters and help compare nearby heights without changing URLs or creating duplicate punctuation variants.</p> },
      { heading: "Use total inches first", body: <p>For height, multiply feet by 12, add the remaining inches, then multiply total inches by exactly 2.54 to get centimeters.</p> },
    ],
  },
  "screen-tools": {
    title: "Screen Tools",
    description: "Use screen measurement tools for diagonal size, centimeters, aspect ratio, width, height, and PPI.",
    initialValue: 15.6,
    screenTool: "dimensions",
    sections: [
      { heading: "Screen measurement hub", body: <p>Screen pages focus on calculations from user-entered diagonal size, aspect ratio, and resolution. They do not invent branded product dimensions.</p> },
      { heading: "Diagonal, width, height, and PPI", body: <p>Diagonal size converts directly from inches to centimeters. Width and height require aspect ratio, while PPI requires resolution and diagonal size.</p> },
    ],
  },
  "measurement-guides": {
    title: "Measurement Guides",
    description: "Read practical measurement guides for rulers, tape measures, rounding, screen size, and metric-imperial notation.",
    initialValue: 12,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 12, presets: [1, 6, 12, 24] },
    sections: [
      { heading: "Measurement guide hub", body: <p>These guides explain practical measurement tasks that support the converter ecosystem, such as reading rulers, understanding fractions, and comparing metric and imperial notation.</p> },
      { heading: "Use tools before rounding", body: <p>Calculate with exact conversion factors first. Round only when the task allows it, such as a rough fit check or a readable chart.</p> },
    ],
  },
  "feet-to-inches": {
    title: "Feet to Inches Converter",
    description: "Convert feet to inches with the exact 12 inches per foot formula, examples, and related length converters.",
    initialValue: 6,
    tool: { defaultFrom: "ft", defaultTo: "in", defaultValue: 6, presets: [1, 3, 5, 6] },
    sections: [
      { heading: "Feet to inches formula", body: <p>Multiply feet by 12. For example, 6 feet × 12 = 72 inches.</p> },
      { heading: "When this conversion is useful", body: <p>Use feet to inches for height totals, room dimensions, lumber, sports references, and any measurement that needs one inch value.</p> },
    ],
  },
  "inches-to-feet": {
    title: "Inches to Feet Converter",
    description: "Convert inches to feet with decimal feet, feet-plus-inches context, examples, and related height tools.",
    initialValue: 72,
    tool: { defaultFrom: "in", defaultTo: "ft", defaultValue: 72, presets: [12, 24, 36, 72] },
    sections: [
      { heading: "Inches to feet formula", body: <p>Divide inches by 12. For example, 72 inches ÷ 12 = 6 feet.</p> },
      { heading: "Decimal feet versus feet and inches", body: <p>Decimal feet are useful for calculations. Human height is usually easier to read as feet plus remaining inches.</p> },
    ],
  },
  "meters-to-feet": {
    title: "Meters to Feet Converter",
    description: "Convert meters to feet with the exact metric relationship, examples, precision guidance, and related unit tools.",
    initialValue: 1,
    tool: { defaultFrom: "m", defaultTo: "ft", defaultValue: 1, presets: [1, 1.5, 2, 10] },
    sections: [
      { heading: "Meters to feet formula", body: <p>One meter is approximately 3.28084 feet. Convert through meters as the base length unit, then round the displayed result.</p> },
      { heading: "Use cases", body: <p>This is useful for room sizes, travel distances, product dimensions, sports measurements, and metric-to-imperial references.</p> },
    ],
  },
  "feet-to-meters": {
    title: "Feet to Meters Converter",
    description: "Convert feet to meters with formula notes, examples, rounding guidance, and related metric length tools.",
    initialValue: 10,
    tool: { defaultFrom: "ft", defaultTo: "m", defaultValue: 10, presets: [1, 3, 6, 10] },
    sections: [
      { heading: "Feet to meters formula", body: <p>One foot equals exactly 0.3048 meters. Multiply feet by 0.3048 to get meters.</p> },
      { heading: "Precision guidance", body: <p>Keep more decimals for specifications, but one or two decimals is usually enough for everyday length comparisons.</p> },
    ],
  },
  "yards-to-meters": {
    title: "Yards to Meters Converter",
    description: "Convert yards to meters for field lengths, fabric, sports, landscaping, and metric comparison.",
    initialValue: 1,
    tool: { defaultFrom: "yd", defaultTo: "m", defaultValue: 1, presets: [1, 3, 10, 100] },
    sections: [
      { heading: "Yards to meters formula", body: <p>One yard equals exactly 0.9144 meters. Multiply yards by 0.9144 to convert.</p> },
      { heading: "Common uses", body: <p>Yards appear in sports fields, fabric, landscaping, and larger imperial measurements that need metric comparison.</p> },
    ],
  },
  "meters-to-yards": {
    title: "Meters to Yards Converter",
    description: "Convert meters to yards with formula notes, examples, and related metric-imperial length converters.",
    initialValue: 10,
    tool: { defaultFrom: "m", defaultTo: "yd", defaultValue: 10, presets: [1, 5, 10, 100] },
    sections: [
      { heading: "Meters to yards formula", body: <p>Divide meters by 0.9144, or multiply by about 1.09361, to convert meters to yards.</p> },
      { heading: "Rounding advice", body: <p>Use rounded yards for communication, but keep precise values for plans, sports markings, or material estimates.</p> },
    ],
  },
  "miles-to-km": {
    title: "Miles to KM Converter",
    description: "Convert miles to kilometers for road distances, races, maps, and metric travel references.",
    initialValue: 1,
    tool: { defaultFrom: "mi", defaultTo: "km", defaultValue: 1, presets: [1, 3.1, 5, 10] },
    sections: [
      { heading: "Miles to kilometers formula", body: <p>One mile equals exactly 1.609344 kilometers. Multiply miles by 1.609344 to convert.</p> },
      { heading: "Common distance context", body: <p>This conversion is useful for road signs, race distances, walking routes, and comparing imperial and metric map distances.</p> },
    ],
  },
  "km-to-miles": {
    title: "KM to Miles Converter",
    description: "Convert kilometers to miles with formula guidance, examples, and related distance converters.",
    initialValue: 5,
    tool: { defaultFrom: "km", defaultTo: "mi", defaultValue: 5, presets: [1, 5, 10, 42.195] },
    sections: [
      { heading: "Kilometers to miles formula", body: <p>Divide kilometers by 1.609344 to convert to miles. A 5 km distance is about 3.1069 miles.</p> },
      { heading: "When to use miles", body: <p>Miles are common in US road distances, race descriptions, and imperial travel references.</p> },
    ],
  },
  "meters-to-cm": {
    title: "Meters to CM Converter",
    description: "Convert meters to centimeters using the exact metric factor of 100, with examples and related metric tools.",
    initialValue: 1,
    tool: { defaultFrom: "m", defaultTo: "cm", defaultValue: 1, presets: [0.5, 1, 1.5, 2] },
    sections: [
      { heading: "Meters to centimeters formula", body: <p>Multiply meters by 100. For example, 1.5 meters × 100 = 150 centimeters.</p> },
      { heading: "Metric scale context", body: <p>Use centimeters when the measurement needs more detail than meters but does not need millimeter-level precision.</p> },
    ],
  },
  "cm-to-meters": {
    title: "CM to Meters Converter",
    description: "Convert centimeters to meters with the exact metric formula, examples, and related unit tools.",
    initialValue: 100,
    tool: { defaultFrom: "cm", defaultTo: "m", defaultValue: 100, presets: [10, 50, 100, 180] },
    sections: [
      { heading: "Centimeters to meters formula", body: <p>Divide centimeters by 100. For example, 180 cm ÷ 100 = 1.8 meters.</p> },
      { heading: "When meters are clearer", body: <p>Meters are easier for larger lengths such as height, furniture, room sizes, and longer product dimensions.</p> },
    ],
  },
  "mm-to-cm": {
    title: "MM to CM Converter",
    description: "Convert millimeters to centimeters with exact metric scaling, examples, and small-measurement guidance.",
    initialValue: 10,
    tool: { defaultFrom: "mm", defaultTo: "cm", defaultValue: 10, presets: [1, 5, 10, 25.4] },
    sections: [
      { heading: "Millimeters to centimeters formula", body: <p>Divide millimeters by 10. For example, 25.4 mm ÷ 10 = 2.54 cm.</p> },
      { heading: "Small measurement use", body: <p>Millimeters are common for hardware and small parts; centimeters are easier for nearby product dimensions and school measurements.</p> },
    ],
  },
  "cm-to-mm": {
    title: "CM to MM Converter",
    description: "Convert centimeters to millimeters with the exact metric factor of 10, examples, and precision notes.",
    initialValue: 2.54,
    tool: { defaultFrom: "cm", defaultTo: "mm", defaultValue: 2.54, presets: [1, 2.54, 10, 30] },
    sections: [
      { heading: "Centimeters to millimeters formula", body: <p>Multiply centimeters by 10. For example, 2.54 cm × 10 = 25.4 mm.</p> },
      { heading: "When millimeters are better", body: <p>Use millimeters for hardware, small product details, drawings, and fit checks where small differences matter.</p> },
    ],
  },
  "decimal-inches-to-fractions": {
    title: "Decimal Inches to Fractions",
    description: "Convert decimal inches to nearby ruler fractions with centimeter and millimeter context.",
    initialValue: 0.625,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 0.625, presets: [0.125, 0.25, 0.5, 0.625] },
    sections: [
      { heading: "Decimal to fraction method", body: <p>Choose the ruler denominator first, such as 16ths or 32nds, then round the decimal inch value to the nearest increment.</p> },
      { heading: "Keep exact and rounded values separate", body: <p>A fraction can be a practical tape-measure reading, while the decimal and metric values are better for calculations and specifications.</p> },
    ],
  },
  "fractions-to-decimal-inches": {
    title: "Fractions to Decimal Inches",
    description: "Convert common ruler fractions to decimal inches, centimeters, and millimeters with precision guidance.",
    initialValue: 0.5,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 0.5, presets: [0.0625, 0.125, 0.25, 0.5] },
    sections: [
      { heading: "Fraction to decimal method", body: <p>Divide the numerator by the denominator. For example, 1/8 inch = 0.125 inch.</p> },
      { heading: "Metric conversion after decimal", body: <p>After the fraction is converted to decimal inches, multiply by 2.54 for centimeters or 25.4 for millimeters.</p> },
    ],
  },
  "ppi-calculator": {
    title: "PPI Calculator",
    description: "Calculate pixels per inch from screen resolution and diagonal size, with formula and display-density examples.",
    initialValue: 24,
    screenTool: "ppi",
    sections: [
      { heading: "PPI formula", body: <p>Pixels per inch equals the diagonal pixel count divided by the screen diagonal in inches: √(width² + height²) ÷ diagonal inches.</p> },
      { heading: "What PPI tells you", body: <p>PPI describes pixel density, not physical screen size. Use it to compare sharpness when resolution and diagonal size are both known.</p> },
    ],
  },
  "screen-aspect-ratio-calculator": {
    title: "Screen Aspect Ratio Calculator",
    description: "Use screen diagonal and aspect ratio to understand display width, height, and proportional screen shape.",
    initialValue: 27,
    screenTool: "aspect-ratio",
    sections: [
      { heading: "Aspect ratio calculation", body: <p>An aspect ratio such as 16:9 describes width compared with height. The diagonal and ratio form a right triangle used to estimate screen width and height.</p> },
      { heading: "Why aspect ratio matters", body: <p>Two screens with the same diagonal can have different widths and heights if their aspect ratios are different.</p> },
    ],
  },
  "screen-dimensions-calculator": {
    title: "Screen Dimensions Calculator",
    description: "Estimate screen width and height from diagonal size and aspect ratio for laptops, monitors, tablets, and TVs.",
    initialValue: 15.6,
    screenTool: "dimensions",
    sections: [
      { heading: "Screen dimensions formula", body: <p>Use the diagonal and aspect ratio to estimate the visible display rectangle. Bezels, stands, and casing are not included.</p> },
      { heading: "Fit-check guidance", body: <p>Use calculated width and height for quick comparison, then check manufacturer dimensions before buying a sleeve, monitor arm, cabinet, or wall mount.</p> },
    ],
  },
  "tape-measure-fractions-guide": {
    title: "Tape Measure Fractions Guide",
    description: "Understand common tape-measure fractions, ruler increments, decimal inches, and metric equivalents.",
    initialValue: 0.125,
    tool: { defaultFrom: "in", defaultTo: "mm", defaultValue: 0.125, presets: [0.0625, 0.125, 0.25, 0.5] },
    sections: [
      { heading: "Common tape-measure increments", body: <p>Many tape measures mark halves, quarters, eighths, and sixteenths of an inch. Finer tools may include thirty-seconds or sixty-fourths.</p> },
      { heading: "Convert fractions carefully", body: <p>First simplify the fraction when possible, then convert it to decimal inches before calculating centimeters or millimeters.</p> },
    ],
  },
} as const;

export const guides = {
  ...baseGuides,
  ...generatedGuides,
} as const;

export type GuideSlug = keyof typeof guides;
export type GuideData = (typeof guides)[GuideSlug];
export function isGuideSlug(slug: string): slug is GuideSlug {
  return Object.prototype.hasOwnProperty.call(guides, slug);
}

const baseGuideDirectAnswers: Record<string, string> = {
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
  "laptop-screen-size-in-cm": "Laptop screen size is measured diagonally; multiply the inch diagonal by 2.54 to get centimeters.",
  "tv-size-in-cm": "TV size is the diagonal screen measurement in inches; multiply by 2.54 to convert it to centimeters.",
  "metric-vs-imperial-units": "Metric units use powers of ten, while imperial length units include inches, feet, yards, and miles.",
  "how-to-convert-cm-to-inches": "Divide centimeters by 2.54 to convert centimeters to inches.",
  "how-big-is-24-inches": "24 inches equals exactly 60.96 cm, 609.6 mm, and 2 feet.",
  "length-converters": "Use length converters to change one length unit into another while keeping the task inside measurement and size conversion.",
  "fraction-converters": "Fraction converters help translate decimal inches, ruler fractions, centimeters, and millimeters without mixing exact and rounded values.",
  "height-tools": "Height tools convert feet-and-inches notation into centimeters by using total inches first.",
  "screen-tools": "Screen tools calculate diagonal size, width, height, aspect ratio, and PPI from user-entered measurements.",
  "measurement-guides": "Measurement guides explain how to read, convert, and round practical length and size measurements.",
  "feet-to-inches": "Multiply feet by 12 to convert feet to inches.",
  "inches-to-feet": "Divide inches by 12 to convert inches to feet.",
  "meters-to-feet": "Multiply meters by about 3.28084 to convert meters to feet.",
  "feet-to-meters": "Multiply feet by exactly 0.3048 to convert feet to meters.",
  "yards-to-meters": "Multiply yards by exactly 0.9144 to convert yards to meters.",
  "meters-to-yards": "Divide meters by 0.9144 to convert meters to yards.",
  "miles-to-km": "Multiply miles by exactly 1.609344 to convert miles to kilometers.",
  "km-to-miles": "Divide kilometers by 1.609344 to convert kilometers to miles.",
  "meters-to-cm": "Multiply meters by 100 to convert meters to centimeters.",
  "cm-to-meters": "Divide centimeters by 100 to convert centimeters to meters.",
  "mm-to-cm": "Divide millimeters by 10 to convert millimeters to centimeters.",
  "cm-to-mm": "Multiply centimeters by 10 to convert centimeters to millimeters.",
  "decimal-inches-to-fractions": "Convert decimal inches to a nearby ruler fraction by rounding to the chosen denominator.",
  "fractions-to-decimal-inches": "Divide the numerator by the denominator to convert a fraction to decimal inches.",
  "ppi-calculator": "PPI equals diagonal pixels divided by diagonal inches.",
  "screen-aspect-ratio-calculator": "Aspect ratio compares screen width to height and helps calculate display dimensions from a diagonal.",
  "screen-dimensions-calculator": "Screen width and height can be estimated from diagonal size and aspect ratio.",
  "tape-measure-fractions-guide": "Tape-measure fractions are common inch increments such as halves, quarters, eighths, and sixteenths.",
};

export const guideDirectAnswers: Record<string, string> = {
  ...baseGuideDirectAnswers,
  ...generatedGuideDirectAnswers,
};

const baseGuideFaqs: Record<string, FaqItem[]> = {
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
  "laptop-screen-size-in-cm": [
    { question: "How many cm is a 15.6-inch laptop screen?", answer: "A 15.6-inch laptop screen has a diagonal of exactly 39.624 cm." },
    { question: "Is laptop screen size the width?", answer: "No. Laptop screen size is normally the diagonal measurement, not the width." },
  ],
  "tv-size-in-cm": [
    { question: "How many cm is a 55-inch TV?", answer: "A 55-inch TV has a diagonal of exactly 139.7 cm." },
    { question: "Does TV size include the frame?", answer: "Usually no. Advertised TV size refers to the screen diagonal, while bezels and stands add to the physical size." },
  ],
  "metric-vs-imperial-units": [
    { question: "Is cm metric or imperial?", answer: "Centimeters are metric units." },
    { question: "Is inch metric or imperial?", answer: "Inches are imperial units, and 1 inch equals exactly 2.54 centimeters." },
  ],
  "how-to-convert-cm-to-inches": [
    { question: "What is the formula for cm to inches?", answer: "Divide centimeters by 2.54." },
    { question: "How many inches is 25.4 cm?", answer: "25.4 cm equals exactly 10 inches." },
  ],
  "how-big-is-24-inches": [
    { question: "How many cm is 24 inches?", answer: "24 inches equals exactly 60.96 cm." },
    { question: "Is 24 inches 2 feet?", answer: "Yes. 24 inches equals exactly 2 feet." },
  ],
  "length-converters": [
    { question: "What units are covered here?", answer: "The length tools cover inches, centimeters, millimeters, meters, kilometers, feet, yards, and miles." },
    { question: "Are unrelated calculators included?", answer: "No. The hub stays focused on length and size conversion." },
  ],
  "fraction-converters": [
    { question: "Which fractions are useful for rulers?", answer: "Halves, quarters, eighths, sixteenths, thirty-seconds, and sixty-fourths are common ruler increments." },
    { question: "Should I round before converting?", answer: "Convert first when possible, then round the displayed value for the task." },
  ],
  "height-tools": [
    { question: "What is the height conversion formula?", answer: "Multiply feet by 12, add inches, then multiply total inches by 2.54." },
    { question: "Does this replace exact height pages?", answer: "No. It links to exact height pages and the height chart for specific values." },
  ],
  "screen-tools": [
    { question: "Is screen size width or diagonal?", answer: "Advertised screen size is normally the diagonal measurement." },
    { question: "What do I need for PPI?", answer: "You need pixel width, pixel height, and diagonal inches." },
  ],
  "measurement-guides": [
    { question: "What topics belong in measurement guides?", answer: "Rulers, tape measures, rounding, screen measurement, and metric-imperial notation belong here." },
    { question: "Are guides separate from calculators?", answer: "Guides explain the method and link to the relevant calculators." },
  ],
  "feet-to-inches": [
    { question: "How many inches are in 1 foot?", answer: "There are exactly 12 inches in 1 foot." },
    { question: "How many inches is 6 feet?", answer: "6 feet equals exactly 72 inches." },
  ],
  "inches-to-feet": [
    { question: "How many feet is 72 inches?", answer: "72 inches equals exactly 6 feet." },
    { question: "Why divide inches by 12?", answer: "One foot contains exactly 12 inches." },
  ],
  "meters-to-feet": [
    { question: "How many feet is 1 meter?", answer: "1 meter is approximately 3.28084 feet." },
    { question: "Is the result exact?", answer: "The meter and foot definitions are exact, but the displayed decimal is rounded." },
  ],
  "feet-to-meters": [
    { question: "How many meters is 1 foot?", answer: "1 foot equals exactly 0.3048 meters." },
    { question: "How many meters is 10 feet?", answer: "10 feet equals exactly 3.048 meters." },
  ],
  "yards-to-meters": [
    { question: "How many meters is 1 yard?", answer: "1 yard equals exactly 0.9144 meters." },
    { question: "How many meters is 100 yards?", answer: "100 yards equals exactly 91.44 meters." },
  ],
  "meters-to-yards": [
    { question: "How many yards is 1 meter?", answer: "1 meter is approximately 1.09361 yards." },
    { question: "What formula converts meters to yards?", answer: "Divide meters by 0.9144." },
  ],
  "miles-to-km": [
    { question: "How many km is 1 mile?", answer: "1 mile equals exactly 1.609344 kilometers." },
    { question: "How many km is 5 miles?", answer: "5 miles equals exactly 8.04672 kilometers." },
  ],
  "km-to-miles": [
    { question: "How many miles is 5 km?", answer: "5 km is approximately 3.10686 miles." },
    { question: "What formula converts km to miles?", answer: "Divide kilometers by 1.609344." },
  ],
  "meters-to-cm": [
    { question: "How many cm is 1 meter?", answer: "1 meter equals exactly 100 centimeters." },
    { question: "How many cm is 1.8 meters?", answer: "1.8 meters equals exactly 180 cm." },
  ],
  "cm-to-meters": [
    { question: "How many meters is 100 cm?", answer: "100 cm equals exactly 1 meter." },
    { question: "How many meters is 180 cm?", answer: "180 cm equals exactly 1.8 meters." },
  ],
  "mm-to-cm": [
    { question: "How many cm is 10 mm?", answer: "10 mm equals exactly 1 cm." },
    { question: "Why divide mm by 10?", answer: "One centimeter contains exactly 10 millimeters." },
  ],
  "cm-to-mm": [
    { question: "How many mm is 1 cm?", answer: "1 cm equals exactly 10 mm." },
    { question: "How many mm is 2.54 cm?", answer: "2.54 cm equals exactly 25.4 mm." },
  ],
  "decimal-inches-to-fractions": [
    { question: "What is 0.625 inches as a fraction?", answer: "0.625 inches equals 5/8 inch." },
    { question: "Which denominator should I use?", answer: "Use the denominator your ruler supports, such as 16ths or 32nds." },
  ],
  "fractions-to-decimal-inches": [
    { question: "What is 1/8 inch as a decimal?", answer: "1/8 inch equals 0.125 inches." },
    { question: "How do I convert a fraction to cm?", answer: "Convert the fraction to decimal inches, then multiply by 2.54." },
  ],
  "ppi-calculator": [
    { question: "What is the PPI formula?", answer: "PPI = √(width pixels² + height pixels²) ÷ diagonal inches." },
    { question: "Does higher PPI mean a larger screen?", answer: "No. PPI measures pixel density, not physical screen size." },
  ],
  "screen-aspect-ratio-calculator": [
    { question: "What does 16:9 mean?", answer: "It means the screen width is 16 units for every 9 units of height." },
    { question: "Can the same diagonal have different widths?", answer: "Yes. Different aspect ratios produce different widths and heights." },
  ],
  "screen-dimensions-calculator": [
    { question: "Does this include the bezel?", answer: "No. The calculation estimates visible display dimensions, not the frame or casing." },
    { question: "What values are required?", answer: "Enter diagonal inches and choose an aspect ratio." },
  ],
  "tape-measure-fractions-guide": [
    { question: "What are common tape-measure fractions?", answer: "Common marks include 1/2, 1/4, 1/8, and 1/16 inch." },
    { question: "How do I convert a tape fraction to mm?", answer: "Convert the fraction to decimal inches, then multiply by 25.4." },
  ],
};

export const guideFaqs: Record<string, FaqItem[]> = {
  ...baseGuideFaqs,
  ...generatedGuideFaqs,
};
