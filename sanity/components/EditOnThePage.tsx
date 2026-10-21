/**
 * The "Edit on the page" button above the form of every document that has a
 * page on the site: articles (drafts included), products, applications and
 * the four pages (21 Oct 2026). It opens Studio's "Edit on the page" at that
 * document's own page, with the document open beside it. The tool in Studio's
 * top bar always starts on the homepage, and the "Used on N pages" list above
 * the form is easy to miss; Vern, 21 Oct: "when I try to click the 'Edit on
 * the page' button on a blog article, it takes me to the homepage".
 *
 * The address and the link come from sanity/studio-pages.ts, which also feeds
 * the "Used on N pages" list, so the two can't point at different pages.
 * Inside "Edit on the page" itself the button stays out of the way: the
 * document is already beside its page there.
 */
import { Component, type ReactNode } from "react";
import { Box, Button, Card, Flex, Text } from "@sanity/ui";
import { EyeOpenIcon } from "@sanity/icons";
import { isDocumentSchemaType, type InputProps } from "sanity";
import { useIntentLink } from "sanity/router";
import { usePresentationParams } from "sanity/presentation";
import { TYPES_WITH_A_PAGE, documentPage, editOnThePageIntent } from "../studio-pages";

interface DocValue {
  _id?: string;
  slug?: { current?: string | null } | null;
  name?: string | null;
  title?: string | null;
}

function EditOnThePageCard({ type, value }: { type: string; value: DocValue | undefined }) {
  // Set only inside "Edit on the page" (the one Presentation tool here).
  const inPresentation = !!usePresentationParams(false);
  const id = value?._id;
  const page = documentPage(type, { slug: value?.slug?.current, name: value?.name, title: value?.title });
  // A hook, so it runs on every render; its link is used only once there's a page.
  const link = useIntentLink(editOnThePageIntent(id ?? "", type, page?.href ?? "/"));

  if (inPresentation) return null;

  const ready = !!(id && page);
  const words = !ready
    ? "Once the article has a URL slug (Generate, under the title), you can see it on the page from here."
    : type === "blogPost"
      ? "See this article as it looks on the site, and click any text to change it."
      : "See this page as it looks on the site, and click any text or photo to change it.";

  return (
    <Card padding={3} radius={2} border tone="primary" marginBottom={4}>
      <Flex align="center" gap={3} wrap="wrap">
        <Box flex={1} style={{ minWidth: 200 }}>
          <Text size={1}>{words}</Text>
        </Box>
        {ready ? (
          <Button as="a" href={link.href} onClick={link.onClick} icon={EyeOpenIcon} text="Edit on the page" tone="primary" />
        ) : (
          <Button disabled icon={EyeOpenIcon} text="Edit on the page" tone="primary" />
        )}
      </Flex>
    </Card>
  );
}

/**
 * If the button ever fails (a Studio upgrade, an odd document), it disappears
 * and the form below it carries on: Doug must always be able to edit.
 */
class QuietBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error("[studio] the Edit on the page button failed; the form is unaffected", err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Studio form input (sanity.config.ts, `form.components.input`): the button
 * above the form of a document that has a page; every other input renders as
 * before.
 */
export function EditOnThePageInput(props: InputProps): ReactNode {
  const type = props.schemaType;
  if (!isDocumentSchemaType(type) || !TYPES_WITH_A_PAGE.has(type.name)) return props.renderDefault(props);
  return (
    <div>
      <QuietBoundary>
        <EditOnThePageCard type={type.name} value={props.value as DocValue | undefined} />
      </QuietBoundary>
      {props.renderDefault(props)}
    </div>
  );
}
