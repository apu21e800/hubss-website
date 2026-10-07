/**
 * One source of truth for the social accounts. Anything rendering a social
 * icon reads from here — the Instagram strip used to carry its own spelling.
 *
 * The YouTube handle looks wrong and is right: @hubsurfacesystems8112 is the
 * auto-generated handle YouTube assigned the channel (UCcHUWv8BTes_fZ9BC_ohBpw,
 * "HUB SURFACE SYSTEMS"), because nobody ever claimed a custom one. The tidy
 * @hubsurfacesystems that used to be here 404s — HUB does not own it. Claiming
 * the custom handle on YouTube is the real fix; until then this is the URL that
 * reaches the channel.
 *
 * Instagram is @hub_surface_systems, with underscores (confirmed by Vern,
 * 23 Sep 2026). "hubsurfacesystems" is HUB's name on Pinterest and Linktree,
 * which is how it ended up on the Follow the Work button while the photo tiles
 * underneath it linked to the underscored account. Every Instagram link on the
 * site, and the homepage Organization schema, now reads from this one line.
 */
//
// Since 7 Oct 2026 these are the code's copy of Studio's Site Settings
// (lib/site-settings.ts, DEFAULT_SITE_SETTINGS), which the site reads through
// getSiteSettings() and useSiteSettings(). This name stays for anything that
// needs the code's copy without Studio.
import { DEFAULT_SITE_SETTINGS } from './site-settings';

export const SOCIAL_LINKS = DEFAULT_SITE_SETTINGS.social;

/** The Instagram handle as people type it, derived so it can never drift from the URL. */
export const INSTAGRAM_HANDLE =
  '@' + SOCIAL_LINKS.instagram.replace(/\/+$/, '').split('/').pop();
