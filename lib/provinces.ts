/**
 * Province and territory names as the map card prints them (Québec with its
 * accent, as the map has since 30 Sep 2026). One list for the map card
 * (components/sections/map/ProjectDetail.tsx) and the places on the Projects
 * cards (lib/post-places.ts).
 */
export const PROVINCE_NAME: Record<string, string> = {
  YT: "Yukon", NT: "Northwest Territories", NU: "Nunavut", BC: "British Columbia", AB: "Alberta",
  SK: "Saskatchewan", MB: "Manitoba", ON: "Ontario", QC: "Québec", NB: "New Brunswick",
  NS: "Nova Scotia", PE: "Prince Edward Island", NL: "Newfoundland and Labrador",
};

export const provinceName = (code: string) => PROVINCE_NAME[code] ?? code;
