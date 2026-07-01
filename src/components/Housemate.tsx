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
            Travel from:{" "}
            <input
              type="date"
              name={`${housemateName}-travel-start-date`}
              value={travelStartDate}
              onChange={(e) => setTravelStartDate(e.target.value)}
              aria-describedby={`${housemateName}-travel-start-hint`}
            />
          </label>{" "}
          <p
            id={`${housemateName}-travel-start-hint`}
            className={styles.travelHelperText}
          >
            The first day starts counting absent.
          </p>
        </div>
        <div>
          <label>
            Travel to:{" "}
            <input
              type="date"
              name={`${housemateName}-travel-end-date`}
              value={travelEndDate}
              onChange={(e) => setTravelEndDate(e.target.value)}
              aria-describedby={`${housemateName}-travel-end-hint`}
            />
          </label>
          <p
            id={`${housemateName}-travel-end-hint`}
            className={styles.travelHelperText}
          >
            The last day starts counting absent.
          </p>
        </div>
      </div>
      <p>Total travel days: {totalTravelDays ? totalTravelDays : 0}</p>
      <p>Total home days: {totalHomeDays} </p>
      <p>
        Total {utilityType} bill: ${bill ? bill.toFixed(2) : "-"}
      </p>

      <hr />
    </div>
  );
};

export default Housemate;
