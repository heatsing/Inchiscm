export type OnThisPageItem = {
  href: `#${string}`;
  label: string;
};

export function OnThisPage({
  items,
  title = "On this page",
}: {
  items: OnThisPageItem[];
  title?: string;
}) {
  const visibleItems = items.filter((item) => item.href.length > 1 && item.label.trim());

  if (visibleItems.length < 2) return null;

  return (
    <nav className="on-this-page" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {visibleItems.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
