"use client";

import { useId, useMemo, useState } from "react";
import { formatLength } from "@/lib/length-units";
import {
  aspectRatios,
  calculateScreenDimensions,
  getAspectRatio,
  type AspectRatio,
} from "@/lib/screen-dimensions";

const commonDiagonals = [13.3, 15.6, 24, 27, 32, 55];

export function ScreenDimensionsCalculator({
  defaultDiagonal = 15.6,
  defaultAspectRatio = "16:9",
}: {
  defaultDiagonal?: number;
  defaultAspectRatio?: AspectRatio;
}) {
  const id = useId();
  const [diagonal, setDiagonal] = useState(String(defaultDiagonal));
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(defaultAspectRatio);
  const parsedDiagonal = Number(diagonal);
  const isValid = diagonal.trim() !== "" && Number.isFinite(parsedDiagonal) && parsedDiagonal > 0;
  const ratio = getAspectRatio(aspectRatio);
  const dimensions = useMemo(
    () => isValid
      ? calculateScreenDimensions(parsedDiagonal, ratio.width, ratio.height)
      : null,
    [isValid, parsedDiagonal, ratio],
  );

  return (
    <div className="converter-card screen-calculator">
      <div className="length-value-row">
        <div className="field">
          <label htmlFor={`${id}-diagonal`}>Screen diagonal</label>
          <div className="field-wrap">
            <input
              id={`${id}-diagonal`}
              inputMode="decimal"
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
            onChange={(event) => setAspectRatio(event.target.value as AspectRatio)}
          >
            {aspectRatios.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

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
              <strong>{formatLength(parsedDiagonal)}-inch {aspectRatio} display</strong>
              <div className="subtle">Approximate visible panel dimensions, excluding the bezel and casing.</div>
            </div>
            <div className="screen-dimension-grid">
              <div><span>Width</span><strong>{formatLength(dimensions.widthInches, 2)} in</strong><small>{formatLength(dimensions.widthCm, 2)} cm</small></div>
              <div><span>Height</span><strong>{formatLength(dimensions.heightInches, 2)} in</strong><small>{formatLength(dimensions.heightCm, 2)} cm</small></div>
              <div><span>Diagonal</span><strong>{formatLength(parsedDiagonal)} in</strong><small>{formatLength(dimensions.diagonalCm, 3)} cm</small></div>
            </div>
          </>
        ) : (
          <strong>Enter a screen diagonal greater than zero.</strong>
        )}
      </div>
    </div>
  );
}
