import { render, fireEvent, screen } from "@testing-library/react";
import BillAndHousemates from "./BillAndHousemates.tsx";

const section = (name: string) => {
  return screen.getByRole("heading", { name }).closest("div") as HTMLElement;
};

describe("BillAndHousemates (integration)", () => {
  it("splits the bill by home-days when one housemate travels", () => {
    render(<BillAndHousemates />);

    // Electricity 1–10 Jun = 10 days, bill 100.
    fireEvent.change(
      document.querySelector(`input[name="start-date"]`) as HTMLInputElement,
      { target: { value: "2026-06-01" } },
    );
    fireEvent.change(
      document.querySelector(`input[name="end-date"]`) as HTMLInputElement,
      { target: { value: "2026-06-10" } },
    );
    fireEvent.change(
      document.querySelector(`input[name="total-bill"]`) as HTMLInputElement,
      { target: { value: "100" } },
    );

    // adora is away for 5 days; the other 3 housemates are home all 10 days.
    fireEvent.change(
      document.querySelector(
        `input[name="adora-travel-start-date"]`,
      ) as HTMLInputElement,
      { target: { value: "2026-06-01" } },
    );
    fireEvent.change(
      document.querySelector(
        `input[name="adora-travel-end-date"]`,
      ) as HTMLInputElement,
      {
        target: { value: "2026-06-05" },
      },
    );

    expect(screen.getByText("Total days: 10")).toBeInTheDocument();
    expect(section("adora")).toHaveTextContent("Total travel days: 5");
    expect(section("adora")).toHaveTextContent("Total home days: 5");
    expect(section("adora")).toHaveTextContent("Total bill: $14.29");

    expect(section("rhea")).toHaveTextContent("Total travel days: 0");
    expect(section("rhea")).toHaveTextContent("Total home days: 10");
    expect(section("rhea")).toHaveTextContent("Total bill: $28.57");
  });
});
