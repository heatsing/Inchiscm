import { Breadcrumbs } from "./Breadcrumbs";
import { ConversionTable } from "./ConversionTable";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema, siteUrl } from "@/lib/seo";

export function ChartPage({ title, intro, path, direction, values }: { title: string; intro: string; path: string; direction: "in-to-cm" | "cm-to-in"; values: number[] }) {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: title, path }]),
        { "@context": "https://schema.org", "@type": "Dataset", name: title, description: intro, url: `${siteUrl}${path}`, creator: { "@type": "Organization", name: "InchesCM" } },
      ]} />
      <Breadcrumbs current={title} />
      <article className="shell content-page">
        <div className="eyebrow">Reference chart</div>
        <h1>{title}</h1>
        <p className="lead">{intro}</p>
        <ConversionTable direction={direction} values={values} />
      </article>
    </>
  );
}
