import { ArrowLeftRight, Calculator, FileText, Proportions, Ruler } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { MeasurementQuiz } from "@/components/MeasurementQuiz";
import { registryMetadata, requirePageDefinition } from "@/data/page-registry";
import { breadcrumbSchema, graphSchema, webApplicationSchema, webPageSchema } from "@/lib/seo";
import styles from "./page.module.css";

const path = "/game";
const page = requirePageDefinition(path);
const schema = { name: page.h1, description: page.description, path };

export const metadata = registryMetadata(path);

function FractionIcon() {
  return <span className={styles.fractionIcon} aria-hidden="true">½</span>;
}

const practiceGroups = [
  { title: "Inches and centimeters", links: [
    { href: "/inches-to-cm#visual-ruler", label: "Practice on the dual-unit ruler", Icon: Ruler },
    { href: "/cm-to-inches", label: "CM to inches converter", Icon: ArrowLeftRight },
    { href: "/inch-to-cm-chart#printable-inch-cm", label: "Free printable inch-to-CM chart", Icon: FileText },
  ] },
  { title: "Fractions and dimensions", links: [
    { href: "/fraction-inch-to-cm-chart", label: "Fractional inches in centimeters", Icon: FractionIcon },
    { href: "/inches-to-cm-dimensions#2d", label: "2D dimension conversion practice", Icon: Proportions },
  ] },
];

export default function MeasurementQuizPage() {
  return (
    <>
      <JsonLd data={graphSchema([
        webPageSchema(schema),
        { ...webApplicationSchema(schema), applicationCategory: "EducationalApplication" },
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: page.h1, path }]),
      ])} />
      <div className={styles.breadcrumbs}><Breadcrumbs current={page.h1} /></div>
      <article className={styles.page}>
        <h1>{page.h1}</h1>
        <MeasurementQuiz gameName={page.h1} />
        <div className={styles.intro}>
          <p>Practice converting inches and centimeters in 10-question rounds. Start with whole numbers or try fractions, ruler readings, and practical dimensions.</p>
        </div>
        <section className={styles.rules} aria-labelledby="quiz-rules">
          <h2 className={styles.sectionHeading} id="quiz-rules">How to play</h2>
          <p>Choose a difficulty, then pick one of four answers for each question. After each choice, check the result and its calculation before you continue.</p>
          <ul className={styles.levels}>
            <li><strong>Easy:</strong> whole inches to centimeters and whole centimeters to inches.</li>
            <li><strong>Medium:</strong> decimal inches and common fractions, including 1/2, 1/4, 3/4, 3/8, and 5/8.</li>
            <li><strong>Hard:</strong> sixteenth-inch marks, mixed fractions, ruler readings, and two-dimensional sizes.</li>
          </ul>
          <p>At the end of the round, see your score, accuracy, completion time, and longest streak of correct answers. You can review any missed questions or play another round.</p>
        </section>
        <section className={styles.example} aria-labelledby="quiz-example">
          <h2 className={styles.sectionHeading} id="quiz-example">Example question</h2>
          <div className={styles.exampleCard}>
            <div className={styles.exampleIcon} aria-hidden="true"><Calculator /></div>
            <div className={styles.calculation}>
              <p><strong>How many centimeters is 3/8 inch?</strong></p>
              <p>3 ÷ 8 = 0.375</p>
              <p>0.375 × 2.54 = 0.9525 cm</p>
            </div>
          </div>
        </section>
        <section className={styles.practice} aria-labelledby="quiz-practice">
          <h2 className={styles.sectionHeading} id="quiz-practice">Practice tools</h2>
          <div className={styles.practiceGrid}>
            {practiceGroups.map(({ title, links }) => (
              <div className={styles.practiceCard} key={title}>
                <h3>{title}</h3>
                <ul>
                  {links.map(({ href, label, Icon }) => (
                    <li key={href}><Link href={href}><Icon aria-hidden="true" /><span>{label}</span></Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
