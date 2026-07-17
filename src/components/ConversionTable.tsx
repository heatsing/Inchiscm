"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cmSlug, cmToInches, formatNumber, inchSlug, inchesToCm } from "@/lib/conversions";

export function ConversionTable({ direction, values }: { direction: "in-to-cm" | "cm-to-in"; values: number[] }) {
  const [filter, setFilter] = useState("");
  const rows = useMemo(() => {
    const query = filter.trim();
    if (!query) return values;
    return values.filter((value) => String(value).includes(query)).slice(0, 100);
  }, [filter, values]);

  function onFilter(value: string) {
    setFilter(value);
    const win = window as typeof window & { dataLayer?: Record<string, unknown>[] };
    win.dataLayer?.push({ event: "chart_filter", direction, value });
  }

  return (
    <>
      <input className="table-filter" type="search" value={filter} onChange={(event) => onFilter(event.target.value)} placeholder="Filter values…" aria-label="Filter conversion chart" />
      <div className="data-table-wrap">
        <table>
          <caption>{direction === "in-to-cm" ? "Inches to centimeters conversion chart" : "Centimeters to inches conversion chart"}</caption>
          <thead><tr><th>{direction === "in-to-cm" ? "Inches" : "Centimeters"}</th><th>{direction === "in-to-cm" ? "Centimeters" : "Inches"}</th><th>Details</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={3} role="status">No matching conversions.</td></tr>}
            {rows.map((value) => {
              const result = direction === "in-to-cm" ? inchesToCm(value) : cmToInches(value);
              const sourceUnit = direction === "in-to-cm" ? "inches" : "cm";
              return <tr key={value}><td>{formatNumber(value)} {direction === "in-to-cm" ? "in" : "cm"}</td><td>{formatNumber(result)} {direction === "in-to-cm" ? "cm" : "in"}</td><td><Link href={direction === "in-to-cm" ? inchSlug(value) : cmSlug(value)}>View {formatNumber(value)} {sourceUnit}</Link></td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
