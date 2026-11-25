import assert from "node:assert/strict";
import test from "node:test";
import { trackGa4Event } from "../src/lib/analytics.ts";

test("quiz GA4 events use the installed tag command", () => {
  const calls = [];
  globalThis.window = { gtag: (...args) => calls.push(args) };
  try {
    trackGa4Event("game_start", { difficulty: "easy" });
    assert.deepEqual(calls, [["event", "game_start", { difficulty: "easy" }]]);
  } finally {
    delete globalThis.window;
  }
});

test("quiz GA4 events queue in gtag format before the tag loads", () => {
  globalThis.window = {};
  try {
    trackGa4Event("game_complete", { difficulty: "hard" });
    assert.deepEqual(Array.from(window.dataLayer[0]), ["event", "game_complete", { difficulty: "hard" }]);
  } finally {
    delete globalThis.window;
  }
});
