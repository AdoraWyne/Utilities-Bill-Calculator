# Why?

In my [project.md](./docs/project.md), I mentioned **endDate must be ≥ startDate**.

So I wanna start with the utility bill first.

# User input validation

Pseudo code:

1. When user enters a start date first, the end date must be started from the start date.

   So I added `min` attribute to the end-date to be `startDate`.

   ```jsx
   <label>
     Period to:{" "}
     <input
       type="date"
       name={`${namePrefix}end-date`}
       value={endDate}
       onChange={handleEndChange}
       min={startDate} // ⬅️ here!
     />
   </label>
   ```

2. When user enters a end date first, the start date must be ended at the end date.

   So I added `max` attribute to the end-date to be `endDate`.

   ```jsx
   <label>
       Period from:{" "}
       <input
       type="date"
       name={`${namePrefix}start-date`}
       value={startDate}
       onChange={handleStartChange}
       max={endDate} // ⬅️ here!
       />
   </label>{" "}
   ```

# Boundary validation

Pseudo code:

- When endDate before start date, the total days will return as negative number.
- When either startDate or endDate is "", it will return as null

What I did:

- Create `isValidPeriod` to check if the period is valid , return boolean.
- Use that in BillAndHousemates component to check if the period is valid, if it's not valid, return 0.
