import { registryMetadata } from "@/data/page-registry";
import { CoreConverterPage } from "@/components/CoreConverterPage";

export const metadata = registryMetadata("/inches-to-cm");

export default function InchesToCmPage() {
  return <CoreConverterPage title="Inches to CM Converter" intro="This dedicated inches-to-centimeters hub converts any inch value with the exact 2.54 formula, plus examples, charts, and exact inch pages." mode="in-to-cm" formula="inches × 2.54 = centimeters" path="/inches-to-cm" toolKey="inchesToCm" initialValue={12} />;
}
