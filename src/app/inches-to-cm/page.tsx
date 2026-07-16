import { CoreConverterPage } from "@/components/CoreConverterPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Inches to CM Converter - Instant Centimeter Calculator",
  "Convert inches to centimeters instantly. Enter inches, including height formats, and see the exact result and formula.",
  "/inches-to-cm",
);

const faq = [
  { question: "What is the inches to cm formula?", answer: "Multiply inches by 2.54 to get centimeters." },
  { question: "Can I convert decimal inches?", answer: "Yes. Values such as 0.5, 13.3, and 15.6 inches are supported." },
  { question: "Can I enter feet and inches?", answer: "Yes. Inputs such as 5'8\" and 5 ft 8 in are converted to total inches before being converted to centimeters." },
];

export default function InchesToCmPage() {
  return <CoreConverterPage title="Inches to CM Converter" intro="Enter any inch measurement for an instant, exact centimeter result." mode="in-to-cm" formula="inches × 2.54 = centimeters" faq={faq} path="/inches-to-cm" />;
}
