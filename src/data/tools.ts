export type ToolSEOExample = {
  input: string;
  result: string;
  note: string;
};

export type ToolSEOTableRow = {
  label: string;
  result: string;
  note?: string;
};

export type ToolSEORelatedTool = {
  href: string;
  label: string;
  reason: string;
};

export type ToolSEOFAQ = {
  question: string;
  answer: string;
};

export type ToolSEOContentConfig = {
  name: string;
  keyword: string;
  type: "converter" | "calculator" | "chart" | "reference";
  audience: string[];
  userTasks: string[];
  introduction: string;
  howItWorks: string[];
  formula: string;
  formulaExplanation: string;
  examples: ToolSEOExample[];
  tableTitle: string;
  tableRows: ToolSEOTableRow[];
  useCases: string[];
  tips: string[];
  relatedTools: ToolSEORelatedTool[];
  faq: ToolSEOFAQ[];
};

export const toolSeoContent = {
  home: {
    name: "Inch to CM Converter",
    keyword: "inch to cm converter",
    type: "converter",
    audience: [
      "Shoppers comparing product dimensions from inch-based listings with metric measurements.",
      "Students, teachers, makers, and DIY users who need a quick length conversion with the formula visible.",
      "People checking screen, furniture, packaging, ruler, craft, or everyday object sizes.",
    ],
    userTasks: [
      "Enter an inch value and get the centimeter result without reading a long article first.",
      "Check the exact formula and calculation step for trust or homework use.",
      "Move to a more specific tool when the task is height, screen size, millimeters, or reverse cm-to-inch conversion.",
    ],
    introduction:
      "The Inch to CM Converter is the main length conversion tool on Inch is CM. It is built for people who need a quick centimeter result from an inch value, but it also supports millimeters, meters, kilometers, feet, yards, and miles for nearby length tasks. The default setting stays focused on inches to centimeters because that is the site's primary search intent.",
    howItWorks: [
      "Choose the source unit and target unit. The homepage starts with Inch (in) to Centimeter (cm).",
      "Enter the length value. The result updates in the output field and can also be copied.",
      "When inches are involved, the tool also shows decimal inches, feet plus inches, and a nearest fractional-inch reference.",
    ],
    formula: "centimeters = inches × 2.54",
    formulaExplanation:
      "One international inch is exactly 2.54 centimeters. The converter uses defined length relationships through meters, then formats the result for readability.",
    examples: [
      { input: "1 inch", result: "2.54 cm", note: "Useful for understanding the base conversion." },
      { input: "10 inches", result: "25.4 cm", note: "A common search value and practical product-size reference." },
      { input: "24 inches", result: "60.96 cm", note: "Exactly 2 feet, often used for monitors, shelves, and product dimensions." },
    ],
    tableTitle: "Common inch to centimeter results",
    tableRows: [
      { label: "1 inch", result: "2.54 cm" },
      { label: "5 inches", result: "12.7 cm" },
      { label: "10 inches", result: "25.4 cm" },
      { label: "12 inches", result: "30.48 cm", note: "Exactly 1 foot" },
      { label: "24 inches", result: "60.96 cm", note: "Exactly 2 feet" },
    ],
    useCases: [
      "Checking product dimensions from US listings before comparing metric specifications.",
      "Converting ruler, craft, sewing, DIY, or classroom measurements.",
      "Understanding screen diagonals, small furniture dimensions, packaging, and shipping sizes.",
    ],
    tips: [
      "Check whether the original measurement is a length, diagonal, width, depth, or height before converting.",
      "Keep more decimals for technical work, then round only the final displayed result.",
      "Use the height converter for feet-and-inches height values instead of typing height notation into a simple inch field.",
    ],
    relatedTools: [
      { href: "/inches-to-cm", label: "Inches to CM Converter", reason: "Focused inch-to-centimeter conversion page." },
      { href: "/cm-to-inches", label: "CM to Inches Converter", reason: "Reverse metric-to-inch conversion." },
      { href: "/height-converter", label: "Height Converter", reason: "Feet and inches to centimeters for height." },
      { href: "/screen-size-converter", label: "Screen Size Converter", reason: "Convert display diagonals and estimate width and height." },
    ],
    faq: [
      { question: "How many cm is 1 inch?", answer: "One inch is exactly 2.54 centimeters." },
      { question: "How do I convert inches to cm?", answer: "Multiply the inch value by 2.54 to get centimeters." },
      { question: "Can this tool convert more than inches and centimeters?", answer: "Yes. It also supports mm, m, km, ft, yd, and mi while keeping inch to cm as the default conversion." },
      { question: "Is 10 inches exactly 25.4 cm?", answer: "Yes. Because the inch-to-centimeter factor is exact, 10 inches equals exactly 25.4 centimeters." },
      { question: "Should I round inch to cm results?", answer: "Round only as much as your task allows. Product specs and technical work may need more precision than casual size comparisons." },
    ],
  },
  inchesToCm: {
    name: "Inches to CM Converter",
    keyword: "inches to cm converter",
    type: "converter",
    audience: [
      "Users with an inch measurement from a product page, ruler, screen listing, drawing, or package label.",
      "Metric-system users who need to understand US or imperial dimensions.",
      "DIY, craft, classroom, and shopping users who want a fast answer plus nearby examples.",
    ],
    userTasks: [
      "Convert one whole or decimal inch value into centimeters.",
      "Verify the 2.54 formula and see whether the result should be rounded.",
      "Compare common inch values or open an exact conversion page for a specific measurement.",
    ],
    introduction:
      "The Inches to CM Converter helps users turn whole or decimal inch measurements into centimeters with a clear formula and exact conversion factor. It is useful when a product, ruler, screen, box, shelf, or drawing is listed in inches but the user needs a metric value.",
    howItWorks: [
      "Enter the inch value in the converter field.",
      "The page returns the centimeter result using the exact 2.54 conversion factor.",
      "Use the examples, chart links, and exact-value pages when you need to compare common sizes quickly.",
    ],
    formula: "centimeters = inches × 2.54",
    formulaExplanation:
      "The international inch is defined as exactly 2.54 centimeters. That means the calculation itself is exact; any rounding happens only when the result is displayed.",
    examples: [
      { input: "0.5 inch", result: "1.27 cm", note: "Common for small product and craft measurements." },
      { input: "12 inches", result: "30.48 cm", note: "Exactly 1 foot." },
      { input: "15.6 inches", result: "39.624 cm", note: "A common laptop screen diagonal." },
    ],
    tableTitle: "Common inches to cm conversions",
    tableRows: [
      { label: "1 inch", result: "2.54 cm" },
      { label: "6 inches", result: "15.24 cm" },
      { label: "10 inches", result: "25.4 cm" },
      { label: "24 inches", result: "60.96 cm" },
      { label: "36 inches", result: "91.44 cm", note: "Exactly 3 feet" },
    ],
    useCases: [
      "Product dimensions and packaging sizes.",
      "Screen diagonals for laptops, monitors, tablets, and TVs.",
      "DIY, woodworking, craft, sewing, and classroom measurements.",
    ],
    tips: [
      "Use decimal inches when the source measurement includes halves or tenths.",
      "For height values, use the dedicated height converter so feet and inches are handled separately.",
      "If you are comparing fit, convert all dimensions, not just the longest side.",
    ],
    relatedTools: [
      { href: "/inch-to-cm-chart", label: "Inch to CM Chart", reason: "Browse common inch values from 1 to 100." },
      { href: "/cm-to-inches", label: "CM to Inches Converter", reason: "Reverse the conversion." },
      { href: "/how-to-convert-inches-to-cm", label: "Formula Guide", reason: "Learn the exact method and examples." },
      { href: "/24-inches-in-cm", label: "24 Inches in CM", reason: "Current high-signal exact inch page." },
    ],
    faq: [
      { question: "What is the formula for inches to cm?", answer: "Multiply inches by 2.54 to get centimeters." },
      { question: "Can I convert decimal inches to centimeters?", answer: "Yes. Decimal values such as 0.5, 13.3, and 15.6 inches can be converted." },
      { question: "How many cm is 12 inches?", answer: "12 inches equals exactly 30.48 cm." },
      { question: "Is the inches to cm conversion exact?", answer: "Yes. One inch is exactly 2.54 centimeters." },
      { question: "What page should I use for feet and inches height?", answer: "Use the height converter because it separates feet from remaining inches before converting to centimeters." },
    ],
  },
  cmToInches: {
    name: "CM to Inches Converter",
    keyword: "cm to inches converter",
    type: "converter",
    audience: [
      "US or imperial-unit users reading metric product dimensions.",
      "Shoppers, students, and makers comparing centimeter values with inch-based tools or materials.",
      "People who need a readable decimal-inch result from a metric measurement.",
    ],
    userTasks: [
      "Convert centimeters into inches and understand why the result is often a decimal.",
      "Check exact reverse values such as 25.4 cm equals 10 inches.",
      "Use related tools when the task becomes height, charts, or inch-to-cm conversion.",
    ],
    introduction:
      "The CM to Inches Converter changes centimeter measurements into inches for users who need imperial dimensions from a metric value. It is helpful for product dimensions, furniture sizes, screen measurements, school work, and any situation where a centimeter value must be understood in inches.",
    howItWorks: [
      "Enter the centimeter value.",
      "The converter divides the value by 2.54 and displays the inch result.",
      "Because many centimeter values do not divide evenly into inches, the result is usually shown as a decimal.",
    ],
    formula: "inches = centimeters ÷ 2.54",
    formulaExplanation:
      "Since 1 inch equals exactly 2.54 centimeters, dividing centimeters by 2.54 gives the matching inch value. Rounded display values should not be treated as a new exact definition.",
    examples: [
      { input: "10 cm", result: "3.937 inches", note: "Useful for compact product dimensions." },
      { input: "25.4 cm", result: "10 inches", note: "Exact reverse of 10 inches." },
      { input: "100 cm", result: "39.3701 inches", note: "Exactly 1 meter converted to inches." },
    ],
    tableTitle: "Common cm to inches conversions",
    tableRows: [
      { label: "1 cm", result: "0.3937 inches" },
      { label: "10 cm", result: "3.937 inches" },
      { label: "25.4 cm", result: "10 inches", note: "Exact" },
      { label: "50 cm", result: "19.685 inches" },
      { label: "100 cm", result: "39.3701 inches" },
    ],
    useCases: [
      "Reading metric product specs in inches.",
      "Comparing furniture, packaging, and storage dimensions.",
      "Converting school or international measurement examples into imperial units.",
    ],
    tips: [
      "Expect decimal inches for most centimeter values.",
      "Use the nearest fraction only when a task can tolerate approximation.",
      "For human height, convert centimeters with a height-specific tool if you need feet plus inches formatting.",
    ],
    relatedTools: [
      { href: "/cm-to-inch-chart", label: "CM to Inch Chart", reason: "Scan common centimeter values." },
      { href: "/inches-to-cm", label: "Inches to CM Converter", reason: "Reverse conversion for inch values." },
      { href: "/inch-vs-cm", label: "Inch vs CM", reason: "Understand the difference between both units." },
      { href: "/25-4-cm-in-inches", label: "25.4 CM in Inches", reason: "Exact reverse of 10 inches." },
    ],
    faq: [
      { question: "What is the formula for cm to inches?", answer: "Divide centimeters by 2.54 to get inches." },
      { question: "How many inches is 10 cm?", answer: "10 cm is approximately 3.937 inches." },
      { question: "Why is the cm to inches result often rounded?", answer: "Most centimeter values produce long decimal inch results, so the display is rounded for readability." },
      { question: "Is 25.4 cm exactly 10 inches?", answer: "Yes. 25.4 centimeters equals exactly 10 inches." },
      { question: "Can I use this for product dimensions?", answer: "Yes. Convert each product dimension separately and keep enough decimal places for the fit you need." },
    ],
  },
  feetToCm: {
    name: "Feet to CM Converter",
    keyword: "feet to cm converter",
    type: "converter",
    audience: [
      "People converting personal height from feet and inches into centimeters.",
      "Users filling out international forms, sports profiles, health records, or travel documents.",
      "Anyone who needs to avoid confusing feet-and-inches notation with decimal feet.",
    ],
    userTasks: [
      "Enter feet and optional remaining inches, then get centimeters.",
      "Understand the total-inches step behind the height calculation.",
      "Open nearby height pages or the height chart when comparing several heights.",
    ],
    introduction:
      "The Feet to CM Converter converts feet, and optional remaining inches, into centimeters. It is especially useful for height records, forms, sports profiles, travel documents, and international measurement comparisons where centimeters are expected.",
    howItWorks: [
      "Enter the number of feet and, if needed, the remaining inches.",
      "The tool converts feet to total inches, adds any extra inches, then multiplies by 2.54.",
      "The result is shown in centimeters with a clear calculation path.",
    ],
    formula: "centimeters = (feet × 12 + inches) × 2.54",
    formulaExplanation:
      "One foot contains exactly 12 inches, and one inch equals exactly 2.54 centimeters. Converting to total inches first avoids confusion.",
    examples: [
      { input: "5 feet", result: "152.4 cm", note: "A feet-only conversion." },
      { input: "5 feet 8 inches", result: "172.72 cm", note: "Common height example." },
      { input: "6 feet", result: "182.88 cm", note: "Exact 72-inch conversion." },
    ],
    tableTitle: "Common feet and inches to cm results",
    tableRows: [
      { label: "4 feet 10 inches", result: "147.32 cm" },
      { label: "5 feet 5 inches", result: "165.1 cm" },
      { label: "5 feet 8 inches", result: "172.72 cm" },
      { label: "6 feet", result: "182.88 cm" },
      { label: "6 feet 2 inches", result: "187.96 cm" },
    ],
    useCases: [
      "Personal height conversion for metric forms.",
      "Sports profiles, fitness records, and international bios.",
      "School, travel, and identification documents that request centimeters.",
    ],
    tips: [
      "Do not enter 5.8 feet when you mean 5 feet 8 inches; those are different values.",
      "Keep feet and remaining inches in separate fields.",
      "Use total inches when checking the calculation manually.",
    ],
    relatedTools: [
      { href: "/height-converter", label: "Height Converter", reason: "Dedicated height tool with common height links." },
      { href: "/height-chart", label: "Height Chart", reason: "Browse heights from 4 feet to 7 feet." },
      { href: "/6-feet-in-cm", label: "6 Feet in CM", reason: "Exact height conversion page." },
      { href: "/inches-to-cm", label: "Inches to CM Converter", reason: "Convert total inches directly." },
    ],
    faq: [
      { question: "How many centimeters are in one foot?", answer: "One foot equals exactly 30.48 centimeters." },
      { question: "How do I convert feet and inches to cm?", answer: "Multiply feet by 12, add the remaining inches, then multiply total inches by 2.54." },
      { question: "What is 5 feet 8 inches in cm?", answer: "5 feet 8 inches equals exactly 172.72 cm." },
      { question: "Is 6 feet exactly 182.88 cm?", answer: "Yes. 6 feet is 72 inches, and 72 × 2.54 = 182.88 cm." },
      { question: "Should I type height as decimal feet?", answer: "Only use decimal feet if the source value is truly decimal feet. For normal height notation, use separate feet and inches." },
    ],
  },
  inchesToMm: {
    name: "Inches to MM Converter",
    keyword: "inches to mm converter",
    type: "converter",
    audience: [
      "Users working with small parts, hardware, product specs, drawings, or manufacturing dimensions.",
      "People who need more precision than centimeters provide.",
      "Makers, repair users, students, and buyers comparing inch sizes with metric hardware.",
    ],
    userTasks: [
      "Convert inch or decimal-inch measurements into millimeters.",
      "Check exact values such as 0.5 inch to 12.7 mm or 1 inch to 25.4 mm.",
      "Decide whether millimeters, centimeters, or inches are the best unit for the task.",
    ],
    introduction:
      "The Inches to MM Converter changes inch measurements into millimeters for small parts, hardware, technical drawings, product dimensions, and tasks where centimeters are not precise enough. It stays within the length conversion scope of Inch is CM.",
    howItWorks: [
      "Enter an inch value, including decimals if needed.",
      "The converter multiplies the value by 25.4.",
      "The result is returned in millimeters and can be compared with centimeter values when useful.",
    ],
    formula: "millimeters = inches × 25.4",
    formulaExplanation:
      "One inch is exactly 25.4 millimeters because one inch is exactly 2.54 centimeters and each centimeter contains 10 millimeters.",
    examples: [
      { input: "0.5 inch", result: "12.7 mm", note: "Common half-inch reference." },
      { input: "2 inches", result: "50.8 mm", note: "Useful for small product dimensions." },
      { input: "10 inches", result: "254 mm", note: "Exact conversion for a common search value." },
    ],
    tableTitle: "Common inches to millimeters conversions",
    tableRows: [
      { label: "0.25 inch", result: "6.35 mm" },
      { label: "0.5 inch", result: "12.7 mm" },
      { label: "1 inch", result: "25.4 mm" },
      { label: "2 inches", result: "50.8 mm" },
      { label: "10 inches", result: "254 mm" },
    ],
    useCases: [
      "Hardware and fastener measurements.",
      "Technical drawings and manufacturing references.",
      "Small product dimensions where millimeter precision matters.",
    ],
    tips: [
      "Use millimeters when small differences matter more than centimeter-level rounding.",
      "Check whether the source is inch, fractional inch, or decimal inch before converting.",
      "For large measurements, centimeters or meters may be easier to read.",
    ],
    relatedTools: [
      { href: "/inches-to-cm", label: "Inches to CM Converter", reason: "Centimeter version of the same source unit." },
      { href: "/inch-to-cm-chart", label: "Inch to CM Chart", reason: "Reference chart for common inch values." },
      { href: "/10-inches-in-cm", label: "10 Inches in CM", reason: "Common exact inch conversion." },
      { href: "/conversion-methodology", label: "Conversion Methodology", reason: "See exact factors and rounding approach." },
    ],
    faq: [
      { question: "How many millimeters are in one inch?", answer: "One inch equals exactly 25.4 millimeters." },
      { question: "What is the formula for inches to mm?", answer: "Multiply inches by 25.4 to get millimeters." },
      { question: "Is 10 inches exactly 254 mm?", answer: "Yes. 10 × 25.4 = 254 millimeters exactly." },
      { question: "When should I use millimeters instead of centimeters?", answer: "Use millimeters for small parts, technical drawings, and dimensions where centimeter rounding is too coarse." },
      { question: "Can I convert fractional inches to millimeters?", answer: "Yes. First express the fraction as a decimal inch value, then multiply by 25.4." },
    ],
  },
  heightConverter: {
    name: "Height Converter",
    keyword: "height converter feet inches to cm",
    type: "converter",
    audience: [
      "Users searching a personal height such as 5'8\", 6'2\", or 6'11\" in centimeters.",
      "People preparing metric height values for forms, profiles, sports, school, travel, or medical-adjacent records.",
      "Users who need the page to explain feet-and-inches notation clearly, not just output a number.",
    ],
    userTasks: [
      "Convert a height written in feet and inches into centimeters.",
      "See total inches, formula, nearby heights, and common height examples.",
      "Avoid the common mistake of treating 5'8\" as 5.8 feet.",
    ],
    introduction:
      "The Height Converter is built for people who need to convert feet-and-inches height notation into centimeters. It supports the search behavior seen in GSC, where users look for values such as 6'11 in cm, 4'7 in cm, or 5'5 in cm.",
    howItWorks: [
      "Enter feet in the first field and remaining inches in the second field.",
      "The tool converts the full height to total inches.",
      "It multiplies total inches by 2.54 and returns the centimeter height.",
    ],
    formula: "centimeters = (feet × 12 + inches) × 2.54",
    formulaExplanation:
      "Height notation such as 5'8\" is not a decimal number. It means 5 feet plus 8 inches, so the feet must be converted to inches before the centimeter conversion.",
    examples: [
      { input: "4 feet 7 inches", result: "139.7 cm", note: "Observed high-impression height cluster example." },
      { input: "5 feet 5 inches", result: "165.1 cm", note: "Common personal-height conversion." },
      { input: "6 feet 11 inches", result: "210.82 cm", note: "Strong early GSC height-page signal." },
    ],
    tableTitle: "Useful height conversions",
    tableRows: [
      { label: "4'7\"", result: "139.7 cm" },
      { label: "5'5\"", result: "165.1 cm" },
      { label: "5'8\"", result: "172.72 cm" },
      { label: "6'3\"", result: "190.5 cm" },
      { label: "6'11\"", result: "210.82 cm" },
    ],
    useCases: [
      "International height forms and profiles.",
      "Sports, fitness, and personal records.",
      "Comparing feet-and-inches height listings with metric charts.",
    ],
    tips: [
      "Use the inches field only for the remaining inches from 0 to 11.",
      "Do not write 6'11\" as 6.11 feet; that is mathematically different.",
      "If you only know total inches, use the inches-to-cm converter instead.",
    ],
    relatedTools: [
      { href: "/height-chart", label: "Height Chart", reason: "Browse nearby height values." },
      { href: "/feet-to-cm", label: "Feet to CM Converter", reason: "Convert feet and optional inches." },
      { href: "/6-11-in-cm", label: "6'11\" in CM", reason: "High-signal exact height page." },
      { href: "/height-conversion-guide", label: "Height Conversion Guide", reason: "Learn the method step by step." },
    ],
    faq: [
      { question: "How do I convert height from feet and inches to cm?", answer: "Multiply feet by 12, add the remaining inches, then multiply total inches by 2.54." },
      { question: "What is 5'8\" in cm?", answer: "5 feet 8 inches equals exactly 172.72 cm." },
      { question: "What is 6'11\" in cm?", answer: "6 feet 11 inches equals exactly 210.82 cm." },
      { question: "Is 5.8 feet the same as 5 feet 8 inches?", answer: "No. 5.8 feet is decimal feet, while 5 feet 8 inches is 5 feet plus 8 inches." },
      { question: "Why convert height to total inches first?", answer: "Total inches gives one clear length value before applying the exact 2.54 centimeter factor." },
    ],
  },
  screenSize: {
    name: "Screen Size Converter",
    keyword: "screen size converter inches to cm",
    type: "calculator",
    audience: [
      "People shopping for laptops, monitors, tablets, TVs, projector screens, or display accessories.",
      "Users who know the advertised diagonal size but need centimeters, width, height, or fit context.",
      "Buyers checking whether a display fits a desk, wall, cabinet, monitor arm, bag, or room.",
    ],
    userTasks: [
      "Convert an advertised screen diagonal from inches to centimeters.",
      "Estimate visible width and height from diagonal size and aspect ratio.",
      "Understand that diagonal size is not the same as physical device width, height, or bezel size.",
    ],
    introduction:
      "The Screen Size Converter helps users understand advertised screen diagonals in centimeters and estimate the visible width and height of a display. It is designed for laptops, monitors, tablets, TVs, and projector screens where diagonal size alone does not explain physical fit.",
    howItWorks: [
      "Enter the advertised diagonal screen size in inches.",
      "Choose the aspect ratio, such as 16:9.",
      "The calculator converts the diagonal to centimeters and estimates the display width and height using the aspect-ratio triangle.",
    ],
    formula: "width = diagonal × w ÷ √(w² + h²); height = diagonal × h ÷ √(w² + h²)",
    formulaExplanation:
      "A screen diagonal forms a right triangle with width and height. The aspect ratio controls how that diagonal is split between width and height. Bezels, stands, and casings are not included.",
    examples: [
      { input: "15.6-inch 16:9 screen", result: "39.62 cm diagonal", note: "Common laptop display size." },
      { input: "24-inch 16:9 monitor", result: "60.96 cm diagonal", note: "Common desktop monitor size." },
      { input: "55-inch 16:9 TV", result: "139.7 cm diagonal", note: "Common television class." },
    ],
    tableTitle: "Common screen diagonal conversions",
    tableRows: [
      { label: "13.3-inch display", result: "33.78 cm diagonal" },
      { label: "15.6-inch display", result: "39.62 cm diagonal" },
      { label: "24-inch display", result: "60.96 cm diagonal" },
      { label: "32-inch display", result: "81.28 cm diagonal" },
      { label: "55-inch display", result: "139.7 cm diagonal" },
    ],
    useCases: [
      "Checking whether a monitor or TV will fit a desk, cabinet, or wall area.",
      "Understanding laptop and tablet display sizes across US and metric specs.",
      "Estimating visible display width and height before buying accessories.",
    ],
    tips: [
      "Remember that advertised screen size is diagonal, not width.",
      "Check the manufacturer's full product dimensions when fit matters.",
      "Use the same aspect ratio when comparing two screens by width and height.",
    ],
    relatedTools: [
      { href: "/screen-size-vs-width-height", label: "Screen Size vs Width and Height", reason: "Learn why diagonal size is different from width." },
      { href: "/24-inches-in-cm", label: "24 Inches in CM", reason: "Common monitor diagonal conversion." },
      { href: "/15-6-inch-in-cm", label: "15.6 Inches in CM", reason: "Common laptop diagonal conversion." },
      { href: "/inches-to-cm", label: "Inches to CM Converter", reason: "Convert any screen diagonal directly." },
    ],
    faq: [
      { question: "How are screen sizes measured?", answer: "Screen sizes are measured diagonally across the visible display area." },
      { question: "Is a 15.6-inch screen 15.6 inches wide?", answer: "No. 15.6 inches is the diagonal. Width depends on the aspect ratio." },
      { question: "How many centimeters is a 24-inch screen?", answer: "A 24-inch screen has a 60.96 cm diagonal." },
      { question: "Does screen size include the bezel?", answer: "Usually not. The advertised size normally describes the display panel, not the full device." },
      { question: "Why do aspect ratios matter?", answer: "Two screens with the same diagonal can have different width and height if their aspect ratios differ." },
    ],
  },
  heightChart: {
    name: "Feet and Inches to CM Height Chart",
    keyword: "height chart feet inches to cm",
    type: "chart",
    audience: [
      "Users who want to scan many height values instead of converting one height at a time.",
      "People comparing nearby heights for forms, profiles, sports references, or international charts.",
      "Searchers who need a fast table plus links to exact height pages when more detail is needed.",
    ],
    userTasks: [
      "Find a feet-and-inches height and read the centimeter value in the same row.",
      "Compare nearby height values without retyping them into a converter.",
      "Open a detailed exact page when a single height needs formula, context, and FAQ.",
    ],
    introduction:
      "The Feet and Inches to CM Height Chart is a reference page for scanning common heights from 4 feet through 7 feet. It supports users who want to compare several height values at once instead of entering each height into a converter.",
    howItWorks: [
      "Find the feet-and-inches height in the first column.",
      "Check the total inches column if you want to verify the calculation.",
      "Read the centimeter value or open the detailed height page for formula, nearby values, and a prefilled converter.",
    ],
    formula: "centimeters = total inches × 2.54",
    formulaExplanation:
      "Each height is first converted into total inches. The chart then multiplies total inches by the exact 2.54 centimeter factor.",
    examples: [
      { input: "4 feet 7 inches", result: "139.7 cm", note: "One of the early high-impression height pages." },
      { input: "5 feet 5 inches", result: "165.1 cm", note: "Common personal-height reference." },
      { input: "6 feet 11 inches", result: "210.82 cm", note: "Strong early GSC height-cluster signal." },
    ],
    tableTitle: "Height chart examples",
    tableRows: [
      { label: "4'7\"", result: "139.7 cm" },
      { label: "5'5\"", result: "165.1 cm" },
      { label: "5'8\"", result: "172.72 cm" },
      { label: "6'1\"", result: "185.42 cm" },
      { label: "6'11\"", result: "210.82 cm" },
    ],
    useCases: [
      "Comparing multiple heights for forms, profiles, and sports references.",
      "Checking nearby heights without retyping values.",
      "Moving from a chart row to a detailed exact height conversion page.",
    ],
    tips: [
      "Use the detailed height page when you need the step-by-step formula for one value.",
      "Remember that 5'8\" means 5 feet plus 8 inches, not 5.8 feet.",
      "Use centimeters consistently when comparing several height values.",
    ],
    relatedTools: [
      { href: "/height-converter", label: "Height Converter", reason: "Enter a custom feet-and-inches height." },
      { href: "/feet-to-cm", label: "Feet to CM Converter", reason: "Convert feet with optional inches." },
      { href: "/6-11-in-cm", label: "6'11\" in CM", reason: "High-signal exact height page." },
      { href: "/height-conversion-guide", label: "Height Conversion Guide", reason: "Learn the calculation method." },
    ],
    faq: [
      { question: "How do I use the height chart?", answer: "Find the feet-and-inches height, then read the centimeter value in the same row." },
      { question: "What formula does the chart use?", answer: "It converts the height to total inches and multiplies by exactly 2.54." },
      { question: "What is 5'8\" in cm?", answer: "5 feet 8 inches equals exactly 172.72 cm." },
      { question: "Why does the chart show total inches?", answer: "Total inches makes it easier to verify the feet-and-inches calculation before converting to centimeters." },
      { question: "Where should I go for a height not shown in the chart?", answer: "Use the height converter for a custom feet-and-inches value." },
    ],
  },
  inchChart: {
    name: "Inch to CM Chart",
    keyword: "inch to cm chart",
    type: "chart",
    audience: [
      "Users comparing multiple inch values from product specs, classroom work, plans, or size tables.",
      "People who prefer a reference chart over entering each value into a calculator.",
      "Searchers who may start with a table and then need an exact conversion page for one value.",
    ],
    userTasks: [
      "Scan common inch values and read their centimeter equivalents.",
      "Use the chart as a quick reference for repeated conversions.",
      "Open exact inch pages or the converter when the value needs more detail or is decimal.",
    ],
    introduction:
      "The Inch to CM Chart gives users a scannable reference for common inch values and their centimeter equivalents. It is useful when a user wants a table instead of typing one value at a time.",
    howItWorks: [
      "Search or scan the inch value in the chart.",
      "Read the centimeter result in the adjacent column.",
      "Open an exact conversion page when you need formula, nearby values, or real-world context.",
    ],
    formula: "centimeters = inches × 2.54",
    formulaExplanation:
      "Every row uses the exact international inch definition. The chart is a reference layer, while exact pages provide deeper context.",
    examples: [
      { input: "10 inches", result: "25.4 cm", note: "Common everyday reference." },
      { input: "24 inches", result: "60.96 cm", note: "Exactly 2 feet." },
      { input: "36 inches", result: "91.44 cm", note: "Exactly 3 feet." },
    ],
    tableTitle: "Chart values users often check",
    tableRows: [
      { label: "1 inch", result: "2.54 cm" },
      { label: "10 inches", result: "25.4 cm" },
      { label: "12 inches", result: "30.48 cm" },
      { label: "24 inches", result: "60.96 cm" },
      { label: "100 inches", result: "254 cm" },
    ],
    useCases: [
      "Quick classroom and reference checks.",
      "Comparing multiple product dimensions.",
      "Finding exact conversion pages from a table.",
    ],
    tips: [
      "Use the search field when the chart is long.",
      "Open an exact page for FAQ, formula, and nearby values.",
      "Use the converter when your value includes decimals not shown in the chart.",
    ],
    relatedTools: [
      { href: "/inches-to-cm", label: "Inches to CM Converter", reason: "Convert custom inch values." },
      { href: "/cm-to-inch-chart", label: "CM to Inch Chart", reason: "Reverse chart for metric values." },
      { href: "/24-inches-in-cm", label: "24 Inches in CM", reason: "Common exact table value." },
      { href: "/how-to-convert-inches-to-cm", label: "Formula Guide", reason: "Learn how chart values are calculated." },
    ],
    faq: [
      { question: "How do I use the inch to cm chart?", answer: "Find the inch value and read the centimeter result in the next column." },
      { question: "Does the chart use the exact 2.54 factor?", answer: "Yes. Each inch value is multiplied by exactly 2.54." },
      { question: "Can I search the chart?", answer: "Yes. Use the chart filter to find a value quickly." },
      { question: "What if my inch value is a decimal?", answer: "Use the converter for decimal values that are not listed in the table." },
      { question: "Why open an exact conversion page from the chart?", answer: "Exact pages include the formula, nearby values, converter, FAQ, and practical context." },
    ],
  },
  cmChart: {
    name: "CM to Inch Chart",
    keyword: "cm to inch chart",
    type: "chart",
    audience: [
      "Users comparing many centimeter values with inch equivalents.",
      "People reading metric product, furniture, storage, or package dimensions.",
      "Searchers who need a chart first, then a precise converter when rounding matters.",
    ],
    userTasks: [
      "Find a centimeter value and read the rounded inch result.",
      "Compare several metric measurements in one table.",
      "Move to an exact cm page or converter when more precision is required.",
    ],
    introduction:
      "The CM to Inch Chart helps users compare centimeter values with rounded inch equivalents. It is a reference table for metric dimensions that need to be understood in inches.",
    howItWorks: [
      "Find the centimeter value in the table.",
      "Read the rounded inch result beside it.",
      "Open an exact cm page when you need the calculation and nearby values.",
    ],
    formula: "inches = centimeters ÷ 2.54",
    formulaExplanation:
      "Most centimeter values become decimal inches. The chart rounds values for readability while exact pages explain the calculation.",
    examples: [
      { input: "10 cm", result: "3.937 inches", note: "Common compact object size." },
      { input: "25.4 cm", result: "10 inches", note: "Exact reverse conversion." },
      { input: "100 cm", result: "39.3701 inches", note: "One meter in inches." },
    ],
    tableTitle: "Chart values users often check",
    tableRows: [
      { label: "1 cm", result: "0.3937 inches" },
      { label: "10 cm", result: "3.937 inches" },
      { label: "25.4 cm", result: "10 inches" },
      { label: "50 cm", result: "19.685 inches" },
      { label: "100 cm", result: "39.3701 inches" },
    ],
    useCases: [
      "Metric product specifications.",
      "Furniture, package, and storage dimensions.",
      "School and international measurement references.",
    ],
    tips: [
      "Use rounded inch values carefully when fit matters.",
      "For exact inch values, check whether the cm value maps to a known inch equivalent.",
      "Use the converter if you need a value that is not visible in the chart.",
    ],
    relatedTools: [
      { href: "/cm-to-inches", label: "CM to Inches Converter", reason: "Convert custom centimeter values." },
      { href: "/inch-to-cm-chart", label: "Inch to CM Chart", reason: "Reverse chart for inch values." },
      { href: "/25-4-cm-in-inches", label: "25.4 CM in Inches", reason: "Exact 10-inch reverse conversion." },
      { href: "/inch-vs-cm", label: "Inch vs CM", reason: "Understand the unit difference." },
    ],
    faq: [
      { question: "How do I use the cm to inch chart?", answer: "Find the centimeter value and read its inch equivalent beside it." },
      { question: "Why are chart results rounded?", answer: "Many centimeter values create long decimal inch results, so the chart rounds for readability." },
      { question: "Is 25.4 cm exactly 10 inches?", answer: "Yes. 25.4 centimeters equals exactly 10 inches." },
      { question: "Can I use the chart for product dimensions?", answer: "Yes, but convert each product dimension separately." },
      { question: "What if I need more precision?", answer: "Use the converter or exact conversion page and keep more decimal places." },
    ],
  },
} satisfies Record<string, ToolSEOContentConfig>;

export type ToolSEOKey = keyof typeof toolSeoContent;
