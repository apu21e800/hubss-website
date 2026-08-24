import Link from "next/link";
import { PRODUCT_SLUGS } from "./PostConversion";

/**
 * "Systems in this piece" — the internal-linking rail (Aug 2026).
 *
 * Field Notes posts name products constantly in prose and linked to none of
 * them. That wastes the library twice over: a reader who just learned what
 * TrafficPatternsXD does had no way to go read its specs, and search engines
 * saw 67 pages discussing products with zero internal links to the product
 * pages those posts should be strengthening. Products are now scanned from the
 * whole post body (see scanProducts in lib/mdx.ts), so this rail is complete
 * rather than excerpt-deep.
 */
export default function SystemsInPost({ products }: { products: string[] }) {
  const linkable = products.filter((p) => PRODUCT_SLUGS[p]);
  if (linkable.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2">
      <div
        className="rounded-xl p-5 sm:p-6"
        style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
      >
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3.5" style={{ color: "#FB923C" }}>
          Systems in this piece
        </p>
        <div className="flex flex-wrap gap-2">
          {linkable.map((p) => (
            <Link
              key={p}
              href={`/products/${PRODUCT_SLUGS[p]}`}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:bg-white/5"
              style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "#F5F0EB" }}
            >
              {p}
              <svg
                width="11"
                height="11"
                fill="none"
                stroke="#FB923C"
                viewBox="0 0 24 24"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
