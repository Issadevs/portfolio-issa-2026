import { renderHook, act, waitFor } from "@testing-library/react";
import { useLang } from "@/hooks/useLang";

describe("useLang", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "fr";
    vi.useRealTimers();
  });

  it("hydrates the saved language from localStorage", async () => {
    localStorage.setItem("portfolio_lang", "en");

    const { result } = renderHook(() => useLang());

    await waitFor(() => {
      expect(result.current.lang).toBe("en");
    });

    expect(document.documentElement.lang).toBe("en");
  });

  it("toggles language, persists it, and ends the transition", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useLang());

    act(() => {
      result.current.toggleLang();
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.lang).toBe("en");
    expect(localStorage.getItem("portfolio_lang")).toBe("en");

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.isTransitioning).toBe(false);
    expect(document.documentElement.lang).toBe("en");
  });

  it("resolves nested translations", () => {
    const { result } = renderHook(() => useLang());

    expect(result.current.t("nav.contact")).toBe("Contact");
  });
});
