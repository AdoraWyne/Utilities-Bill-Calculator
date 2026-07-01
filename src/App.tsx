import { useState } from "react";
import "./App.css";
import {
  calculateTotalInclusiveDays,
  calculateBillPerPersonDay,
} from "./utils/billCalculator.ts";
import Utility from "./components/Utility.tsx";
import Housemate from "./components/Housemate.tsx";

function App() {
  // const [electricity, setElectricity] = useState({
  //   startDate: "2026-06-01",
  //   endDate: "2026-06-10",
  //   totalBill: 0,
  // });
  const [elecBill, setElecBill] = useState<string>("100");
  const [elecStartDate, setElecStartDate] = useState<string>("2026-06-01");
  const [elecEndDate, setElecEndDate] = useState<string>("2026-06-10");

  const elecTotalDays =
    calculateTotalInclusiveDays(elecStartDate, elecEndDate) ?? 0;

  // adora
  const [adoraTravelStartDate, setAdoraTravelStartDate] = useState<string>("");
  const [adoraTravelEndDate, setAdoraTravelEndDate] = useState<string>("");

  const adoraTravelTotalDays =
    calculateTotalInclusiveDays(adoraTravelStartDate, adoraTravelEndDate) ?? 0;
  const adoraElecHomeDays = elecTotalDays - adoraTravelTotalDays;

  // rhea
  const [rheaTravelStartDate, setRheaTravelStartDate] =
    useState<string>("2026-06-01");
  const [rheaTravelEndDate, setRheaTravelEndDate] =
    useState<string>("2026-06-05");

  const rheaTravelTotalDays =
    calculateTotalInclusiveDays(rheaTravelStartDate, rheaTravelEndDate) ?? 0;
  const rheaElecHomeDays = elecTotalDays - rheaTravelTotalDays;

  // calculation
  const totalStayHomeDays = adoraElecHomeDays + rheaElecHomeDays;
  const billPerPersonDay = calculateBillPerPersonDay(
    parseInt(elecBill),
    totalStayHomeDays,
  );
  const adoraElecBill = billPerPersonDay * adoraElecHomeDays;
  const rheaElecBill = billPerPersonDay * rheaElecHomeDays;

  return (
    <>
      <h2>Category</h2>
      <Utility
        utilityTitle="Electricity"
        bill={elecBill}
        setBill={setElecBill}
        startDate={elecStartDate}
        setStartDate={setElecStartDate}
        endDate={elecEndDate}
        setEndDate={setElecEndDate}
      />

      <hr />

      <h2>Housemates</h2>
      <Housemate
        housemateName="adora"
        utilityType="electricity"
        travelStartDate={adoraTravelStartDate}
        setTravelStartDate={setAdoraTravelStartDate}
        travelEndDate={adoraTravelEndDate}
        setTravelEndDate={setAdoraTravelEndDate}
        travelTotalDays={adoraTravelTotalDays}
        homeTotalDays={adoraElecHomeDays}
        bill={adoraElecBill}
      />

      <div>
        <Housemate
          housemateName="rhea"
          utilityType="electricity"
          travelStartDate={rheaTravelStartDate}
          setTravelStartDate={setRheaTravelStartDate}
          travelEndDate={rheaTravelEndDate}
          setTravelEndDate={setRheaTravelEndDate}
          travelTotalDays={rheaTravelTotalDays}
          homeTotalDays={rheaElecHomeDays}
          bill={rheaElecBill}
        />
      </div>

      <hr />
    </>
  );
}

export default App;
