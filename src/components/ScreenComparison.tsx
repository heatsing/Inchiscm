"use client";

import { useEffect, useId, useState } from "react";
import { aspectRatios, compareScreens, parseScreenComparisonHash, screenComparisonHash, type ComparedScreen, type AspectRatio } from "@/lib/screen-dimensions";
import { formatScreenMeasurement as formatLength } from "@/lib/screen-dimensions";

export function ScreenComparison() {
  const id = useId();
  const [screens, setScreens] = useState<[ComparedScreen, ComparedScreen]>([{ diagonal: "27", ratio: "16:9" }, { diagonal: "34", ratio: "21:9" }]);
  const [shareStatus, setShareStatus] = useState("");
  useEffect(() => {
    const restore = () => {
      const saved = parseScreenComparisonHash(window.location.hash);
      setScreens(saved && compareScreens(saved) ? saved : [{ diagonal: "27", ratio: "16:9" }, { diagonal: "34", ratio: "21:9" }]);
    };
    const timer = window.setTimeout(restore, 0);
    window.addEventListener("hashchange", restore);
    return () => { window.clearTimeout(timer); window.removeEventListener("hashchange", restore); };
  }, []);
  const result = compareScreens(screens);
  function update(index: number, change: Partial<ComparedScreen>) {
    setScreens((current) => current.map((screen, i) => i === index ? { ...screen, ...change } : screen) as [ComparedScreen, ComparedScreen]);
    setShareStatus("");
  }
  async function share() {
    if (!result || !parseScreenComparisonHash(screenComparisonHash(screens))) return;
    const url = `${window.location.origin}${window.location.pathname}${screenComparisonHash(screens)}`;
    window.history.replaceState(null, "", url);
    try { await navigator.clipboard.writeText(url); setShareStatus("Comparison link copied."); }
    catch { setShareStatus("Link ready in the address bar. Copy it from there."); }
  }
  const delta = (value: { difference: number; percent: number }, unit: string) => `${value.difference >= 0 ? "+" : ""}${formatLength(value.difference, 2)} ${unit} (${value.percent >= 0 ? "+" : ""}${formatLength(value.percent, 2)}%)`;
  const scale = result ? Math.min(180 / Math.max(result.first.widthCm, result.second.widthCm), 110 / Math.max(result.first.heightCm, result.second.heightCm)) : 1;
  return <section aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>Compare two screen sizes</h2>
    <p>Compare visible panels only, excluding bezels, stands, and casing. Screen 1 is the baseline for all percentage changes.</p>
    <div className="converter-card">
      {screens.map((screen, index) => <fieldset className="screen-comparison-fields" key={index}>
        <legend>Screen {index + 1}</legend>
        <div className="length-value-row">
          <div className="field"><label htmlFor={`${id}-${index}-size`}>Diagonal in inches</label><input id={`${id}-${index}-size`} type="number" min="0" step="any" inputMode="decimal" value={screen.diagonal} onChange={(event) => update(index, { diagonal: event.target.value })} aria-invalid={!result} /></div>
          <div className="field"><label htmlFor={`${id}-${index}-ratio`}>Aspect ratio</label><select id={`${id}-${index}-ratio`} value={screen.ratio} onChange={(event) => update(index, { ratio: event.target.value as AspectRatio })}>{aspectRatios.map((ratio) => <option key={ratio.value} value={ratio.value}>{ratio.label}</option>)}</select></div>
        </div>
      </fieldset>)}
      <div aria-live="polite">
        {result ? <><div className="data-table-wrap"><table>
          <caption>Approximate visible panel sizes, excluding frames and stands</caption>
          <thead><tr><th>Screen</th><th>Width</th><th>Height</th><th>Visible area</th></tr></thead>
          <tbody>{([result.first, result.second] as const).map((size, index) => <tr key={index}><th scope="row">{screens[index].diagonal} in · {screens[index].ratio}</th><td>{formatLength(size.widthCm, 2)} cm</td><td>{formatLength(size.heightCm, 2)} cm</td><td>{formatLength(size.areaCm2, 2)} cm²</td></tr>)}</tbody>
        </table></div>
        <p>Screen 2 minus screen 1: width {delta(result.width, "cm")}; height {delta(result.height, "cm")}; visible area {delta(result.area, "cm²")}.</p>
        <figure><svg viewBox="0 0 420 170" style={{ width: "100%", maxWidth: 420 }} role="img" aria-label="Two panels drawn to the same physical scale">
          {[result.first, result.second].map((size, index) => <g key={index}>
            <rect x={index ? 220 : 10} y={125 - size.heightCm * scale} width={size.widthCm * scale} height={size.heightCm * scale} fill={index ? "#5686a3" : "#137a58"} />
            <text x={index ? 220 : 10} y="150" fontSize="14">Screen {index + 1}</text>
          </g>)}
        </svg><figcaption>Both visible panels use the same scale and calculated proportions.</figcaption></figure>
        </> : <p>Enter two positive, finite diagonals and valid aspect ratios.</p>}
      </div>
      <button type="button" className="button no-print" disabled={!result || !parseScreenComparisonHash(screenComparisonHash(screens))} onClick={share}>Copy comparison link</button>
      <p role="status" className="subtle">{shareStatus}</p>
    </div>
  </section>;
}
