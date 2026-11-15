"use client";

import { useState } from "react";

export function ChartActions({ csv, filename, allowCopy = false }: { csv: string; filename: string; allowCopy?: boolean }) {
  const [copyStatus, setCopyStatus] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(csv); setCopyStatus("Complete chart copied as CSV text."); }
    catch { setCopyStatus("Could not copy the chart. Use the CSV download instead."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="no-print"><div className="converter-actions">
    {allowCopy && <button type="button" className="button" onClick={copy}>Copy full table</button>}
    <button type="button" className="button" onClick={download}>Download chart CSV</button>
    <button type="button" className="button" onClick={() => window.print()}>Print reference page</button>
  </div><p role="status" className="subtle">{copyStatus}</p></div>;
}
