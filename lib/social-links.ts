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
export const SOCIAL_LINKS = {
  linkedin:  'https://www.linkedin.com/company/hub-surface-systems',
  youtube:   'https://www.youtube.com/@hubsurfacesystems8112',
  facebook:  'https://www.facebook.com/hubsurfacesystems',
  instagram: 'https://www.instagram.com/hub_surface_systems/',
  x:         'https://x.com/HUB_SS',
} as const;

/** The Instagram handle as people type it, derived so it can never drift from the URL. */
export const INSTAGRAM_HANDLE =
  '@' + SOCIAL_LINKS.instagram.replace(/\/+$/, '').split('/').pop();
