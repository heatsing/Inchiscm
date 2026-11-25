import { convertLength, decimalInchesToFraction, formatLength, parseLengthInput } from "./length-units";
import { convertProductDimensions } from "./product-dimensions";

export const questionsPerRound = 10;
export const pointsPerAnswer = 100;

export const quizDifficulties = ["easy", "medium", "hard"] as const;
export type QuizDifficulty = typeof quizDifficulties[number];

type QuestionKind = "in-to-cm" | "cm-to-in" | "decimal" | "fraction" | "sixteenths" | "mixed-fraction" | "ruler" | "dimensions";

export type QuizQuestion = {
  id: string;
  kind: QuestionKind;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  rulerTick?: number;
};

type RandomSource = () => number;

function shuffle<T>(values: readonly T[], random: RandomSource): T[] {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function lengthQuestion(kind: QuestionKind, input: string): QuizQuestion {
  const isReverse = kind === "cm-to-in";
  const fromUnit = isReverse ? "cm" : "in";
  const toUnit = isReverse ? "in" : "cm";
  const value = parseLengthInput(input)!;
  const result = convertLength(value, fromUnit, toUnit);
  const places = isReverse ? 2 : 6;
  const correctAnswer = `${formatLength(result, places)} ${toUnit}`;
  const step = result >= 10 ? 0.75 : result >= 1 ? 0.25 : 0.05;
  const prompt = isReverse
    ? `How many inches are in ${input} cm? Round to the nearest hundredth if needed.`
    : `How many centimeters are in ${input} ${value <= 1 ? "inch" : "inches"}?`;
  const decimalStep = input.includes("/") ? `${input} in equals ${formatLength(value, 6)} in. ` : "";
  const rounded = isReverse && Math.abs(result - Number(result.toFixed(2))) > 1e-10;
  const explanation = isReverse
    ? `Divide centimeters by 2.54. ${input} ÷ 2.54 ${rounded ? "≈" : "="} ${correctAnswer}.${rounded ? " The value is rounded to the nearest hundredth." : ""}`
    : `${decimalStep}Multiply inches by 2.54. ${formatLength(value, 6)} × 2.54 = ${correctAnswer}.`;
  return {
    id: `${kind}-${input}`,
    kind,
    prompt,
    correctAnswer,
    explanation,
    options: [correctAnswer, ...[-1, 1, 2].map((offset) => `${formatLength(result + offset * step, places)} ${toUnit}`)],
  };
}

function rulerAnswer(tick: number) {
  return `${decimalInchesToFraction(tick / 16).slice(0, -1)} in`;
}

function rulerQuestion(tick: number, position: number): QuizQuestion {
  const firstChoice = Math.min(12, Math.max(1, tick - 1));
  const ticks = [firstChoice, firstChoice + 1, firstChoice + 2, firstChoice + 3];
  const correctAnswer = rulerAnswer(tick);
  return {
    id: `ruler-${tick}`,
    kind: "ruler",
    prompt: position === 0 ? "What measurement does the ruler marker show?" : "Which fraction of an inch matches the ruler marker?",
    rulerTick: tick,
    options: ticks.map(rulerAnswer),
    correctAnswer,
    explanation: `Each small step is 1/16 in. Multiply ${tick} steps by 1/16 in to get ${correctAnswer}.`,
  };
}

type SizeExample = readonly [object: string, width: number, height: number];

function dimensionQuestion([object, width, height]: SizeExample): QuizQuestion {
  const converted = convertProductDimensions([width, height], "in-to-cm")!;
  const [widthCm, heightCm] = converted;
  const option = (first: number, second: number) => `${formatLength(first, 4)} × ${formatLength(second, 4)} cm`;
  const correctAnswer = option(widthCm, heightCm);
  return {
    id: `dimensions-${width}x${height}`,
    kind: "dimensions",
    prompt: `A ${object} is ${width} inches wide and ${height} inches tall. What is its width × height in centimeters?`,
    options: [correctAnswer, option(width, height), option(heightCm, widthCm), option(widthCm, height)],
    correctAnswer,
    explanation: `Convert each side separately. The width is ${width} × 2.54 = ${formatLength(widthCm, 4)} cm. The height is ${height} × 2.54 = ${formatLength(heightCm, 4)} cm.`,
  };
}

const wholeInches = ["2", "3", "4", "5", "6", "8", "10", "12", "15", "18", "24", "30", "36", "40", "48"];
const wholeCentimeters = ["5", "8", "10", "12", "15", "20", "25", "30", "40", "50", "60", "75", "100", "127"];
const decimalInches = ["1.2", "2.5", "3.4", "4.75", "5.2", "6.5", "7.25", "8.4", "9.5", "10.75", "11.6", "12.5", "13.3", "15.6"];
const simpleFractions = ["1/2", "1/4", "3/4", "3/8", "5/8"];
const sixteenthFractions = ["1/16", "3/16", "5/16", "7/16", "9/16", "11/16", "13/16", "15/16"];
const mixedFractions = ["1 1/16", "1 3/4", "2 3/16", "2 5/8", "3 3/8", "4 1/4", "5 7/16", "6 13/16"];
const rulerTicks = [2, 3, 5, 7, 9, 11, 13, 14, 15];
const sizeExamples: SizeExample[] = [
  ["photo print", 4, 6],
  ["frame opening", 8, 10],
  ["paper sheet", 8.5, 11],
  ["canvas panel", 12, 16],
  ["poster", 18, 24],
  ["cabinet door", 15, 22],
];

export function createQuizRound(difficulty: QuizDifficulty, random: RandomSource = Math.random): QuizQuestion[] {
  const pickLengths = (kind: QuestionKind, values: readonly string[], count: number) =>
    shuffle(values, random).slice(0, count).map((input) => lengthQuestion(kind, input));
  const questions = difficulty === "easy"
    ? [...pickLengths("in-to-cm", wholeInches, 5), ...pickLengths("cm-to-in", wholeCentimeters, 5)]
    : difficulty === "medium"
      ? [...pickLengths("decimal", decimalInches, 5), ...pickLengths("fraction", simpleFractions, 5)]
      : [
        ...pickLengths("sixteenths", sixteenthFractions, 3),
        ...pickLengths("mixed-fraction", mixedFractions, 3),
        ...shuffle(rulerTicks, random).slice(0, 2).map(rulerQuestion),
        ...shuffle(sizeExamples, random).slice(0, 2).map(dimensionQuestion),
      ];
  return shuffle(questions, random).map((question) => ({ ...question, options: shuffle(question.options, random) }));
}

export function scoreQuiz(questions: readonly QuizQuestion[], answers: readonly string[]) {
  let correct = 0;
  let streak = 0;
  let bestStreak = 0;
  const mistakes: { question: QuizQuestion; answer: string }[] = [];
  const answered = answers.slice(0, questions.length);
  answered.forEach((answer, index) => {
    const question = questions[index];
    if (answer === question.correctAnswer) {
      correct += 1;
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      mistakes.push({ question, answer });
      streak = 0;
    }
  });
  return {
    correct,
    streak,
    bestStreak,
    points: correct * pointsPerAnswer,
    accuracy: answered.length ? Math.round(correct * 100 / answered.length) : 0,
    mistakes,
  };
}

export function formatQuizTime(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
