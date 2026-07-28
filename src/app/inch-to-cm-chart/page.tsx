import { registryMetadata } from "@/data/page-registry";
import { ChartPage } from "@/components/ChartPage";
import { integerInches } from "@/lib/conversions";

export const metadata = registryMetadata("/inch-to-cm-chart");

export default function InchChartPage() {
  return <ChartPage title="Inch to CM Chart" intro="Use this searchable chart to convert 1 through 100 inches to centimeters. Each result uses the exact factor of 2.54." path="/inch-to-cm-chart" direction="in-to-cm" values={integerInches} />;
}
