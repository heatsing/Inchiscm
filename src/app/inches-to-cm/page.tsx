import { CoreConverterPage } from "@/components/CoreConverterPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Inches to CM Converter - Formula, Chart, and Examples",
  "Convert inches to centimeters instantly. Enter a whole or decimal inch value and see the exact result and formula.",
  "/inches-to-cm",
);

const faq = [
  { question: "What is the inches to cm formula?", answer: "Multiply inches by 2.54 to get centimeters." },
  { question: "Can I convert decimal inches?", answer: "Yes. Values such as 0.5, 13.3, and 15.6 inches are supported." },
  { question: "How do I convert a height in feet and inches?", answer: "Use the dedicated height converter, which provides separate fields for feet and inches." },
];

export default function InchesToCmPage() {
  return <CoreConverterPage title="Inches to CM Converter" intro="Enter any inch measurement for an instant, exact centimeter result." mode="in-to-cm" formula="inches × 2.54 = centimeters" faq={faq} path="/inches-to-cm" initialValue={12} />;
}
