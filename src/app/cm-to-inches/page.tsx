import { CoreConverterPage } from "@/components/CoreConverterPage";
import { cmSlug } from "@/lib/conversions";
import { pageMetadata } from "@/lib/seo";

type SearchParams = Promise<{ value?: string | string[] }>;

function valueFromSearchParams(value: string | string[] | undefined) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 3000 ? parsed : 10;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const { value } = await searchParams;
  const parsed = valueFromSearchParams(value);
  return pageMetadata(
    "CM to Inches Converter",
    "Convert centimeters to inches instantly with the exact formula, rounded results, examples, and charts.",
    value ? cmSlug(parsed) : "/cm-to-inches",
  );
}

const faq = [
  { question: "What is the cm to inches formula?", answer: "Divide centimeters by 2.54 to get inches." },
  { question: "How many inches is 10 cm?", answer: "10 centimeters is approximately 3.937 inches." },
  { question: "Why is the result often a decimal?", answer: "Most centimeter values do not divide evenly by 2.54, so their inch equivalents need decimal places." },
];

export default async function CmToInchesPage({ searchParams }: { searchParams: SearchParams }) {
  const { value } = await searchParams;
  return <CoreConverterPage title="CM to Inches Converter" intro="Enter any centimeter measurement to see its inch equivalent instantly." mode="cm-to-in" formula="centimeters ÷ 2.54 = inches" faq={faq} path="/cm-to-inches" initialValue={valueFromSearchParams(value)} />;
}
