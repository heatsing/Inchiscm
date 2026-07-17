"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cmSlug, cmToInches, formatNumber, inchSlug, inchesToCm } from "@/lib/conversions";

type RangeKey = "1-25" | "26-50" | "51-75" | "76-100" | "other" | "all";

const standardRanges: { key: RangeKey; label: string; min: number; max: number }[] = [
  { key: "1-25", label: "1–25", min: 1, max: 25 },
  { key: "26-50", label: "26–50", min: 26, max: 50 },
  { key: "51-75", label: "51–75", min: 51, max: 75 },
  { key: "76-100", label: "76–100", min: 76, max: 100 },
];

export function ConversionTable({ direction, values }: { direction: "in-to-cm" | "cm-to-in"; values: number[] }) {
  const [filter, setFilter] = useState("");
  const [range, setRange] = useState<RangeKey>("1-25");
  const rows = useMemo(() => {
    const query = filter.trim();
    if (!query) return values;
    return values.filter((value) => String(value).includes(query)).slice(0, 100);
  }, [filter, values]);
  const hasOtherValues = values.some((value) => value > 100);
  const rangeOptions = hasOtherValues
    ? [...standardRanges, { key: "other" as const, label: "Over 100" }, { key: "all" as const, label: "All" }]
    : [...standardRanges, { key: "all" as const, label: "All" }];
  const hasFilter = filter.trim() !== "";

  function isRowVisible(value: number) {
    if (hasFilter || range === "all") return true;
    if (range === "other") return value > 100;
    const selectedRange = standardRanges.find((option) => option.key === range);
    const bucketValue = Math.floor(value);
    return selectedRange ? bucketValue >= selectedRange.min && bucketValue <= selectedRange.max : true;
  }

  const visibleRowCount = rows.filter(isRowVisible).length;

  function onFilter(value: string) {
    setFilter(value);
    const win = window as typeof window & { dataLayer?: Record<string, unknown>[] };
    win.dataLayer?.push({ event: "chart_filter", direction, value });
  }

  function onRangeChange(nextRange: RangeKey) {
    setRange(nextRange);
    setFilter("");
    const win = window as typeof window & { dataLayer?: Record<string, unknown>[] };
    win.dataLayer?.push({ event: "chart_range", direction, range: nextRange });
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
          <thead><tr><th>{direction === "in-to-cm" ? "Inches" : "Centimeters"}</th><th>{direction === "in-to-cm" ? "Centimeters" : "Inches"}</th><th>Details</th></tr></thead>
          <tbody>
            {visibleRowCount === 0 && <tr><td colSpan={3} role="status">No matching conversions.</td></tr>}
            {rows.map((value) => {
              const result = direction === "in-to-cm" ? inchesToCm(value) : cmToInches(value);
              const sourceUnit = direction === "in-to-cm" ? (value === 1 ? "inch" : "inches") : "cm";
              return <tr key={value} hidden={!isRowVisible(value)}><td>{formatNumber(value)} {direction === "in-to-cm" ? "in" : "cm"}</td><td>{formatNumber(result)} {direction === "in-to-cm" ? "cm" : "in"}</td><td><Link href={direction === "in-to-cm" ? inchSlug(value) : cmSlug(value)}>View {formatNumber(value)} {sourceUnit}</Link></td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
