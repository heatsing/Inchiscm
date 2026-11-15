"use client";

import { useId, useMemo, useState } from "react";
import { formatScreenMeasurement as formatLength } from "@/lib/screen-dimensions";
import {
  aspectRatios,
  calculateScreenDimensions,
  getAspectRatio,
  type AspectRatio,
} from "@/lib/screen-dimensions";

const commonDiagonals = [13.3, 15.6, 16, 24, 27, 32, 34, 55];

export function ScreenDimensionsCalculator({
  defaultDiagonal = 15.6,
  defaultAspectRatio = "16:9",
  defaultCustomRatio = { width: 3440, height: 1440 },
}: {
  defaultDiagonal?: number;
  defaultAspectRatio?: AspectRatio | "custom";
  defaultCustomRatio?: { width: number; height: number };
}) {
  const id = useId();
  const [diagonal, setDiagonal] = useState(String(defaultDiagonal));
  const [aspectRatio, setAspectRatio] = useState<AspectRatio | "custom">(defaultAspectRatio);
  const [customWidth, setCustomWidth] = useState(String(defaultCustomRatio.width));
  const [customHeight, setCustomHeight] = useState(String(defaultCustomRatio.height));
  const parsedDiagonal = Number(diagonal);
  const isValid = diagonal.trim() !== "" && Number.isFinite(parsedDiagonal) && parsedDiagonal > 0;
  const ratio = aspectRatio === "custom"
    ? { width: Number(customWidth), height: Number(customHeight) }
    : getAspectRatio(aspectRatio);
  const ratioLabel = aspectRatio === "custom" ? `${customWidth}:${customHeight}` : aspectRatio;
  const dimensions = useMemo(
    () => isValid
      ? calculateScreenDimensions(parsedDiagonal, ratio.width, ratio.height)
      : null,
    [isValid, parsedDiagonal, ratio.width, ratio.height],
  );

  return (
    <div className="converter-card screen-calculator">
      <div className="length-value-row">
        <div className="field">
          <label htmlFor={`${id}-diagonal`}>Screen diagonal</label>
          <div className="field-wrap">
            <input
              id={`${id}-diagonal`}
              type="number"
              min="0.00000001"
              step="any"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={diagonal}
              onChange={(event) => setDiagonal(event.target.value)}
              aria-invalid={!isValid}
              aria-describedby={`${id}-screen-result`}
            />
            <span className="unit">in</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-ratio`}>Aspect ratio</label>
          <select
            id={`${id}-ratio`}
            value={aspectRatio}
            onChange={(event) => setAspectRatio(event.target.value as AspectRatio | "custom")}
          >
            {aspectRatios.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            <option value="custom">Custom ratio / resolution</option>
          </select>
        </div>
      </div>

      {aspectRatio === "custom" && <div className="length-value-row">
        <div className="field"><label htmlFor={`${id}-custom-width`}>Ratio width / horizontal pixels</label><input id={`${id}-custom-width`} type="number" min="0" step="any" value={customWidth} onChange={(event) => setCustomWidth(event.target.value)} /></div>
        <div className="field"><label htmlFor={`${id}-custom-height`}>Ratio height / vertical pixels</label><input id={`${id}-custom-height`} type="number" min="0" step="any" value={customHeight} onChange={(event) => setCustomHeight(event.target.value)} /></div>
      </div>}
      <p className="subtle">Use a custom ratio for the exact shape of a panel such as 3440 × 1440. The 21:9 preset uses a strict 21:9 ratio.</p>
      <div className="converter-presets" aria-label="Common screen sizes">
        <span>Common sizes</span>
        <div>
          {commonDiagonals.map((value) => (
            <button key={value} type="button" onClick={() => setDiagonal(String(value))}>
              {value}&quot;
            </button>
          ))}
        </div>
      </div>

      <div className="result-detail screen-result" id={`${id}-screen-result`} aria-live="polite">
        {dimensions ? (
          <>
            <div>
              <strong>{formatLength(parsedDiagonal)}-inch {ratioLabel} display</strong>
              <div className="subtle">Approximate visible panel dimensions, excluding the bezel and casing.</div>
            </div>
            <div className="screen-dimension-grid">
              <div><span>Width</span><strong>{formatLength(dimensions.widthInches, 2)} in</strong><small>{formatLength(dimensions.widthCm, 2)} cm</small></div>
              <div><span>Height</span><strong>{formatLength(dimensions.heightInches, 2)} in</strong><small>{formatLength(dimensions.heightCm, 2)} cm</small></div>
              <div><span>Diagonal</span><strong>{formatLength(parsedDiagonal)} in</strong><small>{formatLength(dimensions.diagonalCm, 3)} cm</small></div>
            </div>
            <div className="subtle screen-formula">
              {formatLength(parsedDiagonal)} in × 2.54 = {formatLength(dimensions.diagonalCm)} cm diagonal
            </div>
          </>
        ) : (
          <strong>Enter positive diagonal and ratio values within the supported numeric range.</strong>
        )}
      </div>
    </div>
  );
}
