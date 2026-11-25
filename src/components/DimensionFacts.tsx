import { dimensionPageSummary, formatDimensionMeasure, type DimensionEntry } from "@/data/page-registry/dimension-catalog";

export function DimensionFacts({ row, summary }: { row: DimensionEntry; summary: ReturnType<typeof dimensionPageSummary> }) {
  return (
    <dl className="dimension-detail-facts">
      {summary.mode === 2 ? (
        <>
          <div><dt>Area</dt><dd>{formatDimensionMeasure(summary.targetMeasure, `${row.to}²`)}</dd></div>
          <div><dt>Aspect ratio</dt><dd>{summary.ratio}</dd></div>
        </>
      ) : (
        <>
          <div><dt>Volume</dt><dd>{formatDimensionMeasure(summary.sourceMeasure, `${row.from}³`)}<br />{formatDimensionMeasure(summary.targetMeasure, `${row.to}³`)}</dd></div>
          <div><dt>Liters</dt><dd>{formatDimensionMeasure(summary.liters!, "L", 9)}</dd></div>
        </>
      )}
    </dl>
  );
}
