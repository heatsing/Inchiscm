import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Privacy Policy - Inch is CM",
  "Read how Inch is CM handles converter inputs, technical logs, cookies, and external links.",
  "/privacy-policy",
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs current="Privacy Policy" />
      <article className="narrow content-page policy-page">
        <div className="eyebrow">Website policy</div>
        <h1>Privacy Policy</h1>
        <p className="lead">This policy explains how Inch is CM handles information when you use the website.</p>
        <p className="policy-updated">Last updated: July 2026</p>

        <h2>Converter inputs</h2>
        <p>
          Length, height, and screen measurements entered into our converters are calculated in your browser.
          Inch is CM does not require an account and does not intentionally store the values you enter.
        </p>

        <h2>Technical information</h2>
        <p>
          Our hosting provider may process standard request information such as IP address, browser type,
          requested page, date, and time for security, reliability, and traffic delivery. This information is
          part of normal website infrastructure and is not used by Inch is CM to identify converter inputs.
        </p>

        <h2>Cookies and advertising</h2>
        <p>
          Inch is CM does not currently display advertising and does not include AdSense code. If analytics,
          advertising, or other cookie-based services are introduced later, this policy will be updated before
          those services are enabled.
        </p>

        <h2>External links</h2>
        <p>
          Some pages may link to external websites for additional context. Their privacy practices are governed
          by their own policies, and Inch is CM is not responsible for external website content or data handling.
        </p>

        <h2>Policy changes</h2>
        <p>
          This policy may be revised when site features or data practices change. The updated date at the top of
          this page indicates the latest published version.
        </p>
      </article>
    </>
  );
}
