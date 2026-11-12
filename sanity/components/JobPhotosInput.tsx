/**
 * What happens to a job photos post, above its form (12 Nov 2026; Vern: "I
 * still don't understand how the 'Job photos for social' tab fits into this
 * process"). One card that says, for this post, what publishing it does and
 * where it has got to:
 *  - no story: its photos go out in HUB's social posts (lib/social-pipeline.ts,
 *    the "From the field" stream, one post a day);
 *  - a story: 21e8 writes the job up as a Projects article
 *    (lib/project-posts.ts), which comes to Doug to read before it goes live;
 *    the article's social posts follow once it is live, and the photos make
 *    no post of their own (lib/social-pipeline.ts, hasStory);
 *  - written up: the article's title and where it stands (with 21e8, with
 *    Doug, live), with a way to open it.
 * If the card fails, it gives way and the form below carries on.
 *
 * Doug sees this: plain words, who does the work is "21e8", never how
 * (scripts/test-studio-words.ts).
 */
import { useEffect, useState, type ReactNode } from "react";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { DocumentTextIcon, LaunchIcon } from "@sanity/icons";
import { getPublishedId, useClient, useEditState, type ObjectInputProps } from "sanity";
import { useIntentLink } from "sanity/router";
import QuietBoundary from "./QuietBoundary";
import { jobPhotosLine, type ArticleState } from "../job-photos-line";

type JobValue = { _id?: string; writeUp?: string; article?: { _ref?: string } };

function OpenArticle({ id }: { id: string }) {
  const link = useIntentLink({ intent: "edit", params: { id, type: "blogPost" } });
  return <Button as="a" href={link.href} onClick={link.onClick} icon={DocumentTextIcon} text="Open the article" mode="ghost" />;
}

function JobPhotosCard({ value }: { value: JobValue | undefined }) {
  const id = getPublishedId(value?._id ?? "");
  const editState = useEditState(id, "fieldPost");
  const articleId = value?.article?._ref;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [article, setArticle] = useState<ArticleState | undefined>(undefined);

  useEffect(() => {
    if (!articleId) {
      setArticle(null);
      return;
    }
    let alive = true;
    client
      .fetch<{ draft: { title?: string; forReview?: boolean } | null; live: { title?: string; slug?: string } | null }>(
        `{ "draft": *[_id == $draft][0]{ title, forReview }, "live": *[_id == $id][0]{ title, "slug": slug.current } }`,
        { id: articleId, draft: `drafts.${articleId}` }
      )
      .then((r) => {
        if (!alive) return;
        setArticle({ title: r.live?.title ?? r.draft?.title, slug: r.live?.slug, live: Boolean(r.live), draft: Boolean(r.draft), withDoug: !r.live && r.draft?.forReview === true });
      })
      .catch(() => { if (alive) setArticle(null); });
    return () => { alive = false; };
  }, [client, articleId]);

  if (!editState.ready || article === undefined) return null;
  const line = jobPhotosLine({ published: Boolean(editState.published), story: Boolean(value?.writeUp?.trim()), article, hasArticle: Boolean(articleId) });
  const actions =
    articleId && article && (article.live || article.draft) ? (
      <>
        <OpenArticle id={articleId} />
        {article.live && article.slug ? (
          <Button as="a" href={`/blog/${article.slug}`} target="_blank" rel="noopener" icon={LaunchIcon} text="See it on the site" mode="ghost" />
        ) : null}
      </>
    ) : null;
  return <JobPhotosCardView line={line} actions={actions} />;
}

/** The card, from plain values (a harness can show it without a signed-in Studio). */
export function JobPhotosCardView({ line, actions }: { line: string; actions?: ReactNode }) {
  return (
    <Card padding={3} radius={2} border tone="primary" marginBottom={4}>
      <Stack space={3}>
        <Text size={1} weight="semibold">What happens to this job</Text>
        <Text size={1}>{line}</Text>
        {actions ? <Flex wrap="wrap" gap={2}>{actions}</Flex> : null}
      </Stack>
    </Card>
  );
}

/** The job photos form, with the card above it (sanity/schemas/fieldPost.ts). */
export default function JobPhotosInput(props: ObjectInputProps) {
  return (
    <div>
      <QuietBoundary name="The job photos card">
        <JobPhotosCard value={props.value as JobValue | undefined} />
      </QuietBoundary>
      {props.renderDefault(props)}
    </div>
  );
}
