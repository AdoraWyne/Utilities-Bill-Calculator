import { useState } from "react";
import styles from "./Utility.module.css";

type UtilityProps = {
  utilityType?: string;
  totalUtilityDays: number;
  bill: string;
  setBill: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  isPeriodValid: boolean;
};

const Utility = ({
  utilityType = "",
  totalUtilityDays,
  bill,
  setBill,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isPeriodValid,
}: UtilityProps) => {
  const [billErrorMsg, setBillErrorMsg] = useState<string>("");

  const handleBillChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (value === "") {
      setBillErrorMsg("");
      setBill(value);
      return;
    }

    // ^\d+       one or more digits (the integer part, required)
    // (\.\d+)?   optionally a dot followed by one or more digits
    // ^...$      anchors so the WHOLE string must match, nothing else allowed
    const isValidNumber = /^\d+(\.\d+)?$/.test(value);

    if (!isValidNumber) {
      setBillErrorMsg("Only number is allowed.");
      setBill(value);
    } else {
      setBillErrorMsg("");
      setBill(value);
    }
  };

  const handleStartChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setStartDate(e.target.value);
  };

  const handleEndChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setEndDate(e.target.value);
  };

  const namePrefix = utilityType ? `${utilityType}-` : "";

  return (
    <>
      <h3>{utilityType ? utilityType : "Utility Bill"}</h3>
      <div className={styles.divContainer}>
        <label>
          Total bill:{" "}
          <input
            type="text"
            name={`${namePrefix}total-bill`}
            value={bill}
            onChange={handleBillChange}
            // onChange={(e) => setBill(e.target.value)}
          />
        </label>
        {billErrorMsg && (
          <p style={{ color: "red", fontSize: "0.8rem" }}>{billErrorMsg}</p>
        )}
      </div>
      <div className={styles.divContainer}>
        <label>
          Period from:{" "}
          <input
            type="date"
            name={`${namePrefix}start-date`}
            value={startDate}
            onChange={handleStartChange}
            max={endDate}
          />
        </label>{" "}
        <label>
          Period to:{" "}
          <input
            type="date"
            name={`${namePrefix}end-date`}
            value={endDate}
            onChange={handleEndChange}
            min={startDate}
          />
        </label>
        {!isPeriodValid && endDate !== "" && startDate !== "" && (
          <p style={{ color: "red", fontSize: "0.8rem" }}>
            End date must be on or after the start date.
          </p>
        )}
      </div>
      <div className={styles.divContainer}>Total days: {totalUtilityDays}</div>
    </>
  );
};

export default Utility;
