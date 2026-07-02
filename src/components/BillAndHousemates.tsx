import { useState } from "react";
import {
  calculateTotalInclusiveDays,
  calculateTravelDaysInBillingPeriod,
  calculateBillPerPersonDay,
  calculateBillPerDay,
  calculateEqualSplit,
  isValidPeriod,
} from "../utils/billCalculator.ts";
import Utility from "./Utility.tsx";
import Housemate from "./Housemate.tsx";
import styles from "./BillAndHousemate.module.css";

type HousemateInput = {
  name: string;
  leaveHomeDate: string;
  arriveHomeDate: string;
};

const BillAndHousemates = () => {
  const [elecStartDate, setElecStartDate] = useState<string>("");
  const [elecEndDate, setElecEndDate] = useState<string>("");
  const [elecBill, setElecBill] = useState<string>("");

  const isPeriodValid = isValidPeriod(elecStartDate, elecEndDate);

  const elecTotalDays = isPeriodValid
    ? (calculateTotalInclusiveDays(elecStartDate, elecEndDate) ?? 0)
    : 0;

  // ---- housemates -----
  const [housemates, setHousemates] = useState<HousemateInput[]>([
    {
      name: "adora",
      leaveHomeDate: "",
      arriveHomeDate: "",
    },
    {
      name: "rhea",
      leaveHomeDate: "",
      arriveHomeDate: "",
    },
    {
      name: "hong",
      leaveHomeDate: "",
      arriveHomeDate: "",
    },
    {
      name: "dan",
      leaveHomeDate: "",
      arriveHomeDate: "",
    },
  ]);

  const updateHousemate = (
    index: number,
    field: "leaveHomeDate" | "arriveHomeDate",
    value: string,
  ) => {
    setHousemates((prev) => {
      return prev.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    });
  };

  const housematesInfoWithDays = housemates.map((h) => {
    const totalTravelDays = calculateTravelDaysInBillingPeriod(
      h.leaveHomeDate,
      h.arriveHomeDate,
      elecStartDate,
      elecEndDate,
    );
    return {
      ...h,
      totalTravelDays,
      totalHomeDays: elecTotalDays - totalTravelDays,
    };
  });

  const totalStayHomeDays = housematesInfoWithDays.reduce(
    (acc, h) => acc + h.totalHomeDays,
    0,
  );

  // When nobody is home during the bill period (0 total home-days), the per-day
  // math would divide by zero and leave the bill unpaid. Split it equally instead.
  const everyoneAway = totalStayHomeDays === 0;
  const billAmount = Number.isFinite(Number(elecBill)) ? Number(elecBill) : 0;

  const billPerPersonDay = everyoneAway
    ? 0
    : calculateBillPerPersonDay(billAmount, totalStayHomeDays);

  const housematesView = housematesInfoWithDays.map((h) => ({
    ...h,
    bill: everyoneAway
      ? calculateEqualSplit(billAmount, housemates.length)
      : calculateBillPerDay(billPerPersonDay, h.totalHomeDays),
  }));

  return (
    <>
      <h2>Category</h2>
      <Utility
        bill={elecBill}
        setBill={setElecBill}
        startDate={elecStartDate}
        setStartDate={setElecStartDate}
        endDate={elecEndDate}
        setEndDate={setElecEndDate}
        totalUtilityDays={elecTotalDays}
        isPeriodValid={isPeriodValid}
      />

      <hr />

      <h2>Housemates</h2>
      <div className={styles.housematesGrid}>
        {housematesView.map((h, index) => (
          <Housemate
            key={h.name}
            housemateName={h.name}
            leaveHomeDate={h.leaveHomeDate}
            setLeaveHomeDate={(value) =>
              updateHousemate(index, "leaveHomeDate", value)
            }
            arriveHomeDate={h.arriveHomeDate}
            setArriveHomeDate={(value) =>
              updateHousemate(index, "arriveHomeDate", value)
            }
            totalTravelDays={h.totalTravelDays}
            totalHomeDays={h.totalHomeDays}
            bill={h.bill}
          />
        ))}
      </div>
    </>
  );
};

export default BillAndHousemates;
