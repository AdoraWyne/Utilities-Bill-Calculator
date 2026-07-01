// @vitest-environment node

import { describe, it, expect } from "vitest";
import {
  calculateTotalInclusiveDays,
  calculateBillPerPersonDay,
  calculateBillPerDay,
  calculateEqualSplit,
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

describe("calculateBillPerDay", () => {
  it("multiplies the per-person-day rate by days at home", () => {
    expect(calculateBillPerDay(10, 5)).toBe(50);
  });

  it("preserves cents", () => {
    expect(calculateBillPerDay(5.075, 10)).toBeCloseTo(50.75, 2);
  });

  it("returns 0 when the housemate was never home", () => {
    expect(calculateBillPerDay(10, 0)).toBe(0);
  });
});

describe("calculateEqualSplit", () => {
  it("splits the bill equally across housemates", () => {
    expect(calculateEqualSplit(100, 4)).toBe(25);
  });

  it("handles non-terminating results", () => {
    expect(calculateEqualSplit(100, 3)).toBeCloseTo(33.33, 2);
  });
});
