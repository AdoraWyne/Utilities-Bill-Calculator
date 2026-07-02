# Plan: Add tests for bill calculation utils

## Context

The app splits shared utility bills among 4 housemates, deducting days each person
was travelling. The user has been refactoring with **no test safety net** and manually
re-testing every change. Their non-negotiable requirement: **the calculation must be
correct.**

This plan adds a focused **unit-test suite for the pure calculation functions** in
`src/utils/billCalculator.ts` (the layer where money is computed), plus a few small
code changes the user explicitly opted into during scoping. Test scope is deliberately
**pure utils only** — no DOM / React Testing Library — because that is where correctness
lives and it keeps the suite fast and simple.

During scoping the user made these decisions:
- **Overlap** (travel outside the bill window): NOT handled now. The user will rely on
  entering travel dates *within* the bill period. Tests document current subtraction
  behavior; a real fix (clip/validate travel to the bill window) is a **future task**.
- **Invalid date range** (end before start): keep current negative output; input
  validation is a **future task**. Tests just document it.
- **Everyone away** (0 total home-days): bill must still be paid, so **split equally**
  among housemates. Needs a small new helper (see below).
- **`calculateBillPerDay`**: currently dead code — wire it into the component and test it.
- **Decimals**: bills have cents; test them. Root fix is `parseInt` → `Number` in the
  component.

## Part A — Test tooling setup

Install and wire up **Vitest** (native fit for this Vite project; no jsdom needed for
pure functions).

- `npm install -D vitest`
- Add to `package.json` scripts: `"test": "vitest"` and `"test:run": "vitest run"`.
- No new config file required — Vitest reads the existing `vite.config.ts`. (If globals
  are desired, add `test: { globals: true }` there; otherwise import `describe/it/expect`
  from `vitest` in the test file.)

## Part B — The tests to add (core deliverable)

New file: `src/utils/billCalculator.test.ts`. Use `toBeCloseTo(value, 2)` for any
money/division result to avoid floating-point flakiness.

### `calculateTotalInclusiveDays(start, end)`
- Happy path, inclusive: `"2026-06-01" → "2026-06-10"` = **10**.
- Single day: `"2026-06-01" → "2026-06-01"` = **1**.
- Cross-month (real bill period): `"2026-06-08" → "2026-07-05"` = **28**.
- Empty start → **null**; empty end → **null**; both empty → **null**.
- Documented current behavior (with a `// TODO: validation` comment): end before start
  `"2026-06-10" → "2026-06-05"` = **-4**.

### `calculateBillPerPersonDay(totalBill, totalPersonDays)`
- Happy: `(100, 10)` = **10**.
- Decimal bill flows through: `(50.75, 10)` ≈ **5.075**.
- Non-terminating result: `(100, 3)` ≈ **33.33** (`toBeCloseTo`).
- (This function assumes `totalPersonDays > 0`; the zero case is handled by the
  equal-split path below, not here.)

### `calculateBillPerDay(billPerPersonDay, daysAtHome)`
- Happy: `(10, 5)` = **50**.
- Decimals: `(5.075, 10)` ≈ **50.75**.
- Zero days at home: `(10, 0)` = **0**.

### `calculateEqualSplit(totalBill, numHousemates)` (new — see Part C)
- `(100, 4)` = **25**.
- Decimal result: `(100, 3)` ≈ **33.33**.

## Part C — Small code changes (opted into during scoping)

These make the tested functions actually used and correct. They are **not** covered by
the utils-only suite, so verify them manually (as the user already does) — see
Verification.

1. **Decimal fix** — `src/components/BillAndHousemates.tsx:74`: replace
   `parseInt(elecBill)` with `Number(elecBill)` so cents aren't truncated. (`parseInt`
   currently turns `"50.75"` into `50`.)

2. **Use `calculateBillPerDay`** — `src/components/BillAndHousemates.tsx:80`: replace the
   inline `billPerPersonDay * h.totalHomeDays` with
   `calculateBillPerDay(billPerPersonDay, h.totalHomeDays)`. Removes duplicated logic.

3. **Everyone-away equal split**:
   - Add to `src/utils/billCalculator.ts`:
     `calculateEqualSplit(totalBill, numHousemates) => totalBill / numHousemates`.
   - In `BillAndHousemates.tsx`, when `totalStayHomeDays === 0` (and a bill is entered),
     each housemate's `bill` becomes `calculateEqualSplit(Number(elecBill), housemates.length)`
     instead of the per-day path (which would be 0 and leave the bill unpaid). This also
     avoids the current `Infinity` from `bill / 0`.

## Files

- `package.json` — add vitest dev dep + test scripts.
- `src/utils/billCalculator.ts` — add `calculateEqualSplit`.
- `src/utils/billCalculator.test.ts` — **new**, the suite above.
- `src/components/BillAndHousemates.tsx` — `Number()` fix, use `calculateBillPerDay`,
  equal-split guard.

> **Status: Parts A–C are DONE and verified (15 unit tests green, build clean).**
> Part D below is the current follow-up: RTL integration tests for the component wiring.

## Part D — RTL integration tests (current follow-up)

**Why:** Parts A–C added pure-util tests, but the *component wiring* (state → home-days →
`everyoneAway` branch → `calculateBillPerDay`/`calculateEqualSplit` → rendered `$X.XX`)
is only manually verified. These three tests automate exactly the three manual cases in
the Verification section, so a regression in the wiring fails CI instead of slipping by.

### D1 — Dev deps
`npm install -D @testing-library/react @testing-library/dom @testing-library/jest-dom jsdom`
(`@testing-library/dom` is a required peer of RTL v16; `fireEvent` covers the date
inputs, so no `user-event` needed.)

### D2 — Test env wiring
- `vite.config.ts`: change the import to `import { defineConfig } from "vitest/config";`
  and add:
  ```ts
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
  ```
- New `src/test/setup.ts`: `import "@testing-library/jest-dom";` (registers the DOM
  matchers; RTL auto-cleanup runs via the global `afterEach` that `globals: true` provides).
- `tsconfig.app.json`: extend `types` to
  `["vite/client", "vitest/globals", "@testing-library/jest-dom"]`. **Required** because
  `tsconfig.app.json` includes `src`, so `tsc -b` (the build) type-checks the in-`src`
  test files — without these, global `describe/it/expect` and `toHaveTextContent` won't
  type-check and `npm run build` breaks.

### D3 — New test file: `src/components/BillAndHousemates.test.tsx`

Query helpers (handle the 4 duplicated "Travel from:"/"Travel to:" labels by targeting
input `name`, and scope assertions to one housemate via its `<h3>` heading):
```ts
const setInput = (name: string, value: string) =>
  fireEvent.change(
    document.querySelector(`input[name="${name}"]`) as HTMLInputElement,
    { target: { value } },
  );
const section = (name: string) =>
  screen.getByRole("heading", { name }).closest("div") as HTMLElement;
```
Input names available: Utility → `total-bill`, `start-date`, `end-date`; each housemate →
`<name>-travel-start-date`, `<name>-travel-end-date`. Bill renders as `$${bill.toFixed(2)}`
(or `$-` when 0). Housemate names: `adora`, `rhea`, `hong`, `dan`.

**Test 1 — one-traveller hand-calc (core correctness anchor).**
Electricity `2026-06-01 → 2026-06-10` (10 days), bill `100`, adora travels
`2026-06-01 → 2026-06-05` (5 days). Total home-days = 5 + 10·3 = 35, rate = 100/35.
- `screen.getByText("Total days: 10")` present.
- `section("adora")` → `Total home days: 5`, `$14.29` (2.857·5).
- `section("rhea")` → `Total home days: 10`, `$28.57` (2.857·10).

**Test 2 — decimals not truncated (guards the `Number()` fix, line 81).**
10-day period, bill `50.40`, nobody travels → each home 10, total 40, rate 1.26, ·10.
- `section("adora")` → `$12.60`. (Old `parseInt` would render `$12.50`, so this fails
  if anyone reverts to `parseInt`.)

**Test 3 — everyone away → equal split (guards the `everyoneAway` branch).**
10-day period, bill `100`, all four travel `2026-06-01 → 2026-06-10` (home 0).
- each `section(name)` → `$25.00` (100/4).
- `expect(screen.queryByText(/Infinity/)).toBeNull();`

## Explicitly out of scope (future tasks)

- Overlap-aware travel clipping (travel days outside the bill window).
- Date-range validation (end must be ≥ start).

## Verification

1. `npm run test:run` — all tests green (15 existing unit + 3 new integration).
2. `npm run build` — `tsc -b` type-checks the in-`src` test files (needs the D2 tsconfig
   types) and Vite builds.
3. Sanity: temporarily revert `Number(elecBill)` → `parseInt(elecBill)` and confirm
   Test 2 fails (proves the decimal test actually guards the fix), then restore.
