import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { MeasurementQuiz } from "@/components/MeasurementQuiz";
import { RelatedLinks } from "@/components/RelatedLinks";
import { registryMetadata, requirePageDefinition } from "@/data/page-registry";
import { breadcrumbSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";

const path = "/game";
const page = requirePageDefinition(path);
const schema = { name: page.h1, description: page.description, path };

export const metadata = registryMetadata(path);

export default function MeasurementQuizPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema(schema),
        { ...webApplicationSchema(schema), applicationCategory: "EducationalApplication" },
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: page.h1, path }]),
      ])} />
      <Breadcrumbs current={page.h1} />
      <article className="narrow content-page">
        <h1>{page.h1}</h1>
        <p className="lead">Practice converting inches and centimeters in 10-question rounds. Start with whole numbers or try fractions, ruler readings, and practical dimensions.</p>
        <MeasurementQuiz />
        <section aria-labelledby="quiz-rules">
          <h2 id="quiz-rules">How to play</h2>
          <p>Choose a difficulty, then pick one of four answers for each question. After each choice, check the result and its calculation before you continue.</p>
          <ul>
            <li><strong>Easy:</strong> whole inches to centimeters and whole centimeters to inches.</li>
            <li><strong>Medium:</strong> decimal inches and common fractions, including 1/2, 1/4, 3/4, 3/8, and 5/8.</li>
            <li><strong>Hard:</strong> sixteenth-inch marks, mixed fractions, ruler readings, and two-dimensional sizes.</li>
          </ul>
          <p>At the end of the round, see your score, accuracy, completion time, and longest streak of correct answers. You can review any missed questions or play another round.</p>
        </section>
        <section aria-labelledby="quiz-example">
          <h2 id="quiz-example">Example question</h2>
          <p><strong>How many centimeters is 3/8 inch?</strong> First divide 3 by 8 to get 0.375 inches. Then multiply by 2.54 to get exactly 0.9525 cm.</p>
        </section>
        <h2>Practice tools</h2>
        <RelatedLinks sections={[
          { title: "Inches and centimeters", links: [
            { href: "/inches-to-cm#visual-ruler", label: "Practice on the dual-unit ruler" },
            { href: "/cm-to-inches", label: "CM to inches converter" },
            { href: "/inch-to-cm-chart#printable-inch-cm", label: "Free printable inch-to-CM chart" },
          ] },
          { title: "Fractions and dimensions", links: [
            { href: "/fraction-inch-to-cm-chart", label: "Fractional inches in centimeters" },
            { href: "/inches-to-cm-dimensions#2d", label: "2D dimension conversion practice" },
          ] },
        ]} />
      </article>
    </>
  );
}
