/**
 * The line above a job photos post's form (sanity/components/JobPhotosInput.tsx):
 * what publishing it does and where it has got to. Its only import is the
 * review's words (sanity/review-words.ts, no imports of its own), so
 * `npm run test:studio` reads it without the Studio.
 */
import { REVIEWERS } from "./review-words";

/** The article written from a job photos post, as the card reads it (null: none, or it couldn't be read). */
export type ArticleState = { title?: string; slug?: string; live: boolean; draft: boolean; withDoug: boolean } | null;

/** The words for where the job stands. */
export function jobPhotosLine(job: { published: boolean; story: boolean; article: ArticleState; hasArticle: boolean }): string {
  const { published, story, article, hasArticle } = job;
  if (hasArticle) {
    const title = article?.title?.trim() ? `"${article.title.trim()}"` : "an article";
    if (!article || (!article.live && !article.draft)) return "An article was written from this job, but it is no longer in Blog posts.";
    if (article.live) return `Written up as ${title}, which is on the site.`;
    if (article.withDoug) return `Written up as ${title}, which is with ${REVIEWERS}, waiting for their OK.`;
    return `Written up as ${title}. 21e8 is reading it; then it goes to ${REVIEWERS} for their OK.`;
  }
  if (story) {
    return published
      ? `21e8 writes this job up as a Projects article for the website in the next few days. It goes to ${REVIEWERS} to read before it goes live, and its social posts follow once it is live.`
      : `With the story filled in, 21e8 writes this job up as a Projects article once you publish it. It goes to ${REVIEWERS} to read before it goes live, and its social posts follow once it is live.`;
  }
  return published
    ? "Its photos go out in HUB's social posts over the next few days. To have the job written up as a Projects article instead, fill in the story below and publish again."
    : "Publish it and its photos go out in HUB's social posts over the next few days. Fill in the story below to have the job written up as a Projects article for the website instead.";
}
