import { ChartPage } from "@/components/ChartPage";
import { centimeterValues } from "@/lib/conversions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("CM to Inch Chart (1–300 CM)", "Search a centimeter to inch conversion table with precise decimal results and detailed conversion pages.", "/cm-to-inch-chart");

export default function CmChartPage() {
  return <ChartPage title="CM to Inch Chart" intro="Use this searchable chart to convert 1 through 300 centimeters to inches. Results are rounded to four decimal places." path="/cm-to-inch-chart" direction="cm-to-in" values={centimeterValues} />;
}
