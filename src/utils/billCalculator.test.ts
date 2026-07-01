import { describe, it, expect } from "vitest";
import {
  calculateTotalInclusiveDays,
  calculateBillPerPersonDay,
} from "./billCalculator.ts";

describe("calculateTotalInclusiveDays", () => {
  it("counts both endpoints (inclusive)", () => {
    expect(calculateTotalInclusiveDays("2026-06-01", "2026-06-10")).toBe(10);
  });

  it("returns 1 when start and end are the same day", () => {
    expect(calculateTotalInclusiveDays("2026-06-01", "2026-06-01")).toBe(1);
  });

  it("spans across months (real electricity bill period)", () => {
    expect(calculateTotalInclusiveDays("2026-06-08", "2026-07-05")).toBe(28);
  });

  it("returns null when the start date is empty", () => {
    expect(calculateTotalInclusiveDays("", "2026-06-10")).toBeNull();
  });

  it("returns null when the end date is empty", () => {
    expect(calculateTotalInclusiveDays("2026-06-01", "")).toBeNull();
  });

  it("returns null when both dates are empty", () => {
    expect(calculateTotalInclusiveDays("", "")).toBeNull();
  });

  // Documents CURRENT behavior only.
  // TODO: add validation so end date cannot be before start date.
  it("currently returns a negative count when end is before start", () => {
    expect(calculateTotalInclusiveDays("2026-06-10", "2026-06-05")).toBe(-4);
  });
});

describe("calculateBillPerPersonDay", () => {
  it("divides the bill by total person-days", () => {
    expect(calculateBillPerPersonDay(100, 10)).toBe(10);
  });

  it("preserves cents in the bill amount", () => {
    expect(calculateBillPerPersonDay(50.75, 10)).toBeCloseTo(5.075, 3);
  });

  it("handles non-terminating results", () => {
    expect(calculateBillPerPersonDay(100, 3)).toBeCloseTo(33.33, 2);
  });
});
