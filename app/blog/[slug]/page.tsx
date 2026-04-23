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
import ShareButtons from "@/components/blog/ShareButtons";
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
  try {
    post = getPost(slug);
  } catch {
    return {};
  }
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
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

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
      logo: {
        "@type": "ImageObject",
        url: "https://hubss.com/images/logo.svg",
      },
    },
    url: postUrl,
    image: post.featuredImage
      ? `https://hubss.com${post.featuredImage}`
      : "https://hubss.com/images/og-default.jpg",
  };

  return (
    <main className="min-h-screen bg-[var(--bg-dark)]">
      <JsonLd data={articleSchema} />
      <Nav />

      {/* ── Hero ────────────────────────────────────────── */}
      <header className="relative w-full h-[60vh] min-h-[420px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-dark)]" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-[var(--bg-dark)]/60 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 pb-12">
            <div className="max-w-3xl">
              <p className="text-sm text-gray-300 mb-4">
                {new Date(post.date).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" · "}
                {post.readTime}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* ── Article + Sidebar layout ────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:grid lg:grid-cols-[1fr_240px] lg:gap-16">
        {/* Article body */}
        <article
          data-blog-content
          className="blog-prose prose prose-invert max-w-3xl"
        >
          <MDXRemote
            source={post.content}
            components={{ BlogImage }}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <TableOfContents />
          </div>
        </aside>
      </div>

      {/* ── Author / Share bar ──────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              HUB Surface Systems
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Canadian leader in decorative and functional pavement solutions
            </p>
          </div>
          <ShareButtons url={postUrl} title={post.title} />
        </div>
      </div>

      {/* ── CTA band ────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-[var(--bg-card)]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-4">
            Ready to transform your streetscape?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            From decorative crosswalks to durable transit lanes — get a custom
            spec sheet for your project or book a complimentary Lunch &amp; Learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary px-8 py-4 rounded-lg font-semibold text-sm"
            >
              Request Spec Sheet
            </Link>
            <Link
              href="/lunch-learn"
              className="px-8 py-4 rounded-lg font-semibold text-sm border border-white/20 text-[var(--text-primary)] hover:border-orange-400/40 hover:text-orange-400 transition-all duration-200"
            >
              Book Lunch &amp; Learn
            </Link>
          </div>
        </div>
      </section>

      {/* ── Social share ────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <div className="border-t border-zinc-800 pt-8 mt-12">
          <p className="text-zinc-500 text-sm mb-4">Share this article</p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://hubss.com/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#006099] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=https://hubss.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              Post to X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://hubss.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share on Facebook
            </a>
            <InstagramShareButton postUrl={`https://hubss.com/blog/${post.slug}`} />
          </div>
        </div>
      </div>

      {/* ── Related Posts ───────────────────────────────── */}
      <div className="pt-16 border-t border-white/5 bg-[#0c0c0c]">
        <RelatedPosts posts={getAllPosts()} currentSlug={post.slug} />
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
