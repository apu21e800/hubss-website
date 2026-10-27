import type { ReactNode } from "react";
import PostBody from "@/components/blog/PostBody";
import { sanitySized } from "@/lib/photos";
import { anchorFor, reviewWhen, type ReviewArticle, type ReviewData, type ReviewSocialGroup, type ReviewSocialPost } from "@/lib/review-page";

/** Vern's button (app/review/[key]/actions.ts), passed in so the page can be rendered without Next (test:review). */
export type ReviewAction = (formData: FormData) => void | Promise<void>;

/**
 * The review page (app/review/[key]/page.tsx), in the site's own type on
 * paper. Doug's link: what 21e8 has put on his page, written to him in plain
 * words about articles and social posts, never how they are made or where
 * they wait (lib/review-page.ts has that). Vern's link: the same page with
 * everything waiting, the checks' notes, and a button on each item that puts
 * it on Doug's page or takes it off. No links out of the page except the
 * article bodies' own, and the posts' web addresses print as text, so a look
 * at a post is never counted as a visit from social media.
 */
export default function ReviewView({ data, now, actionKey, action }: { data: ReviewData; now: Date; actionKey?: string; action?: ReviewAction }) {
  const agency = data.audience === "agency";
  const waitingArticles = data.articles.filter((a) => !a.goesLive && a.onDougsPage).length;
  const waitingPosts = data.social.reduce((n, g) => n + (g.onDougsPage ? g.posts.filter((p) => p.state === "waiting").length : 0), 0);
  const notYet = data.articles.filter((a) => !a.onDougsPage).length + data.social.filter((g) => !g.onDougsPage && g.posts.some((p) => p.state === "waiting")).length;
  const controls = agency && action && actionKey ? { action, actionKey } : undefined;
  const failed = data.articlesError || data.socialError;
  return (
    <div data-surface="paper" className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <header data-surface="dark" style={{ background: "var(--bg-dark)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- the bar's own logo file, as Nav draws it */}
          <img src="/images/hub-official-logo.svg" alt="HUB Surface Systems" width={160} height={38} style={{ height: 32, width: "auto" }} />
        </div>
        <div style={{ height: 2, background: "linear-gradient(90deg, #F97316 0%, #EAB308 50%, transparent 100%)" }} />
      </header>

      <main id="main" className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        {agency ? (
          <>
            <p className="eyebrow">For 21e8 only</p>
            <h1 className="h1-page mt-3">What&apos;s waiting</h1>
            <p className="text-lg mt-5 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              Everything waiting to go out, with the checks&apos; notes. Doug&apos;s link shows only what you put on his page. Read each one, fix what needs it (Studio for an article, Buffer for a post), then press <strong>Put on Doug&apos;s page</strong>. Nothing here publishes or posts.
            </p>
            {data.dougsLink && (
              <p className="mt-4 text-[15px]" style={{ color: "var(--text-secondary)", overflowWrap: "anywhere" }}>
                Doug&apos;s link, to send him once: <span className="font-semibold select-all" style={{ color: "var(--text-primary)" }}>{data.dougsLink}</span>
              </p>
            )}
            <p className="mt-4 text-[15px]" style={{ color: "var(--text-muted)" }}>
              {failed
                ? "Part of this page couldn't be loaded just now."
                : `On Doug's page, waiting for his OK: ${count(waitingArticles, "article")} and ${count(waitingPosts, "social post")}. Not on his page yet: ${count(notYet, "item")}.`}{" "}
              As of {reviewWhen(now.toISOString())}, Toronto time.
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">For your review</p>
            <h1 className="h1-page mt-3">Ready to go out</h1>
            <p className="text-lg mt-5 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              The next articles for hubss.com and posts for HUB&apos;s social channels. Nothing on this page is public yet. Reply to Vern with OK, or with anything you&apos;d change.
            </p>
            <p className="mt-4 text-[15px]" style={{ color: "var(--text-muted)" }}>
              {failed ? "Part of this page couldn't be loaded just now." : summaryLine(waitingArticles, waitingPosts)} As of {reviewWhen(now.toISOString())}, Toronto time.
            </p>
          </>
        )}

        <section aria-labelledby="review-articles" className="mt-14">
          <h2 id="review-articles" className="h2-sub">Articles</h2>
          {data.articlesError ? (
            <Empty>The articles couldn&apos;t be loaded just now. Try again in a few minutes.</Empty>
          ) : data.articles.length ? (
            <div className="mt-6 grid gap-8">
              {data.articles.map((a) => (
                <ArticleCard key={a.id} article={a} agency={agency} controls={controls} />
              ))}
            </div>
          ) : (
            <Empty>{agency ? "No new drafts." : "No articles waiting for you."}</Empty>
          )}
        </section>

        <section aria-labelledby="review-social" className="mt-16">
          <h2 id="review-social" className="h2-sub">Social posts</h2>
          <p className="mt-3 text-[15px] max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Each goes out once, on the network named, with its photo.
            {data.socialAsOf && !data.socialError ? ` As they stood at ${sentenceEnd(clock(data.socialAsOf))}` : ""}
          </p>
          {data.socialError ? (
            <Empty>The social posts couldn&apos;t be loaded just now. Try again in a few minutes.</Empty>
          ) : data.social.length ? (
            <div className="mt-6 grid gap-12">
              {data.social.map((g) => (
                <SocialGroup key={g.key} group={g} agency={agency} controls={controls} />
              ))}
            </div>
          ) : (
            <Empty>{agency ? "No social posts waiting." : "No social posts waiting for you."}</Empty>
          )}
        </section>

        <p className="mt-16 pt-6 text-[15px]" style={{ borderTop: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
          {agency
            ? "Keep this link to yourself: it can put things on Doug's page. After his OK: Publish (or \"Scheduled\" on) in Studio, Add to Queue in Buffer."
            : "This page always shows what is waiting, so keep the link. Once something is out, it leaves the page."}
        </p>
      </main>
    </div>
  );
}

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? "" : "s"}`;
}

/** A sentence's last words with one full stop, even after "a.m." */
function sentenceEnd(words: string): string {
  return words.endsWith(".") ? words : `${words}.`;
}

/** "2:35 p.m.", the time part of reviewWhen. */
function clock(iso: string): string {
  return reviewWhen(iso).replace(/^.*, /, "");
}

function summaryLine(articles: number, posts: number): string {
  if (!articles && !posts) return "Nothing is waiting for your OK.";
  const parts = [articles ? count(articles, "article") : "", posts ? count(posts, "social post") : ""].filter(Boolean);
  return `Waiting for your OK: ${parts.join(" and ")}.`;
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 text-[15px]" style={{ color: "var(--text-muted)" }}>
      {children}
    </p>
  );
}

type Controls = { action: ReviewAction; actionKey: string };

/** Vern's button: one small form per item, so it works before any script has loaded. */
function Toggle({ controls, kind, id, on }: { controls: Controls; kind: "article" | "social"; id: string; on: boolean }) {
  return (
    <form action={controls.action} className="mt-5">
      <input type="hidden" name="key" value={controls.actionKey} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="on" value={on ? "0" : "1"} />
      <button type="submit" className={on ? "btn-ghost" : "btn-accent"}>
        {on ? "Take off Doug's page" : "Put on Doug's page"}
      </button>
    </form>
  );
}

function Status({ children, tone }: { children: ReactNode; tone: "accent" | "muted" }) {
  return <span style={{ color: tone === "accent" ? "var(--accent-text)" : "var(--text-muted)" }}>{children}</span>;
}

function ArticleState({ article, agency }: { article: ReviewArticle; agency: boolean }) {
  if (article.goesLive) return <Status tone="muted">Goes live {reviewWhen(article.goesLive)}</Status>;
  if (!agency) return <Status tone="accent">Waiting for your OK</Status>;
  return article.onDougsPage ? <Status tone="accent">On Doug&apos;s page, waiting for his OK</Status> : <Status tone="muted">Not on Doug&apos;s page yet</Status>;
}

function ArticleCard({ article, agency, controls }: { article: ReviewArticle; agency: boolean; controls?: Controls }) {
  const { photo } = article;
  return (
    <article id={anchorFor("article", article.id)} className="card" style={{ background: "var(--bg-card)" }}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element -- Sanity's CDN sizes it (sanitySized), as PostBody's photos are
        <img
          src={sanitySized(photo.url, 1200, 80, photo.alt)}
          alt={photo.alt}
          width={photo.width ?? 1200}
          height={photo.height ?? 675}
          className="w-full object-cover"
          style={{ aspectRatio: "16 / 9" }}
        />
      )}
      <div className="p-5 sm:p-7">
        <p className="eyebrow">{article.kind}</p>
        <h3 className="mt-3 text-2xl sm:text-[28px] font-extrabold" style={{ lineHeight: 1.15, letterSpacing: "-0.02em", textWrap: "balance" }}>
          {article.title}
        </h3>
        <p className="mt-2 text-[15px] font-semibold">
          <ArticleState article={article} agency={agency} />
        </p>
        {article.excerpt && (
          <p className="mt-3 text-lg" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {article.excerpt}
          </p>
        )}
        {article.body.length > 0 && (
          <details className="group mt-6">
            <summary className="link-arrow cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Read the whole article</span>
              <span className="hidden group-open:inline">Close the article</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="group-open:rotate-90">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </summary>
            <div className="blog-prose prose mt-6" style={{ maxWidth: "68ch" }}>
              <PostBody body={article.body} title={article.title} />
            </div>
          </details>
        )}
        {agency && article.notes && (
          <details className="mt-5">
            <summary className="cursor-pointer text-[15px] font-semibold" style={{ color: "var(--text-secondary)" }}>
              The checks&apos; notes
            </summary>
            <p className="mt-3 text-[14px] whitespace-pre-line" style={{ color: "var(--text-secondary)", lineHeight: 1.55, overflowWrap: "anywhere" }}>
              {article.notes}
            </p>
          </details>
        )}
        {controls && !article.goesLive && <Toggle controls={controls} kind="article" id={article.id} on={article.onDougsPage} />}
      </div>
    </article>
  );
}

function SocialGroup({ group, agency, controls }: { group: ReviewSocialGroup; agency: boolean; controls?: Controls }) {
  const waiting = group.posts.some((p) => p.state === "waiting");
  return (
    <div id={anchorFor("social", group.key)}>
      <p className="eyebrow eyebrow-muted">{group.about}</p>
      {group.title && (
        <h3 className="mt-2 text-xl sm:text-2xl font-extrabold" style={{ lineHeight: 1.2, letterSpacing: "-0.015em", textWrap: "balance" }}>
          {group.title}
        </h3>
      )}
      {agency && waiting && (
        <p className="mt-2 text-[15px] font-semibold">
          {group.onDougsPage ? <Status tone="accent">On Doug&apos;s page, waiting for his OK</Status> : <Status tone="muted">Not on Doug&apos;s page yet</Status>}
        </p>
      )}
      {agency && group.styleCheck && group.styleClean === false && (
        <div className="mt-3 rounded-lg p-3 text-[14px]" style={{ border: "1px solid var(--accent-text)", color: "var(--text-primary)" }}>
          <p className="font-semibold">The style check found something. Fix it in Buffer before Doug sees it.</p>
          <p className="mt-1 whitespace-pre-line" style={{ color: "var(--text-secondary)", overflowWrap: "anywhere" }}>{group.styleCheck}</p>
        </div>
      )}
      <div className="mt-5 grid gap-5">
        {group.posts.map((p) => (
          <SocialPost key={p.id} post={p} agency={agency} />
        ))}
      </div>
      {controls && waiting && <Toggle controls={controls} kind="social" id={group.key} on={group.onDougsPage} />}
    </div>
  );
}

function SocialPost({ post, agency }: { post: ReviewSocialPost; agency: boolean }) {
  return (
    <div className="card p-4 sm:p-5" style={{ background: "var(--bg-card)" }}>
      <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[15px]">
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>{post.network}</span>
        {post.dueAt ? (
          <Status tone="muted">Goes out {reviewWhen(post.dueAt)}</Status>
        ) : agency ? (
          <Status tone="muted">Waiting in Buffer</Status>
        ) : (
          <Status tone="accent">Waiting for your OK</Status>
        )}
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-start">
        <p className="text-[15px] whitespace-pre-line min-w-0" style={{ color: "var(--text-primary)", lineHeight: 1.6, overflowWrap: "anywhere" }}>
          {post.text}
        </p>
        {post.photo && (
          // eslint-disable-next-line @next/next/no-img-element -- the photo the post carries, as Buffer holds it
          <img src={post.photo.url} alt={post.photo.alt} className="w-full rounded-lg object-cover order-first sm:order-none max-h-[220px] sm:max-h-[320px]" loading="lazy" />
        )}
      </div>
    </div>
  );
}
