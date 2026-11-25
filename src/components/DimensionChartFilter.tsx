"use client";

import { useId, useState } from "react";

function normalize(text: string) {
  return text.toLowerCase().replaceAll("×", "x").replace(/\s*x\s*/g, "x").trim();
}

export function DimensionChartFilter({ tableId, kinds, total }: { tableId: string; kinds: readonly string[]; total: number }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");
  const [visible, setVisible] = useState(total);

  function filter(nextQuery: string, nextKind: string) {
    let count = 0;
    const terms = normalize(nextQuery).split(/\s+/);
    const rows = document.getElementById(tableId)?.querySelectorAll<HTMLTableRowElement>("tr[data-size]") ?? [];
    for (const row of rows) {
      const text = normalize(row.dataset.size ?? "");
      const matches = (!nextKind || row.dataset.kind === nextKind) && terms.every((term) => text.includes(term));
      row.hidden = !matches;
      if (matches) count += 1;
    }
    setVisible(count);
  }

  return (
    <div className="dimension-filters no-print">
      <div className="field">
        <label htmlFor={`${id}-query`}>Search sizes</label>
        <input id={`${id}-query`} className="dimension-search" type="search" placeholder="Try 8 x 10" value={query} aria-controls={tableId} onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          filter(value, kind);
        }} />
      </div>
      <div className="field">
        <label htmlFor={`${id}-kind`}>Filter by use</label>
        <select id={`${id}-kind`} value={kind} aria-controls={tableId} onChange={(event) => {
          const value = event.target.value;
          setKind(value);
          filter(query, value);
        }}>
          <option value="">All sizes</option>
          {kinds.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>
      <p className="subtle" role="status">{visible === 0 ? "No matching sizes." : `${visible} of ${total} sizes`}</p>
    </div>
  );
}
