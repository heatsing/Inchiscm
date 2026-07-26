import Link from "next/link";
import { faqSchema } from "@/lib/seo";
import type { ToolSEOContentConfig } from "@/data/tools";

function ToolFAQSchema({ items }: { items: ToolSEOContentConfig["faq"] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(items)) }}
    />
  );
}

export function ToolSEOContent({ config }: { config: ToolSEOContentConfig }) {
  return (
    <section className="tool-seo-content" aria-label={`${config.name} guide`}>
      <ToolFAQSchema items={config.faq} />

      <div className="tool-seo-intro">
        <div className="eyebrow">Tool guide</div>
        <h2>{config.name}: what this tool solves</h2>
        <p>{config.introduction}</p>
      </div>

      <div className="tool-seo-grid">
        <section className="card">
          <h3>Who this tool is for</h3>
          <ul>
            {config.audience.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section className="card">
          <h3>What users usually need to do</h3>
          <ul>
            {config.userTasks.map((task) => <li key={task}>{task}</li>)}
          </ul>
        </section>
      </div>

      <div className="tool-seo-grid">
        <section className="card">
          <h3>How it works</h3>
          <ol>
            {config.howItWorks.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
        <section className="card">
          <h3>Formula / calculation method</h3>
          <div className="formula">{config.formula}</div>
          <p>{config.formulaExplanation}</p>
        </section>
      </div>

      <section>
        <h2>Examples</h2>
        <div className="example-grid">
          {config.examples.map((example) => (
            <div className="card" key={`${example.input}-${example.result}`}>
              <h3>Example: {example.input}</h3>
              <p><strong>Input:</strong> {example.input}</p>
              <p><strong>Result:</strong> {example.result}</p>
              <p>{example.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>{config.tableTitle}</h2>
        <div className="data-table-wrap">
          <table>
            <caption>{config.tableTitle}</caption>
            <thead>
              <tr>
                <th>Input</th>
                <th>Result</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {config.tableRows.map((row) => (
                <tr key={`${row.label}-${row.result}`}>
                  <td>{row.label}</td>
                  <td>{row.result}</td>
                  <td>{row.note ?? "Common reference value"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="tool-seo-grid">
        <section className="card">
          <h2>Use cases</h2>
          <ul>
            {config.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}
          </ul>
        </section>
        <section className="card">
          <h2>Tips and best practices</h2>
          <ul>
            {config.tips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </section>
      </div>

      <section>
        <h2>Related tools</h2>
        <div className="related-link-sections">
          {config.relatedTools.map((tool) => (
            <section className="related-link-section" key={tool.href}>
              <h3><Link href={tool.href}>{tool.label}</Link></h3>
              <p>{tool.reason}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="faq">
        <h2>Frequently asked questions</h2>
        {config.faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
    </section>
  );
}
