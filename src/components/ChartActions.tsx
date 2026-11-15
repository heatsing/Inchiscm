"use client";

export function ChartActions({ csv, filename }: { csv: string; filename: string }) {
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
  return <div className="converter-actions no-print">
    <button type="button" className="button" onClick={download}>Download chart CSV</button>
    <button type="button" className="button" onClick={() => window.print()}>Print reference page</button>
  </div>;
}
