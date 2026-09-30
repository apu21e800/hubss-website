import Link from "next/link";
import { PRODUCT_SLUGS } from "./PostConversion";
import RuleLabel from "./RuleLabel";

/**
 * "Systems in this piece" — the internal-linking rail (Aug 2026).
 *
 * Field Notes posts name products constantly in prose and linked to none of
 * them. That wastes the library twice over: a reader who just learned what
 * TrafficPatternsXD does had no way to go read its specs, and search engines
 * saw 67 pages discussing products with zero internal links to the product
 * pages those posts should be strengthening. Products are now scanned from the
 * whole post body (see scanProducts in lib/blog-taxonomy.ts), so this rail is complete
 * rather than excerpt-deep.
 */
export default function SystemsInPost({ products, primary }: { products: string[]; primary?: string }) {
  // The system the post is about leads (PostConversion's postFocus), then the
  // rest in the order Studio and the text name them.
  const ordered = primary ? [primary, ...products.filter((p) => p !== primary)] : products;
  const linkable = ordered.filter((p) => PRODUCT_SLUGS[p]);
  if (linkable.length === 0) return null;

  // No page margins of its own: the post page sets it in the reading column.
  // 30 Sep 2026: a labelled hairline row, like every other block in Insights
  // (RuleLabel), where it was a box of orange chips.
  return (
    <div>
      <RuleLabel className="mb-1">Systems in this piece</RuleLabel>
      <div className="flex flex-wrap gap-x-7">
        {linkable.map((p) => (
          <Link
            key={p}
            href={`/products/${PRODUCT_SLUGS[p]}`}
            className="group inline-flex min-h-[48px] items-center gap-2 text-[15px] font-semibold transition-colors hover:text-[var(--accent-text)]"
            style={{ color: "var(--text-primary)" }}
          >
            {p}
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="var(--accent-text)"
              viewBox="0 0 24 24"
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
