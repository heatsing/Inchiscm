import { registryMetadata, pageRegistry } from "@/data/page-registry";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClusterLinkIndex } from "@/components/ClusterLinkIndex";
import { JsonLd } from "@/components/JsonLd";
import { buildSiteMapSections } from "@/lib/url-clusters";
import { breadcrumbSchema, graphSchema, webPageSchema } from "@/lib/seo";

export const metadata = registryMetadata("/site-map");

const sections = buildSiteMapSections(pageRegistry).map((section) => (
  section.id === "policies"
    ? { ...section, links: [...section.links, { href: "/sitemap.xml", label: "XML Sitemap" }] }
    : section
));

export default function SiteMapPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema({ name: "Site Map", description: "Browse the main length converters, measurement charts, height and screen tools, guides, and website policies on Inch is CM.", path: "/site-map" }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Site Map", path: "/site-map" }]),
      ])} />
      <Breadcrumbs current="Site Map" wide />
      <article className="shell content-page">
        <div className="eyebrow">Browse Inch is CM</div>
        <h1>Site Map</h1>
        <p className="lead">Find every published converter, chart, height page, and measurement guide, grouped by cluster. Exact inch-to-cm pages stay separate from feet-and-inches height pages.</p>
        <ClusterLinkIndex sections={sections} />
      </article>
    </>
  );
}
