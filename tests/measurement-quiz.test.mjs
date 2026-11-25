import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { parseLengthInput } from "../src/lib/length-units.ts";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL?.endsWith("/measurement-quiz.ts") && ["./length-units", "./product-dimensions"].includes(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
const { createQuizRound, formatQuizTime, quizDifficulties, questionsPerRound, scoreQuiz } = await import("../src/lib/measurement-quiz.ts");
hooks.deregister();

function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x100000000;
  };
}

test("each round has ten distinct questions with four distinguishable choices", () => {
  for (const difficulty of quizDifficulties) {
    for (let seed = 0; seed < 80; seed += 1) {
      const round = createQuizRound(difficulty, seededRandom(seed));
      assert.equal(round.length, questionsPerRound);
      assert.equal(new Set(round.map((question) => question.id)).size, questionsPerRound);
      assert.equal(new Set(round.map((question) => question.prompt)).size, questionsPerRound);
      for (const question of round) {
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options).size, 4);
        assert.ok(question.options.includes(question.correctAnswer));
        assert.ok(question.explanation);
      }
    }
  }
  assert.notDeepEqual(createQuizRound("easy", seededRandom(1)), createQuizRound("easy", seededRandom(2)));
});

test("question categories cover the skills promised at each difficulty", () => {
  const easy = createQuizRound("easy", () => .999);
  assert.equal(easy.filter((question) => question.kind === "in-to-cm").length, 5);
  assert.equal(easy.filter((question) => question.kind === "cm-to-in").length, 5);
  const reverse = easy.find((question) => question.id === "cm-to-in-5");
  assert.equal(reverse.correctAnswer, "1.97 in");
  assert.match(reverse.explanation, /≈ 1\.97 in.*rounded to the nearest hundredth/);

  const medium = createQuizRound("medium", () => .999);
  assert.equal(medium.filter((question) => question.kind === "decimal").length, 5);
  assert.deepEqual(
    medium.filter((question) => question.kind === "fraction").map((question) => question.correctAnswer),
    ["1.27 cm", "0.635 cm", "1.905 cm", "0.9525 cm", "1.5875 cm"],
  );

  const hard = createQuizRound("hard", () => .999);
  assert.equal(hard.filter((question) => question.kind === "sixteenths").length, 3);
  assert.equal(hard.filter((question) => question.kind === "mixed-fraction").length, 3);
  const rulers = hard.filter((question) => question.kind === "ruler");
  assert.equal(rulers.length, 2);
  for (const ruler of rulers) {
    assert.equal(parseLengthInput(ruler.correctAnswer.replace(" in", "")) * 16, ruler.rulerTick);
  }
  const dimensions = hard.filter((question) => question.kind === "dimensions");
  assert.equal(dimensions.length, 2);
  assert.equal(dimensions[0].correctAnswer, "10.16 × 15.24 cm");
  assert.equal(dimensions[1].correctAnswer, "20.32 × 25.4 cm");
});

test("scores points and accuracy, resets streaks, and retains mistake review data", () => {
  const round = createQuizRound("easy", seededRandom(1));
  const correctness = [true, true, false, true, true, true, false, true, false, true];
  const answers = round.map((question, index) => correctness[index]
    ? question.correctAnswer
    : question.options.find((option) => option !== question.correctAnswer));
  const result = scoreQuiz(round, answers);
  assert.equal(result.correct, 7);
  assert.equal(result.points, 700);
  assert.equal(result.accuracy, 70);
  assert.equal(result.bestStreak, 3);
  assert.equal(result.streak, 1);
  assert.deepEqual(result.mistakes, [2, 6, 8].map((index) => ({ question: round[index], answer: answers[index] })));
  assert.equal(scoreQuiz(round, []).accuracy, 0);
  assert.equal(scoreQuiz(round, answers.slice(0, 3)).accuracy, 67);
  assert.equal(formatQuizTime(0), "0:00");
  assert.equal(formatQuizTime(65_999), "1:05");
});
