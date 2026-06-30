import './App.css';

const calTotalDays = (startDate: string, endDate: string): number => {
  return Temporal.PlainDate.from(startDate).until(endDate).days;
};

function App() {
  return (
    <>
      <h2>Category</h2>
      <label>
        Electricity bill: <input type="text" />
      </label>
      <br />
      <label>
        Period from:{' '}
        <input
          type="date"
          onChange={(e) => console.log(typeof e.target.value)}
        />
      </label>
      <label>
        Period to: <input type="date" />
      </label>
      <p>Total days.</p>
    </>
  );
}

export default App;
