"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings";

/**
 * Site Settings for client components (the contact form, the Lunch & Learn
 * card, the Idea Book reader, the social icons). app/layout.tsx reads them
 * once per page from Studio (getSiteSettings) and hands them down here, so a
 * phone number changed in Studio changes everywhere at once. Server
 * components call getSiteSettings() themselves.
 */
const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

/** The merged Site Settings; the code's copy outside a provider. */
export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
