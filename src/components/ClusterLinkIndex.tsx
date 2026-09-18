import Link from "next/link";
import type { ClusterSection } from "@/lib/url-clusters";

export function ClusterLinkIndex({ sections }: { sections: ClusterSection[] }) {
  return (
    <div className="cluster-index">
      <nav className="cluster-toc" aria-label="Site map clusters">
        {sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>{section.heading}</a>
        ))}
      </nav>
      {sections.map((section) => (
        <section className="cluster-section" id={section.id} key={section.id}>
          <h2>{section.heading}</h2>
          <p className="cluster-intro">{section.intro}</p>
          <ul>
            {section.links.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
