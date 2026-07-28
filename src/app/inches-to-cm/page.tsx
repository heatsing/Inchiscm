import { registryMetadata } from "@/data/page-registry";
import { CoreConverterPage } from "@/components/CoreConverterPage";

export const metadata = registryMetadata("/inches-to-cm");

export default function InchesToCmPage() {
  return <CoreConverterPage title="Inches to CM Converter" intro="Enter any inch measurement for an instant, exact centimeter result." mode="in-to-cm" formula="inches × 2.54 = centimeters" path="/inches-to-cm" toolKey="inchesToCm" initialValue={12} />;
}
