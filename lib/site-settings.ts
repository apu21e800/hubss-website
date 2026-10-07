/**
 * Site Settings: HUB's two offices, the social accounts and the footer line,
 * editable in Studio (Site Settings) since 7 Oct 2026 and the same everywhere
 * they appear: the footer, Contact, About, the product and application
 * pages, the Lunch & Learn card, the Idea Book reader, the 404 page, the
 * terms and privacy pages, llms.txt and the search-engine data.
 *
 * Until then the Studio fields existed and did nothing, while the numbers
 * were typed by hand in a dozen files.
 *
 * The values below are the code's copy and the fallback, on the site-wide
 * rule in lib/cms-merge.ts: a blank Studio field shows these. Server code
 * reads the merged settings with getSiteSettings() (lib/sanity.queries.ts);
 * client components with useSiteSettings() (components/SiteSettingsProvider.tsx).
 *
 * Pure data and string functions: safe in server and client components.
 */

import { stegaClean } from "@sanity/client/stega";

export interface Office {
  /** "Ladysmith, British Columbia" */
  place: string;
  /** The person who answers: "Cleve Stordy" */
  name: string;
  email: string;
  /** As people read it: "604-309-8212" */
  phone: string;
}

export interface SocialAccounts {
  linkedin: string;
  youtube: string;
  facebook: string;
  instagram: string;
  x: string;
}

export interface SiteSettings {
  offices: { west: Office; east: Office };
  social: SocialAccounts;
  /** The line under the logo in the footer. */
  footerTagline: string;
}

/**
 * The code's copy. The social accounts are the ones lib/social-links.ts
 * documents: Instagram is @hub_surface_systems (Vern, 23 Sep 2026), and the
 * YouTube channel's handle is the auto-generated @hubsurfacesystems8112.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  offices: {
    west: { place: "Ladysmith, British Columbia", name: "Cleve Stordy", email: "cleve.stordy@hubss.com", phone: "604-309-8212" },
    east: { place: "Milton, Ontario", name: "Doug Bain", email: "doug.bain@hubss.com", phone: "416-540-9287" },
  },
  social: {
    linkedin: "https://www.linkedin.com/company/hub-surface-systems",
    youtube: "https://www.youtube.com/@hubsurfacesystems8112",
    facebook: "https://www.facebook.com/hubsurfacesystems",
    instagram: "https://www.instagram.com/hub_surface_systems/",
    x: "https://x.com/HUB_SS",
  },
  footerTagline: "Pedestrian safety, traffic calming, civic identity.",
};

/**
 * Values Studio held from the May 2026 migration that are known to be wrong:
 * an Instagram account HUB does not own, a YouTube handle that 404s, and the
 * footer line before the 27 Sep QA. They are treated as blank, so the site
 * keeps the right value whether or not the sync has corrected Studio yet
 * (scripts/sync-pages-to-sanity.ts replaces them).
 */
export const LEGACY_SETTINGS: { [K in "instagram" | "youtube" | "footerTagline"]: readonly string[] } = {
  instagram: ["https://www.instagram.com/hubsurfacesystems", "https://www.instagram.com/hubsurfacesystems/"],
  youtube: ["https://www.youtube.com/@hubsurfacesystems", "https://www.youtube.com/@hubsurfacesystems/"],
  footerTagline: ["Pedestrian safety. Traffic calming.\nCivic identity. Coast to coast since 1999."],
};

/** Site Settings as the query returns them (lib/sanity.queries.ts). */
export interface SanitySiteSettings {
  _id?: string;
  offices?: { [K in "west" | "east"]?: { place?: string | null; name?: string | null; email?: string | null; phone?: string | null } | null } | null;
  social?: Partial<Record<keyof SocialAccounts, string | null>> | null;
  footerTagline?: string | null;
}

/** Studio's text when it has any and isn't a known-wrong legacy value, else the code's. */
function pick(value: string | null | undefined, code: string, legacy: readonly string[] = []): string {
  if (typeof value !== "string") return code;
  const clean = stegaClean(value).trim();
  if (!clean || legacy.includes(clean)) return code;
  return value.trim();
}

/** Studio over the code, field by field. */
export function mergeSiteSettings(sanity: SanitySiteSettings | null | undefined): SiteSettings {
  const d = DEFAULT_SITE_SETTINGS;
  const office = (key: "west" | "east"): Office => {
    const s = sanity?.offices?.[key];
    return {
      place: pick(s?.place, d.offices[key].place),
      name: pick(s?.name, d.offices[key].name),
      email: pick(s?.email, d.offices[key].email),
      phone: pick(s?.phone, d.offices[key].phone),
    };
  };
  const social = sanity?.social;
  return {
    offices: { west: office("west"), east: office("east") },
    social: {
      linkedin: pick(social?.linkedin, d.social.linkedin),
      youtube: pick(social?.youtube, d.social.youtube, LEGACY_SETTINGS.youtube),
      facebook: pick(social?.facebook, d.social.facebook),
      instagram: pick(social?.instagram, d.social.instagram, LEGACY_SETTINGS.instagram),
      x: pick(social?.x, d.social.x),
    },
    footerTagline: pick(sanity?.footerTagline, d.footerTagline, LEGACY_SETTINGS.footerTagline),
  };
}

/** The digits of a Canadian number, with the country code: "16043098212". */
function digits(phone: string): string {
  const d = stegaClean(phone).replace(/\D/g, "");
  return d.length === 10 ? `1${d}` : d;
}

/** A tel: link for a number as people write it: "tel:+16043098212". */
export function telHref(phone: string): string {
  return `tel:+${digits(phone)}`;
}

/** The number for structured data: "+1-604-309-8212". */
export function schemaPhone(phone: string): string {
  const d = digits(phone);
  return d.length === 11 ? `+${d[0]}-${d.slice(1, 4)}-${d.slice(4, 7)}-${d.slice(7)}` : `+${d}`;
}

/** A mailto: link. */
export function mailtoHref(email: string): string {
  return `mailto:${stegaClean(email).trim()}`;
}

/** The Instagram handle as people type it: "@hub_surface_systems". */
export function instagramHandle(url: string): string {
  return "@" + stegaClean(url).replace(/\/+$/, "").split("/").pop();
}

/** The city alone, for short lines: "Ladysmith". */
export function city(office: Office): string {
  return stegaClean(office.place).split(",")[0].trim();
}

const PROVINCE_CODES: Record<string, string> = {
  "british columbia": "BC", alberta: "AB", saskatchewan: "SK", manitoba: "MB", ontario: "ON",
  quebec: "QC", "québec": "QC", "new brunswick": "NB", "nova scotia": "NS",
  "prince edward island": "PE", "newfoundland and labrador": "NL", yukon: "YT",
  "northwest territories": "NT", nunavut: "NU",
};

/** The province's postal code for structured data, from the town line: "BC". */
export function provinceCode(office: Office, fallback: string): string {
  const prov = stegaClean(office.place).split(",")[1]?.trim().toLowerCase() ?? "";
  return PROVINCE_CODES[prov] ?? (/^[a-z]{2}$/.test(prov) ? prov.toUpperCase() : fallback);
}
