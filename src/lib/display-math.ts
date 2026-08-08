export function calculatePpi(widthPixels: number, heightPixels: number, diagonalInches: number) {
  if (widthPixels <= 0 || heightPixels <= 0 || diagonalInches <= 0) return null;
  return Math.hypot(widthPixels, heightPixels) / diagonalInches;
}

export function formatPpi(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(value);
}
