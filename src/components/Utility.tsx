import { calculateTotalInclusiveDays } from "../utils/billCalculator";

type UtilityProps = {
  utilityTitle: string;
  bill: string;
  setBill: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
};

const Utility = ({
  utilityTitle,
  bill,
  setBill,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: UtilityProps) => {
  const totalDays = calculateTotalInclusiveDays(startDate, endDate) ?? 0;

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

  return (
    <>
      <h3>{utilityTitle}</h3>
      <label>
        {utilityTitle}:{" "}
        <input
          type="text"
          name={`${utilityTitle}-bill`}
          value={bill}
          onChange={(e) => setBill(e.target.value)}
        />
      </label>
      <br />
      <div>
        <label>
          Period from:{" "}
          <input
            type="date"
            name={`${utilityTitle}-start-date`}
            value={startDate}
            onChange={handleStartChange}
          />
        </label>
        <label>
          Period to:{" "}
          <input
            type="date"
            name={`${utilityTitle}-end-date`}
            value={endDate}
            onChange={handleEndChange}
          />
        </label>
      </div>
      <p>Total days: {totalDays}</p>
    </>
  );
};

export default Utility;
