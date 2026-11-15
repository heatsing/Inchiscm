export const aspectRatios = [
  { value: "16:9", label: "16:9 widescreen", width: 16, height: 9 },
  { value: "16:10", label: "16:10 laptop", width: 16, height: 10 },
  { value: "21:9", label: "21:9 ultrawide", width: 21, height: 9 },
  { value: "3:2", label: "3:2 productivity", width: 3, height: 2 },
  { value: "4:3", label: "4:3 classic", width: 4, height: 3 },
] as const;

export type AspectRatio = (typeof aspectRatios)[number]["value"];
export type ScreenUnit = "cm" | "in";

export function getAspectRatio(value: AspectRatio) {
  return aspectRatios.find((ratio) => ratio.value === value) ?? aspectRatios[0];
}

export function getScreenDefaults(slug: string): { diagonal: number; aspectRatio: AspectRatio } {
  if (slug.includes("21-9") || slug.includes("ultrawide")) return { diagonal: 34, aspectRatio: "21:9" };
  if (slug.includes("16-10")) return { diagonal: 16, aspectRatio: "16:10" };
  if (slug.includes("4-3")) return { diagonal: 27, aspectRatio: "4:3" };
  const diagonal = slug.includes("tv") ? 55 : slug.includes("laptop") ? 15.6 : slug.includes("tablet") ? 11 : slug === "screen-dimensions-calculator" ? 15.6 : 27;
  return { diagonal, aspectRatio: "16:9" };
}

function positiveFinite(...values: number[]) {
  return values.every((value) => Number.isFinite(value) && value > 0);
}

export function calculateScreenDimensions(diagonalInches: number, ratioWidth: number, ratioHeight: number) {
  if (!positiveFinite(diagonalInches, ratioWidth, ratioHeight)) return null;
  // Normalize first so valid large ratios do not overflow intermediate products.
  const scale = Math.max(ratioWidth, ratioHeight);
  const w = ratioWidth / scale;
  const h = ratioHeight / scale;
  const ratioDiagonal = Math.hypot(w, h);
  const widthInches = diagonalInches * (w / ratioDiagonal);
  const heightInches = diagonalInches * (h / ratioDiagonal);
  const result = {
    widthInches, heightInches,
    widthCm: widthInches * 2.54,
    heightCm: heightInches * 2.54,
    diagonalCm: diagonalInches * 2.54,
  };
  return positiveFinite(...Object.values(result)) ? result : null;
}

export function calculateScreenDiagonal(width: number, height: number, unit: ScreenUnit) {
  if (!positiveFinite(width, height)) return null;
  const diagonal = Math.hypot(width, height);
  const result = {
    diagonalInches: unit === "in" ? diagonal : diagonal / 2.54,
    diagonalCm: unit === "cm" ? diagonal : diagonal * 2.54,
  };
  return positiveFinite(...Object.values(result)) ? result : null;
}

export function calculateScreenArea(width: number, height: number, unit: ScreenUnit) {
  const diagonal = calculateScreenDiagonal(width, height, unit);
  if (!diagonal) return null;
  const areaInput = width * height;
  const areaCm2 = unit === "cm" ? areaInput : areaInput * 2.54 * 2.54;
  if (!positiveFinite(areaInput, areaCm2)) return null;
  return { ...diagonal, areaInput, areaCm2 };
}

function greatestCommonDivisor(a: number, b: number) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

export function formatScreenMeasurement(value: number, maximumFractionDigits = 8) {
  if (!Number.isFinite(value)) return "";
  const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits, useGrouping: true }).format(value);
  return value !== 0 && Number(formatted.replaceAll(",", "")) === 0 ? value.toExponential(4) : formatted;
}

export function calculateAspectRatio(widthPixels: number, heightPixels: number) {
  if (![widthPixels, heightPixels].every((value) => Number.isSafeInteger(value) && value > 0)) return null;
  const a = greatestCommonDivisor(widthPixels, heightPixels);
  const w = widthPixels / a;
  const h = heightPixels / a;
  const common = aspectRatios.find((ratio) => {
    const divisor = greatestCommonDivisor(ratio.width, ratio.height);
    return ratio.width / divisor === w && ratio.height / divisor === h;
  })?.value ?? null;
  return { exact: `${w}:${h}`, common, decimal: widthPixels / heightPixels };
}

export type ComparedScreen = { diagonal: string; ratio: AspectRatio };

export function parseScreenComparisonHash(hash: string): [ComparedScreen, ComparedScreen] | null {
  const match = /^#compare=([0-9]+(?:\.[0-9]+)?),(\d+:\d+);([0-9]+(?:\.[0-9]+)?),(\d+:\d+)$/.exec(hash);
  if (!match) return null;
  const first = { diagonal: match[1], ratio: match[2] as AspectRatio };
  const second = { diagonal: match[3], ratio: match[4] as AspectRatio };
  if (![first, second].every((s) => aspectRatios.some((ratio) => ratio.value === s.ratio) && Number(s.diagonal) > 0 && Number(s.diagonal) <= 1_000_000)) return null;
  return [first, second];
}

export function screenComparisonHash(screens: readonly [ComparedScreen, ComparedScreen]) {
  return `#compare=${screens[0].diagonal},${screens[0].ratio};${screens[1].diagonal},${screens[1].ratio}`;
}

export function compareScreens(screens: readonly [ComparedScreen, ComparedScreen]) {
  const results = screens.map((screen) => {
    if (screen.diagonal.trim() === "") return null;
    const ratio = aspectRatios.find((item) => item.value === screen.ratio);
    const size = ratio && calculateScreenDimensions(Number(screen.diagonal), ratio.width, ratio.height);
    if (!size) return null;
    const areaCm2 = size.widthCm * size.heightCm;
    return Number.isFinite(areaCm2) && areaCm2 > 0 ? { ...size, areaCm2 } : null;
  });
  if (!results[0] || !results[1]) return null;
  const [first, second] = results as [NonNullable<(typeof results)[number]>, NonNullable<(typeof results)[number]>];
  const change = (a: number, b: number) => ({ difference: b - a, percent: ((b - a) / a) * 100 });
  const width = change(first.widthCm, second.widthCm);
  const height = change(first.heightCm, second.heightCm);
  const area = change(first.areaCm2, second.areaCm2);
  if (![width, height, area].every(({ difference, percent }) => Number.isFinite(difference) && Number.isFinite(percent))) return null;
  return { first, second, width, height, area };
}
