import { render, fireEvent, screen } from "@testing-library/react";
import BillAndHousemates from "./BillAndHousemates.tsx";

const setInput = (name: string, value: string) => {
  return fireEvent.change(
    document.querySelector(`input[name=${name}]`) as HTMLInputElement,
    { target: { value } },
  );
};

const section = (name: string) => {
  return screen.getByRole("heading", { name }).closest("div") as HTMLElement;
};

describe("BillAndHousemates (integration)", () => {
  it("splits the bill by home-days when one housemate travels within utility billing period", () => {
    render(<BillAndHousemates />);

    // Electricity 1–10 Jun = 10 days, bill 100.
    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "100");

    // adora is away for 5 days; the other 3 housemates are home all 10 days.
    setInput("adora-leave-home-date", "2026-06-01");
    setInput("adora-arrive-home-date", "2026-06-06");

    expect(screen.getByText("Total days: 10")).toBeInTheDocument();
    expect(section("adora")).toHaveTextContent("Total travel days: 5");
    expect(section("adora")).toHaveTextContent("Total home days: 5");
    expect(section("adora")).toHaveTextContent("Total bill: $14.29");

    expect(section("rhea")).toHaveTextContent("Total travel days: 0");
    expect(section("rhea")).toHaveTextContent("Total home days: 10");
    expect(section("rhea")).toHaveTextContent("Total bill: $28.57");
  });

  it("splits the bill by home-days when one housemate travels the whole utility billing period", () => {
    render(<BillAndHousemates />);

    // Electricity 1–10 Jun = 10 days, bill 100.
    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "100");

    setInput("adora-leave-home-date", "2026-06-01");
    setInput("adora-arrive-home-date", "2026-07-06");

    expect(screen.getByText("Total days: 10")).toBeInTheDocument();
    expect(section("adora")).toHaveTextContent("Total travel days: 10");
    expect(section("adora")).toHaveTextContent("Total home days: 0");
    expect(section("adora")).toHaveTextContent("Total bill: $0.00");

    expect(section("rhea")).toHaveTextContent("Total travel days: 0");
    expect(section("rhea")).toHaveTextContent("Total home days: 10");
    expect(section("rhea")).toHaveTextContent("Total bill: $33.33");
  });

  it("splits the bill by home-days when different stayed home date and different travel dates", () => {
    render(<BillAndHousemates />);

    // Electricity 1–10 Jun = 10 days, bill 100.
    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "100");

    // adora is away for 4 days
    setInput("adora-leave-home-date", "2026-06-01");
    setInput("adora-arrive-home-date", "2026-06-05");

    // rhea stayed home for the whole utility period
    setInput("rhea-leave-home-date", "");
    setInput("rhea-arrive-home-date", "");

    // hong away for the whole utility period
    setInput("hong-leave-home-date", "2026-06-01");
    setInput("hong-arrive-home-date", "2026-07-07");

    // dan away for 8 days
    setInput("dan-leave-home-date", "2026-06-01");
    setInput("dan-arrive-home-date", "2026-06-09");

    expect(screen.getByText("Total days: 10")).toBeInTheDocument();
    expect(section("adora")).toHaveTextContent("Total travel days: 4");
    expect(section("adora")).toHaveTextContent("Total home days: 6");
    expect(section("adora")).toHaveTextContent("Total bill: $33.33");

    expect(section("rhea")).toHaveTextContent("Total travel days: 0");
    expect(section("rhea")).toHaveTextContent("Total home days: 10");
    expect(section("rhea")).toHaveTextContent("Total bill: $55.56");

    expect(section("hong")).toHaveTextContent("Total travel days: 10");
    expect(section("hong")).toHaveTextContent("Total home days: 0");
    expect(section("hong")).toHaveTextContent("Total bill: $0.00");

    expect(section("dan")).toHaveTextContent("Total travel days: 8");
    expect(section("dan")).toHaveTextContent("Total home days: 2");
    expect(section("dan")).toHaveTextContent("Total bill: $11.11");
  });

  it("keeps cents in the bill instead of truncating (Number, not parseInt)", () => {
    render(<BillAndHousemates />);

    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "50.40");

    // assume all housemates stayed during the whole bill period
    expect(section("adora")).toHaveTextContent("Total bill: $12.60");
  });

  it("splits the bill equally when everyone is away the whole period", () => {
    render(<BillAndHousemates />);

    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "100");

    const housemates = ["adora", "rhea", "hong", "dan"];

    for (const name of housemates) {
      setInput(`${name}-leave-home-date`, "2026-06-01");
      setInput(`${name}-arrive-home-date`, "2026-07-11");
    }

    for (const name of housemates) {
      expect(section(name)).toHaveTextContent("Total travel days: 10");
      expect(section(name)).toHaveTextContent("Total home days: 0");
      expect(section(name)).toHaveTextContent("Total bill: $25.00");
    }
  });
});
