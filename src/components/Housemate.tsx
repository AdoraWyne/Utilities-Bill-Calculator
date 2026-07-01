type HousemateProps = {
  housemateName: string;
  utilityType?: string;
  travelStartDate: string;
  setTravelStartDate: (value: string) => void;
  travelEndDate: string;
  setTravelEndDate: (value: string) => void;
  totalTravelDays: number;
  totalHomeDays: number;
  bill: number;
};

const Housemate = ({
  housemateName,
  utilityType = "",
  travelStartDate,
  setTravelStartDate,
  travelEndDate,
  setTravelEndDate,
  totalTravelDays,
  totalHomeDays,
  bill,
}: HousemateProps) => {
  return (
    <div>
      <h3>{housemateName}</h3>
      <div>
        <label>
          Travel from:{" "}
          <input
            type="date"
            name={`${housemateName}-travel-start-date`}
            value={travelStartDate}
            onChange={(e) => setTravelStartDate(e.target.value)}
          />
          <span>The day start counting absent.</span>
        </label>{" "}
        <label>
          Travel to:{" "}
          <input
            type="date"
            name={`${housemateName}-travel-end-date`}
            value={travelEndDate}
            onChange={(e) => setTravelEndDate(e.target.value)}
          />
          <span>The last day start counting absent.</span>
        </label>
      </div>
      <p>Total travel days: {totalTravelDays ? totalTravelDays : 0}</p>
      <p>Total home days: {totalHomeDays} </p>
      <p>
        Total {utilityType} bill: ${bill ? bill.toFixed(2) : "-"}
      </p>
    </div>
  );
};

export default Housemate;
