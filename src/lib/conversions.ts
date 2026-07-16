export const INCH_IN_CM = 2.54;

export function round(value: number, places = 4) {
  return Number(value.toFixed(places));
}

export function formatNumber(value: number, places = 4) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: places,
    useGrouping: false,
  }).format(round(value, places));
}

export function inchesToCm(inches: number) {
  return round(inches * INCH_IN_CM);
}

export function cmToInches(cm: number) {
  return round(cm / INCH_IN_CM);
}

export function numberToSlug(value: number) {
  return String(value).replace(".", "-");
}

export function inchSlug(value: number) {
  const unit = value === 1 || value < 1 || (!Number.isInteger(value) && screenInches.includes(value)) ? "inch" : "inches";
  return `/${numberToSlug(value)}-${unit}-in-cm`;
}

export function cmSlug(value: number) {
  return `/${numberToSlug(value)}-cm-in-inches`;
}

export function parseSlugNumber(value: string) {
  const parsed = Number(value.replace("-", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function heightToCm(feet: number, inches: number) {
  return inchesToCm(feet * 12 + inches);
}

export function heightSlug(feet: number, inches: number) {
  return inches === 0 ? `/${feet}-feet-in-cm` : `/${feet}-${inches}-in-cm`;
}

export const integerInches = Array.from({ length: 300 }, (_, i) => i + 1);
export const halfInches = Array.from({ length: 101 }, (_, i) => i + 0.5);
export const screenInches = [13.3, 14, 15.6, 17.3, 24, 27, 32, 43, 55, 65, 75];
export const allInchValues = [...new Set([...integerInches, ...halfInches, ...screenInches])].sort((a, b) => a - b);
export const centimeterValues = Array.from({ length: 300 }, (_, i) => i + 1);
export const heights = Array.from({ length: 37 }, (_, i) => {
  const total = 48 + i;
  return { feet: Math.floor(total / 12), inches: total % 12 };
});

export function parseMeasurementInput(raw: string) {
  const input = raw.trim().toLowerCase();
  const height = input.match(/^(\d+)\s*(?:'|ft|feet|foot)\s*(\d+)?\s*(?:"|in|inches?)?$/);
  if (height) {
    const feet = Number(height[1]);
    const inches = Number(height[2] || 0);
    return { type: "height" as const, value: feet * 12 + inches, feet, inches };
  }
  const number = Number(input.replace(/(?:inches?|in|cm|centimeters?|")/g, "").trim());
  return Number.isFinite(number) ? { type: "number" as const, value: number } : null;
}
