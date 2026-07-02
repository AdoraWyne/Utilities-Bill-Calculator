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
  const HOUSEMATES = ["adora", "rhea", "hong", "dan"];

  // when user input is invalid
  describe("when the utility billing period is incomplete", () => {
    it.each([
      { scenario: "no bill entered", bill: "", expectedShare: "$0.00" },
      { scenario: "bill entered", bill: "100", expectedShare: "$25.00" },
    ])(
      "shows 0 days and $expectedShare per housemate ($scenario)",
      ({ bill, expectedShare }) => {
        render(<BillAndHousemates />);

        setInput("end-date", "2026-06-01"); // start-date left blank → period invalid
        setInput("total-bill", bill);

        expect(screen.getByText("Total days: 0")).toBeInTheDocument();

        // housemates dates also left blank

        for (const name of HOUSEMATES) {
          expect(section(name)).toHaveTextContent("Total travel days: 0");
          expect(section(name)).toHaveTextContent("Total home days: 0");
          expect(section(name)).toHaveTextContent(
            `Total bill: ${expectedShare}`,
          );
        }
      },
    );
  });

  // when user input is invalid
  describe("when the billing period is valid but a housemate's dates are incomplete", () => {
    // Documents CURRENT behavior: a housemate who filled only one of their two
    // dates gets 0 travel days (calculateTotalExclusiveDays returns null), so
    // they're treated as home the whole period. Decide whether that's the
    // intended product behavior or should be flagged/ignored.
    it("treats a half-entered housemate as home for the whole period", () => {
      render(<BillAndHousemates />);

      // Electricity 1–10 Jun = 10 days, bill 100.
      setInput("start-date", "2026-06-01");
      setInput("end-date", "2026-06-10");
      setInput("total-bill", "100");

      // adora entered a leave date but forgot the arrive date.
      setInput("adora-leave-home-date", "2026-06-03");
      setInput("adora-arrive-home-date", "");

      expect(screen.getByText("Total days: 10")).toBeInTheDocument();

      // adora is (currently) counted as home all 10 days, same as everyone else,
      // so the bill splits evenly: 100 / 4 = 25.
      for (const name of HOUSEMATES) {
        expect(section(name)).toHaveTextContent("Total travel days: 0");
        expect(section(name)).toHaveTextContent("Total home days: 10");
        expect(section(name)).toHaveTextContent("Total bill: $25.00");
      }
    });
  });

  // when user input is valid, travel within billing period
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

  // test return bill amount format
  it("keeps cents in the bill instead of truncating (Number, not parseInt)", () => {
    render(<BillAndHousemates />);

    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "50.40");

    // assume all housemates stayed during the whole bill period
    expect(section("adora")).toHaveTextContent("Total bill: $12.60");
  });

  // when everyone is away the whole billing period
  it("splits the bill equally when everyone is away the whole utility billing period", () => {
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

  describe("when user inputs are valid and housemates travelled outside/within billing period", () => {
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
      setInput("hong-leave-home-date", "2026-05-01");
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

    it("only counts travel days inside the bill period when a housemate left before it started", () => {
      render(<BillAndHousemates />);

      setInput("start-date", "2026-06-08");
      setInput("end-date", "2026-07-05");
      setInput("total-bill", "100");
      expect(screen.getByText("Total days: 28")).toBeInTheDocument();

      setInput("adora-leave-home-date", "2026-06-01");
      setInput("adora-arrive-home-date", "2026-06-10");

      expect(section("adora")).toHaveTextContent("Total travel days: 2");
      expect(section("adora")).toHaveTextContent("Total home days: 26");

      expect(section("adora")).toHaveTextContent("Total bill: $23.64");
      expect(section("rhea")).toHaveTextContent("Total travel days: 0");
      expect(section("rhea")).toHaveTextContent("Total home days: 28");
      expect(section("rhea")).toHaveTextContent("Total bill: $25.45");
    });

    it("only counts travel days inside the bill period when a housemate returns home after it ended", () => {
      render(<BillAndHousemates />);

      setInput("start-date", "2026-06-08");
      setInput("end-date", "2026-07-05");
      setInput("total-bill", "100");
      expect(screen.getByText("Total days: 28")).toBeInTheDocument();

      setInput("adora-leave-home-date", "2026-06-10");
      setInput("adora-arrive-home-date", "2026-07-10");

      expect(section("adora")).toHaveTextContent("Total travel days: 26");
      expect(section("adora")).toHaveTextContent("Total home days: 2");

      expect(section("adora")).toHaveTextContent("Total bill: $2.33");
      expect(section("rhea")).toHaveTextContent("Total travel days: 0");
      expect(section("rhea")).toHaveTextContent("Total home days: 28");
      expect(section("rhea")).toHaveTextContent("Total bill: $32.56");
    });
  });
});
