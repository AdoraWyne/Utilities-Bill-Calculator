type HousemateProps = {
  housemateName: string;
  utilityType: string;
  travelStartDate: string;
  setTravelStartDate: (value: string) => void;
  travelEndDate: string;
  setTravelEndDate: (value: string) => void;
  travelTotalDays: number;
  homeTotalDays: number;
  bill: number;
};

const Housemate = ({
  housemateName,
  utilityType,
  travelStartDate,
  setTravelStartDate,
  travelEndDate,
  setTravelEndDate,
  travelTotalDays,
  homeTotalDays,
  bill,
}: HousemateProps) => {
  return (
    <div>
      <h3>{housemateName}</h3>
      <label>
        Travel from:{" "}
        <input
          type="date"
          name={`${housemateName}-travel-start-date`}
          value={travelStartDate}
          onChange={(e) => setTravelStartDate(e.target.value)}
        />
      </label>
      <label>
        Travel to:{" "}
        <input
          type="date"
          name={`${housemateName}-travel-end-date`}
          value={travelEndDate}
          onChange={(e) => setTravelEndDate(e.target.value)}
        />
      </label>
      <p>Total travel days: {travelTotalDays ? travelTotalDays : 0}</p>
      <p>Total home days: {homeTotalDays} </p>
      <p>
        Total {utilityType} bill: ${bill ? bill.toFixed(2) : "-"}
      </p>
    </div>
  );
};

export default Housemate;
