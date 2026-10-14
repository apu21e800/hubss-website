/**
 * Shared by the homepage hero (a server component) and its Idea Book card (a
 * client component, components/sections/IdeaBookHeroCard.tsx). They live here
 * because a server component can't import plain values from a "use client"
 * file: it gets a client reference instead of the string.
 */

/** localStorage key holding when the visitor closed the card. */
export const CLOSED_KEY = "hubss:idea-book-card-closed";
/** How long a closed card stays closed. */
export const CLOSED_DAYS = 30;
/** The class put on <html> while the card is closed. */
export const CLOSED_CLASS = "ib-card-closed";

/**
 * The inline script the hero writes just before the card. It runs while the
 * page is still being parsed, so a visitor who closed the card never sees it
 * flash, and on a phone, where the card takes room under the buttons, nothing
 * below it moves once the page has loaded.
 */
export const CLOSED_SCRIPT = `try{var t=+localStorage.getItem(${JSON.stringify(CLOSED_KEY)});if(t&&Date.now()-t<${CLOSED_DAYS}*864e5)document.documentElement.classList.add(${JSON.stringify(CLOSED_CLASS)})}catch(e){}`;
