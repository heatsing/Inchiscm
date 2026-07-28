import { registryMetadata } from "@/data/page-registry";
import { CoreConverterPage } from "@/components/CoreConverterPage";

export const metadata = registryMetadata("/cm-to-inches");

export default function CmToInchesPage() {
  return <CoreConverterPage title="CM to Inches Converter" intro="Enter any centimeter measurement to see its inch equivalent instantly." mode="cm-to-in" formula="centimeters ÷ 2.54 = inches" path="/cm-to-inches" toolKey="cmToInches" initialValue={25.4} />;
}
