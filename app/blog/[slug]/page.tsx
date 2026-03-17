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
import { buildMetadata } from "@/lib/seo";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import RelatedPosts from "@/components/blog/RelatedPosts";

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
    <main className="min-h-screen bg-[#0a0a0a]">
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 pb-12">
            <div className="max-w-3xl">
              <p className="text-sm text-gray-400 mb-4">
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
          <MDXRemote source={post.content} />
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
            <p className="text-sm font-semibold text-[#f5f0eb]">
              HUB Surface Systems
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Canadian leader in decorative and functional pavement solutions
            </p>
          </div>
          <ShareButtons url={postUrl} title={post.title} />
        </div>
      </div>

      {/* ── CTA band ────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-[#111]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#f5f0eb] mb-4">
            Ready to transform your streetscape?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
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
              className="px-8 py-4 rounded-lg font-semibold text-sm border border-white/20 text-[#f5f0eb] hover:border-orange-400/40 hover:text-orange-400 transition-all duration-200"
            >
              Book Lunch &amp; Learn
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related Posts ───────────────────────────────── */}
      <div className="pt-16 border-t border-white/5">
        <RelatedPosts posts={allPosts} currentSlug={slug} />
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
