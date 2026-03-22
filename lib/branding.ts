export type BrandKey = "efrei" | "sfr" | "aerial";

export interface Brand {
  name: string;
  logoSrc: string;
  darkLogoSrc?: string;
  initials: string;
  fallbackBg: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export const brands: Record<BrandKey, Brand> = {
  efrei: {
    name: "EFREI Paris",
    logoSrc: "/assets/logos/efrei.webp",
    darkLogoSrc: "/assets/logos/efrei-dark.webp",
    initials: "EF",
    fallbackBg: "bg-blue-700",
    dimensions: {
      width: 800,
      height: 296,
    },
  },
  sfr: {
    name: "SFR",
    logoSrc: "/assets/logos/sfr.webp",
    initials: "SFR",
    fallbackBg: "bg-red-600",
    dimensions: {
      width: 600,
      height: 600,
    },
  },
  aerial: {
    name: "Aérial Group",
    logoSrc: "/assets/logos/aerial.webp",
    initials: "AG",
    fallbackBg: "bg-sky-600",
    dimensions: {
      width: 697,
      height: 227,
    },
  },
};
