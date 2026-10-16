/**
 * Separator dots that never open a line. "Crosswalks · Entrances · Plazas" is
 * set with a no-break space before each dot, so the dot stays with the word
 * before it and a line may only break after it. QA sweep, 16 Oct 2026: on a
 * phone a line read "· STREETSCAPES" and "Volume 5" lost its dot.
 */
export const DOT = " · ";

/** Items joined with dots that never open a line. */
export const dotted = (items: readonly string[]) => items.join(DOT);

/** A string that already has " · " separators, set the same way. */
export const keepDots = (s: string) => s.replace(/ · /g, DOT);
