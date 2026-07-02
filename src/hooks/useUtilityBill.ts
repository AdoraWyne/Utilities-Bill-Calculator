import { useState } from "react";
import {
  calculateTotalInclusiveDays,
  calculateTravelDaysInBillingPeriod,
  calculateBillPerPersonDay,
  calculateBillPerDay,
  calculateEqualSplit,
  isValidPeriod,
} from "../utils/billCalculator.ts";

export type HousemateInput = {
  name: string;
  leaveHomeDate: string;
  arriveHomeDate: string;
};

export type HousemateBillView = HousemateInput & {
  totalTravelDays: number;
  totalHomeDays: number;
  bill: number;
};

export type UtilityBill = {
  bill: string;
  setBill: (value: string) => void;
  billStartDate: string;
  setBillStartDate: (value: string) => void;
  billEndDate: string;
  setBillEndDate: (value: string) => void;
  billTotalDays: number;
  isPeriodValid: boolean;
  housemates: HousemateBillView[];
};

export function useUtilityBill(housemates: HousemateInput[]): UtilityBill {
  const [billStartDate, setBillStartDate] = useState<string>("");
  const [billEndDate, setBillEndDate] = useState<string>("");
  const [bill, setBill] = useState<string>("");

  const isPeriodValid = isValidPeriod(billStartDate, billEndDate);

  const billTotalDays = isPeriodValid
    ? (calculateTotalInclusiveDays(billStartDate, billEndDate) ?? 0)
    : 0;

  const housematesInfoWithDays = housemates.map((h) => {
    const totalTravelDays = calculateTravelDaysInBillingPeriod(
      h.leaveHomeDate,
      h.arriveHomeDate,
      billStartDate,
      billEndDate,
    );
    return {
      ...h,
      totalTravelDays,
      totalHomeDays: billTotalDays - totalTravelDays,
    };
  });

  const totalStayHomeDays = housematesInfoWithDays.reduce(
    (acc, h) => acc + h.totalHomeDays,
    0,
  );

  // When nobody is home during the bill period (0 total home-days), the per-day
  // math would divide by zero and leave the bill unpaid. Split it equally instead.
  const everyoneAway = totalStayHomeDays === 0;
  const billAmount = Number.isFinite(Number(bill)) ? Number(bill) : 0;

  const billPerPersonDay = everyoneAway
    ? 0
    : calculateBillPerPersonDay(billAmount, totalStayHomeDays);

  const housematesView: HousemateBillView[] = housematesInfoWithDays.map(
    (h) => ({
      ...h,
      bill: everyoneAway
        ? calculateEqualSplit(billAmount, housemates.length)
        : calculateBillPerDay(billPerPersonDay, h.totalHomeDays),
    }),
  );

  return {
    bill,
    setBill,
    billStartDate,
    setBillStartDate,
    billEndDate,
    setBillEndDate,
    billTotalDays,
    isPeriodValid,
    housemates: housematesView,
  };
}
