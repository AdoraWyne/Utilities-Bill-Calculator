export const calculateTotalInclusiveDays = (startDate: string, endDate: string): number | null => {
    if(startDate !== "" && endDate !== ""){
      // dates inclusive
      return Temporal.PlainDate.from(startDate).until(endDate).days + 1;
    }
    return null
  };

export function calculateBillPerPersonDay(totalBill: number, totalPersonDays: number){
    return totalBill / totalPersonDays
}

export function calculateBillPerDay(billPerPersonDay, daysAtHome){
    return billPerPersonDay * daysAtHome
}