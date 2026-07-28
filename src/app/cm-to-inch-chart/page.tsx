import { registryMetadata } from "@/data/page-registry";
import { ChartPage } from "@/components/ChartPage";
import { centimeterValues } from "@/lib/conversions";

export const metadata = registryMetadata("/cm-to-inch-chart");

export default function CmChartPage() {
  return <ChartPage title="CM to Inch Chart" intro="Use this searchable chart for centimeters from 1 to 100 plus approved reverse-conversion values. Results are rounded to four decimal places." path="/cm-to-inch-chart" direction="cm-to-in" values={centimeterValues} />;
}
