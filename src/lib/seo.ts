import type { Metadata } from "next";

export const siteUrl = "https://inchiscm.com";
export const defaultSocialImage = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Inch is CM length conversion tools",
};

export function absoluteUrl(path: string) {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Inch is CM",
      images: [
        {
          url: defaultSocialImage.path,
          width: defaultSocialImage.width,
          height: defaultSocialImage.height,
          alt: defaultSocialImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultSocialImage.path],
    },
  };
}

export function webPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": `${siteUrl}#website` },
  };
}

export function webApplicationSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@type": "WebApplication",
    name,
    url: absoluteUrl(path),
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function graphSchema(items: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": items,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
