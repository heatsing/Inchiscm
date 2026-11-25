import { DimensionsHub } from "@/components/DimensionsHub";
import { registryMetadata } from "@/data/page-registry";

export const metadata = registryMetadata("/inches-to-cm-dimensions");

export default function InchesToCmDimensionsPage() {
  return <DimensionsHub direction="in-to-cm" />;
}
