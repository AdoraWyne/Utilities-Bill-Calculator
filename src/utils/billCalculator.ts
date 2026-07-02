import { Temporal } from "temporal-polyfill";

export const calculateTotalInclusiveDays = (
  startDate: string,
  endDate: string,
): number | null => {
  if (startDate !== "" && endDate !== "") {
    // dates inclusive
    return Temporal.PlainDate.from(startDate).until(endDate).days + 1;
  }
  return null;
};

export const calculateTotalExclusiveDays = (
  startDate: string,
  endDate: string,
): number | null => {
  if (startDate !== "" && endDate !== "") {
    // dates inclusive
    return Temporal.PlainDate.from(startDate).until(endDate).days;
  }
  return null;
};

export const calculateMaxDate = (date1: string, date2: string) => {
  if (date1 !== "" && date2 !== "") {
    const comparisonIndex = Temporal.PlainDate.compare(date1, date2);
    if (comparisonIndex < 0) {
      return date2;
    } else {
      return date1;
    }
  }
  return null;
};

export const calculateMinDate = (date1: string, date2: string) => {
  if (date1 !== "" && date2 !== "") {
    const comparisonIndex = Temporal.PlainDate.compare(date1, date2);
    if (comparisonIndex > 0) {
      return date2;
    } else {
      return date1;
    }
  }

  return null;
};

export function calculateBillPerPersonDay(
  totalBill: number,
  totalPersonDays: number,
) {
  return totalBill / totalPersonDays;
}

export function calculateBillPerDay(
  billPerPersonDay: number,
  daysAtHome: number,
) {
  return billPerPersonDay * daysAtHome;
}

// Fallback for when nobody is home during the bill period (0 total home-days).
// The bill still has to be paid, so split it equally across all housemates.
export function calculateEqualSplit(totalBill: number, numHousemates: number) {
  return totalBill / numHousemates;
}
