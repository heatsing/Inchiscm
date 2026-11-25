import Link from "next/link";
import { gscPriorityHeightEntries } from "@/lib/gsc-priority-heights";

export function PopularHeightLinks({
  heading = "Popular heights",
  description,
  order = "priority",
}: {
  heading?: string;
  description?: string;
  order?: "priority" | "ascending";
}) {
  const heights = gscPriorityHeightEntries();
  if (order === "ascending") heights.sort((left, right) => left.totalInches - right.totalInches);

  return (
    <div className="popular-heights">
      <h2>{heading}</h2>
      {description ? <p>{description}</p> : null}
      <ul className="link-list">
        {heights.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
