export const RULER_MAX_INCHES = 12;
export const RULER_TICKS_PER_INCH = 16;

export function clampRulerInches(inches: number) {
  return Math.min(RULER_MAX_INCHES, Math.max(0, inches));
}

export function snapRulerInches(inches: number) {
  return Math.round(clampRulerInches(inches) * RULER_TICKS_PER_INCH) / RULER_TICKS_PER_INCH;
}

export function stepRulerInches(inches: number, ticks: number) {
  const current = clampRulerInches(inches) * RULER_TICKS_PER_INCH;
  const nearest = Math.round(current);
  const onTick = Math.abs(current - nearest) < 1e-9;
  const startingTick = onTick ? nearest : ticks > 0 ? Math.floor(current) : Math.ceil(current);
  return clampRulerInches((startingTick + ticks) / RULER_TICKS_PER_INCH);
}
