import { redirect } from "next/navigation";

/**
 * /projects folded into Field Notes when the library was typed — project
 * content is now the 22 "Project Profiles" there rather than a separate index.
 *
 * The redirect was pointing at /blog, the whole 67-post library. So the
 * homepage's "Browse All Projects" button promised projects and delivered an
 * unfiltered blog index, which is the kind of thing a client clicks first in a
 * review. Sending it to the hub that actually holds the project profiles.
 */
export default function ProjectsPage() {
  redirect("/blog/project-profiles");
}
