# Linkable Asset Plan

Last updated: 2026-07-26

This plan evaluates future linkable assets for inchiscm.com. It does not authorize implementation during the current production-change freeze.

## Asset evaluation

| Asset | Target audience | Unique value | Development effort | Link potential | Page location | Risks | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Printable inch-to-cm chart | Teachers, students, craft/sewing users, workshops, classrooms | Clean printable PDF and web chart with exact values and ruler-friendly layout | Low to medium | Medium | Existing `/inch-to-cm-chart`, with downloadable asset later | Low value if it is just another table; must be genuinely printable and clean | High |
| Accurate on-screen inch ruler with calibration | Students, DIY users, designers, people without a ruler | Calibrated screen ruler using known object or device pixel ratio with clear accuracy warnings | Medium to high | High if accurate and distinctive | Existing `/how-to-measure-inches-without-a-ruler` or future tool after validation | Accuracy risk; browser scaling and device variation can mislead users | High |
| Embeddable conversion widget | Bloggers, education sites, DIY pages, ecommerce/product spec sites | Lightweight widget for inch/cm conversion that others can embed | Medium | Medium to high | Future `/embed-inch-cm-converter` only if validated | Spammy if promoted aggressively; maintenance and abuse risk | Medium |
| Height conversion visualization | Fitness, sports, education, character/profile tools | Visual height scale with feet/inches/cm and nearby comparisons | Medium | Medium | Existing `/height-converter` or `/height-chart` | Could drift into sensitive body/medical topics; must stay neutral | Medium |
| Screen-size measurement guide | Buyers, AV installers, teachers, home office users | Explains diagonal, width, height, aspect ratio, bezel, fit | Low to medium | Medium | Existing `/screen-size-converter` and `/screen-size-vs-width-height` | Competitive SERP; needs strong visuals/tools to earn links | Medium |
| Downloadable classroom reference sheet | Teachers, students, homeschool pages | Printable reference for inches, cm, mm, feet, common formulas | Low | Medium | Existing chart or future resource section | Generic if not designed well; limited audience unless polished | Medium |

## Recommended best two future assets

### 1. Accurate on-screen inch ruler with calibration

Why it ranks first:

- It is more distinctive than another conversion table.
- It fits the approved measurement ecosystem.
- It supports the existing `/how-to-measure-inches-without-a-ruler` guide.
- It can earn links from classroom, DIY, design, sewing, and practical measurement pages if it is genuinely useful.

Required safeguards:

- Start with a clear accuracy warning.
- Require calibration against a known object.
- Do not claim medical, engineering, or manufacturing precision.
- Keep measurements in the browser.
- Add methodology and limitations.

Future location:

- Improve `/how-to-measure-inches-without-a-ruler` first.
- Consider a dedicated tool only after GSC/query evidence shows demand.

### 2. Printable inch-to-cm chart

Why it ranks second:

- It is low effort and highly aligned with existing `/inch-to-cm-chart`.
- It can support teachers, students, crafts, woodworking, and classroom references.
- It adds non-programmatic value without increasing indexed page count if placed on the existing chart page.

Required safeguards:

- Make it visually clean and printer-friendly.
- Include exact formula and rounding note.
- Include mm and feet references only when useful.
- Do not create dozens of separate printable chart pages.

Future location:

- Add to `/inch-to-cm-chart` as a downloadable PDF or print stylesheet enhancement.

## Assets not selected first

- Embeddable widget: useful later, but outreach risk is higher and it requires maintenance.
- Height visualization: promising because height has proven GSC demand, but needs design care to avoid generic or sensitive framing.
- Screen guide: good support asset, but current page already covers the core concept and should wait for screen-query evidence.
- Classroom reference sheet: useful, but overlaps the printable chart and should be bundled rather than separate.

## Implementation gates

Before building either selected asset:

1. confirm freeze has ended;
2. collect fresh 7-day GSC top queries and top pages;
3. decide whether the asset can live on an existing page;
4. define internal links;
5. run human-value review;
6. run `npm run verify`;
7. do not add AdSense around the asset.
