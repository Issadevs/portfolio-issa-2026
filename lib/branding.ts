export type BrandKey = "efrei" | "sfr" | "aerial";

export interface Brand {
  name: string;
  logoSrc: string;
  darkLogoSrc?: string;
  initials: string;
  fallbackBg: string;
}

export const brands: Record<BrandKey, Brand> = {
  efrei: {
    name: "EFREI Paris",
    logoSrc: "/assets/logos/efrei.webp",
    darkLogoSrc: "/assets/logos/efrei-dark.webp",
    initials: "EF",
    fallbackBg: "bg-blue-700",
  },
  sfr: {
    name: "SFR",
    logoSrc: "/assets/logos/sfr.webp",
    initials: "SFR",
    fallbackBg: "bg-red-600",
  },
  aerial: {
    name: "Aérial Group",
    logoSrc: "/assets/logos/aerial.webp",
    initials: "AG",
    fallbackBg: "bg-sky-600",
  },
};
