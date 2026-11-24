import { formatNumber, numberToSlug } from "@/lib/conversions";
import { convertLength, formatLength, type LengthUnit } from "@/lib/length-units";

type UnitValueGroup = {
  hub: string;
  chart?: string;
  from: LengthUnit;
  to: LengthUnit;
  label: string;
  formula: string;
  values: readonly (readonly [number, string])[];
};

export const unitValueGroups: readonly UnitValueGroup[] = [
  {
    hub: "/mm-to-inches", chart: "/mm-to-inch-chart", from: "mm", to: "in", label: "MM to inches",
    formula: "millimeters ÷ 25.4 = inches",
    values: [
      [0.5, "Use this value to compare a thin shim or sheet thickness with an inch drawing."],
      [1, "Compare a one-millimeter gap or sheet thickness with an inch tolerance."],
      [1.5, "Use the conversion to compare a 1.5 mm hex key with a socket marked in inches."],
      [2, "Compare the marked diameter of a 2 mm drill bit with an inch drawing."],
      [2.5, "Use the converted size for a 2.5 mm hex key, whose size is measured across flats."],
      [3, "Compare a 3 mm rod diameter with an inch hole specification."],
      [4, "Use the result to check a 4 mm sheet or acrylic panel against an inch drawing."],
      [5, "Compare a 5 mm wire or pin diameter with an inch reference."],
      [6, "Use this result to compare a 6 mm bit with an inch drill chart."],
      [6.35, "A 6.35 mm shaft or bit shank is exactly one quarter inch in nominal diameter."],
      [8, "Use this value to compare a metric dowel or bit with an inch drawing."],
      [10, "Compare a 10 mm socket opening with the across-flats size on an inch specification."],
      [12, "Compare a 12 mm panel with inch stock before accounting for actual thickness tolerances."],
      [12.7, "A 12.7 mm nominal shaft or drive dimension converts exactly to one half inch."],
      [15, "Use the result to compare a 15 mm spacer or bracket dimension with an inch drawing."],
      [16, "Compare a 16 mm diameter or panel thickness with an inch reference."],
      [19.05, "A 19.05 mm nominal thickness is exactly three quarters of an inch."],
      [20, "Convert a 20 mm strap width or mounting offset when reading an inch specification."],
      [22, "Convert a 22 mm watch-strap width measured between the lugs."],
      [25, "Compare a 25 mm strap width with its inch equivalent before checking the actual opening."],
      [25.4, "A nominal 25.4 mm center spacing is exactly one inch."],
      [30, "Convert a 30 mm face or hole offset to the units on an inch drawing."],
      [32, "Compare a 32 mm cabinet-hole spacing with an inch drawing by measuring center to center."],
      [38, "Convert a 38 mm webbing width when comparing it with an inch buckle opening."],
      [40, "Convert a 40 mm fan or component housing by checking the side and mounting holes separately."],
      [45, "Use the result to compare the stated width of a 45 mm bracket with available space."],
      [50, "Compare the actual width of a 50 mm fitting or strap with an inch opening."],
      [50.8, "A 50.8 mm marked length or diameter is exactly two inches."],
      [60, "Convert the side of a 60 mm fan housing and check its mounting pitch independently."],
      [65, "Compare a 65 mm hole or opening with the outside diameter of the mating part."],
      [70, "Convert a 70 mm opening to inches before allowing for a part's required clearance."],
      [75, "Convert a 75 mm center-to-center mounting distance, such as a square display-mount pattern."],
      [80, "Compare an 80 mm component footprint with the available inch clearance."],
      [90, "Use the result for an actual 90 mm housing or opening dimension."],
      [100, "Convert a 100 mm mounting pattern or separation measured center to center."],
    ],
  },
  {
    hub: "/inches-to-mm", chart: "/inch-to-mm-chart", from: "in", to: "mm", label: "Inches to MM",
    formula: "inches × 25.4 = millimeters",
    values: [
      [1, "Use a one-inch reference to check a scale or a mounting-hole pitch."],
      [1.25, "Compare a 1.25-inch outside diameter with a millimeter opening."],
      [1.5, "Check a 1.5-inch strap against the usable width of a metric buckle."],
      [2, "Translate the marked width of a two-inch strip into a metric cut list."],
      [2.5, "Use the actual 2.5-inch dimension of a bracket rather than any nominal form-factor name."],
      [3, "Convert a three-inch hole spacing or trim width on a millimeter drawing."],
      [3.5, "Convert an actual 3.5-inch body dimension before allowing room for a connector or fastener."],
      [4, "Compare a four-inch vent or duct opening with a metric cutout."],
      [4.5, "Convert a 4.5-inch component dimension before checking the mounting clearance."],
      [5, "Translate a five-inch cut mark to the millimeter scale on a ruler."],
      [5.5, "Convert a 5.5-inch cut width and measure the finished board separately."],
      [6, "Use the result for an actual six-inch piece or measured mounting offset."],
      [8, "Convert an eight-inch plate width or an edge on a technical drawing."],
      [10, "Translate a ten-inch reference length to a millimeter layout."],
      [12, "Convert a full foot of measured length when working from a millimeter cut list."],
      [16, "Convert the center-to-center distance of a 16-inch layout to millimeters."],
      [18, "Convert an 18-inch shelf or cabinet dimension before allowing for hardware clearance."],
      [24, "Use the result to convert a two-foot measurement for a millimeter drawing."],
      [36, "Check a 36-inch measured workspace or opening against metric dimensions."],
      [48, "Translate a four-foot measured panel width into millimeters for a cut list."],
    ],
  },
  {
    hub: "/feet-to-cm", from: "ft", to: "cm", label: "Feet to CM",
    formula: "feet × 30.48 = centimeters",
    values: [
      [1, "Use the exact one-foot reference for a ruler, shelf depth, or construction drawing."],
      [2, "Convert the depth of a two-foot shelf or the width of a panel."],
      [9, "Convert a nine-foot ceiling height measured from the finished floor."],
      [10, "Convert a ten-foot wall span or length of trim."],
      [12, "Convert a twelve-foot room span for a metric floor plan."],
      [15, "Convert a fifteen-foot wall length before checking usable floor area."],
      [16, "Convert an actual sixteen-foot board length for a metric cut list."],
      [20, "Convert a twenty-foot equipment bay or storage span."],
      [24, "Convert a twenty-four-foot garage or building span on a plan."],
      [30, "Convert a thirty-foot run before comparing material lengths."],
      [50, "Convert a fifty-foot cable run and allow additional length for routing."],
      [100, "Convert a measured hundred-foot run before preparing a metric material schedule."],
    ],
  },
  {
    hub: "/meters-to-feet", chart: "/meter-to-feet-chart", from: "m", to: "ft", label: "Meters to feet",
    formula: "meters ÷ 0.3048 = feet",
    values: [
      [0.5, "Convert half a meter of shelf depth or equipment clearance to decimal feet."],
      [1, "Use one meter as a reference length on an imperial layout."],
      [2.5, "Convert a 2.5-meter wall, ceiling, or equipment dimension."],
      [3, "Convert a three-meter wall span or work area to decimal feet."],
      [3.048, "A measured 3.048-meter span is exactly ten international feet."],
      [4, "Convert a four-meter room width before comparing imperial furniture layouts."],
      [5, "Convert a five-meter room length or equipment clearance."],
      [6, "Convert a six-meter span before comparing imperial material lengths."],
      [10, "Convert a ten-meter cable or room span to feet."],
      [15, "Convert a fifteen-meter run for an imperial site plan."],
      [20, "Convert a twenty-meter length before measuring along an imperial tape."],
      [30, "Convert a thirty-meter layout or roll of material to feet."],
      [50, "Convert a fifty-meter course or cable length into decimal feet."],
      [100, "Convert a hundred-meter course or measured distance into feet."],
    ],
  },
];

function inputUnit(group: UnitValueGroup, value: number) {
  if (group.from === "in") return value === 1 ? "inch" : "inches";
  if (group.from === "ft") return value === 1 ? "foot" : "feet";
  if (group.from === "m") return value === 1 ? "meter" : "meters";
  return group.from;
}

function outputUnit(group: UnitValueGroup) {
  if (group.to === "in") return "inches";
  if (group.to === "ft") return "feet";
  return group.to;
}

export const unitValuePages = unitValueGroups.flatMap((group) => group.values.map(([value, use]) => {
  const from = inputUnit(group, value);
  const to = outputUnit(group);
  const connector = group.from === "ft" ? "to" : "in";
  return {
    slug: `${numberToSlug(value)}-${from}-${connector}-${to}`,
    label: `${formatNumber(value)} ${from} in ${to}`,
    value,
    use,
    group,
  };
}));

export type UnitValuePage = (typeof unitValuePages)[number];
export const unitValuePageBySlug = new Map(unitValuePages.map((page) => [page.slug, page]));

export function unitValueResult(group: UnitValueGroup, value: number) {
  const result = convertLength(value, group.from, group.to);
  const displayed = Number(result.toFixed(6));
  const exact = Math.abs(displayed - result) <= Math.abs(result) * Number.EPSILON * 2;
  return { text: formatLength(displayed, 6), exact };
}

export function unitValueChartRows(group: UnitValueGroup) {
  const indexed = unitValuePages.filter((page) => page.group === group);
  const values = group.from === "mm"
    ? [...new Set([...Array.from({ length: 100 }, (_, index) => index + 1), ...indexed.map((page) => page.value)])].sort((a, b) => a - b)
    : indexed.map((page) => page.value);
  const slugs = new Map(indexed.map((page) => [page.value, page.slug]));
  return values.map((value) => ({ value, slug: slugs.get(value), ...unitValueResult(group, value) }));
}
