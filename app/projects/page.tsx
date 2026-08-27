import { redirect } from "next/navigation";

/**
 * /projects folded into Field Notes when the library was typed — project
 * content is now the 22 "Project Profiles" there rather than a separate index.
 *
 * The redirect was pointing at /blog, the whole 67-post library. So the
 * homepage's "Browse All Projects" button promised projects and delivered an
 * unfiltered blog index, which is the kind of thing a client clicks first in a
 * review. Sending it to the hub that actually holds the project profiles.
 *
 * THIS FILE NO LONGER RUNS IN PRODUCTION. Because the route prerenders, Next
 * shipped this redirect inside the RSC payload rather than as an HTTP status,
 * so an arriving visitor rendered a bare "LOADING" shell for ~600ms before the
 * client-side navigation fired — and a crawler saw a 200 with an empty body.
 * The redirect now lives in next.config.ts, where it resolves at the edge.
 * This stays as the fallback if that rule is ever removed. Keep the two in
 * sync: same destination, or /projects silently changes behaviour depending on
 * whether the config rule matched.
 */
export default function ProjectsPage() {
  redirect("/blog/project-profiles");
}
