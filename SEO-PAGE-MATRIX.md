# SEO Page Matrix

Last updated: 2026-07-26

This matrix classifies the current 389 sitemap URLs. It is a planning document only. Do not delete, redirect, canonicalize, noindex, retitle, or deploy anything from this document without a separate production task and validation.

## Architecture summary

| Page group | Count | Classification |
| --- | ---: | --- |
| Core, hub, guide, size-use-case, utility/legal pages | 26 | Mixed |
| Exact inch conversion pages | 142 | Exact Conversion |
| Exact centimeter conversion pages | 160 | Exact Conversion |
| Height conversion pages | 61 | Height Conversion |
| Total sitemap URLs | 389 | Current indexable set |

Every current sitemap route is covered by exactly one row or route-pattern row below.

## Core, hub, guide, size-use-case, utility/legal routes

| Route | Class | Target intent | Parent hub | Expected user value | GSC evidence | Status | Potential cannibalization | Internal-link role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Core Tool | Inch to cm converter and length converter entry | Root | Immediate inch-to-cm conversion, links to core tools | Not isolated in supplied GSC | Keep | Could overlap `/inches-to-cm`; keep homepage brand/core role distinct | Primary root hub |
| `/inches-to-cm` | Core Tool | Convert inches to centimeters | `/` | Focused inch-to-cm converter, formula, FAQ | Core topic; no page-specific supplied data | Keep | Overlap with homepage; differentiate as focused tool page | Hub for exact inch pages |
| `/cm-to-inches` | Core Tool | Convert cm to inches | `/` | Reverse converter and formula | No supplied evidence | Keep | Low; reverse intent is distinct | Hub for exact cm pages |
| `/feet-to-cm` | Core Tool | Convert feet to cm | `/height-converter` | Feet-only length conversion | No supplied evidence | Hold | Could overlap height pages if expanded carelessly | Supports height ecosystem |
| `/inches-to-mm` | Core Tool | Convert inches to millimeters | `/` | Approved Phase 2 length tool | No supplied evidence | Hold | Could overlap future `mm-to-inches` if duplicated | Supports focused length expansion |
| `/height-converter` | Hub | Feet and inches to cm converter | `/` | Dedicated height converter and common heights | Height cluster strongest evidence | Improve | Could overlap exact height pages; keep as hub/tool | Parent for height pages |
| `/height-chart` | Hub | Height chart from 4'0" to 7'0" | `/height-converter` | Scan common height conversions | Height cluster evidence supports it | Keep | Low if table links to exact pages | Reference hub |
| `/screen-size-converter` | Hub | Screen diagonal to cm plus width/height | `/` | Converts diagonal and estimates display dimensions | No supplied page-specific data | Improve later | Could overlap exact screen-size inch pages; keep as functional hub | Parent for screen-size intent |
| `/inches-to-cm-dimensions` | Core Tool / Product Dimensions | Convert L x W x H inches to centimeters | `/` and `/common-product-dimensions-in-cm` | Converts product, box, luggage, furniture, and package dimensions side by side | Reference-site structure review and owner-approved task page expansion | Keep; monitor | Distinct from single-value inch pages because it handles dimension sets, not one value | Product-dimension task hub |
| `/cm-to-inches-dimensions` | Core Tool / Product Dimensions | Convert L x W x H centimeters to inches | `/` and `/common-product-dimensions-in-cm` | Converts metric product, box, luggage, furniture, and package dimensions to inches | Reference-site structure review and owner-approved task page expansion | Keep; monitor | Distinct from single-value cm pages because it handles dimension sets, not one value | Reverse product-dimension task hub |
| `/inch-to-cm-chart` | Hub | Inch to cm chart | `/inches-to-cm` | Searchable reference table | Core topic; no page-specific supplied data | Keep | Low; reference intent differs from converter | Links to exact inch pages |
| `/cm-to-inch-chart` | Hub | CM to inch chart | `/cm-to-inches` | Searchable reverse reference table | No supplied evidence | Keep | Low | Links to exact cm pages |
| `/how-to-convert-inches-to-cm` | Guide | Learn formula | `/inches-to-cm` | Formula, examples, rounding guidance | Supports core intent | Keep | Could overlap converter page if too tool-like | Educational support link |
| `/inch-vs-cm` | Guide | Compare units | `/inches-to-cm` | Explains metric vs imperial unit difference | No supplied evidence | Keep | Low | Trust and context support |
| `/why-is-one-inch-2-54-cm` | Guide | Explain exact definition | `/conversion-methodology` | Authority and source context | No supplied evidence | Keep | Low | Trust support |
| `/how-to-measure-inches-without-a-ruler` | Guide | Estimate size without ruler | `/inches-to-cm` | Practical measurement help | No supplied evidence | Hold | Could become broad if expanded too far | Practical support |
| `/how-big-is-10-inches` | Size Use Case | Real-world size of 10 inches | `/inches-to-cm` | Familiar examples plus exact value | No supplied evidence | Hold | Could duplicate `/10-inches-in-cm`; keep practical intent distinct | Links to exact page |
| `/how-big-is-12-inches` | Size Use Case | Real-world size of 12 inches | `/inches-to-cm` | Explains 1 foot and common ruler reference | No supplied evidence | Hold | Could duplicate `/12-inches-in-cm`; keep practical intent distinct | Links to exact page |
| `/how-big-is-15-inches` | Size Use Case | Real-world size of 15 inches | `/screen-size-converter` | Laptop/screen and object context | No supplied evidence | Hold | Could duplicate `/15-inches-in-cm`; maintain use-case framing | Links to exact page and screen hub |
| `/common-product-dimensions-in-cm` | Size Use Case | Product dimensions in cm/inches | `/` | Practical fit and dimension-order guidance | No supplied evidence | Improve later | Could become too broad; keep within product dimensions | Use-case support |
| `/screen-size-vs-width-height` | Guide | Diagonal vs width/height | `/screen-size-converter` | Explains screen sizing and aspect ratio | Screen SERP supports this intent | Keep | Could overlap screen converter; keep as explanatory guide | Supports screen hub |
| `/height-conversion-guide` | Guide | Feet/inches to cm method | `/height-converter` | Formula and examples for height | Height cluster supports it | Improve later | Could overlap height converter; keep as guide | Supports height hub |
| `/conversion-methodology` | Utility or Legal | Accuracy, factors, sources | Root | Trust, rounding, authority | No GSC evidence needed | Keep | Low | Trust and source link |
| `/privacy-policy` | Utility or Legal | Privacy disclosure | Root | Legal and trust support | No GSC evidence needed | Keep | None | Footer policy link |
| `/terms-of-service` | Utility or Legal | Terms and limitations | Root | Legal and risk disclosure | No GSC evidence needed | Keep | None | Footer policy link |
| `/site-map` | Utility or Legal | Human sitemap | Root | Crawl/user discovery | No GSC evidence needed | Keep | None | Navigation support |

## Exact inch conversion routes

| Routes covered | Class | Target intent | Parent hub | Expected user value | GSC evidence | Status | Potential cannibalization | Internal-link role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Whole-inch routes `/1-inch-in-cm`, `/2-inches-in-cm` through `/100-inches-in-cm` | Exact Conversion | Exact inch value to cm | `/inches-to-cm` and `/inch-to-cm-chart` | Direct answer, formula, prefilled converter, nearby values | `/24-inches-in-cm`, `/12-inches-in-cm`, and `/95-inches-in-cm` have supplied recent impressions | Keep; improve only pages with evidence | Query variants must consolidate to the canonical route; no `24inch` duplicate pages | Long-tail exact-answer layer |
| Decimal-inch routes including quarter-inch and half-inch values from `/0-25-inch-in-cm` through `/12-75-inches-in-cm`, plus approved screen decimals such as `/13-3-inch-in-cm`, `/15-6-inch-in-cm`, and `/17-3-inch-in-cm` | Exact Conversion | Common decimal and fractional-style inch value to cm | `/inches-to-cm` | Direct decimal conversion for product, hardware, craft, screen, and specification sizes | User-authorized 2026-07-26 expansion; still bounded by policy | Keep; monitor index quality | Risk if expanded beyond approved list | Supports decimal-size searches |
| Screen-size inch routes `/13-3-inch-in-cm`, `/14-inches-in-cm`, `/15-6-inch-in-cm`, `/17-3-inch-in-cm`, `/24-inches-in-cm`, `/27-inches-in-cm`, `/32-inches-in-cm`, `/43-inches-in-cm`, `/55-inches-in-cm`, `/65-inches-in-cm`, `/75-inches-in-cm` | Exact Conversion / Size Use Case | Screen diagonal inch to cm | `/screen-size-converter` | Diagonal conversion plus screen context | `/24-inches-in-cm` has strongest recent evidence | Improve evidenced pages first | Could overlap screen hub; keep exact result on exact page and width/height on hub | Connects exact conversion to screen hub |

## Exact centimeter conversion routes

| Routes covered | Class | Target intent | Parent hub | Expected user value | GSC evidence | Status | Potential cannibalization | Internal-link role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Whole-centimeter routes `/1-cm-in-inches` through `/100-cm-in-inches` | Exact Conversion | Exact cm value to inches | `/cm-to-inches` and `/cm-to-inch-chart` | Direct answer, formula, prefilled converter, nearby values | No supplied page-specific evidence | Hold | Avoid near-duplicate reverse pages beyond approved range | Long-tail reverse layer |
| Approved reverse-centimeter routes including known inch equivalents such as `/2-54-cm-in-inches`, `/5-08-cm-in-inches`, `/30-48-cm-in-inches`, `/60-96-cm-in-inches`, `/101-6-cm-in-inches`, `/152-4-cm-in-inches`, `/182-88-cm-in-inches`, and `/254-cm-in-inches` | Exact Conversion | Known inch-equivalent cm values | `/cm-to-inches` | Reverse lookup for common exact inch conversions and bidirectional internal linking | User-authorized 2026-07-26 expansion; still bounded by policy | Keep; monitor index quality | Low if kept limited and linked only when relevant | Connects inch and cm exact pages |

## Height conversion routes

| Routes covered | Class | Target intent | Parent hub | Expected user value | GSC evidence | Status | Potential cannibalization | Internal-link role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/3-feet-in-cm`, `/3-1-in-cm` through `/7-11-in-cm`, `/8-feet-in-cm` | Height Conversion | Convert a specific height from feet/inches to cm | `/height-converter` and `/height-chart` | Direct height answer, total inches, formula, converter, nearby heights | Strongest proven cluster; top supplied pages include `/6-11-in-cm`, `/4-7-in-cm`, `/5-5-in-cm`, `/6-3-in-cm`, `/6-1-in-cm`, `/6-8-in-cm`, `/6-4-in-cm`, `/4-10-in-cm`, `/6-5-in-cm`, `/6-10-in-cm` | Keep; monitor newly exposed edges of the height range | Query punctuation variants must map to the same canonical height URL | Proven long-tail layer and hub-supporting cluster |

## Consolidation watchlist

Do not consolidate during the current task. Later review may be needed for:

- homepage vs `/inches-to-cm` if Google consistently ranks the wrong page for core `inch to cm` terms;
- `/how-big-is-*` pages vs exact inch pages if GSC shows the same queries split across both;
- screen-size exact inch pages vs `/screen-size-converter` if diagonal-to-width intent becomes dominant;
- height guide vs height converter if broad `feet inches to cm` queries split across both.

Current recommendation: keep all current pages, improve only evidence-backed pages, and wait for more query/page data.
