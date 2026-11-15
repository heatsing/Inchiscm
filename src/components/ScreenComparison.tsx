"use client";

import { useId, useState } from "react";
import { aspectRatios, calculateScreenDimensions, getAspectRatio, type AspectRatio } from "@/lib/screen-dimensions";
import { formatScreenMeasurement as formatLength } from "@/lib/screen-dimensions";

export function ScreenComparison() {
  const id = useId();
  const [screens, setScreens] = useState([{ diagonal: "27", ratio: "16:9" as AspectRatio }, { diagonal: "34", ratio: "21:9" as AspectRatio }]);
  const results = screens.map((screen) => {
    const ratio = getAspectRatio(screen.ratio);
    return calculateScreenDimensions(Number(screen.diagonal), ratio.width, ratio.height);
  });
  function update(index: number, change: Partial<(typeof screens)[number]>) {
    setScreens((current) => current.map((screen, i) => i === index ? { ...screen, ...change } : screen));
  }
  return <section aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>Compare two screen sizes</h2>
    <p>Compare visible panel dimensions before choosing a monitor or TV. Ratios below are exact presets; use the main calculator’s custom ratio option for a model’s actual resolution.</p>
    <div className="converter-card">
      {screens.map((screen, index) => <fieldset className="screen-comparison-fields" key={index}>
        <legend>Screen {index + 1}</legend>
        <div className="length-value-row">
          <div className="field"><label htmlFor={`${id}-${index}-size`}>Diagonal in inches</label><input id={`${id}-${index}-size`} type="number" min="0" step="any" inputMode="decimal" value={screen.diagonal} onChange={(event) => update(index, { diagonal: event.target.value })} aria-invalid={!results[index]} /></div>
          <div className="field"><label htmlFor={`${id}-${index}-ratio`}>Aspect ratio</label><select id={`${id}-${index}-ratio`} value={screen.ratio} onChange={(event) => update(index, { ratio: event.target.value as AspectRatio })}>{aspectRatios.map((ratio) => <option key={ratio.value} value={ratio.value}>{ratio.label}</option>)}</select></div>
        </div>
      </fieldset>)}
      <div aria-live="polite">
        {results.every(Boolean) ? <div className="data-table-wrap"><table>
          <caption>Approximate visible panel sizes, excluding frames and stands</caption>
          <thead><tr><th>Screen</th><th>Width</th><th>Height</th><th>Diagonal</th></tr></thead>
          <tbody>{results.map((result, index) => result && <tr key={index}><th scope="row">{screens[index].diagonal} in · {screens[index].ratio}</th><td>{formatLength(result.widthCm, 2)} cm ({formatLength(result.widthInches, 2)} in)</td><td>{formatLength(result.heightCm, 2)} cm ({formatLength(result.heightInches, 2)} in)</td><td>{formatLength(result.diagonalCm, 2)} cm</td></tr>)}</tbody>
        </table></div> : <p>Enter two positive, finite diagonals within the supported numeric range.</p>}
      </div>
    </div>
  </section>;
}
