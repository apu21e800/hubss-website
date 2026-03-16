import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/ui/JsonLd";
import { getAllPosts, getPost } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

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
      logo: { "@type": "ImageObject", url: "https://hubss.com/images/logo.svg" },
    },
    url: `https://hubss.com/blog/${post.slug}`,
    image: post.featuredImage
      ? `https://hubss.com${post.featuredImage}`
      : "https://hubss.com/images/og-default.jpg",
  };

  return (
    <main style={{ background: "#1a1a1a", minHeight: "100vh" }}>
      <JsonLd data={articleSchema} />
      <Nav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="mb-10">
          <Link href="/blog" className="text-xs font-semibold tracking-widest uppercase mb-6 block transition-colors hover:text-[#f97316]" style={{ color: "#9ca3af" }}>
            &larr; Back to Blog
          </Link>
          <p className="text-xs mb-4" style={{ color: "#9ca3af" }}>
            {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
            {" \u00b7 "}{post.readTime}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#f5f0eb" }}>
            {post.title}
          </h1>
        </div>

        {post.featuredImage && (
          <div className="mb-10 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-invert max-w-none"
          style={{
            color: "#9ca3af",
            lineHeight: "1.8",
          }}
        >
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-16 pt-10" style={{ borderTop: "1px solid #333" }}>
          <Link
            href="/contact"
            className="inline-block font-semibold px-8 py-4 rounded text-sm"
            style={{ background: "#f97316", color: "#fff" }}
          >
            Request Spec Sheet
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
