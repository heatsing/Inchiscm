import Link from "next/link";
import { gscPriorityHeightLinks } from "@/lib/gsc-priority-heights";

export function PopularHeightLinks({
  heading = "Popular heights",
  description,
}: {
  heading?: string;
  description?: string;
}) {
  return (
    <div className="popular-heights">
      <h2>{heading}</h2>
      {description ? <p>{description}</p> : null}
      <ul className="link-list">
        {gscPriorityHeightLinks().map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
