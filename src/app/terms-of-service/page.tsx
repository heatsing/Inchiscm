import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Terms of Service - Inch is CM",
  "Review the terms for using Inch is CM conversion tools, charts, guides, and measurement information.",
  "/terms-of-service",
);

export default function TermsOfServicePage() {
  return (
    <>
      <Breadcrumbs current="Terms of Service" />
      <article className="narrow content-page policy-page">
        <div className="eyebrow">Website policy</div>
        <h1>Terms of Service</h1>
        <p className="lead">These terms apply when you use Inch is CM and its measurement conversion tools.</p>
        <p className="policy-updated">Last updated: July 2026</p>

        <h2>Permitted use</h2>
        <p>
          You may use the converters, charts, and guides for personal, educational, and ordinary business
          measurement tasks. Do not interfere with the website, attempt unauthorized access, or use automated
          requests in a way that disrupts service for other visitors.
        </p>

        <h2>Accuracy and rounding</h2>
        <p>
          Inch is CM uses established length conversion factors, including the exact definition of one inch as
          2.54 centimeters. Displayed results may be rounded for readability. You are responsible for selecting
          suitable precision and independently checking measurements used for safety-critical, medical,
          engineering, manufacturing, or contractual decisions.
        </p>

        <h2>No professional advice</h2>
        <p>
          The website provides general measurement information and calculation tools. It does not provide
          engineering, medical, legal, construction, or other professional advice.
        </p>

        <h2>Availability</h2>
        <p>
          We may correct errors, improve features, or update content without notice. Continuous or error-free
          access is not guaranteed.
        </p>

        <h2>External links</h2>
        <p>
          Links to third-party websites are provided for convenience. Inch is CM does not control or endorse all
          external content and is not responsible for third-party availability or policies.
        </p>

        <h2>Privacy</h2>
        <p>
          Please review the <Link href="/privacy-policy">Privacy Policy</Link> for information about converter
          inputs, technical logs, cookies, and advertising status.
        </p>
      </article>
    </>
  );
}
