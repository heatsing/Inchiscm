import { LengthConverter } from "./LengthConverter";

type Mode = "in-to-cm" | "cm-to-in";

export function Converter({
  initialValue = 10,
  initialMode = "in-to-cm",
  compact = false,
  showVisualRuler = false,
}: {
  initialValue?: number;
  initialMode?: Mode;
  compact?: boolean;
  showVisualRuler?: boolean;
}) {
  return (
    <LengthConverter
      defaultFrom={initialMode === "in-to-cm" ? "in" : "cm"}
      defaultTo={initialMode === "in-to-cm" ? "cm" : "in"}
      defaultValue={initialValue}
      compact={compact}
      showVisualRuler={showVisualRuler}
    />
  );
}
