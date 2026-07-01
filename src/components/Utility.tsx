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
}: UtilityProps) => {
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
            onChange={(e) => setBill(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.divContainer}>
        <label>
          Period from:{" "}
          <input
            type="date"
            name={`${namePrefix}start-date`}
            value={startDate}
            onChange={handleStartChange}
          />
        </label>{" "}
        <label>
          Period to:{" "}
          <input
            type="date"
            name={`${namePrefix}end-date`}
            value={endDate}
            onChange={handleEndChange}
          />
        </label>
      </div>
      <div className={styles.divContainer}>Total days: {totalUtilityDays}</div>
    </>
  );
};

export default Utility;
