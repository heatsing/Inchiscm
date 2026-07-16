export const aspectRatios = [
  { value: "16:9", label: "16:9 widescreen", width: 16, height: 9 },
  { value: "16:10", label: "16:10 laptop", width: 16, height: 10 },
  { value: "3:2", label: "3:2 productivity", width: 3, height: 2 },
  { value: "4:3", label: "4:3 classic", width: 4, height: 3 },
] as const;

export type AspectRatio = (typeof aspectRatios)[number]["value"];

export function getAspectRatio(value: AspectRatio) {
  return aspectRatios.find((ratio) => ratio.value === value) ?? aspectRatios[0];
}

export function calculateScreenDimensions(
  diagonalInches: number,
  ratioWidth: number,
  ratioHeight: number,
) {
  const ratioDiagonal = Math.hypot(ratioWidth, ratioHeight);
  const widthInches = diagonalInches * ratioWidth / ratioDiagonal;
  const heightInches = diagonalInches * ratioHeight / ratioDiagonal;

  return {
    widthInches,
    heightInches,
    widthCm: widthInches * 2.54,
    heightCm: heightInches * 2.54,
    diagonalCm: diagonalInches * 2.54,
  };
}
