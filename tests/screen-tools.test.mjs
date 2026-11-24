import assert from 'node:assert/strict';
import test from 'node:test';
import * as screens from '../src/lib/screen-dimensions.ts';
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.0001, `${actual} != ${expected}`);

test('screen route defaults match the advertised ratio and device size', () => {
  for (const [slug, ratio, diagonal] of [
    ['21-9-screen-size-calculator', '21:9', 34],
    ['ultrawide-screen-dimensions-calculator', '21:9', 34],
    ['16-10-screen-size-calculator', '16:10', 16],
    ['4-3-screen-size-calculator', '4:3', 27],
    ['tv-dimensions-calculator', '16:9', 55],
    ['laptop-screen-size-calculator', '16:9', 15.6],
  ]) assert.deepEqual(screens.getScreenDefaults(slug), { diagonal, aspectRatio: ratio });
  assert.equal(screens.getAspectRatio('21:9').width, 21);
});

test('strict ultrawide, 16:10 and 4:3 dimensions use the correct geometry', () => {
  const wide = screens.calculateScreenDimensions(34, 21, 9);
  near(wide.widthCm, 79.3774); near(wide.heightCm, 34.0189);
  const laptop = screens.calculateScreenDimensions(16, 16, 10);
  near(laptop.widthCm, 34.4627); near(laptop.heightCm, 21.5392);
  const classic = screens.calculateScreenDimensions(10, 4, 3);
  near(classic.widthInches, 8); near(classic.heightInches, 6);
});

test('physical sides calculate diagonal in either unit', () => {
  const metric = screens.calculateScreenDiagonal(30, 40, 'cm');
  near(metric.diagonalCm, 50); near(metric.diagonalInches, 50 / 2.54);
  const imperial = screens.calculateScreenDiagonal(12, 16, 'in');
  near(imperial.diagonalInches, 20); near(imperial.diagonalCm, 50.8);
});

test('measured panel sides calculate area and reject invalid or overflowing input', () => {
  const metric = screens.calculateScreenArea(40, 30, 'cm');
  near(metric.areaCm2, 1200); near(metric.diagonalCm, 50);
  const imperial = screens.calculateScreenArea(10, 5, 'in');
  near(imperial.areaInput, 50); near(imperial.areaCm2, 50 * 2.54 * 2.54);
  for (const value of [0, -1, NaN, Infinity, 1e308]) {
    assert.equal(screens.calculateScreenArea(value, 30, 'cm'), null);
  }
});

test('pixel resolutions simplify exactly and recognize common ratio names', () => {
  assert.deepEqual(screens.calculateAspectRatio(1920, 1080), { exact: '16:9', common: '16:9', decimal: 16 / 9 });
  assert.deepEqual(screens.calculateAspectRatio(2560, 1600), { exact: '8:5', common: '16:10', decimal: 1.6 });
  const ultrawide = screens.calculateAspectRatio(3440, 1440);
  assert.equal(ultrawide.exact, '43:18');
  assert.equal(ultrawide.common, null);
});

test('invalid or overflowing screen inputs produce no result', () => {
  for (const value of [0, -1, NaN, Infinity]) {
    assert.equal(screens.calculateScreenDimensions(value, 16, 9), null);
    assert.equal(screens.calculateScreenDiagonal(value, 40, 'cm'), null);
  }
  assert.equal(screens.calculateScreenDimensions(1e308, 16, 9), null);
  assert.equal(screens.calculateScreenDiagonal(Number.MAX_VALUE, Number.MAX_VALUE, 'cm'), null);
  assert.equal(screens.calculateScreenDimensions(24, 0, 9), null);
  assert.equal(screens.calculateAspectRatio(1.5, 1080), null);
  assert.equal(screens.calculateAspectRatio(1e20, 1080), null);
  assert.equal(screens.calculateAspectRatio(1920, 0), null);
});

test('revised calculator pages get explicit dates without refreshing unchanged pages', async () => {
  const { routeUpdatedAt } = await import('../src/data/page-registry/constants.ts');
  assert.equal(routeUpdatedAt('/21-9-screen-size-calculator'), '2026-11-15');
  assert.equal(routeUpdatedAt('/inches-to-cm-dimensions'), '2026-11-25');
  assert.equal(routeUpdatedAt('/1-5-inches-in-cm'), '2026-07-28');
});

test('screen measurements never round a positive result down to displayed zero', () => {
  assert.equal(screens.formatScreenMeasurement(0.001, 2), '1.0000e-3');
  assert.equal(screens.formatScreenMeasurement(79.3774, 2), '79.38');
  const diagonal = screens.calculateScreenDiagonal(0.001, 0.001, 'cm');
  assert.notEqual(screens.formatScreenMeasurement(diagonal.diagonalCm, 2), '0');
  const narrow = screens.calculateScreenDimensions(27, 100000, 1);
  assert.notEqual(screens.formatScreenMeasurement(narrow.heightCm, 2), '0');
});

test('near-common huge integer resolutions do not claim an exact common ratio', () => {
  const result = screens.calculateAspectRatio(8000000000000007, 4500000000000004);
  assert.equal(result.exact, '8000000000000007:4500000000000004');
  assert.equal(result.common, null);
});
