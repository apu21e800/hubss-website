import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import JsonLd from "@/components/ui/JsonLd";
import { getAllPosts, getPost } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { buildMetadata } from "@/lib/seo";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import InstagramShareButton from "@/components/blog/InstagramShareButton";
import BlogImage from "@/components/blog/BlogImage";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try { post = getPost(slug); } catch { return {}; }
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    slug: `blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    image: post.featuredImage,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try { post = getPost(slug); } catch { notFound(); }

  const allPosts = getAllPosts();
  const postUrl = `https://hubss.com/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "HUB Surface Systems" },
    publisher: {
      "@type": "Organization",
      name: "HUB Surface Systems",
      logo: { "@type": "ImageObject", url: "https://hubss.com/images/hub-official-logo.svg" },
    },
    url: postUrl,
    image: post.featuredImage
      ? `https://hubss.com${post.featuredImage}`
      : "https://hubss.com/images/og-default.jpg",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Field Notes", item: "https://hubss.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  const formattedDate = new Date(post.date).toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="min-h-screen" style={{ background: "#080d16" }}>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      {/* ── Cinematic hero ────────────────────── */}
      <header className="relative w-full overflow-hidden" style={{ height: "68vh", minHeight: 460 }}>
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a1e2e 100%)" }} />
        )}

        {/* Multi-layer gradient for editorial depth */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(8,13,22,1) 0%, rgba(8,13,22,0.75) 35%, rgba(8,13,22,0.3) 65%, rgba(8,13,22,0.15) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, rgba(8,13,22,0.6) 0%, transparent 60%)"
        }} />

        {/* Category + meta bar */}
        <div className="absolute top-0 inset-x-0" style={{ paddingTop: "6rem" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 flex-wrap">
              {post.tags?.slice(0, 2).map((tag: string) => (
                <span key={tag} style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#F97316",
                  background: "rgba(249,115,22,0.15)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  padding: "4px 12px", borderRadius: 4,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Title block — anchored to bottom */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-7xl mx-auto px-6 pb-14">
            {/* Orange rule */}
            <div style={{ width: 48, height: 3, background: "linear-gradient(90deg, #F97316, #EAB308)", borderRadius: 2, marginBottom: "1.25rem" }} />

            <h1 style={{
              fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              marginBottom: "1.25rem",
              maxWidth: "22em",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}>
              {post.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em", lineHeight: 1 }}>
                {formattedDate}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(249,115,22,0.6)", display: "block", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1 }}>{post.readTime}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(249,115,22,0.6)", display: "block", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1 }}>HUB Surface Systems</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Orange accent divider ─────────────────── */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #F97316 0%, #EAB308 50%, transparent 100%)" }} />

      {/* ── Article layout ────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 lg:grid lg:gap-16" style={{ gridTemplateColumns: "1fr 220px" }}>

        {/* Article body */}
        <article className="blog-prose prose prose-invert" style={{ maxWidth: "72ch" }}>
          {/* Excerpt / lede */}
          {post.excerpt && (
            <p style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.7)",
              borderLeft: "3px solid #F97316",
              paddingLeft: "1.25rem",
              marginBottom: "2.5rem",
              fontStyle: "italic",
              fontWeight: 400,
            }}>
              {post.excerpt}
            </p>
          )}

          <MDXRemote
            source={post.content}
            components={{ BlogImage }}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky" style={{ top: "7rem" }}>
            {/* Author card */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "20px",
              marginBottom: 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #F97316, #EAB308)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 900, color: "#000",
                  flexShrink: 0,
                }}>H</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", margin: 0 }}>HUB Surface Systems</p>
                  <p style={{ fontSize: 11, color: "#868C98", margin: 0 }}>Field Notes</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
                Canada&apos;s leader in decorative and functional pavement solutions since 1999.
              </p>
            </div>

            <TableOfContents />

            {/* Share */}
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#868C98", marginBottom: 12 }}>
                Share
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, color: "#9CA3AF", fontSize: 12, fontWeight: 600, textDecoration: "none",
                    transition: "border-color 0.2s",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Post to X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, color: "#9CA3AF", fontSize: 12, fontWeight: 600, textDecoration: "none",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
                <InstagramShareButton postUrl={postUrl} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Editorial CTA ─────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.03) 100%)",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: 20,
          padding: "clamp(2rem, 4vw, 3.5rem)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#F97316", margin: 0 }}>
            Take the next step
          </p>
          <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", fontWeight: 800, color: "#ffffff", margin: "0 0 8px", lineHeight: 1.15 }}>
            Ready to transform your streetscape?
          </h2>
          <p style={{ fontSize: 16, color: "#9CA3AF", maxWidth: "55ch", margin: "0 0 28px", lineHeight: 1.7 }}>
            Get a custom spec sheet for your project, or book a complimentary Lunch &amp; Learn with our team.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" style={{
              background: "linear-gradient(135deg, #F97316, #ea6c10)",
              color: "#fff", fontWeight: 700, fontSize: 14,
              padding: "12px 28px", borderRadius: 8, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
            }}>
              See the Systems →
            </Link>
            <Link href="/lunch-learn" style={{
              background: "transparent",
              color: "#F5F0EB", fontWeight: 600, fontSize: 14,
              padding: "12px 28px", borderRadius: 8, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              Book Lunch &amp; Learn
            </Link>
          </div>
        </div>
      </div>

      {/* ── Related posts ─────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0c0c0c" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#F97316", marginBottom: 20 }}>
            Continue Reading
          </p>
          <RelatedPosts posts={allPosts} currentSlug={post.slug} />
        </div>
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
