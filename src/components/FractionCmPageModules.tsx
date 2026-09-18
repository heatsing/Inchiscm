import Link from "next/link";
import type { FractionCmModules } from "@/lib/fraction-cm-modules";

export function FractionCmPageModules({ modules }: { modules: FractionCmModules }) {
  return (
    <>
      <section className="numeric-module" id="equivalent-units">
        <h2>Other units for {modules.fraction} inch</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Exact centimeter, millimeter, and decimal-inch equivalents</caption>
            <thead><tr><th>Unit</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Centimeters</td><td>{modules.cmText} cm</td></tr>
              <tr><td>Millimeters</td><td>{modules.mmText} mm</td></tr>
              <tr><td>Decimal inches</td><td>{modules.decimalText} in</td></tr>
            </tbody>
          </table>
        </div>
        <p className="subtle">{modules.rulerNote}</p>
      </section>
      <section className="numeric-module" id="nearby-window">
        <h2>Nearby published fractions</h2>
        <div className="data-table-wrap">
          <table>
            <caption>Published eighths near {modules.fraction} inch</caption>
            <thead>
              <tr>
                <th>Fraction</th>
                <th>Centimeters</th>
                <th>Millimeters</th>
                <th>Decimal inches</th>
              </tr>
            </thead>
            <tbody>
              {modules.nearby.map((row) => (
                <tr key={row.label}>
                  <td>{row.href ? <Link href={row.href}>{row.label}</Link> : row.label}</td>
                  <td>{row.cmText}</td>
                  <td>{row.mmText}</td>
                  <td>{row.decimalText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {(modules.decimalTwin || modules.mmTwin) && (
        <section className="numeric-module" id="same-length-pages">
          <h2>Same length, other published pages</h2>
          <div className="data-table-wrap">
            <table>
              <caption>Matching decimal-inch or millimeter landings</caption>
              <thead><tr><th>Page type</th><th>Published URL</th></tr></thead>
              <tbody>
                {modules.decimalTwin ? (
                  <tr>
                    <td>Decimal inches to cm</td>
                    <td><Link href={modules.decimalTwin.href}>{modules.decimalTwin.label}</Link></td>
                  </tr>
                ) : null}
                {modules.mmTwin ? (
                  <tr>
                    <td>Fraction inch to mm</td>
                    <td><Link href={modules.mmTwin.href}>{modules.mmTwin.label}</Link></td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
