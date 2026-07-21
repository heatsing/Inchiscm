import Link from "next/link";

export type RelatedLink = {
  href: string;
  label: string;
};

export type RelatedLinkSection = {
  title: string;
  links: RelatedLink[];
};

export function RelatedLinks({ sections }: { sections: RelatedLinkSection[] }) {
  const visibleSections = sections
    .map((section) => ({ ...section, links: section.links.filter((link) => link.href && link.label) }))
    .filter((section) => section.links.length > 0);

  if (visibleSections.length === 0) return null;

  return (
    <div className="related-link-sections">
      {visibleSections.map((section) => (
        <section className="related-link-section" key={section.title}>
          <h3>{section.title}</h3>
          <ul>
            {section.links.map((link) => (
              <li key={`${section.title}-${link.href}-${link.label}`}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
