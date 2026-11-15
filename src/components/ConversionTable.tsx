"use client";

import { useState } from "react";
import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { cmSlug, cmToInches, formatNumber, inchSlug, inchesToCm } from "@/lib/conversions";
import type { InchChartRow } from "@/lib/inch-chart-data";

type RangeKey = "1-25" | "26-50" | "51-75" | "76-100" | "other" | "all";

const standardRanges: { key: RangeKey; label: string; min: number; max: number }[] = [
  { key: "1-25", label: "1–25", min: 1, max: 25 },
  { key: "26-50", label: "26–50", min: 26, max: 50 },
  { key: "51-75", label: "51–75", min: 51, max: 75 },
  { key: "76-100", label: "76–100", min: 76, max: 100 },
];

export function ConversionTable({ direction, values, inchRows }: { direction: "in-to-cm" | "cm-to-in"; values: number[]; inchRows?: InchChartRow[] }) {
  const [filter, setFilter] = useState("");
  const [range, setRange] = useState<RangeKey>(inchRows ? "all" : "1-25");
  const rows = inchRows ? inchRows.map((row) => row.inches) : values;
  const rowByValue = new Map(inchRows?.map((row) => [row.inches, row]) ?? []);
  const hasOtherValues = values.some((value) => value > 100);
  const rangeOptions = hasOtherValues
    ? [...standardRanges, { key: "other" as const, label: "Over 100" }, { key: "all" as const, label: "All" }]
    : [...standardRanges, { key: "all" as const, label: "All" }];
  const hasFilter = filter.trim() !== "";

  function isRowVisible(value: number) {
    if (hasFilter) return String(value).includes(filter.trim()) || (rowByValue.get(value)?.label.includes(filter.trim()) ?? false);
    if (range === "all") return true;
    if (range === "other") return value > 100;
    const selectedRange = standardRanges.find((option) => option.key === range);
    const bucketValue = Math.floor(value);
    return selectedRange ? bucketValue >= selectedRange.min && bucketValue <= selectedRange.max : true;
  }

  const visibleRowCount = rows.filter(isRowVisible).length;

  function onFilter(value: string) {
    setFilter(value);
    trackAnalyticsEvent("chart_filter", { direction });
  }

  function onRangeChange(nextRange: RangeKey) {
    setRange(nextRange);
    setFilter("");
    trackAnalyticsEvent("chart_range", { direction, range: nextRange });
  }

  return (
    <>
      <input className="table-filter" type="search" value={filter} onChange={(event) => onFilter(event.target.value)} placeholder="Filter values…" aria-label="Filter conversion chart" />
      <fieldset className="chart-range-controls">
        <legend>Show values</legend>
        <div>
          {rangeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={!hasFilter && range === option.key ? "active" : ""}
              aria-pressed={!hasFilter && range === option.key}
              onClick={() => onRangeChange(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <span className="subtle" aria-live="polite">{visibleRowCount} values shown</span>
      </fieldset>
      <div className="data-table-wrap">
        <table>
          <caption>{direction === "in-to-cm" ? "Inches to centimeters conversion chart" : "Centimeters to inches conversion chart"}</caption>
          <thead><tr><th>{direction === "in-to-cm" ? "Inches" : "Centimeters"}</th><th>{direction === "in-to-cm" ? "Centimeters" : "Inches"}</th>{inchRows && <th>Millimeters</th>}<th>Details</th></tr></thead>
          <tbody>
            {visibleRowCount === 0 && <tr className="no-print"><td colSpan={inchRows ? 4 : 3} role="status">No matching conversions.</td></tr>}
            {rows.map((value) => {
              const row = rowByValue.get(value);
              const result = row ? row.cm : direction === "in-to-cm" ? inchesToCm(value) : cmToInches(value);
              const sourceUnit = direction === "in-to-cm" ? (value === 1 ? "inch" : "inches") : "cm";
              return <tr key={value} hidden={!isRowVisible(value)}><td>{row?.label ?? `${formatNumber(value)} ${direction === "in-to-cm" ? "in" : "cm"}`}</td><td>{formatNumber(result)} {direction === "in-to-cm" ? "cm" : "in"}</td>{inchRows && <td>{formatNumber(row?.mm ?? value * 25.4)} mm</td>}<td>{row && !row.href ? "Reference" : <Link href={row?.href ?? (direction === "in-to-cm" ? inchSlug(value) : cmSlug(value))}>View {formatNumber(value)} {sourceUnit}</Link>}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
