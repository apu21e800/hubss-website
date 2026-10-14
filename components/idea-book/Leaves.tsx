import Link from "next/link";
import PagePhoto, { photoBand } from "@/components/idea-book/PagePhoto";
import { ideaBook } from "@/lib/catalogue";
import { colourFamily, type ColourFamily } from "@/lib/colours";
import { leafTitle, pageLabel, systemEntry, type Caption, type Leaf, type ProjectCard, type SpecifyLine } from "@/lib/idea-book-edition";
import { mapProjects } from "@/lib/map-projects";
import type { SiteSettings } from "@/lib/site-settings";

/**
 * One leaf of the Product Book edition (lib/idea-book-edition.ts): a printed
 * spread, laid out for the screen. The book's own forms are kept: the dark
 * header band on a system page with its orange rule, the orange dot before
 * an eyebrow, the "Place, Province | System" caption, the spec pairs, the
 * SPECIFY strip, the uses strip in tracked capitals, and the page number.
 *
 * Server component: the markup is static. Styles are app/product-book/edition.css.
 */

const PageLink = ({ leaf, children }: { leaf: Leaf; children?: React.ReactNode }) => (
  <Link href={leaf.pages[0] === 1 ? ideaBook.pagesHref : `${ideaBook.href}/${leaf.pages[0]}`} className="ib-pagelink" title="Open these pages as printed">
    {children ?? <>Printed {leaf.pages.length > 1 ? "pages" : "page"} {pageLabel(leaf)}</>}
  </Link>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="ib-eyebrow">{children}</p>;

function CaptionLine({ caption }: { caption?: Caption }) {
  if (!caption) return null;
  return (
    <p className="ib-caption">
      {caption.place}
      {caption.system && <span className="ib-caption-system"> | {caption.system}</span>}
    </p>
  );
}

function Specify({ lines }: { lines: SpecifyLine[] }) {
  return (
    <div className="ib-specify">
      <p className="ib-label">Specify</p>
      <dl>
        {lines.map((l) => (
          <div key={l.name} className="ib-specify-row">
            <dt>{l.slug ? <Link href={`/products/${l.slug}`}>{l.name}</Link> : l.name}</dt>
            <dd>{l.note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The link a job's card carries: its article when there is one, else its pin on the homepage map. */
function jobHref(card: { post?: string; mapId?: string }): { href: string; label: string } | null {
  if (card.post) return { href: `/blog/${card.post}`, label: "Read the article" };
  if (card.mapId && mapProjects.some((p) => p.id === card.mapId)) return { href: "/#map", label: "See it on the map" };
  return null;
}

function Project({ card, sizes }: { card: ProjectCard; sizes?: string }) {
  const link = jobHref(card);
  return (
    <article className="ib-project">
      <div className="ib-project-photo">
        <PagePhoto photo={card.photo} sizes={sizes} />
        {card.badge && <span className="ib-badge">{card.badge}</span>}
      </div>
      <div className="ib-project-text">
        {card.eyebrow && <Eyebrow>{card.eyebrow}</Eyebrow>}
        {card.title && <h3 className="ib-h3">{card.title}</h3>}
        {card.body && <p className="ib-body">{card.body}</p>}
        <CaptionLine caption={card.caption} />
        {link && <Link href={link.href} className="ib-more">{link.label} →</Link>}
      </div>
    </article>
  );
}

function Swatches({ family }: { family: ColourFamily }) {
  return (
    <div className="ib-family">
      <p className="ib-label">{family.name}</p>
      <ul className="ib-swatches">
        {family.colours.map((c) => (
          <li key={c.name}>
            <span className={`ib-swatch${c.keyline ? " ib-swatch-keyline" : ""}`} style={{ background: c.hex }} aria-hidden="true" />
            <span className="ib-swatch-name">{c.name}</span>
            <span className="ib-swatch-meta">{c.pms ?? (c.sr !== undefined ? `SR ${c.sr.toFixed(2)}` : "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LeafView({ leaf, index, settings, priority }: { leaf: Leaf; index: number; settings: SiteSettings; priority: boolean }) {
  // The first leaf is "in" from the server: it is on screen before scripts run,
  // so it never fades (edition.css keys the entrance on .ib-in).
  const common = { id: leaf.id, "data-leaf": index, "data-pages": pageLabel(leaf), "data-title": leafTitle(leaf), className: `ib-leaf ib-${leaf.kind}${index === 0 ? " ib-in" : ""}` };

  switch (leaf.kind) {
    case "cover":
      return (
        <section {...common} aria-label="Cover">
          <div className="ib-cover-art">
            <PagePhoto photo={leaf.photo} priority={priority} sizes="(max-width: 1023px) 100vw, 60vw" />
          </div>
          <div className="ib-cover-text">
            <p className="ib-eyebrow">Decorative pavement solutions · {ideaBook.volume}</p>
            <h1 className="ib-h1">The HUB Product Book</h1>
            <p className="ib-lede">Every system and every application HUB installs across Canada: what it is, where it goes, and the work it has done. Read it here, on any screen, or open any page as printed.</p>
            <div className="ib-cover-actions">
              <a href="#welcome" className="ib-btn">Start reading</a>
              <Link href={ideaBook.pagesHref} className="ib-btn ib-btn-ghost">The printed book</Link>
            </div>
          </div>
        </section>
      );

    case "welcome":
      return (
        <section {...common} aria-label={leaf.heading}>
          <div className="ib-welcome-text">
            <h2 className="ib-h1">
              {leaf.heading} <span className="ib-accent">{leaf.accent}</span>
            </h2>
            <p className="ib-body ib-measure">{leaf.body}</p>
            <h3 className="ib-h2 ib-mt">
              {leaf.pointsTitle} <span className="ib-accent">{leaf.pointsAccent}</span>
            </h3>
            <ol className="ib-points">
              {leaf.points.map((p, i) => (
                <li key={p.title}>
                  <span className="ib-point-n">{i + 1}</span>
                  <div>
                    <strong>{p.title}</strong>
                    <p>{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <PageLink leaf={leaf} />
          </div>
          <div className="ib-welcome-photos">
            {leaf.photos.map((p) => (
              <div key={p.page} className="ib-welcome-photo">
                <PagePhoto photo={p} sizes="(max-width: 1023px) 100vw, 40vw" />
                {p.line && <p className="ib-photo-line">{p.line}</p>}
                <CaptionLine caption={p.caption} />
              </div>
            ))}
          </div>
        </section>
      );

    case "divider":
      return (
        <section {...common} aria-label={leaf.title}>
          <div className="ib-divider-photo">
            <PagePhoto photo={leaf.photo} sizes="100vw" />
            <div className="ib-divider-word">
              <span className="ib-rule" />
              <h2 className="ib-h0">{leaf.title}</h2>
            </div>
            <CaptionLine caption={leaf.caption} />
          </div>
          {leaf.contents && (
            <div className="ib-contents-page">
              <p className="ib-eyebrow">{leaf.subtitle}</p>
              <ol className="ib-contents-list">
                {leaf.contents.map((c) => (
                  <li key={c.slug}>
                    <a href={`#${c.slug}`}>
                      <span className="ib-contents-name">{c.name}</span>
                      <span className="ib-contents-line">{c.line}</span>
                      <span className="ib-contents-page-n">{c.page}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <PageLink leaf={leaf} />
            </div>
          )}
          {!leaf.contents && (
            <div className="ib-divider-foot">
              <PageLink leaf={leaf} />
            </div>
          )}
        </section>
      );

    case "system": {
      const { entry, product } = systemEntry(leaf.slug);
      return (
        <section {...common} aria-label={product.name}>
          <div className="ib-photo-col">
            <PagePhoto photo={leaf.photo} />
            <CaptionLine caption={leaf.caption} />
          </div>
          <div className="ib-page">
            <header className="ib-page-head">
              <h2 className="ib-system-name">{product.name}</h2>
              <span className="ib-rule" />
            </header>
            <div className="ib-page-body">
              <p className="ib-h2">{entry.title}</p>
              <p className="ib-subhead">{entry.subhead}</p>
              <p className="ib-body">{entry.description}</p>
              <dl className="ib-specs">
                {entry.specs.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              {entry.families && (
                <div className="ib-chips">
                  {entry.families.map((key) => {
                    const family = colourFamily(key);
                    if (!family) return null;
                    return (
                      <div key={key} className="ib-chip-row">
                        <p className="ib-label">{family.name}</p>
                        <ul aria-label={`${family.name}: ${family.colours.map((c) => c.name).join(", ")}`}>
                          {family.colours.map((c) => (
                            <li key={c.name} className={c.keyline ? "ib-swatch-keyline" : undefined} style={{ background: c.hex }} title={c.name} />
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="ib-uses">{entry.uses.join(" · ")}</p>
              <div className="ib-page-foot">
                <Link href={`/products/${product.slug}`} className="ib-more">The {product.name} page →</Link>
                <PageLink leaf={leaf} />
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "colours":
      return (
        <section {...common} aria-label={leaf.title}>
          <div className="ib-colours-head">
            <Eyebrow>{leaf.eyebrow}</Eyebrow>
            <h2 className="ib-h1">{leaf.title}</h2>
            <p className="ib-subhead">{leaf.subtitle}</p>
          </div>
          <div className="ib-families">
            {leaf.families.map((key) => {
              const family = colourFamily(key);
              return family ? <Swatches key={key} family={family} /> : null;
            })}
          </div>
          {leaf.extra && <p className="ib-fine">{leaf.extra}</p>}
          <PageLink leaf={leaf} />
        </section>
      );

    case "steps":
      return (
        <section {...common} aria-label={`${leaf.system}: ${leaf.title}`}>
          <div className="ib-steps-text">
            <Eyebrow>{leaf.system}</Eyebrow>
            <h2 className="ib-h1">{leaf.title}</h2>
            {leaf.subtitle && <p className="ib-subhead">{leaf.subtitle}</p>}
            <ol className="ib-steplist">
              {leaf.steps.map((s, i) => (
                <li key={s.name}>
                  <span className="ib-step-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{s.name}</strong>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="ib-page-foot">
              <Link href={`/products/${leaf.slug}`} className="ib-more">The {leaf.system} page →</Link>
              <PageLink leaf={leaf} />
            </div>
          </div>
          <div className="ib-photo-col">
            <PagePhoto photo={leaf.photo} />
            <p className="ib-caption">
              <span className="ib-dot" />
              {leaf.result}
            </p>
          </div>
        </section>
      );

    case "templates":
      return (
        <section {...common} aria-label={leaf.title}>
          <div className="ib-photo-col ib-photo-dark">
            <PagePhoto photo={leaf.photo} />
          </div>
          <div className="ib-page">
            <header className="ib-page-head">
              <p className="ib-eyebrow ib-eyebrow-light">HUB Surface Systems</p>
              <h2 className="ib-system-name">StreetPrint &amp; TrafficPatternsXD</h2>
            </header>
            <div className="ib-page-body">
              <p className="ib-h2">{leaf.title}</p>
              <p className="ib-subhead">{leaf.subtitle}</p>
              <div className="ib-template-groups">
                {leaf.groups.map((g) => (
                  <div key={g.title}>
                    <p className="ib-label">{g.title}</p>
                    <ul className="ib-dotlist">
                      {g.items.map((i) => <li key={i}>{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="ib-uses">{leaf.uses.join(" · ")}</p>
              <div className="ib-page-foot">
                <Link href="/products/streetprint" className="ib-more">The StreetPrint page →</Link>
                <PageLink leaf={leaf} />
              </div>
            </div>
          </div>
        </section>
      );

    case "application": {
      const link = leaf.mapId ? jobHref({ mapId: leaf.mapId, post: mapProjects.find((p) => p.id === leaf.mapId)?.post }) : null;
      return (
        <section {...common} aria-label={leaf.eyebrow}>
          <div className="ib-app-text">
            <Eyebrow>{leaf.eyebrow}</Eyebrow>
            <h2 className="ib-h1">{leaf.title}</h2>
            <p className="ib-subhead">{leaf.subhead}</p>
            <p className="ib-body">{leaf.body}</p>
            <Specify lines={leaf.specify} />
            <div className="ib-page-foot">
              {leaf.number > 0 && <span className="ib-app-n">Application {String(leaf.number).padStart(2, "0")}</span>}
              {leaf.slug && <Link href={`/applications/${leaf.slug}`} className="ib-more">The {leaf.eyebrow.toLowerCase()} page →</Link>}
              <PageLink leaf={leaf} />
            </div>
          </div>
          <div className="ib-photo-col">
            <PagePhoto photo={leaf.photo} />
            <div className="ib-caption-row">
              <CaptionLine caption={leaf.caption} />
              {link && <Link href={link.href} className="ib-more">{link.label} →</Link>}
            </div>
          </div>
        </section>
      );
    }

    case "then-now": {
      const link = jobHref({ mapId: leaf.mapId, post: mapProjects.find((p) => p.id === leaf.mapId)?.post });
      // Both photographs at one shape, the wider of the two, so the pair reads as a pair.
      const fit = Math.max(photoBand(leaf.before).ratio, photoBand(leaf.after).ratio);
      return (
        <section {...common} aria-label={leaf.title}>
          <div className="ib-app-text">
            <Eyebrow>{leaf.eyebrow}</Eyebrow>
            <h2 className="ib-h1">{leaf.title}</h2>
            <p className="ib-subhead">{leaf.subhead}</p>
            <p className="ib-body">{leaf.body}</p>
            <Specify lines={leaf.specify} />
            <div className="ib-page-foot">
              {leaf.number > 0 && <span className="ib-app-n">Application {String(leaf.number).padStart(2, "0")}</span>}
              {link && <Link href={link.href} className="ib-more">{link.label} →</Link>}
              <PageLink leaf={leaf} />
            </div>
          </div>
          <div className="ib-pair">
            <figure className="ib-then-now-item">
              <PagePhoto photo={leaf.before} fit={fit} />
              <figcaption className="ib-label">{leaf.labels[0]}</figcaption>
            </figure>
            <figure className="ib-then-now-item">
              <PagePhoto photo={leaf.after} fit={fit} />
              <figcaption className="ib-label">{leaf.labels[1]}</figcaption>
            </figure>
            <CaptionLine caption={leaf.caption} />
          </div>
        </section>
      );
    }

    case "statement": {
      const link = jobHref({ mapId: leaf.mapId, post: leaf.post ?? mapProjects.find((p) => p.id === leaf.mapId)?.post });
      return (
        <section {...common} aria-label={leaf.title}>
          <div className="ib-statement-photo">
            <PagePhoto photo={leaf.photo} sizes="(max-width: 1023px) 100vw, 62vw" />
          </div>
          <div className="ib-statement-text">
            {leaf.eyebrow && <p className="ib-eyebrow ib-eyebrow-light">{leaf.eyebrow}</p>}
            <h2 className="ib-h1">{leaf.title}</h2>
            {leaf.body && <p className="ib-body">{leaf.body}</p>}
            <CaptionLine caption={leaf.caption} />
            <div className="ib-page-foot">
              {link && <Link href={link.href} className="ib-more">{link.label} →</Link>}
              <PageLink leaf={leaf} />
            </div>
          </div>
        </section>
      );
    }

    case "projects":
      return (
        <section {...common} aria-label={leafTitle(leaf)} data-count={leaf.items.length}>
          <div className="ib-projects-grid">
            {leaf.items.map((card) => (
              <Project key={card.page} card={card} sizes={leaf.items.length > 1 ? "(max-width: 1023px) 100vw, 50vw" : "(max-width: 1023px) 100vw, 60vw"} />
            ))}
          </div>
          <div className="ib-leaf-foot">
            <PageLink leaf={leaf} />
          </div>
        </section>
      );

    case "installer":
      return (
        <section {...common} aria-label={leaf.title}>
          <div className="ib-photo-col">
            <PagePhoto photo={leaf.photo} />
            <CaptionLine caption={leaf.caption} />
          </div>
          <div className="ib-installer-text">
            <Eyebrow>{leaf.region}</Eyebrow>
            <h2 className="ib-h2">{leaf.title}</h2>
            <p className="ib-body">{leaf.body}</p>
            <p className="ib-installer-contact">
              <span>{leaf.phone}</span>
              <span aria-hidden="true"> · </span>
              <a href={`https://${leaf.web}`} rel="noopener">{leaf.web}</a>
            </p>
            <PageLink leaf={leaf} />
          </div>
        </section>
      );

    case "partner":
      return (
        <section {...common} aria-label={leaf.subtitle}>
          <div className="ib-partner-photos">
            {leaf.photos.map((p) => (
              <div key={p.page}>
                <PagePhoto photo={p} sizes="(max-width: 1023px) 100vw, 50vw" />
                <CaptionLine caption={p.caption} />
              </div>
            ))}
          </div>
          <div className="ib-partner-text">
            <h2 className="ib-h2">{leaf.title}</h2>
            <p className="ib-h3">{leaf.subtitle}</p>
            <p className="ib-body">{leaf.body}</p>
            <PageLink leaf={leaf} />
          </div>
        </section>
      );

    case "closing":
      return (
        <section {...common} aria-label={`${leaf.title} ${leaf.accent}`}>
          <div className="ib-closing-dark">
            <p className="ib-eyebrow">Since 1999.</p>
            <h2 className="ib-h0">
              {leaf.title} <span className="ib-accent">{leaf.accent}</span>
            </h2>
            <p className="ib-stats">{leaf.stats}</p>
            <p className="ib-body">{leaf.line}</p>
            <div className="ib-cover-actions">
              <Link href="/contact" className="ib-btn">Send a project enquiry</Link>
              <Link href={ideaBook.requestHref} className="ib-btn ib-btn-ghost">Request the printed copy</Link>
            </div>
          </div>
          <div className="ib-communities">
            <h3 className="ib-h1 ib-accent">{leaf.communitiesTitle}</h3>
            <p className="ib-subhead">{leaf.communitiesLine}</p>
            <ul className="ib-community-list">
              {leaf.communities.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <PageLink leaf={leaf} />
          </div>
        </section>
      );

    case "lunch": {
      const { west, east } = settings.offices;
      return (
        <section {...common} aria-label={leaf.contactsTitle}>
          <div className="ib-lunch-box">
            <h2 className="ib-h0">
              {leaf.title} <span className="ib-accent">{leaf.accent}</span>
            </h2>
            <p className="ib-body">{leaf.body}</p>
            <ul className="ib-dotlist ib-dotlist-light">
              {leaf.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <Link href="/lunch-learn" className="ib-btn">Register for a free Lunch &amp; Learn</Link>
          </div>
          <div className="ib-contacts">
            <p className="ib-eyebrow">{leaf.contactsEyebrow}</p>
            <h3 className="ib-h1">{leaf.contactsTitle}</h3>
            <p className="ib-subhead">{leaf.contactsLine}</p>
            <div className="ib-offices">
              {([["West coast", west], ["East coast", east]] as const).map(([label, office]) => (
                <div key={label}>
                  <p className="ib-label">{label}</p>
                  <p className="ib-office-name">{office.name}</p>
                  <a href={`mailto:${office.email}`}>{office.email}</a>
                  <a href={`tel:${office.phone.replace(/[^+\d]/g, "")}`}>{office.phone}</a>
                </div>
              ))}
            </div>
            <p className="ib-site"><Link href="/">www.hubss.com</Link></p>
            <p className="ib-fine">specifications · project gallery · information · lunch + learns and damn cool projects!</p>
            <PageLink leaf={leaf} />
          </div>
        </section>
      );
    }

    case "back":
      return (
        <section {...common} aria-label="Back cover">
          <div className="ib-back-art">
            <PagePhoto photo={leaf.photo} sizes="(max-width: 1023px) 100vw, 50vw" />
          </div>
          <div className="ib-back-text">
            <p className="ib-fine">© 2026 HUB Surface Systems · Coast to Coast</p>
            <div className="ib-cover-actions">
              <a href="#cover" className="ib-btn ib-btn-ghost">Back to the cover</a>
              <Link href={ideaBook.pagesHref} className="ib-btn ib-btn-ghost">The printed book</Link>
            </div>
          </div>
        </section>
      );
  }
}
