/**
 * The small letterspaced label Insights opens a block with, on a hairline
 * whose first few pixels are the brand gradient: the same rule the Insights
 * menu's columns sit on (components/sections/Nav.tsx), so the menu and the
 * pages read as one publication.
 */
export default function RuleLabel({
  children,
  as: Tag = "p",
  id,
  className = "",
}: {
  children: React.ReactNode;
  as?: "p" | "h2";
  id?: string;
  className?: string;
}) {
  return (
    <Tag
      id={id}
      className={`relative pb-3 text-[10.5px] uppercase ${className}`}
      // Type inline: app/globals.css gives every h1-h6 its family, weight,
      // tracking and leading as unlayered CSS, which beats Tailwind's
      // utilities, so an h2 set with classes alone came out squeezed
      // ("BROWSEINSIGHTS").
      style={{
        color: "var(--accent-text)",
        borderBottom: "1px solid var(--ink-10)",
        fontFamily: "inherit",
        fontWeight: 700,
        letterSpacing: "0.2em",
        lineHeight: 1.5,
      }}
    >
      {children}
      <span aria-hidden="true" className="absolute -bottom-px left-0 block h-[2px] w-8" style={{ background: "var(--gradient-brand)" }} />
    </Tag>
  );
}
