import type { ReactNode } from "react";
import PostBody from "@/components/blog/PostBody";
import { sanitySized } from "@/lib/photos";
import { reviewWhen, type ReviewArticle, type ReviewData, type ReviewSocialGroup, type ReviewSocialPost } from "@/lib/review-page";

/**
 * Doug's review page (app/review/[key]/page.tsx): what is waiting for his OK
 * and what is lined up, in the site's own type on paper. Written to him, in
 * plain words, about articles and social posts: never how they are made or
 * where they wait (lib/review-page.ts has that). No links out of the page
 * except the article bodies' own, and the posts' web addresses print as
 * text, so a look at a post is never counted as a visit from social media.
 */
export default function ReviewView({ data, now }: { data: ReviewData; now: Date }) {
  const waitingPosts = data.social.reduce((n, g) => n + g.posts.filter((p) => p.state === "waiting").length, 0);
  const waitingArticles = data.articles.filter((a) => !a.goesLive).length;
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
        <p className="eyebrow">For your review</p>
        <h1 className="h1-page mt-3">Ready to go out</h1>
        <p className="text-lg mt-5 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          The next articles for hubss.com and posts for HUB&apos;s social channels. Nothing on this page is public yet. Reply to Vern with OK, or with anything you&apos;d change.
        </p>
        <p className="mt-4 text-[15px]" style={{ color: "var(--text-muted)" }}>
          {data.articlesError || data.socialError ? "Part of this page couldn't be loaded just now." : summaryLine(waitingArticles, waitingPosts)} As of {reviewWhen(now.toISOString())}, Toronto time.
        </p>

        <section aria-labelledby="review-articles" className="mt-14">
          <h2 id="review-articles" className="h2-sub">Articles</h2>
          {data.articlesError ? (
            <Empty>The articles couldn&apos;t be loaded just now. Try again in a few minutes.</Empty>
          ) : data.articles.length ? (
            <div className="mt-6 grid gap-8">
              {data.articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <Empty>No articles waiting for you.</Empty>
          )}
        </section>

        <section aria-labelledby="review-social" className="mt-16">
          <h2 id="review-social" className="h2-sub">Social posts</h2>
          <p className="mt-3 text-[15px] max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Each goes out once, on the network named, with its photo.
          </p>
          {data.socialError ? (
            <Empty>The social posts couldn&apos;t be loaded just now. Try again in a few minutes.</Empty>
          ) : data.social.length ? (
            <div className="mt-6 grid gap-12">
              {data.social.map((g) => (
                <SocialGroup key={g.key} group={g} />
              ))}
            </div>
          ) : (
            <Empty>No social posts waiting for you.</Empty>
          )}
        </section>

        <p className="mt-16 pt-6 text-[15px]" style={{ borderTop: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
          This page always shows what is waiting, so keep the link. Once something is out, it leaves the page.
        </p>
      </main>
    </div>
  );
}

function summaryLine(articles: number, posts: number): string {
  if (!articles && !posts) return "Nothing is waiting for your OK.";
  const parts = [
    articles ? `${articles} ${articles === 1 ? "article" : "articles"}` : "",
    posts ? `${posts} social ${posts === 1 ? "post" : "posts"}` : "",
  ].filter(Boolean);
  return `Waiting for your OK: ${parts.join(" and ")}.`;
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 text-[15px]" style={{ color: "var(--text-muted)" }}>
      {children}
    </p>
  );
}

function State({ goesLive, verb }: { goesLive?: string; verb: string }) {
  return goesLive ? (
    <span style={{ color: "var(--text-muted)" }}>
      {verb} {reviewWhen(goesLive)}
    </span>
  ) : (
    <span style={{ color: "var(--accent-text)" }}>Waiting for your OK</span>
  );
}

function ArticleCard({ article }: { article: ReviewArticle }) {
  const { photo } = article;
  return (
    <article className="card" style={{ background: "var(--bg-card)" }}>
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
          <State goesLive={article.goesLive} verb="Goes live" />
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
      </div>
    </article>
  );
}

function SocialGroup({ group }: { group: ReviewSocialGroup }) {
  return (
    <div>
      <p className="eyebrow eyebrow-muted">{group.about}</p>
      <h3 className="mt-2 text-xl sm:text-2xl font-extrabold" style={{ lineHeight: 1.2, letterSpacing: "-0.015em", textWrap: "balance" }}>
        {group.title}
      </h3>
      <div className="mt-5 grid gap-5">
        {group.posts.map((p) => (
          <SocialPost key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}

function SocialPost({ post }: { post: ReviewSocialPost }) {
  return (
    <div className="card p-4 sm:p-5" style={{ background: "var(--bg-card)" }}>
      <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[15px]">
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>{post.network}</span>
        <State goesLive={post.dueAt} verb="Goes out" />
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
