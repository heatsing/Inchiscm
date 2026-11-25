"use client";

import { Clock3, RotateCcw, Share2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { trackGa4Event } from "@/lib/analytics";
import {
  createQuizRound, formatQuizTime, pointsPerAnswer, questionsPerRound, quizDifficulties, scoreQuiz,
  type QuizDifficulty, type QuizQuestion,
} from "@/lib/measurement-quiz";
import { absoluteUrl } from "@/lib/seo";
import styles from "./MeasurementQuiz.module.css";

const difficultyDetails = {
  easy: { label: "Easy", topics: "Whole inches and centimeters" },
  medium: { label: "Medium", topics: "Decimal inches and common fractions" },
  hard: { label: "Hard", topics: "Sixteenths, mixed fractions, rulers, and 2D sizes" },
};

const practiceHref = "/inches-to-cm#visual-ruler";
const gameUrl = absoluteUrl("/game");
const gameShareMessages = {
  shared: "Game link shared.",
  copied: "Game link copied.",
  manual: "Select and copy the game link below.",
};

async function shareWithBrowser(data: ShareData) {
  if (typeof navigator.share !== "function") return "unavailable";
  try {
    await navigator.share(data);
    return "shared";
  } catch (error) {
    return error instanceof Error && error.name === "AbortError" ? "cancelled" : "unavailable";
  }
}

type Round = {
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  answers: string[];
  index: number;
  startedAt: number;
  finishedAt?: number;
};

function QuizRuler({ tick }: { tick: number }) {
  return (
    <div className={styles.ruler} role="img" aria-label={`A one-inch ruler divided into 16 equal steps. A marker is ${tick} steps from zero.`}>
      <div className={styles.rulerTrack} aria-hidden="true">
        {Array.from({ length: 17 }, (_, index) => (
          <span
            className={styles.rulerTick}
            key={index}
            style={{ left: `${index / 16 * 100}%`, height: index % 8 === 0 ? "1.4rem" : index % 4 === 0 ? "1rem" : index % 2 === 0 ? ".8rem" : ".55rem" }}
          />
        ))}
        <span className={styles.rulerMarker} style={{ left: `${tick / 16 * 100}%` }} />
      </div>
      <div className={styles.rulerLabels} aria-hidden="true"><span>0</span><span>½</span><span>1 in</span></div>
    </div>
  );
}

function GameShareMenu({ gameName, difficulty }: { gameName: string; difficulty: QuizDifficulty }) {
  const dialogId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasDeviceShare, setHasDeviceShare] = useState(false);
  const [feedback, setFeedback] = useState<keyof typeof gameShareMessages | null>(null);
  const encodedUrl = encodeURIComponent(gameUrl);
  const encodedName = encodeURIComponent(gameName);
  const shareLinks = [
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${gameName}\n${gameUrl}`)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedName}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedName}` },
  ];

  function trackShare() {
    trackGa4Event("game_share", { difficulty });
  }

  function openShareMenu() {
    if (!dialog.current || dialog.current.open) return;
    setHasDeviceShare(typeof navigator.share === "function");
    setFeedback(null);
    dialog.current.showModal();
    setIsOpen(true);
  }

  function closeShareMenu() {
    dialog.current?.close();
  }

  function shareToDestination() {
    trackShare();
    closeShareMenu();
  }

  async function copyGameLink() {
    try {
      await navigator.clipboard.writeText(gameUrl);
      setFeedback("copied");
    } catch {
      setFeedback("manual");
    }
  }

  async function shareWithDevice() {
    trackShare();
    const outcome = await shareWithBrowser({ title: gameName, url: gameUrl });
    if (outcome === "shared") setFeedback("shared");
    if (outcome === "unavailable") await copyGameLink();
  }

  return (
    <>
      <button
        ref={trigger}
        className={styles.roundShare}
        type="button"
        aria-label="Share game"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={isOpen}
        onClick={openShareMenu}
      >
        <Share2 aria-hidden="true" /><span>Share</span>
      </button>
      <dialog
        ref={dialog}
        id={dialogId}
        className={styles.shareDialog}
        aria-labelledby={`${dialogId}-title`}
        onClose={() => {
          setIsOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeShareMenu();
        }}
      >
        <div className={styles.sharePanel}>
          <div className={styles.shareHeader}>
            <h2 id={`${dialogId}-title`}>Share game</h2>
            <button className={styles.shareClose} type="button" aria-label="Close share menu" onClick={closeShareMenu}>
              <X aria-hidden="true" />
            </button>
          </div>
          <ul className={styles.shareLinks}>
            {shareLinks.map(({ name, href }) => (
              <li key={name}>
                <a className={styles.shareOption} href={href} target="_blank" rel="noopener noreferrer" onClick={shareToDestination}>
                  {name}
                </a>
              </li>
            ))}
            <li><a className={styles.shareOption} href={`mailto:?subject=${encodedName}&body=${encodedUrl}`} onClick={shareToDestination}>Email</a></li>
            <li>
              <button className={styles.shareOption} type="button" onClick={() => { trackShare(); void copyGameLink(); }}>
                Copy link
              </button>
            </li>
          </ul>
          {hasDeviceShare && <button className={`${styles.shareOption} ${styles.shareMore}`} type="button" onClick={shareWithDevice}>More sharing options</button>}
          <p className={styles.shareStatus} role="status">{feedback && gameShareMessages[feedback]}</p>
          {feedback === "manual" && (
            <label className={styles.copyField}>
              Game link
              <input type="url" readOnly value={gameUrl} onFocus={(event) => event.currentTarget.select()} />
            </label>
          )}
        </div>
      </dialog>
    </>
  );
}

export function MeasurementQuiz({ gameName }: { gameName: string }) {
  const difficultyId = useId();
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("easy");
  const [round, setRound] = useState<Round | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [shareStatus, setShareStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const played = useRef(false);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const startedAt = round?.startedAt;
  const finishedAt = round?.finishedAt;
  const question = round?.questions[round.index];
  const answer = round?.answers[round.index];

  useEffect(() => {
    if (startedAt === undefined || finishedAt !== undefined) return;
    const timer = window.setInterval(() => setElapsed(performance.now() - startedAt), 250);
    return () => window.clearInterval(timer);
  }, [startedAt, finishedAt]);

  useEffect(() => {
    if (played.current) stageHeading.current?.focus();
  }, [startedAt, finishedAt, round?.index]);

  useEffect(() => {
    if (answer !== undefined && finishedAt === undefined) nextButton.current?.focus();
  }, [answer, finishedAt, startedAt]);

  function startRound(level: QuizDifficulty) {
    played.current = true;
    setDifficulty(level);
    setRound({ difficulty: level, questions: createQuizRound(level), answers: [], index: 0, startedAt: performance.now() });
    setElapsed(0);
    setShareStatus("");
    setManualCopy(false);
    trackGa4Event("game_start", { difficulty: level });
  }

  function chooseAnswer(option: string) {
    if (!question || !round || answer !== undefined || round.finishedAt !== undefined) return;
    setRound({ ...round, answers: [...round.answers, option] });
    trackGa4Event("question_answered", { difficulty: round.difficulty, question_kind: question.kind, question_number: round.index + 1 });
  }

  function continueRound() {
    if (!round || answer === undefined || round.finishedAt !== undefined) return;
    if (round.index === round.questions.length - 1) {
      setRound({ ...round, finishedAt: performance.now() });
      trackGa4Event("game_complete", { difficulty: round.difficulty });
    } else {
      setRound({ ...round, index: round.index + 1 });
    }
  }

  if (!round || !question) {
    return (
      <section className={styles.panel} id="measurement-quiz" aria-labelledby="quiz-start-heading">
        <h2 id="quiz-start-heading" ref={stageHeading} tabIndex={-1}>Start a round</h2>
        <p>{questionsPerRound} questions. Earn {pointsPerAnswer} points for each correct answer.</p>
        <fieldset className={styles.difficulties}>
          <legend>Choose a difficulty</legend>
          {quizDifficulties.map((level) => (
            <label className={styles.difficulty} key={level}>
              <input type="radio" name={difficultyId} value={level} checked={difficulty === level} onChange={() => setDifficulty(level)} />
              <span><strong>{difficultyDetails[level].label}</strong><span>{difficultyDetails[level].topics}</span></span>
            </label>
          ))}
        </fieldset>
        <button className="button primary" type="button" onClick={() => startRound(difficulty)}>Start Game</button>
      </section>
    );
  }

  const result = scoreQuiz(round.questions, round.answers);
  const maximumScore = round.questions.length * pointsPerAnswer;
  if (finishedAt !== undefined) {
    const duration = formatQuizTime(finishedAt - round.startedAt);
    const resultText = `I scored ${result.points}/${maximumScore} in ${gameName} (${difficultyDetails[round.difficulty].label}). ${result.correct}/${round.questions.length} correct (${result.accuracy}%) in ${duration}.`;
    const copyText = `${resultText}\n${gameUrl}`;

    async function copyResult() {
      try {
        await navigator.clipboard.writeText(copyText);
        setShareStatus("Result copied.");
        setManualCopy(false);
      } catch {
        setManualCopy(true);
        setShareStatus("Select and copy the result below.");
      }
    }

    async function shareResult() {
      trackGa4Event("game_share", { difficulty: round?.difficulty ?? difficulty });
      const outcome = await shareWithBrowser({ title: gameName, text: resultText, url: gameUrl });
      if (outcome === "cancelled") return;
      if (outcome === "shared") {
        setManualCopy(false);
        setShareStatus("Result shared.");
        return;
      }
      await copyResult();
    }

    return (
      <section className={styles.panel} id="measurement-quiz" aria-labelledby="quiz-results-heading">
        <div className={styles.scoreCard}>
          <h2 id="quiz-results-heading" ref={stageHeading} tabIndex={-1}>Round complete</h2>
          <p>{difficultyDetails[round.difficulty].label}</p>
          <dl className={styles.stats}>
            <div><dt>Score</dt><dd>{result.points.toLocaleString("en-US")} / {maximumScore.toLocaleString("en-US")}</dd></div>
            <div><dt>Correct answers</dt><dd>{result.correct} / {round.questions.length}</dd></div>
            <div><dt>Accuracy</dt><dd>{result.accuracy}%</dd></div>
            <div><dt>Completion time</dt><dd>{duration}</dd></div>
            <div><dt>Best streak</dt><dd>{result.bestStreak}</dd></div>
          </dl>
        </div>
        <div className={styles.actions}>
          <button className="button primary" type="button" onClick={() => startRound(round.difficulty)}>Play Again</button>
          <button className="button" type="button" onClick={copyResult}>Copy Result</button>
          <button className="button" type="button" onClick={shareResult}>Share Result</button>
          <Link className="button" href={practiceHref} onClick={() => trackGa4Event("game_practice_click", { difficulty: round.difficulty })}>Practice with Converter</Link>
        </div>
        <p className={styles.shareStatus} role="status">{shareStatus}</p>
        {manualCopy && (
          <label className={styles.copyField}>
            Result to copy
            <textarea readOnly value={copyText} rows={3} onFocus={(event) => event.currentTarget.select()} />
          </label>
        )}
        <details className={styles.review}>
          <summary>Review Mistakes</summary>
          {result.mistakes.length === 0 ? <p>No mistakes this round.</p> : (
            <ol>
              {result.mistakes.map((mistake) => (
                <li key={mistake.question.id}>
                  <p><strong>{mistake.question.prompt}</strong></p>
                  {mistake.question.rulerTick !== undefined && <QuizRuler tick={mistake.question.rulerTick} />}
                  <p>You chose {mistake.answer}. The correct answer is {mistake.question.correctAnswer}.</p>
                  <p>{mistake.question.explanation}</p>
                </li>
              ))}
            </ol>
          )}
        </details>
        <button className={styles.textButton} type="button" onClick={() => setRound(null)}>Choose a different difficulty</button>
      </section>
    );
  }

  const isCorrect = answer === question.correctAnswer;
  return (
    <section className={styles.activeRound} id="measurement-quiz" aria-labelledby="quiz-question-heading">
      <div className={styles.roundInfo}>
        <select
          className={styles.roundDifficulty}
          aria-label="Start a new round at a different difficulty"
          value={round.difficulty}
          onChange={(event) => {
            const level = quizDifficulties.find((value) => value === event.currentTarget.value);
            if (level !== undefined) startRound(level);
          }}
        >
          <optgroup label="Start a new round">
            {quizDifficulties.map((level) => <option key={level} value={level}>{difficultyDetails[level].label}</option>)}
          </optgroup>
        </select>
        <div className={styles.roundStats}>
          <span>Streak {result.streak}</span>
          <span className={styles.roundTime} role="timer" aria-label="Round time"><Clock3 aria-hidden="true" />{formatQuizTime(elapsed)}</span>
          <GameShareMenu gameName={gameName} difficulty={round.difficulty} />
        </div>
      </div>
      <div className={styles.progress}>
        <p>Question {round.index + 1} of {round.questions.length}</p>
        <ol className={styles.progressDots} aria-hidden="true">
          {round.questions.map(({ id }, index) => <li key={id} data-state={index === round.index ? "current" : index < round.index ? "completed" : undefined} />)}
        </ol>
      </div>
      {question.rulerTick === undefined && (
        <div className={styles.rulerIllustration} aria-hidden="true"><span /></div>
      )}
      <h2 className={styles.question} id="quiz-question-heading" ref={stageHeading} tabIndex={-1}>{question.prompt}</h2>
      {question.rulerTick !== undefined && <QuizRuler tick={question.rulerTick} />}
      <div className={styles.answers} role="group" aria-label="Answer choices">
        {question.options.map((option, index) => (
          <button
            className={styles.answer}
            data-result={answer === undefined ? undefined : option === question.correctAnswer ? "correct" : option === answer ? "incorrect" : undefined}
            type="button"
            key={option}
            disabled={answer !== undefined}
            onClick={() => chooseAnswer(option)}
          >
            <span className={styles.answerLetter} aria-hidden="true">{"ABCD"[index]}</span>
            {option}
          </button>
        ))}
      </div>
      <div role="status">
        {answer !== undefined && (
          <div className={styles.feedback} data-result={isCorrect ? "correct" : "incorrect"}>
            <p><strong>{isCorrect ? "Correct!" : "Incorrect."}</strong> The correct answer is {question.correctAnswer}.</p>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>
      <div className={styles.roundActions}>
        {answer !== undefined && (
          <button className="button primary" ref={nextButton} type="button" onClick={continueRound}>
            {round.index + 1 === round.questions.length ? "See Results" : "Continue"}
          </button>
        )}
        <button className={styles.restart} type="button" onClick={() => startRound(round.difficulty)}><RotateCcw aria-hidden="true" />Restart round</button>
      </div>
    </section>
  );
}
