import Link from "next/link";
import { dimensionPageSummary, dimensionShareHref, nearbyDimensionEntries, referencesForDimensionGuide } from "@/data/page-registry/dimension-catalog";
import { DimensionFacts } from "./DimensionFacts";
import "./dimension-pages.css";

export function DimensionGuideReferences({ path }: { path: string }) {
  const rows = referencesForDimensionGuide(path);
  if (!rows.length) return null;
  return (
    <section className="dimension-block" id="dimension-reference">
      <h2>Dimension conversions</h2>
      {rows.map((row) => {
        const summary = dimensionPageSummary(row);
        const related = nearbyDimensionEntries(row);
        return (
          <section key={row.slug}>
            <h3>{summary.answer}</h3>
            <DimensionFacts row={row} summary={summary} />
            <p><Link href={dimensionShareHref(row.direction, row.values)}>Open the calculator with this size</Link></p>
            <ul>{related.slice(0, 2).map((item) => (
              <li key={item.href}><Link href={item.href}>{dimensionPageSummary(item).h1}</Link></li>
            ))}</ul>
          </section>
        );
      })}
    </section>
  );
}
