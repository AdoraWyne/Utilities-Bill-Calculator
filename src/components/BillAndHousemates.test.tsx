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
  it("splits the bill by home-days when one housemate travels", () => {
    render(<BillAndHousemates />);

    // Electricity 1–10 Jun = 10 days, bill 100.
    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "100");

    // adora is away for 5 days; the other 3 housemates are home all 10 days.
    setInput("adora-travel-start-date", "2026-06-01");
    setInput("adora-travel-end-date", "2026-06-05");

    expect(screen.getByText("Total days: 10")).toBeInTheDocument();
    expect(section("adora")).toHaveTextContent("Total travel days: 5");
    expect(section("adora")).toHaveTextContent("Total home days: 5");
    expect(section("adora")).toHaveTextContent("Total bill: $14.29");

    expect(section("rhea")).toHaveTextContent("Total travel days: 0");
    expect(section("rhea")).toHaveTextContent("Total home days: 10");
    expect(section("rhea")).toHaveTextContent("Total bill: $28.57");
  });

  it("keeps cents in the bill instead of truncating (Number, not parseInt)", () => {
    render(<BillAndHousemates />);

    setInput("start-date", "2026-06-01");
    setInput("end-date", "2026-06-10");
    setInput("total-bill", "50.40");

    // assume all housemates stayed during the whole bill period
    expect(section("adora")).toHaveTextContent("Total bill: $12.60");
  });
});
