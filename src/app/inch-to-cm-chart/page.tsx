import { ChartPage } from "@/components/ChartPage";
import { integerInches } from "@/lib/conversions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Inch to CM Chart (1–300 Inches)", "Search a complete inch to centimeter conversion table with exact values and links to detailed conversions.", "/inch-to-cm-chart");

export default function InchChartPage() {
  return <ChartPage title="Inch to CM Chart" intro="Use this searchable chart to convert 1 through 300 inches to centimeters. Each result uses the exact factor of 2.54." path="/inch-to-cm-chart" direction="in-to-cm" values={integerInches} />;
}
