export const SITE_ORIGIN = "https://inchiscm.com";
export const ROUTE_UPDATED_AT = "2026-07-28";
export const CONVERSION_DATA_UPDATED_AT = "2026-11-25";
export const DIMENSION_CONTENT_UPDATED_AT = "2026-11-25";
export const SHARED_SOCIAL_IMAGE_PATH = "/icon.png" as const;

// Explicit content revisions: keep untouched URLs on their original date.
const CALCULATOR_REVISED_PATHS = new Set([
  "/inches-to-cm-dimensions", "/cm-to-inches-dimensions", "/common-product-dimensions-in-cm", "/a4-paper-size-in-inches-and-cm", "/inch-to-cm-chart",
  "/screen-size-converter",
  "/screen-aspect-ratio-calculator", "/screen-dimensions-calculator",
  "/tv-dimensions-calculator", "/monitor-dimensions-calculator", "/laptop-screen-size-calculator",
  "/screen-width-calculator", "/screen-height-calculator", "/diagonal-screen-calculator",
  "/resolution-to-ppi-calculator", "/16-9-screen-size-calculator", "/16-10-screen-size-calculator",
  "/21-9-screen-size-calculator", "/4-3-screen-size-calculator", "/tablet-screen-size-calculator",
  "/projector-screen-size-calculator", "/ultrawide-screen-dimensions-calculator",
]);

const CONVERSION_DATA_REVISED_PATHS = new Set([
  "/inches-to-cm", "/cm-to-inches", "/cm-to-inch-chart", "/mm-to-inches", "/inches-to-mm", "/feet-to-cm",
  "/mm-to-inch-chart", "/inch-to-mm-chart", "/meters-to-feet", "/meter-to-feet-chart", "/length-converters",
  "/common-product-dimensions-in-cm", "/inches-to-cm-dimensions", "/screen-size-converter", "/screen-tools",
  "/fraction-converters", "/site-map",
]);

const DIMENSION_CONTENT_REVISED_PATHS = new Set([
  "/", "/inches-to-cm-dimensions", "/cm-to-inches-dimensions", "/a4-paper-size-in-inches-and-cm", "/site-map",
]);

const MEASUREMENT_PRACTICE_REVISED_PATHS = new Set(["/game", "/inches-to-cm", "/inch-to-cm-chart", "/site-map"]);

export function routeUpdatedAt(path: string) {
  if (MEASUREMENT_PRACTICE_REVISED_PATHS.has(path)) return "2026-11-25";
  if (DIMENSION_CONTENT_REVISED_PATHS.has(path)) return DIMENSION_CONTENT_UPDATED_AT;
  if (CONVERSION_DATA_REVISED_PATHS.has(path)) return CONVERSION_DATA_UPDATED_AT;
  return CALCULATOR_REVISED_PATHS.has(path) ? "2026-11-15" : ROUTE_UPDATED_AT;
}
