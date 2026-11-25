import Link from "next/link";
import type { CmNumericModules, InchNumericModules } from "@/lib/numeric-page-modules";
import { formatNumber } from "@/lib/conversions";

type Modules = InchNumericModules | CmNumericModules;

function Equivalents({ modules }: { modules: Modules }) {
  const roundedInches = modules.kind === "cm" && modules.isRounded;
  const rows = modules.kind === "inch"
    ? [
        ["Centimeters", `${modules.cmText} cm`],
        ["Millimeters", `${modules.mmText} mm`],
        ["Meters", `${modules.mText} m`],
        ...(modules.fraction ? [[modules.fraction.exact ? "Exact fraction" : "Nearest 1/16 inch", modules.fraction.text] as const] : []),
        ["Feet and inches", modules.feetAndInches],
      ]
    : [
        ["Inches", `${roundedInches ? "≈ " : ""}${modules.inchText} in`],
        ["Millimeters", `${modules.mmText} mm`],
        ["Meters", `${modules.mText} m`],
        [modules.fraction.exact ? "Exact fraction" : "Nearest 1/16 inch", modules.fraction.text],
      ];

  return (
    <section className="numeric-module" id="equivalent-units">
      <h2>{modules.kind === "inch" ? `Other units for ${modules.valueText} ${modules.unitLabel}` : `Other units for ${modules.valueText} cm`}</h2>
      <div className="data-table-wrap">
        <table>
          <caption>Metric and imperial equivalents</caption>
          <thead><tr><th>Unit</th><th>Value</th></tr></thead>
          <tbody>
            {rows.map(([label, result]) => (
              <tr key={label}><td>{label}</td><td>{result}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NearbyWindow({ modules }: { modules: Modules }) {
  const currentLabel = modules.kind === "inch"
    ? `${modules.valueText} ${modules.unitLabel}`
    : `${modules.valueText} cm`;
  const heading = modules.kind === "inch" ? "Inches" : "Centimeters";
  const primaryHeading = modules.kind === "inch" ? "Centimeters" : "Decimal inches";
  const secondaryHeading = modules.kind === "inch" ? "Millimeters" : "Fraction";

  return (
    <section className="numeric-module" id="nearby-window">
      <h2>Nearby conversions</h2>
      <div className="data-table-wrap">
        <table>
          <caption>Values near {currentLabel}</caption>
          <thead>
            <tr>
              <th>{heading}</th>
              <th>{primaryHeading}</th>
              <th>{secondaryHeading}</th>
            </tr>
          </thead>
          <tbody>
            {modules.nearby.map((row) => (
              <tr key={row.value} aria-current={row.isCurrent || undefined}>
                <td>{row.href ? <Link href={row.href}>{row.label}</Link> : row.label}</td>
                <td>{row.primaryText}</td>
                <td>{row.secondaryText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReverseLink({ modules }: { modules: Modules }) {
  if (!modules.reverse) return null;
  const from = modules.kind === "inch"
    ? `${modules.valueText} ${modules.unitLabel} = ${modules.cmText} cm`
    : `${modules.valueText} cm = ${modules.inchText} in`;
  return (
    <section className="numeric-module" id="reverse-conversion">
      <h2>Reverse conversion</h2>
      <div className="data-table-wrap">
        <table>
          <caption>Matching opposite-direction page</caption>
          <thead><tr><th>Direction</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>This page</td><td>{from}</td></tr>
            <tr>
              <td>Reverse page</td>
              <td><Link href={modules.reverse.href}>{modules.reverse.label}</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeightEntry({ modules }: { modules: Modules }) {
  if (!modules.height) return null;
  const { feet, inches, href, label, isApproximate } = modules.height;
  const measure = modules.kind === "inch"
    ? `${modules.valueText} ${modules.unitLabel}`
    : `${modules.valueText} cm`;
  return (
    <section className="numeric-module" id="height-entry">
      <h2>Height chart reference for {measure}</h2>
      <div className="data-table-wrap">
        <table>
          <caption>{isApproximate ? "Height chart entry rounded to the nearest whole inch" : "Height chart entry for the same length"}</caption>
          <thead><tr><th>Notation</th><th>Page</th></tr></thead>
          <tbody>
            <tr>
              <td>{`${isApproximate ? "≈ " : ""}${feet}'${inches}"`}</td>
              <td><Link href={href}>{label}</Link></td>
            </tr>
            <tr>
              <td>Height tools</td>
              <td><Link href="/height-converter">Height converter</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScreenEntry({ modules }: { modules: Modules }) {
  if (!modules.screen) return null;
  return (
    <section className="numeric-module" id="screen-entry">
      <h2>Screen diagonal {formatNumber(modules.screen.diagonalInches)} in</h2>
      <div className="data-table-wrap">
        <table>
          <caption>Viewable width and height from this diagonal</caption>
          <thead>
            <tr>
              <th>Aspect ratio</th>
              <th>Width</th>
              <th>Height</th>
            </tr>
          </thead>
          <tbody>
            {modules.screen.ratios.map((row) => (
              <tr key={row.ratio}>
                <td>{row.ratio}</td>
                <td>{row.widthInches} in / {row.widthCm} cm</td>
                <td>{row.heightInches} in / {row.heightCm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="subtle"><Link href={modules.screen.converterHref}>Screen size converter</Link> for other aspect ratios.</p>
    </section>
  );
}

export function NumericPageModules({ modules }: { modules: Modules }) {
  return (
    <>
      <Equivalents modules={modules} />
      {modules.notable.length > 0 && (
        <section className="numeric-module" id="notable-relationships">
          <h2>Notable relationships</h2>
          <ul>
            {modules.notable.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}
      {modules.nearby.length > 0 && <NearbyWindow modules={modules} />}
      <ReverseLink modules={modules} />
      <HeightEntry modules={modules} />
      <ScreenEntry modules={modules} />
    </>
  );
}
