import { formatAvailableDate } from "@/lib/date";

describe("formatAvailableDate", () => {
  it("formats French dates without timezone drift", () => {
    expect(formatAvailableDate("2026-02-01", "fr")).toBe("février 2026");
  });

  it("formats English dates without timezone drift", () => {
    expect(formatAvailableDate("2026-02-01", "en")).toBe("February 2026");
  });
});
