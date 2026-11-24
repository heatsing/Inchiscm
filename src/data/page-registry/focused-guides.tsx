import type { ReactNode } from "react";
import { calculateAspectRatio, calculateScreenDimensions, aspectRatios, type AspectRatio } from "@/lib/screen-dimensions";
import { formatNumber } from "@/lib/conversions";
import { dimensionCombinationSpecs, screenSizeSpecs } from "./dimension-screen-expansion";

type DimensionRow = readonly [label: string, valuesInches: readonly number[]];
type ScreenRow = readonly [label: string, diagonalInches: number, ratio: AspectRatio | "43:18"];
type FractionRow = readonly [label: string, inches: number];

type BaseSpec = {
  slug: string;
  title: string;
  description: string;
  answer: string;
  purpose: string;
  method: string;
  limit: string;
};
export type DimensionSpec = BaseSpec & { rows: readonly DimensionRow[] };
export type ScreenSpec = BaseSpec & { rows: readonly ScreenRow[]; compare?: boolean; portrait?: boolean; resolutionRows?: readonly (readonly [string, number, number])[]; sidesRows?: readonly (readonly [string, number, number])[] };
type FractionSpec = BaseSpec & { rows: readonly FractionRow[] };
export type FocusedGuideSpec =
  | (DimensionSpec & { group: "dimensions" })
  | (ScreenSpec & { group: "screens" })
  | (FractionSpec & { group: "fractions" });

const dimensionSpecs: DimensionSpec[] = [
  {
    slug: "photo-print-sizes-in-cm", title: "Photo Print Sizes in CM and Inches",
    description: "Compare common photo print dimensions in inches and centimeters before selecting a print or frame.",
    answer: "A 4 × 6 inch photo is 10.16 × 15.24 cm; a 5 × 7 inch photo is 12.7 × 17.78 cm.",
    purpose: "Use the physical print dimensions when ordering paper or choosing a frame. A file's pixel dimensions alone do not establish its printed size.",
    method: "Convert each side separately: 4 × 2.54 = 10.16 cm and 6 × 2.54 = 15.24 cm.",
    limit: "A print may be trimmed, bordered, or mounted. Check the lab's final cut size rather than assuming the nominal size is the opening you need.",
    rows: [["4 × 6 photo", [4, 6]], ["5 × 7 photo", [5, 7]], ["8 × 10 photo", [8, 10]]],
  },
  {
    slug: "picture-frame-sizes-in-cm", title: "Picture Frame Sizes in CM and Inches",
    description: "Convert common frame labels to centimeters and distinguish nominal frame size from its visible opening.",
    answer: "An 8 × 10 inch frame label converts to 20.32 × 25.4 cm, but the visible opening may be smaller.",
    purpose: "Match a print to the frame's stated insert size, then verify the rabbet and visible opening before cutting a mount.",
    method: "For each nominal side, multiply inches by 2.54; 8 × 2.54 = 20.32 cm and 10 × 2.54 = 25.4 cm.",
    limit: "Manufacturers may label the insert size, external frame size, or visible aperture differently. Measure the actual frame.",
    rows: [["8 × 10 frame", [8, 10]], ["5 × 7 frame", [5, 7]], ["11 × 14 frame", [11, 14]]],
  },
  {
    slug: "poster-sizes-in-cm", title: "Poster Sizes in CM and Inches",
    description: "See common poster dimensions in centimeters and plan wall space or a frame with measured sides.",
    answer: "An 18 × 24 inch poster is 45.72 × 60.96 cm before borders, trimming, or framing.",
    purpose: "Compare the paper size with wall space and the frame insert. Leave extra room for the frame's outside dimensions.",
    method: "Convert width and height independently: 18 × 2.54 = 45.72 cm; 24 × 2.54 = 60.96 cm.",
    limit: "Poster formats are not universal. A seller's listed dimensions should override a generic chart.",
    rows: [["18 × 24 poster", [18, 24]], ["11 × 17 poster", [11, 17]], ["24 × 36 poster", [24, 36]]],
  },
  {
    slug: "canvas-print-sizes-in-cm", title: "Canvas Print Sizes in CM",
    description: "Translate common canvas face dimensions to centimeters and account for wrapped edges separately.",
    answer: "A 16 × 20 inch canvas face is 40.64 × 50.8 cm; its depth must be measured separately.",
    purpose: "Use the face dimensions for wall composition, then ask for the stretcher depth if the canvas must fit a recess.",
    method: "Multiply each face side by 2.54. Do not add the wrapped edge depth to the printed face dimensions.",
    limit: "Gallery wraps can cover the sides with image or solid color; the nominal face size says nothing about how much image is lost to wrapping.",
    rows: [["16 × 20 canvas face", [16, 20]], ["8 × 10 canvas face", [8, 10]], ["20 × 30 canvas face", [20, 30]]],
  },
  {
    slug: "picture-mat-border-size", title: "Picture Mat Border Size Guide",
    description: "Work out the border around a print from the mat's outside size and opening dimensions.",
    answer: "A centered 8 × 10 inch opening in an 11 × 14 inch mat leaves 1.5 inches on each side and 2 inches at top and bottom.",
    purpose: "Subtract the opening from the outside size on each axis, then divide each difference by two to center the window.",
    method: "Horizontal border = (11 − 8) ÷ 2 = 1.5 in. Vertical border = (14 − 10) ÷ 2 = 2 in.",
    limit: "A mat opening is often cut slightly smaller than the print so the paper does not fall through; this example uses exact stated sizes.",
    rows: [["Print opening", [8, 10]], ["Mat outside", [11, 14]], ["Border, each side (horizontal × vertical)", [1.5, 2]]],
  },
  {
    slug: "frame-opening-vs-photo-size", title: "Frame Opening vs Photo Size",
    description: "Learn which measurements describe a photo, a frame insert, and the part of the image actually visible.",
    answer: "A photo can fit an 8 × 10 inch frame while less than 8 × 10 inches remains visible behind the frame lip.",
    purpose: "Measure the photo, the insert recess, and the aperture separately. They answer different fit questions.",
    method: "Convert each measured pair to centimeters only after identifying which surface it describes.",
    limit: "Do not assume a nominal 8 × 10 label guarantees an exact 8 × 10 visible opening or protects critical image edges.",
    rows: [["Nominal 8 × 10 print", [8, 10]], ["Example smaller visible opening", [7.75, 9.75]], ["Nominal 11 × 14 print", [11, 14]]],
  },
  {
    slug: "how-to-measure-a-picture-frame", title: "How to Measure a Picture Frame",
    description: "Measure a frame's insert recess, visible opening, outside width, and depth without mixing them up.",
    answer: "Measure the recess where the print sits for print fit; measure the outside edges for wall space.",
    purpose: "Remove the backing if safe, measure across the inside recess, then measure the visible opening and outside edge independently.",
    method: "Record every width × height pair in the same unit. Convert the measured sides individually if a seller uses another unit.",
    limit: "Do not force the backing or glass out of a sealed frame. Manufacturer dimensions may include trim not shown in nominal labels.",
    rows: [["Example print recess", [8, 10]], ["Example visible opening", [7.75, 9.75]], ["Example outside frame", [9, 11]]],
  },
  {
    slug: "photo-aspect-ratio-and-print-size", title: "Photo Aspect Ratio and Print Size",
    description: "Compare common print shape ratios and understand when cropping is needed before ordering.",
    answer: "A 4 × 6 print has a 2:3 shape, while an 8 × 10 print has a 4:5 shape; one image cannot fill both without a crop or border.",
    purpose: "Choose the target print shape before cropping. The same diagonal is not a substitute for matching width-to-height proportion.",
    method: "Reduce width:height to lowest terms, then convert the chosen physical sides from inches to centimeters.",
    limit: "A digital photo's resolution affects print sharpness, but the aspect ratio alone does not prove print quality.",
    rows: [["4 × 6, ratio 2:3", [4, 6]], ["5 × 7, ratio 5:7", [5, 7]], ["8 × 10, ratio 4:5", [8, 10]]],
  },
  {
    slug: "how-to-read-box-dimensions", title: "How to Read Box Dimensions",
    description: "Interpret length, width, and height labels on a box before converting units or checking fit.",
    answer: "A box marked 22 × 14 × 9 in has three separate sides: 55.88 × 35.56 × 22.86 cm.",
    purpose: "Check whether the seller means external or internal dimensions, then match the labeled axes to your item.",
    method: "Convert each side separately: 22 × 2.54, 14 × 2.54, and 9 × 2.54 centimeters.",
    limit: "The order of length and width can vary by manufacturer. Never assume that swapping axes leaves a directional fit check unchanged.",
    rows: [["22 × 14 × 9 example", [22, 14, 9]], ["Small example box", [10, 8, 6]], ["Medium example box", [16, 12, 8]]],
  },
  {
    slug: "shipping-box-size-chart", title: "Shipping Box Size Chart in CM",
    description: "Compare example shipping-box length, width, and height in inches and centimeters.",
    answer: "A 12 × 10 × 8 inch box measures 30.48 × 25.4 × 20.32 cm on the same three axes.",
    purpose: "Use this as a unit reference while shopping for boxes, not as a carrier size approval or a promise of internal capacity.",
    method: "Multiply the three stated inch dimensions by 2.54 independently; retain their original order.",
    limit: "Examples are not standardized box products. Carrier limits and actual usable interior dimensions must be verified separately.",
    rows: [["12 × 10 × 8 example", [12, 10, 8]], ["8 × 6 × 4 example", [8, 6, 4]], ["18 × 14 × 10 example", [18, 14, 10]]],
  },
  {
    slug: "box-interior-vs-exterior-dimensions", title: "Box Interior vs Exterior Dimensions",
    description: "Understand why a package's outside dimensions cannot be used as its usable inside dimensions.",
    answer: "A box's interior length, width, and height are usually smaller than its exterior measurements because walls take space.",
    purpose: "Use interior measurements to check whether an object fits; use exterior measurements when checking shelf, vehicle, or carrier limits.",
    method: "Measure both sets of sides directly. If wall thickness is uniform, an estimate is inside side = outside side − 2 × wall thickness.",
    limit: "Wall thickness, folds, flaps, and padding vary, so calculated interior space is an estimate until measured.",
    rows: [["Illustrative exterior", [12, 10, 8]], ["Illustrative interior", [11.5, 9.5, 7.5]], ["Illustrative difference per axis", [0.5, 0.5, 0.5]]],
  },
  {
    slug: "how-to-measure-a-box-for-shipping", title: "How to Measure a Box for Shipping",
    description: "Measure the finished package's outside length, width, and height in a consistent order.",
    answer: "For shipping dimensions, measure the sealed box's longest outside side, next side, and remaining height.",
    purpose: "Set the box on a flat surface, include protruding seams or bulges, and measure the final packed shape.",
    method: "Record three outside sides in one unit. Convert all three only after the measurements are taken.",
    limit: "Carrier rounding and dimensional-weight rules differ; this guide gives physical dimensions, not a shipping quote.",
    rows: [["Example sealed parcel", [14, 10, 6]], ["Example larger parcel", [20, 16, 12]]],
  },
  {
    slug: "packing-clearance-for-a-box", title: "Packing Clearance for a Box",
    description: "Compare an item's outside dimensions with a box's usable inside dimensions before adding padding.",
    answer: "If an item is 10 × 8 × 4 in and the usable box interior is 12 × 10 × 6 in, there are 2 inches of total clearance on each axis.",
    purpose: "Subtract object size from usable inside size on matching axes; positive clearance does not guarantee enough padding at corners.",
    method: "For the example: 12 − 10 = 2 in length, 10 − 8 = 2 in width, and 6 − 4 = 2 in height.",
    limit: "Allow for irregular shape, cushioning, flaps, and orientation. Do not treat these sample dimensions as packaging approval.",
    rows: [["Example item exterior", [10, 8, 4]], ["Example box interior", [12, 10, 6]], ["Total clearance per axis", [2, 2, 2]]],
  },
  {
    slug: "how-to-measure-product-dimensions", title: "How to Measure Product Dimensions",
    description: "Measure a product's external length, width, and height and keep those values separate from packaging.",
    answer: "Product dimensions describe the item itself; package dimensions include the container and packing material.",
    purpose: "Put the item in the orientation used by the listing, measure its furthest points, and label each axis.",
    method: "Record all sides in one unit, then convert each with × 2.54 for inches to centimeters or ÷ 2.54 in reverse.",
    limit: "Flexible items, handles, and detachable parts need a clear measurement convention; note what was included.",
    rows: [["Example item", [10, 15, 2]], ["Example package", [12, 17, 4]]],
  },
  {
    slug: "length-width-height-order", title: "Length × Width × Height Order",
    description: "Read three-dimensional size notation and avoid assuming every product lists axes in the same order.",
    answer: "L × W × H names three sides, but sellers can define length and width differently; check the diagram or labels.",
    purpose: "Map each listed dimension to the actual side before checking whether an item can pass through an opening.",
    method: "Keep the order fixed while converting: 22 × 14 × 9 in becomes 55.88 × 35.56 × 22.86 cm.",
    limit: "Rotating an object can change which side is width or height, but it cannot make a rigid side shorter.",
    rows: [["Example L × W × H", [22, 14, 9]], ["Rotated order, same object", [14, 22, 9]]],
  },
  {
    slug: "measuring-furniture-for-a-doorway", title: "Measuring Furniture for a Doorway",
    description: "Compare the smallest usable doorway opening with furniture's rigid outside dimensions.",
    answer: "Measure the clear opening with the door fully open, then compare it with the furniture's relevant rigid sides in the intended orientation.",
    purpose: "Record door width and height at the narrowest point; include trim, hinges, and fixed protrusions on the furniture.",
    method: "For a simple straight pass, each corresponding furniture side must be less than the clear opening side; convert both to the same unit first.",
    limit: "Angles, corners, stairwells, and turning clearance require an on-site check. A two-number comparison does not guarantee delivery fit.",
    rows: [["Illustrative clear opening", [30, 78]], ["Illustrative item front", [28, 76]]],
  },
  {
    slug: "shelf-clearance-and-product-fit", title: "Shelf Clearance and Product Fit",
    description: "Compare usable shelf opening width, height, and depth with a product's outside dimensions.",
    answer: "A shelf opening must exceed the item's matching outside dimensions on all required axes, with extra handling clearance.",
    purpose: "Measure the shelf's narrowest opening, not just its outer cabinet dimensions; include door hinges and back panels.",
    method: "Subtract the item's width, height, and depth from the shelf's usable measurements in the same units.",
    limit: "Positive numeric clearance may still be insufficient for cables, ventilation, fingers, or tilted insertion.",
    rows: [["Illustrative shelf opening", [24, 18, 16]], ["Illustrative product", [22, 16, 14]], ["Total clearance per axis", [2, 2, 2]]],
  },
  {
    slug: "desk-dimensions-in-cm-and-inches", title: "Desk Dimensions in CM and Inches",
    description: "Compare example desk width, depth, and height measurements before planning a workspace.",
    answer: "A desk top 48 × 24 inches is 121.92 × 60.96 cm; desk height is a separate third measurement.",
    purpose: "Check whether the top fits the room, then measure leg clearance and height for the user and equipment.",
    method: "Multiply each listed inch side by 2.54, including height if supplied.",
    limit: "These are comparison examples, not universal desk standards or ergonomic recommendations.",
    rows: [["Example 48 × 24 top", [48, 24]], ["Example compact top", [40, 20]], ["Example desk exterior", [48, 24, 29]]],
  },
  {
    slug: "envelope-sizes-in-cm-and-inches", title: "Envelope Sizes in CM and Inches",
    description: "Convert example envelope width and height without assuming the flap or usable interior matches the outside.",
    answer: "An envelope measuring 9 × 12 inches outside is 22.86 × 30.48 cm outside.",
    purpose: "Match the document to the envelope's usable opening; the exterior label alone is insufficient for a tight fit.",
    method: "Multiply outside width and height by 2.54, then separately measure the inside if clearance is critical.",
    limit: "Envelope names and formats vary by region and supplier. The rows are dimension examples, not a standardized product catalog.",
    rows: [["Example 9 × 12 outside", [9, 12]], ["Example small envelope", [4, 6]], ["Example larger envelope", [10, 13]]],
  },
  {
    slug: "luggage-exterior-dimensions-guide", title: "Luggage Exterior Dimensions Guide",
    description: "Measure luggage's full outside height, width, and depth including fixed wheels and handles.",
    answer: "A bag body and its full exterior can differ; use the full exterior when comparing a bag with a size limit.",
    purpose: "Set the bag upright and measure its widest, tallest, and deepest fixed points after packing.",
    method: "Convert each measured side in the same order. A 22 × 14 × 9 inch exterior is 55.88 × 35.56 × 22.86 cm.",
    limit: "Airline and carrier rules change. These example numbers are not a carry-on allowance or compliance guarantee.",
    rows: [["Illustrative full exterior", [22, 14, 9]], ["Illustrative bag body", [20, 13, 8]]],
  },
];

const screenSpecs: ScreenSpec[] = [
  {
    slug: "screen-area-from-width-and-height", title: "Screen Area from Width and Height",
    description: "Enter an active display's measured width and height to calculate visible area and diagonal.",
    answer: "A visible panel 40 × 30 cm has 1,200 cm² of rectangular area and a 50 cm diagonal.",
    purpose: "Use measured width and height when the diagonal label or aspect ratio is unknown. This is different from estimating area from a diagonal.",
    method: "Multiply the active width by active height: 40 × 30 = 1,200 cm². The diagonal is √(40²+30²) = 50 cm.",
    limit: "Measure only the lit rectangle. Rounded corners, bezels, stands, and casing are not included.",
    rows: [["24-inch 16:9 panel", 24, "16:9"], ["27-inch 16:9 panel", 27, "16:9"]],
    sidesRows: [["40 × 30 cm example", 40, 30], ["50 × 30 cm example", 50, 30]],
  },
  {
    slug: "screen-area-from-diagonal", title: "Screen Area from Diagonal and Aspect Ratio",
    description: "See how two panels with the same diagonal can have different widths, heights, and areas.",
    answer: "A diagonal cannot determine screen area without an aspect ratio; 16:9 and 21:9 panels of the same diagonal differ.",
    purpose: "Compare display surface when changing from a conventional monitor to a wider format.",
    method: "For ratio a:b, width = diagonal × a ÷ √(a²+b²), height = diagonal × b ÷ √(a²+b²), then area = width × height.",
    limit: "Aspect ratios describe shape, not the exact visible area of a specific manufacturer's panel.",
    rows: [["34-inch 16:9", 34, "16:9"], ["34-inch strict 21:9", 34, "21:9"]],
  },
  {
    slug: "monitor-size-comparison-chart", title: "Monitor Size Comparison Chart",
    description: "Compare approximate visible widths, heights, and areas for common monitor diagonals.",
    answer: "A 27-inch 16:9 monitor has a larger visible panel than a 24-inch 16:9 monitor, but its outside frame size varies by model.",
    purpose: "Use the chart to compare the panel itself before measuring the actual device for desk placement.",
    method: "Calculate width and height from each diagonal and aspect ratio, then multiply for panel area.",
    limit: "Monitor stands, bezels, and laptop lids are outside the panel calculation.",
    rows: [["24-inch 16:9", 24, "16:9"], ["27-inch 16:9", 27, "16:9"], ["32-inch 16:9", 32, "16:9"]],
    compare: true,
  },
  {
    slug: "tv-width-by-screen-size", title: "TV Width by Screen Size",
    description: "Estimate visible 16:9 television panel width from advertised diagonal inches.",
    answer: "A 55-inch 16:9 panel is about 121.76 cm wide; the complete TV is wider if it has a bezel.",
    purpose: "Use panel width for comparing picture size, but measure the product width before ordering a cabinet.",
    method: "For 16:9, width = diagonal × 16 ÷ √(16²+9²), then multiply inches by 2.54.",
    limit: "The chart assumes exact 16:9 active panels. Product bezels, legs, and mounting clearances require model specifications.",
    rows: [["55-inch TV panel", 55, "16:9"], ["43-inch TV panel", 43, "16:9"], ["65-inch TV panel", 65, "16:9"]],
  },
  {
    slug: "tv-height-by-screen-size", title: "TV Height by Screen Size",
    description: "Estimate the visible picture height of common 16:9 TV diagonals in centimeters.",
    answer: "A 55-inch 16:9 panel is about 68.49 cm high before adding any frame or stand.",
    purpose: "Compare picture height with wall space or a recessed opening; measure the whole TV separately.",
    method: "For a 16:9 panel, height = diagonal × 9 ÷ √(16²+9²), then convert inches to centimeters.",
    limit: "A TV's stand can add substantial height and does not follow from the screen diagonal.",
    rows: [["55-inch TV panel", 55, "16:9"], ["43-inch TV panel", 43, "16:9"], ["75-inch TV panel", 75, "16:9"]],
  },
  {
    slug: "monitor-width-by-screen-size", title: "Monitor Width by Screen Size",
    description: "Estimate visible monitor panel width for common 16:9 and 16:10 screen sizes.",
    answer: "Monitor width depends on both diagonal and aspect ratio; a 27-inch 16:9 panel is about 59.77 cm wide.",
    purpose: "Check active viewing width before using product exterior dimensions for a desk or arm.",
    method: "Use width = diagonal × ratio width ÷ ratio hypotenuse, then multiply by 2.54 for cm.",
    limit: "The estimate excludes bezels; a model with the same advertised diagonal may occupy more desk width.",
    rows: [["27-inch 16:9", 27, "16:9"], ["24-inch 16:9", 24, "16:9"], ["27-inch 16:10", 27, "16:10"]],
  },
  {
    slug: "monitor-height-by-screen-size", title: "Monitor Height by Screen Size",
    description: "Estimate active monitor picture height without confusing it with monitor stand height.",
    answer: "A 27-inch 16:9 panel is about 33.62 cm high; the stand and frame are additional.",
    purpose: "Compare visible vertical workspace across screen shapes with the same or different diagonals.",
    method: "Height = diagonal × ratio height ÷ √(ratio width²+ratio height²), converted to cm.",
    limit: "Physical device height cannot be calculated from active panel height alone.",
    rows: [["27-inch 16:9", 27, "16:9"], ["24-inch 16:9", 24, "16:9"], ["27-inch 16:10", 27, "16:10"]],
  },
  {
    slug: "dual-monitor-desk-space", title: "Dual Monitor Desk Space",
    description: "Estimate the combined visible width of two panels before allowing for bezels, stands, and a gap.",
    answer: "Two 27-inch 16:9 panels have about 119.54 cm of visible width in total; the desk needs more space than that.",
    purpose: "Add the two panel widths as a lower-bound planning value, then include model-specific frames and your preferred spacing.",
    method: "Calculate each panel's width from diagonal and ratio; combined panel width = width 1 + width 2.",
    limit: "A side-by-side sum is not a stand-footprint or desk-fit guarantee.",
    rows: [["27-inch 16:9 panel 1", 27, "16:9"], ["27-inch 16:9 panel 2", 27, "16:9"]],
    compare: true,
  },
  {
    slug: "screen-panel-vs-bezel-size", title: "Screen Panel vs Bezel Size",
    description: "Separate advertised visible diagonal from a monitor or TV's outside product width and height.",
    answer: "A 27-inch screen label refers to the visible panel diagonal, not to the total width including bezel.",
    purpose: "Use panel dimensions to compare image size; use manufacturer exterior dimensions when checking furniture fit.",
    method: "Calculate the active rectangle from diagonal and ratio, then compare it with separately measured outside dimensions.",
    limit: "No bezel width can be inferred from diagonal and aspect ratio. Do not treat the active rectangle as a product specification.",
    rows: [["27-inch 16:9 active panel", 27, "16:9"], ["32-inch 16:9 active panel", 32, "16:9"]],
  },
  {
    slug: "16-9-vs-16-10-screen-size", title: "16:9 vs 16:10 Screen Dimensions",
    description: "Compare panel width, height, and area at the same diagonal for 16:9 and 16:10.",
    answer: "At the same 16-inch diagonal, a 16:10 screen is taller and narrower than a 16:9 screen.",
    purpose: "Use the comparison when choosing between wider video space and more vertical workspace.",
    method: "Hold the diagonal fixed at 16 inches, solve width and height for each ratio, then compare areas.",
    limit: "The comparison says nothing about resolution, pixel density, or device body dimensions.",
    rows: [["16-inch 16:9", 16, "16:9"], ["16-inch 16:10", 16, "16:10"]],
    compare: true,
  },
  {
    slug: "16-9-vs-21-9-screen-size", title: "16:9 vs Strict 21:9 Screen Dimensions",
    description: "Compare equal-diagonal 16:9 and strict 21:9 active panels without confusing resolution labels.",
    answer: "At a fixed 34-inch diagonal, strict 21:9 produces a wider, shorter panel than 16:9.",
    purpose: "Use this to understand the shape trade-off before comparing specific monitor models.",
    method: "Hold 34 inches constant; calculate two rectangles using 16:9 and 21:9, then compare width, height, and area.",
    limit: "Many products advertised as 21:9 use a different exact pixel ratio, such as 3440:1440 = 43:18.",
    rows: [["34-inch 16:9", 34, "16:9"], ["34-inch strict 21:9", 34, "21:9"]],
    compare: true,
  },
  {
    slug: "24-vs-27-inch-monitor-dimensions", title: "24 vs 27 Inch Monitor Dimensions",
    description: "Compare 24-inch and 27-inch 16:9 visible panels by width, height, and area.",
    answer: "At 16:9, a 27-inch panel is 12.5% wider and taller than a 24-inch panel; its area is about 26.56% larger.",
    purpose: "Consider physical viewing surface separately from resolution when deciding whether to move up one common monitor size.",
    method: "Compare diagonals 27 ÷ 24 = 1.125; the same aspect ratio scales both sides by 1.125 and area by 1.125².",
    limit: "Bezel, stand, resolution, and viewing distance vary by model.",
    rows: [["24-inch 16:9", 24, "16:9"], ["27-inch 16:9", 27, "16:9"]],
    compare: true,
  },
  {
    slug: "27-vs-32-inch-monitor-dimensions", title: "27 vs 32 Inch Monitor Dimensions",
    description: "Compare 27-inch and 32-inch 16:9 panel dimensions and visible surface area.",
    answer: "At 16:9, a 32-inch panel is about 18.52% wider and taller than a 27-inch panel.",
    purpose: "Check whether the larger active panel is useful before measuring the complete monitor for your desk.",
    method: "At the same ratio, side scale = 32 ÷ 27; area scale = (32 ÷ 27)².",
    limit: "A larger panel does not necessarily have sharper text; pixel density depends on resolution too.",
    rows: [["27-inch 16:9", 27, "16:9"], ["32-inch 16:9", 32, "16:9"]],
    compare: true,
  },
  {
    slug: "32-vs-34-inch-ultrawide-dimensions", title: "32 Inch vs 34 Inch Ultrawide Dimensions",
    description: "Compare a 32-inch 16:9 panel with a 34-inch strict 21:9 panel at their actual shapes.",
    answer: "A 34-inch 21:9 panel is wider but shorter than a 32-inch 16:9 panel; diagonal size alone hides this difference.",
    purpose: "Use width, height, and visible area together instead of treating a two-inch diagonal difference as a simple upgrade.",
    method: "Compute both rectangles from their separate diagonals and ratios before subtracting corresponding dimensions.",
    limit: "The strict 21:9 geometry is an estimate; actual ultrawide resolutions and bezels may differ.",
    rows: [["32-inch 16:9", 32, "16:9"], ["34-inch strict 21:9", 34, "21:9"]],
    compare: true,
  },
  {
    slug: "portrait-monitor-dimensions", title: "Portrait Monitor Width and Height",
    description: "Work out upright panel width and height after rotating a landscape monitor by 90 degrees.",
    answer: "Rotating a 24-inch 16:9 panel swaps its visible width and height; the diagonal and area do not change.",
    purpose: "Use landscape height as portrait width when planning a vertical display arrangement.",
    method: "Calculate landscape width and height from diagonal and ratio, then exchange the two dimensions for portrait orientation.",
    limit: "A stand or mount must support rotation; portrait physical clearance also depends on the frame and cables.",
    rows: [["24-inch 16:9 before rotation", 24, "16:9"], ["27-inch 16:9 before rotation", 27, "16:9"]],
    portrait: true,
  },
  {
    slug: "screen-resolution-aspect-ratio-chart", title: "Screen Resolution Aspect Ratio Chart",
    description: "Reduce common pixel dimensions to exact width:height ratios before choosing display geometry.",
    answer: "1920 × 1080 reduces to 16:9; 2560 × 1600 reduces to 8:5, commonly called 16:10.",
    purpose: "Pixel resolution defines shape and density, not physical inches. Pair it with a diagonal for panel dimensions.",
    method: "Divide pixel width and height by their greatest common divisor to get the exact reduced ratio.",
    limit: "A marketing format name can differ from the strict ratio of the pixel grid.",
    rows: [["1920 × 1080, 16:9", 24, "16:9"], ["2560 × 1600, 16:10 format", 16, "16:10"]],
    resolutionRows: [["Full HD", 1920, 1080], ["16:10 example", 2560, 1600], ["Ultrawide example", 3440, 1440]],
  },
  {
    slug: "3440x1440-aspect-ratio-explained", title: "3440 × 1440 Aspect Ratio Explained",
    description: "See why 3440 × 1440 is exactly 43:18 even when a monitor is marketed as 21:9.",
    answer: "3440:1440 reduces to 43:18 (about 2.389:1), not exactly 21:9 (about 2.333:1).",
    purpose: "Use 43:18 for pixel-accurate geometry; use 21:9 only as a familiar product-category label.",
    method: "Greatest common divisor of 3440 and 1440 is 80, so 3440 ÷ 80 = 43 and 1440 ÷ 80 = 18.",
    limit: "A 34-inch 21:9 physical estimate will differ slightly from one computed with the panel's exact pixel aspect ratio.",
    rows: [["34-inch exact 43:18 shape", 34, "43:18"], ["34-inch strict 21:9 estimate", 34, "21:9"]],
    resolutionRows: [["3440 × 1440", 3440, 1440], ["2560 × 1080", 2560, 1080]],
  },
  {
    slug: "2560x1600-aspect-ratio-explained", title: "2560 × 1600 Aspect Ratio Explained",
    description: "Reduce the 2560 × 1600 pixel ratio and distinguish its simplest form from the 16:10 display name.",
    answer: "2560:1600 reduces to 8:5; multiplying both parts by two gives the equivalent 16:10 name.",
    purpose: "Use the same geometry whether a specification says 8:5 or 16:10, while keeping resolution separate from size.",
    method: "Divide both pixel counts by 320 to get 8:5; 8:5 and 16:10 both equal 1.6.",
    limit: "Resolution alone cannot tell you the screen's width or height in centimeters; the physical diagonal is also required.",
    rows: [["16-inch 16:10 example", 16, "16:10"], ["16-inch 16:9 comparison", 16, "16:9"]],
    resolutionRows: [["2560 × 1600", 2560, 1600], ["1920 × 1200", 1920, 1200]],
  },
  {
    slug: "laptop-screen-vs-laptop-body-size", title: "Laptop Screen vs Laptop Body Size",
    description: "Separate laptop display diagonal from the full lid and chassis dimensions used for bags and sleeves.",
    answer: "A 16-inch display label measures the active screen diagonal, not the laptop body's outside width.",
    purpose: "Use screen geometry to compare viewing space; use the manufacturer's chassis width, depth, and thickness for fit.",
    method: "A 16-inch 16:10 panel's active rectangle can be calculated, but it does not determine bezel or hinge dimensions.",
    limit: "Never buy a sleeve from diagonal size alone. Chassis and protective padding are model-specific.",
    rows: [["16-inch 16:10 active panel", 16, "16:10"], ["15.6-inch 16:9 active panel", 15.6, "16:9"]],
  },
  {
    slug: "projector-screen-width-and-height", title: "Projector Screen Width and Height",
    description: "Estimate projected image width and height from diagonal and chosen aspect ratio.",
    answer: "A 100-inch 16:9 projected image is about 221.38 cm wide and 124.53 cm high.",
    purpose: "Calculate the intended visible image before checking a screen frame or wall opening.",
    method: "Use diagonal and ratio to find the active rectangle, then convert each side to centimeters.",
    limit: "Projector throw distance, overscan, frame border, and installation height require separate model-specific planning.",
    rows: [["100-inch 16:9 image", 100, "16:9"], ["120-inch 16:9 image", 120, "16:9"]],
  },
];

const fractionSpecs: FractionSpec[] = [
  { slug: "millimeters-to-nearest-sixteenth-inch", title: "Millimeters to the Nearest 1/16 Inch",
    description: "Convert millimeter measurements to inches and round to a readable sixteenth-inch ruler mark.",
    answer: "25 mm is about 0.9843 inches, which rounds to 1 inch at the nearest 1/16-inch mark.",
    purpose: "Compare a metric part with a tape marked in sixteenths without treating the rounded mark as exact.",
    method: "Divide millimeters by 25.4, multiply decimal inches by 16, round to the nearest integer, then divide by 16.",
    limit: "A rounded mark can differ by up to 1/32 inch from the true size; check required tolerances.",
    rows: [["1-inch mark", 1], ["1/16-inch mark", 1 / 16], ["1/2-inch mark", 1 / 2]] },
  { slug: "centimeters-to-nearest-sixteenth-inch", title: "Centimeters to the Nearest 1/16 Inch",
    description: "Read centimeter lengths against a sixteenth-inch ruler while keeping exact and rounded values distinct.",
    answer: "10 cm is about 3.937 inches, which rounds to 3 15/16 inches at the nearest 1/16 inch.",
    purpose: "Translate a centimeter measurement for a tape check without silently replacing the original metric value.",
    method: "Divide centimeters by 2.54, then round the result to the closest multiple of 1/16 inch.",
    limit: "Nearest-mark rounding is not suitable when a part requires a tighter mechanical tolerance.",
    rows: [["3 15/16-inch mark", 3 + 15 / 16], ["1/16-inch mark", 1 / 16], ["4-inch mark", 4]] },
  { slug: "inches-to-nearest-millimeter-chart", title: "Inches to Nearest Millimeter Chart",
    description: "Compare exact inch-to-millimeter values with whole-millimeter readings for rough measurement.",
    answer: "1 inch equals exactly 25.4 mm, which becomes 25 mm only when rounded to a whole millimeter.",
    purpose: "Use exact millimeters in specifications and whole-millimeter values only when the task permits rounding.",
    method: "Multiply inches by exactly 25.4; round the final result to the nearest whole millimeter if needed.",
    limit: "Rounding 25.4 mm to 25 mm loses 0.4 mm, which may matter for fitted parts.",
    rows: [["1 inch", 1], ["1/4 inch", 0.25], ["1/2 inch", 0.5]] },
  { slug: "ruler-sixteenth-inch-markings", title: "1/16 Inch Ruler Markings",
    description: "Identify the sixteen equal intervals between consecutive whole-inch marks on a ruler.",
    answer: "Each 1/16-inch step equals exactly 0.0625 inches, 0.15875 cm, or 1.5875 mm.",
    purpose: "Count small marks from the last whole inch; reduce the fraction when possible, such as 8/16 = 1/2.",
    method: "For mark n, length = n ÷ 16 inches; multiply the decimal by 25.4 for millimeters.",
    limit: "Not every ruler has sixteenth-inch ticks; inspect the actual subdivisions before counting.",
    rows: [["First 1/16 mark", 1 / 16], ["Quarter-inch mark, 4/16", 4 / 16], ["Half-inch mark, 8/16", 8 / 16]] },
  { slug: "ruler-thirty-second-inch-markings", title: "1/32 Inch Ruler Markings",
    description: "Read thirty-second-inch subdivisions and compare them with sixteenth-inch marks.",
    answer: "1/32 inch equals exactly 0.03125 inches or 0.79375 mm.",
    purpose: "Use thirty-second marks when the ruler provides them and the task needs a finer reading.",
    method: "Count 1/32 marks from the whole-inch line; multiply the fraction by 25.4 for millimeters.",
    limit: "A finer printed scale does not remove line-thickness or parallax errors; check the instrument's accuracy.",
    rows: [["1/32 inch", 1 / 32], ["1/16 inch, 2/32", 2 / 32], ["3/32 inch", 3 / 32]] },
  { slug: "ruler-eighth-inch-markings", title: "1/8 Inch Ruler Markings",
    description: "Read the eight larger fractional marks across one inch and translate them to metric units.",
    answer: "Each 1/8-inch increment is 0.125 inches, 0.3175 cm, or 3.175 mm.",
    purpose: "Use eighths for approximate object sizes when finer sixteenth marks are unnecessary.",
    method: "Count n eighths after the whole-inch line; n × 0.125 gives decimal inches.",
    limit: "An 1/8-inch reading can be off by much more than a millimeter; use a finer scale for tight fit.",
    rows: [["1/8 inch", 1 / 8], ["3/8 inch", 3 / 8], ["5/8 inch", 5 / 8]] },
  { slug: "adding-fractional-inches", title: "How to Add Fractional Inches",
    description: "Add ruler measurements with common denominators, simplify, and convert the result to metric units.",
    answer: "1/2 inch + 1/4 inch = 3/4 inch = 19.05 mm.",
    purpose: "Combine cut lengths while retaining exact fractional values before rounding to a ruler mark.",
    method: "Rewrite 1/2 as 2/4, add 2/4 + 1/4 = 3/4, then multiply 0.75 inch by 25.4.",
    limit: "The arithmetic is exact only if the input measurements are exact; tape readings still have uncertainty.",
    rows: [["First length, 1/2 inch", 1 / 2], ["Second length, 1/4 inch", 1 / 4], ["Sum, 3/4 inch", 3 / 4]] },
  { slug: "subtracting-fractional-inches", title: "How to Subtract Fractional Inches",
    description: "Subtract fractional ruler lengths using a common denominator and check the remainder in mm.",
    answer: "1 inch − 3/8 inch = 5/8 inch = 15.875 mm.",
    purpose: "Find the remaining width after an opening, margin, or material allowance is removed.",
    method: "Rewrite 1 as 8/8, subtract 3/8, then convert 5/8 inch with × 25.4.",
    limit: "Allow for cutting loss or edge thickness separately; the arithmetic result is not a fit guarantee.",
    rows: [["Starting length, 1 inch", 1], ["Removed length, 3/8 inch", 3 / 8], ["Remainder, 5/8 inch", 5 / 8]] },
  { slug: "measuring-to-nearest-sixteenth-inch", title: "Measure to the Nearest 1/16 Inch",
    description: "Find the closest sixteenth-inch tick and report a length without false precision.",
    answer: "A reading close to 1.19 inches rounds to 1 3/16 inches on a ruler marked in sixteenths.",
    purpose: "Use the smallest visible tick consistently, starting the item at a known zero line.",
    method: "Multiply the decimal part by 16, round to the nearest mark, then reduce the fraction if possible.",
    limit: "Do not claim a sixteenth-inch measurement is accurate to 0.001 inch because a calculator shows decimals.",
    rows: [["1 1/8 inches", 1.125], ["1 3/16 inches", 1.1875], ["1 1/4 inches", 1.25]] },
  { slug: "inch-fractions-for-product-dimensions", title: "Inch Fractions in Product Dimensions",
    description: "Interpret fractional width, depth, and height in product listings before converting each side.",
    answer: "A product 10 1/2 × 5 3/4 inches measures 26.67 × 14.605 cm before rounding.",
    purpose: "Keep whole numbers and fractions together on each side of a 2D or 3D specification.",
    method: "Convert 10 1/2 to 10.5 inches and 5 3/4 to 5.75 inches, then multiply each by 2.54.",
    limit: "If a listing rounded its source dimensions, extra post-conversion decimals do not make it more precise.",
    rows: [["10 1/2-inch side", 10.5], ["5 3/4-inch side", 5.75], ["3 1/8-inch side", 3.125]] },
];

const initialFocusedGuideSpecs: readonly FocusedGuideSpec[] = [
  ...dimensionSpecs.map((spec) => ({ ...spec, group: "dimensions" as const })),
  ...screenSpecs.map((spec) => ({ ...spec, group: "screens" as const })),
  ...fractionSpecs.map((spec) => ({ ...spec, group: "fractions" as const })),
];
export const dimensionAndScreenExpansionSpecs: readonly FocusedGuideSpec[] = [
  ...dimensionCombinationSpecs.map((spec) => ({ ...spec, group: "dimensions" as const })),
  ...screenSizeSpecs.map((spec) => ({ ...spec, group: "screens" as const })),
];
export const dimensionAndScreenExpansionSlugs = new Set(dimensionAndScreenExpansionSpecs.map(({ slug }) => slug));
export const focusedGuideSpecs = [...initialFocusedGuideSpecs, ...dimensionAndScreenExpansionSpecs];

export const focusedGuideGroups = {
  dimensions: [...dimensionSpecs, ...dimensionCombinationSpecs].map(({ slug, title }) => ({ slug, title })),
  screens: [...screenSpecs, ...screenSizeSpecs].map(({ slug, title }) => ({ slug, title })),
  fractions: fractionSpecs.map(({ slug, title }) => ({ slug, title })),
} as const;

if (initialFocusedGuideSpecs.length !== 50 || new Set(focusedGuideSpecs.map(({ slug }) => slug)).size !== focusedGuideSpecs.length) {
  throw new Error("Focused guides must keep the initial 50 routes and use distinct slugs.");
}

function dimensionTable(rows: readonly DimensionRow[]) {
  return <div className="data-table-wrap"><table>
    <caption>Example measurements. Match each axis before comparing or converting.</caption>
    <thead><tr><th scope="col">Example</th><th scope="col">Inches</th><th scope="col">Centimeters</th></tr></thead>
    <tbody>{rows.map(([label, values]) => <tr key={label}><th scope="row">{label}</th><td>{values.map(formatNumber).join(" × ")} in</td><td>{values.map((value) => formatNumber(value * 2.54)).join(" × ")} cm</td></tr>)}</tbody>
  </table></div>;
}

function screenTable(rows: readonly ScreenRow[], portrait = false) {
  return <div className="data-table-wrap"><table>
    <caption>{portrait ? "Portrait dimensions after a 90° rotation; exterior frame and stand excluded." : "Approximate active panel dimensions; exterior frame and stand excluded."}</caption>
    <thead><tr><th scope="col">Panel</th><th scope="col">Visible width</th><th scope="col">Visible height</th><th scope="col">Visible area</th></tr></thead>
    <tbody>{rows.map(([label, diagonal, ratio]) => {
      const [width, height] = ratio.split(":").map(Number);
      const size = calculateScreenDimensions(diagonal, width, height);
      if (!size) throw new Error("Invalid focused screen reference");
      return <tr key={label}><th scope="row">{label}</th><td>{formatNumber(portrait ? size.heightCm : size.widthCm)} cm</td><td>{formatNumber(portrait ? size.widthCm : size.heightCm)} cm</td><td>{formatNumber(size.widthCm * size.heightCm)} cm²</td></tr>;
    })}</tbody>
  </table></div>;
}

function resolutionTable(rows: readonly (readonly [string, number, number])[]) {
  return <div className="data-table-wrap"><table>
    <caption>Exact reduced ratio from the pixel counts; names are shown only where equivalent.</caption>
    <thead><tr><th scope="col">Resolution</th><th scope="col">Pixels</th><th scope="col">Reduced ratio</th><th scope="col">Common name</th></tr></thead>
    <tbody>{rows.map(([label, width, height]) => {
      const ratio = calculateAspectRatio(width, height);
      if (!ratio) throw new Error("Invalid reference resolution");
      return <tr key={label}><th scope="row">{label}</th><td>{width} × {height}</td><td>{ratio.exact}</td><td>{ratio.common ?? "No exact preset"}</td></tr>;
    })}</tbody>
  </table></div>;
}

function sidesAreaTable(rows: readonly (readonly [string, number, number])[]) {
  return <div className="data-table-wrap"><table>
    <caption>Measured active rectangle only; no frame or stand.</caption>
    <thead><tr><th scope="col">Example</th><th scope="col">Width</th><th scope="col">Height</th><th scope="col">Visible area</th><th scope="col">Diagonal</th></tr></thead>
    <tbody>{rows.map(([label, width, height]) => <tr key={label}><th scope="row">{label}</th><td>{width} cm</td><td>{height} cm</td><td>{formatNumber(width * height)} cm²</td><td>{formatNumber(Math.hypot(width, height))} cm</td></tr>)}</tbody>
  </table></div>;
}

function fractionTable(rows: readonly FractionRow[]) {
  return <div className="data-table-wrap"><table>
    <caption>Inch-to-metric arithmetic; displayed decimals may be rounded.</caption>
    <thead><tr><th scope="col">Reading</th><th scope="col">Decimal inches</th><th scope="col">Centimeters</th><th scope="col">Millimeters</th></tr></thead>
    <tbody>{rows.map(([label, inches]) => <tr key={label}><th scope="row">{label}</th><td>{formatNumber(inches)} in</td><td>{formatNumber(inches * 2.54)} cm</td><td>{formatNumber(inches * 25.4)} mm</td></tr>)}</tbody>
  </table></div>;
}

type FocusedGuideLike = {
  title: string;
  description: string;
  initialValue?: number;
  tool?: { defaultFrom: "in"; defaultTo: "cm"; defaultValue: number; presets: number[] };
  screenTool?: "dimensions" | "comparison" | "aspect-ratio" | "area-from-sides";
  dimensionTool?: { values: readonly number[] };
  screenDefaults?: { diagonal: number; ratio: AspectRatio | "custom"; customWidth?: number; customHeight?: number };
  comparisonDefaults?: readonly [{ diagonal: string; ratio: AspectRatio }, { diagonal: string; ratio: AspectRatio }];
  resolutionDefaults?: { width: number; height: number };
  sections: { heading: string; body: ReactNode }[];
};

function buildEntry(spec: FocusedGuideSpec): [string, FocusedGuideLike, string, { question: string; answer: string }[]] {
  const table = spec.group === "dimensions" ? dimensionTable(spec.rows) : spec.group === "screens" ? (spec.sidesRows ? sidesAreaTable(spec.sidesRows) : spec.resolutionRows ? resolutionTable(spec.resolutionRows) : screenTable(spec.rows, spec.portrait)) : fractionTable(spec.rows);
  const guide: FocusedGuideLike = {
    title: spec.title,
    description: spec.description,
    sections: [
      { heading: "What to measure", body: <p>{spec.purpose}</p> },
      { heading: "Calculation and example", body: <p>{spec.method}</p> },
      { heading: "Reference measurements", body: table },
      { heading: "Limits and practical checks", body: <p>{spec.limit}</p> },
    ],
  };
  if (spec.group === "dimensions") guide.dimensionTool = { values: spec.rows[0][1] };
  if (spec.group === "screens") {
    guide.screenTool = spec.sidesRows ? "area-from-sides" : spec.resolutionRows ? "aspect-ratio" : spec.compare ? "comparison" : "dimensions";
    if (spec.resolutionRows) guide.resolutionDefaults = { width: spec.resolutionRows[0][1], height: spec.resolutionRows[0][2] };
    const firstRatio = spec.rows[0][2];
    guide.screenDefaults = firstRatio === "43:18"
      ? { diagonal: spec.rows[0][1], ratio: "custom", customWidth: 43, customHeight: 18 }
      : { diagonal: spec.rows[0][1], ratio: firstRatio };
    if (spec.compare && spec.rows.length >= 2) {
      if (![spec.rows[0][2], spec.rows[1][2]].every((ratio) => aspectRatios.some((item) => item.value === ratio))) throw new Error("Comparison requires supported ratios");
      guide.comparisonDefaults = [
        { diagonal: String(spec.rows[0][1]), ratio: spec.rows[0][2] as AspectRatio },
        { diagonal: String(spec.rows[1][1]), ratio: spec.rows[1][2] as AspectRatio },
      ];
    }
  }
  if (spec.group === "fractions") guide.tool = { defaultFrom: "in", defaultTo: "cm", defaultValue: spec.rows[0][1], presets: spec.rows.map((row) => row[1]) };
  return [spec.slug, guide, spec.answer, []];
}

export const focusedGuideEntries = focusedGuideSpecs.map(buildEntry);
