import { DimensionsHub } from "@/components/DimensionsHub";
import { registryMetadata } from "@/data/page-registry";

export const metadata = registryMetadata("/cm-to-inches-dimensions");

export default function CmToInchesDimensionsPage() {
  return <DimensionsHub direction="cm-to-in" />;
}
