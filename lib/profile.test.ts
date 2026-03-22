import { DEFAULT_SETTINGS } from "@/lib/settings";
import { getAvailabilityLabel, getCvFooterText } from "@/lib/profile";

describe("getAvailabilityLabel", () => {
  it("returns a localized soon label when a date is provided", () => {
    expect(
      getAvailabilityLabel(
        {
          ...DEFAULT_SETTINGS,
          status: "SOON",
          contract_type: "ALTERNANCE",
          available_from: "2026-02-01",
        },
        "fr"
      )
    ).toBe("Alternance dès février 2026");
  });

  it("returns an immediate availability label in English", () => {
    expect(
      getAvailabilityLabel(
        {
          ...DEFAULT_SETTINGS,
          status: "OPEN",
          contract_type: "STAGE",
        },
        "en"
      )
    ).toBe("Internship — Available now");
  });

  it("returns a not-looking label when the profile is closed", () => {
    expect(
      getAvailabilityLabel(
        {
          ...DEFAULT_SETTINGS,
          status: "NOT_LOOKING",
        },
        "fr"
      )
    ).toBe("Pas en recherche");
  });
});

describe("getCvFooterText", () => {
  it("includes the localized availability summary", () => {
    expect(
      getCvFooterText(
        {
          ...DEFAULT_SETTINGS,
          status: "OPEN",
          contract_type: "ALTERNANCE",
        },
        "en"
      )
    ).toContain("Apprenticeship — Available now");
  });
});
