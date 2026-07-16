import { CoreConverterPage } from "@/components/CoreConverterPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "CM to Inches Converter - Convert Centimeters to Inches",
  "Convert centimeters to inches instantly with the exact formula, rounded results, examples, and charts.",
  "/cm-to-inches",
);

const faq = [
  { question: "What is the cm to inches formula?", answer: "Divide centimeters by 2.54 to get inches." },
  { question: "How many inches is 10 cm?", answer: "10 centimeters is approximately 3.937 inches." },
  { question: "Why is the result often a decimal?", answer: "Most centimeter values do not divide evenly by 2.54, so their inch equivalents need decimal places." },
];

export default function CmToInchesPage() {
  return <CoreConverterPage title="CM to Inches Converter" intro="Enter any centimeter measurement to see its inch equivalent instantly." mode="cm-to-in" formula="centimeters ÷ 2.54 = inches" faq={faq} path="/cm-to-inches" initialValue={25.4} />;
}
