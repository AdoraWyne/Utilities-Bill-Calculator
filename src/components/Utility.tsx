import {calculateTotalInclusiveDays } from "../utils/billCalculator"

type UtilityProps = {
    utilityTitle: string;
    bill: string;
    setBill: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
    startDate: string;
    setStartDate: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
    endDate: string;
    setEndDate: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

const Utility = ({utilityTitle, bill, setBill, startDate, setStartDate, endDate, setEndDate}: UtilityProps) => {

    const totalDays = calculateTotalInclusiveDays(startDate, endDate) ?? 0

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
                Period from:{' '}
                <input
                    type="date"
                    name={`${utilityTitle}-start-date`}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                </label>
                <label>
                Period to:{" "}
                <input 
                    type="date" 
                    name={`${utilityTitle}-end-date`}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                </label>
            </div>
            <p>Total days: totalDays</p>
        </>
    )
}

export default Utility