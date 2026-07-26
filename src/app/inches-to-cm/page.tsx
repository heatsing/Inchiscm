import { CoreConverterPage } from "@/components/CoreConverterPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Inches to CM Converter - Formula, Chart, and Examples",
  "Convert inches to centimeters instantly. Enter a whole or decimal inch value and see the exact result and formula.",
  "/inches-to-cm",
);

export default function InchesToCmPage() {
  return <CoreConverterPage title="Inches to CM Converter" intro="Enter any inch measurement for an instant, exact centimeter result." mode="in-to-cm" formula="inches × 2.54 = centimeters" path="/inches-to-cm" toolKey="inchesToCm" initialValue={12} />;
}
