type UtilityProps = {
  utilityType: string;
  totalUtilityDays: number;
  bill: string;
  setBill: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
};

const Utility = ({
  utilityType,
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

  return (
    <>
      <h3>{utilityType}</h3>
      <div>
        <label>
          {utilityType} total bill:{" "}
          <input
            type="text"
            name={`${utilityType}-bill`}
            value={bill}
            onChange={(e) => setBill(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Period from:{" "}
          <input
            type="date"
            name={`${utilityType}-start-date`}
            value={startDate}
            onChange={handleStartChange}
          />
        </label>{" "}
        <label>
          Period to:{" "}
          <input
            type="date"
            name={`${utilityType}-end-date`}
            value={endDate}
            onChange={handleEndChange}
          />
        </label>
      </div>
      <p>Total days: {totalUtilityDays}</p>
    </>
  );
};

export default Utility;
