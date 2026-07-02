// @vitest-environment node

import { describe, it, expect } from "vitest";
import {
  calculateTotalInclusiveDays,
  calculateBillPerPersonDay,
  calculateBillPerDay,
  calculateEqualSplit,
  calculateMaxDate,
  calculateMinDate,
  calculateTravelDaysInBillingPeriod,
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

describe("calculateMaxDate", () => {
  it("returns the second date when it is later", () => {
    expect(calculateMaxDate("2026-06-01", "2026-06-10")).toBe("2026-06-10");
  });

  it("returns the first date when it is later", () => {
    expect(calculateMaxDate("2026-06-10", "2026-06-01")).toBe("2026-06-10");
  });

  it("returns either date when both are the same day", () => {
    expect(calculateMaxDate("2026-06-01", "2026-06-01")).toBe("2026-06-01");
  });

  it("returns null when a date is empty", () => {
    expect(calculateMaxDate("", "2026-06-01")).toBeNull();
  });
});

describe("calculateMinDate", () => {
  it("returns the first date when it is earlier", () => {
    expect(calculateMinDate("2026-06-01", "2026-06-10")).toBe("2026-06-01");
  });

  it("returns the second date when it is earlier", () => {
    expect(calculateMinDate("2026-06-10", "2026-06-01")).toBe("2026-06-01");
  });

  it("returns either date when both are the same day", () => {
    expect(calculateMinDate("2026-06-01", "2026-06-01")).toBe("2026-06-01");
  });

  it("returns null when a date is empty", () => {
    expect(calculateMinDate("2026-06-01", "")).toBeNull();
  });
});

describe("calculateTravelDaysInBillingPeriod", () => {
  it("counts travel days when the trip falls entirely inside the bill period", () => {
    // bill Jun 1-10, away Jun 1-6 (present from the 6th) => 5 travel days
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-06-01",
        "2026-06-06",
        "2026-06-01",
        "2026-06-10",
      ),
    ).toBe(5);
  });

  it("clamps the leave side when the housemate left before the bill started", () => {
    // bill Jun 8 - Jul 5, away since Jun 1, back Jun 10.
    // Only the 8th and 9th fall inside the period => 2 travel days.
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-06-01",
        "2026-06-10",
        "2026-06-08",
        "2026-07-05",
      ),
    ).toBe(2);
  });

  it("clamps the arrive side when the housemate returns after the bill ended", () => {
    // bill Jun 1-10, away the whole period and beyond => all 10 days count.
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-06-01",
        "2026-07-06",
        "2026-06-01",
        "2026-06-10",
      ),
    ).toBe(10);
  });

  it("treats the arrive day as a present (paying) day", () => {
    // bill Jun 1-10, arrive on the 10th => away Jun 1-9 (9 days), present the 10th.
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-06-01",
        "2026-06-10",
        "2026-06-01",
        "2026-06-10",
      ),
    ).toBe(9);
  });

  it("counts the final billed day when arriving the day after the bill ends", () => {
    // bill Jun 1-10, arrive Jun 11 => all 10 days are travel days.
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-06-01",
        "2026-06-11",
        "2026-06-01",
        "2026-06-10",
      ),
    ).toBe(10);
  });

  it("returns 0 when no travel dates are entered", () => {
    expect(
      calculateTravelDaysInBillingPeriod("", "", "2026-06-01", "2026-06-10"),
    ).toBe(0);
  });

  it("returns 0 when no bill period is entered", () => {
    expect(
      calculateTravelDaysInBillingPeriod("2026-06-01", "2026-06-06", "", ""),
    ).toBe(0);
  });

  it("returns 0 when the trip is entirely before the bill period", () => {
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-05-01",
        "2026-05-10",
        "2026-06-01",
        "2026-06-10",
      ),
    ).toBe(0);
  });

  it("returns 0 when the trip is entirely after the bill period", () => {
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-07-01",
        "2026-07-10",
        "2026-06-01",
        "2026-06-10",
      ),
    ).toBe(0);
  });

  it("returns 0 for reversed travel dates (arrive before leave)", () => {
    // Clamp-only behavior: invalid input resolves safely to 0, no error.
    expect(
      calculateTravelDaysInBillingPeriod(
        "2026-06-10",
        "2026-06-05",
        "2026-06-01",
        "2026-06-20",
      ),
    ).toBe(0);
  });
});
