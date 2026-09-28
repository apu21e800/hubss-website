import { permanentRedirect } from "next/navigation";

/**
 * /projects folded into Insights when the library was typed; project write-ups
 * are the Projects section there (/blog/projects, since 28 Sep 2026: the case
 * studies and project profiles together) rather than a separate index.
 *
 * The redirect was pointing at /blog, the whole library. So the homepage's
 * "Browse All Projects" button promised projects and delivered an unfiltered
 * blog index, which is the kind of thing a client clicks first in a review.
 * It goes to the section that holds the projects.
 *
 * THIS FILE NO LONGER RUNS IN PRODUCTION. Because the route prerenders, Next
 * shipped this redirect inside the RSC payload rather than as an HTTP status,
 * so an arriving visitor rendered a bare "LOADING" shell for ~600ms before the
 * client-side navigation fired — and a crawler saw a 200 with an empty body.
 * The redirect now lives in next.config.ts, where it resolves at the edge.
 * This stays as the fallback if that rule is ever removed. Keep the two in
 * sync: same destination, or /projects silently changes behaviour depending on
 * whether the config rule matched. Permanent since 28 Sep 2026, when the
 * Projects section settled where projects live.
 */
export default function ProjectsPage() {
  permanentRedirect("/blog/projects");
}
