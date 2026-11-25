import Link from "next/link";
import { ChartActions } from "./ChartActions";
import { DimensionChartFilter } from "./DimensionChartFilter";
import { dimensionPageSummary, dimensionRows, formatDimensionMeasure } from "@/data/page-registry/dimension-catalog";
import { type DimensionDirection, type DimensionMode } from "@/lib/product-dimensions";
import "./dimension-pages.css";

const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export function DimensionChart({ direction, mode }: { direction: DimensionDirection; mode: DimensionMode }) {
  const rows = dimensionRows(direction, mode).map((row) => ({ ...row, summary: dimensionPageSummary(row) }));
  const { from, to } = rows[0];
  const fullNames = { in: "inches", cm: "cm" } as const;
  const tableId = `dimension-chart-${mode}-${direction}`;
  const axes = mode === 2 ? [`Width × Height (${fullNames[from]})`] : [`Length (${from})`, `Width (${from})`, `Height (${from})`];
  const columns = [
    ...axes,
    mode === 2 ? `Width × Height (${fullNames[to]})` : `Converted dimensions (${to})`,
    ...(mode === 2 ? [`Area (${to}²)`, "Aspect ratio"] : [`Volume (${from}³ and ${to}³)`, "Liters"]),
    "Details",
  ];
  const chartRows = rows.map((row) => {
    const { source, target, targetMeasure, sourceMeasure, ratio, liters, isRounded } = row.summary;
    const values = [
      ...(mode === 2 ? [source] : row.values),
      `${isRounded ? "≈ " : ""}${target} ${to}`,
      ...(mode === 2
        ? [formatDimensionMeasure(targetMeasure, `${to}²`), ratio ?? ""]
        : [`${formatDimensionMeasure(sourceMeasure, `${from}³`)} / ${formatDimensionMeasure(targetMeasure, `${to}³`)}`, formatDimensionMeasure(liters!, "L", 9)]),
    ];
    return { row, values };
  });
  const csv = [columns, ...chartRows.map(({ row, values }) => [...values, `https://inchiscm.com${row.href}`])]
    .map((cols) => cols.map(csvCell).join(",")).join("\r\n");

  return (
    <>
      <DimensionChartFilter tableId={tableId} kinds={[...new Set(rows.map((row) => row.kind))]} total={rows.length} />
      <div className="data-table-wrap dimension-chart-wrap" tabIndex={0} role="region" aria-label={`${mode}D dimension conversion table`}>
        <table id={tableId}>
          <caption>{mode}D dimensions from {fullNames[from]} to {fullNames[to]}</caption>
          <thead><tr>{columns.map((name) => <th key={name} scope="col">{name}</th>)}</tr></thead>
          <tbody>
            {chartRows.map(({ row, values }) => (
              <tr key={row.slug} data-kind={row.kind} data-size={`${row.summary.source} ${from} ${row.summary.target} ${to} ${row.kind} ${row.example}`}>
                <th scope="row">{values[0]}</th>
                {values.slice(1).map((value, index) => <td key={index}>{value}</td>)}
                <td><Link href={row.existingPath && !row.existingPath.startsWith("/dimensions/") ? `${row.href}#dimension-reference` : row.href}>{row.summary.source} {from} details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ChartActions csv={csv} filename={`${tableId}.csv`} />
    </>
  );
}
