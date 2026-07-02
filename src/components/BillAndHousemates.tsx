import { useState } from "react";
import Utility from "./Utility.tsx";
import Housemate from "./Housemate.tsx";
import styles from "./BillAndHousemate.module.css";
import {
  type HousemateInput,
  useUtilityBill,
} from "../hooks/useUtilityBill.ts";

const BillAndHousemates = () => {
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
  const electricity = useUtilityBill(housemates);

  const updateHousemate = (
    index: number,
    field: "leaveHomeDate" | "arriveHomeDate",
    value: string,
  ) => {
    setHousemates((prev) => {
      return prev.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    });
  };

  return (
    <>
      <h2>Category</h2>
      <Utility
        bill={electricity.bill}
        setBill={electricity.setBill}
        startDate={electricity.billStartDate}
        setStartDate={electricity.setBillStartDate}
        endDate={electricity.billEndDate}
        setEndDate={electricity.setBillEndDate}
        totalUtilityDays={electricity.billTotalDays}
        isPeriodValid={electricity.isPeriodValid}
      />

      <hr />

      <h2>Housemates</h2>
      <div className={styles.housematesGrid}>
        {electricity.housemates.map((h, index) => (
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
