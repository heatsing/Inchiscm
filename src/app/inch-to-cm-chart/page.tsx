import { ChartPage } from "@/components/ChartPage";
import { integerInches } from "@/lib/conversions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Inch to CM Chart - Inches to Centimeters Table", "Search an inch to centimeter table from 1 to 100 inches with exact values and detailed conversion links.", "/inch-to-cm-chart");

export default function InchChartPage() {
  return <ChartPage title="Inch to CM Chart" intro="Use this searchable chart to convert 1 through 100 inches to centimeters. Each result uses the exact factor of 2.54." path="/inch-to-cm-chart" direction="in-to-cm" values={integerInches} />;
}
