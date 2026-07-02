import styles from "./Housemate.module.css";

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
      <div className={styles.travelDateContainer}>
        <div>
          <label>
            Date when leave home:{" "}
            <input
              type="date"
              name={`${housemateName}-leave-home-date`}
              value={travelStartDate}
              onChange={(e) => setTravelStartDate(e.target.value)}
              aria-describedby={`${housemateName}-leave-home-hint`}
            />
          </label>{" "}
          <p
            id={`${housemateName}-leave-home-hint`}
            className={styles.travelHelperText}
          >
            Date leaving house for travel.
          </p>
        </div>
        <div>
          <label>
            Date when arrive home:{" "}
            <input
              type="date"
              name={`${housemateName}-arrive-home-date`}
              value={travelEndDate}
              onChange={(e) => setTravelEndDate(e.target.value)}
              aria-describedby={`${housemateName}-arrive-home-hint`}
            />
          </label>
          <p
            id={`${housemateName}-arrive-home-hint`}
            className={styles.travelHelperText}
          >
            Date arrive/back home from travel.
          </p>
        </div>
      </div>
      <p>Total travel days: {totalTravelDays ? totalTravelDays : 0}</p>
      <p>Total home days: {totalHomeDays} </p>
      <p>
        Total {utilityType} bill: ${bill.toFixed(2)}
      </p>

      <hr />
    </div>
  );
};

export default Housemate;
