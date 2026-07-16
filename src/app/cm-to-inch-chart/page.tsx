import { ChartPage } from "@/components/ChartPage";
import { centimeterValues } from "@/lib/conversions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("CM to Inch Chart - Centimeters to Inches Table", "Search common centimeter-to-inch values with precise decimal results and detailed conversion pages.", "/cm-to-inch-chart");

export default function CmChartPage() {
  return <ChartPage title="CM to Inch Chart" intro="Use this searchable chart for centimeters from 1 to 100 plus approved reverse-conversion values. Results are rounded to four decimal places." path="/cm-to-inch-chart" direction="cm-to-in" values={centimeterValues} />;
}
