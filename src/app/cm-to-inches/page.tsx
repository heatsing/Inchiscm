import { CoreConverterPage } from "@/components/CoreConverterPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "CM to Inches Converter - Formula, Chart, and Examples",
  "Convert centimeters to inches instantly with the exact formula, rounded results, examples, and charts.",
  "/cm-to-inches",
);

export default function CmToInchesPage() {
  return <CoreConverterPage title="CM to Inches Converter" intro="Enter any centimeter measurement to see its inch equivalent instantly." mode="cm-to-in" formula="centimeters ÷ 2.54 = inches" path="/cm-to-inches" toolKey="cmToInches" initialValue={25.4} />;
}
