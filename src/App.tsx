import { useState } from "react"
import './App.css';
import {calculateTotalInclusiveDays, calculateBillPerPersonDay} from "./utils/billCalculator.ts"
import Utility from "./components/Utility.tsx"

const calTotalDays = (startDate: string, endDate: string): number | null => {
  if(startDate !== "" && endDate !== ""){
    // date inclusive
    return Temporal.PlainDate.from(startDate).until(endDate).days + 1;
  }
  return null
};

function App() {
  const [elecBill, setElecBill] = useState<string>("100")
  const [elecStartDate, setElecStartDate] = useState<string>("2026-06-01")
  const [elecEndDate, setElecEndDate] = useState<string>("2026-06-10")
  
  const elecTotalDays = calculateTotalInclusiveDays(elecStartDate, elecEndDate) ?? 0
  
  // adora
  const [adoraTravelStartDate, setAdoraTravelStartDate] = useState<string>("")
  const [adoraTravelEndDate, setAdoraTravelEndDate] = useState<string>("")

  const adoraTravelTotalDays = calculateTotalInclusiveDays(adoraTravelStartDate, adoraTravelEndDate) ?? 0
  const adoraElecHomeDays = elecTotalDays - adoraTravelTotalDays

  // rhea
  const [rheaTravelStartDate, setRheaTravelStartDate] = useState<string>("2026-06-01")
  const [rheaTravelEndDate, setRheaTravelEndDate] = useState<string>("2026-06-05")
  
  const rheaTravelTotalDays = calculateTotalInclusiveDays(rheaTravelStartDate, rheaTravelEndDate) ?? 0
  const rheaElecHomeDays = elecTotalDays - rheaTravelTotalDays

  const totalStayHomeDays = adoraElecHomeDays + rheaElecHomeDays
  const billPerPersonDay = calculateBillPerPersonDay(elecBill, totalStayHomeDays)
  const adoraElecBill = billPerPersonDay * adoraElecHomeDays
  const rheaElecBill = billPerPersonDay * rheaElecHomeDays
  

  return (
    <>
      <h2>Category</h2>
      <h3>Electricty Bill</h3>
      <label>
        Electricity bill:{" "}
        <input 
        type="text" 
        name="elec-bill"
        value={elecBill}
        onChange={(e) => setElecBill(e.target.value)}
        />
      </label>
      <br />
      <div>
        <label>
          Period from:{' '}
          <input
            type="date"
            name="electricity-start-date"
            value={elecStartDate}
            onChange={(e) => setElecStartDate(e.target.value)}
          />
        </label>
        <label>
          Period to:{" "}
          <input type="date" 
          name="electricity-end-date"
          value={elecEndDate}
          onChange={(e) => setElecEndDate(e.target.value)}
          />
        </label>
      </div>
      <p>Total days: {elecTotalDays ? elecTotalDays : "-"}</p>

      <hr />

      <div>
        <h2>Housemates</h2>
        <h3>adora</h3>
        <label>
          Travel from:{' '}
          <input
            type="date"
            name="adora-travel-start-date"
            value={adoraTravelStartDate}
            onChange={(e) => setAdoraTravelStartDate(e.target.value)}
          />
        </label>
        <label>
          Travel to:{' '}
          <input
            type="date"
            name="adora-travel-end-date"
            value={adoraTravelEndDate}
            onChange={(e) => setAdoraTravelEndDate(e.target.value)}
          />
        </label>
        <p>Total travel days: {adoraTravelTotalDays ? adoraTravelTotalDays : "0"}</p>
        <p>Total home days for electricity: {adoraElecHomeDays} </p>
        <p>Total electricity bill: ${adoraElecBill ? adoraElecBill.toFixed(2) : "-"}</p>
      </div>

      <div>
        <h3>rhea</h3>
        <label>
          Travel from:{' '}
          <input
            type="date"
            name="rhea-travel-start-date"
            value={rheaTravelStartDate}
            onChange={(e) => setRheaTravelStartDate(e.target.value)}
          />
        </label>
        <label>
          Travel to:{' '}
          <input
            type="date"
            name="rhea-travel-end-date"
            value={rheaTravelEndDate}
            onChange={(e) => setRheaTravelEndDate(e.target.value)}
          />
        </label>
        <p>Total travel days: {rheaTravelTotalDays ? rheaTravelTotalDays : "-"}</p>
        <p>Total home days for electricity: {rheaElecHomeDays} </p>
        <p>Total electricity bill: ${rheaElecBill ? rheaElecBill.toFixed(2) : "-"}</p>
      </div>

      <hr />
    </>
  );
}

export default App;
