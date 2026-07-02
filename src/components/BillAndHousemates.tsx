import { useState } from "react";
import {
  calculateTotalInclusiveDays,
  calculateTotalExclusiveDays,
  calculateBillPerPersonDay,
  calculateBillPerDay,
  calculateEqualSplit,
} from "../utils/billCalculator.ts";
import Utility from "./Utility.tsx";
import Housemate from "./Housemate.tsx";
import styles from "./BillAndHousemate.module.css";

type HousemateInput = {
  name: string;
  travelStartDate: string;
  travelEndDate: string;
};

const BillAndHousemates = () => {
  const [elecStartDate, setElecStartDate] = useState<string>("");
  const [elecEndDate, setElecEndDate] = useState<string>("");
  const [elecBill, setElecBill] = useState<string>("");
  const elecTotalDays =
    calculateTotalInclusiveDays(elecStartDate, elecEndDate) ?? 0;

  // ---- housemates -----
  const [housemates, setHousemates] = useState<HousemateInput[]>([
    {
      name: "adora",
      travelStartDate: "",
      travelEndDate: "",
    },
    {
      name: "rhea",
      travelStartDate: "",
      travelEndDate: "",
    },
    {
      name: "hong",
      travelStartDate: "",
      travelEndDate: "",
    },
    {
      name: "dan",
      travelStartDate: "",
      travelEndDate: "",
    },
  ]);

  const updateHousemate = (
    index: number,
    field: "travelStartDate" | "travelEndDate",
    value: string,
  ) => {
    setHousemates((prev) => {
      return prev.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    });
  };

  const housematesInfoWithDays = housemates.map((h) => {
    const totalTravelDays =
      (calculateTotalExclusiveDays(h.travelStartDate, h.travelEndDate) ?? 0) >
      elecTotalDays
        ? elecTotalDays
        : (calculateTotalExclusiveDays(h.travelStartDate, h.travelEndDate) ??
          0);
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

  const billPerPersonDay = everyoneAway
    ? 0
    : calculateBillPerPersonDay(Number(elecBill), totalStayHomeDays);

  const housematesView = housematesInfoWithDays.map((h) => ({
    ...h,
    bill: everyoneAway
      ? calculateEqualSplit(Number(elecBill), housemates.length)
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
      />

      <hr />

      <h2>Housemates</h2>
      <div className={styles.housematesGrid}>
        {housematesView.map((h, index) => (
          <Housemate
            key={h.name}
            housemateName={h.name}
            travelStartDate={h.travelStartDate}
            setTravelStartDate={(value) =>
              updateHousemate(index, "travelStartDate", value)
            }
            travelEndDate={h.travelEndDate}
            setTravelEndDate={(value) =>
              updateHousemate(index, "travelEndDate", value)
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
