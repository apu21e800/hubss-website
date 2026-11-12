/**
 * "Doug's review" on a blog post (12 Nov 2026; Vern: "it's not clear to me
 * how this process works with Doug ... it might be ideal if he gets an email
 * when there is a blog ready for him to review").
 *
 * The field is still `forReview` (the review page reads it,
 * lib/review-page.ts), but the switch is a panel now, with where the article
 * stands in it:
 *  - a new article not sent yet: "Send to Doug". It saves the field, then
 *    asks the site to email Doug a link to it (POST /api/review/notify,
 *    lib/review-notify.ts), through a private one-use record only an editor
 *    can make (lib/review-ask.ts). The morning run sends any it missed;
 *  - sent: "With Doug", when he was emailed, a link to his page, and
 *    "Take it back";
 *  - already on the site: a line saying the review is for new articles.
 * The email's record (`reviewMailed`, private) and Doug's link
 * (lib/review-link-record.ts) are read with the signed-in editor's own
 * session, as the "Start here" button reads the link (GuidePane.tsx). If the
 * panel ever fails, Sanity's own switch takes its place (QuietBoundary).
 *
 * ReviewPanelView draws it from plain values, so a harness can show every
 * state without a signed-in Studio; ReviewPanel feeds it.
 *
 * Doug sees this form too: plain words, nothing about how the article was
 * made or how it goes live (scripts/test-studio-words.ts).
 */
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { CheckmarkCircleIcon, ClockIcon, EnvelopeIcon, LaunchIcon, UndoIcon } from "@sanity/icons";
import { getPublishedId, set, useClient, useEditState, useFormValue, type BooleanInputProps } from "sanity";
import { DOUGS_LINK_ID } from "../../lib/review-link-record";
import { anchorFor } from "../../lib/review-anchor";
import { ASK_PREFIX, ASK_TYPE, newAskKey } from "../../lib/review-ask";
import QuietBoundary from "./QuietBoundary";

/** lib/review-notify.ts MAILED_TYPE (`npm run test:review` keeps them equal). */
const MAILED_TYPE = "reviewMailed";

type Mailed = { state?: "sending" | "sent" | "failed"; cleared?: boolean; mailedAt?: string } | null;

/** What the site answered, in words; nothing when the status line says it. */
const ANSWERS: Record<string, string> = {
  "not sent": "The email to Doug didn't go. Press Email Doug now to try again; if it still won't, it goes tomorrow morning.",
  error: "The site couldn't be reached to email Doug. Press Email Doug now to try again; if it still won't, it goes tomorrow morning.",
  "not ticked": "Still saving. Press Email Doug now in a moment.",
  elsewhere: "Saved. Doug gets the email tomorrow morning.",
  refused: "Saved. Doug gets the email tomorrow morning.",
  off: "Saved. No email goes to Doug while his review is switched off.",
  "already on the site": "This article is already on the site.",
  "not found": "Give the article a title, then send it again.",
};

function when(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-CA", { timeZone: "America/Toronto", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export interface ReviewPanelState {
  /** The article is on the site. */
  live: boolean;
  /** Sent to Doug (the field). */
  on: boolean;
  hasTitle: boolean;
  /** The email went (this round). */
  emailed: boolean;
  /** The email is on its way. */
  sending: boolean;
  /** When it went, as Doug's time zone prints it. */
  mailedWhen: string;
  /** Doug's page at this article's card, when the link is known. */
  page: string | null;
  /** What the site answered to the last press. */
  answer: string | null;
  readOnly?: boolean;
  busy: boolean;
}

/** The panel, from plain values. */
export function ReviewPanelView(props: ReviewPanelState & { onSend: () => void; onEmailNow: () => void; onTakeBack: () => void }) {
  const { live, on, hasTitle, emailed, sending, mailedWhen, page, answer, readOnly, busy } = props;

  if (live) {
    return (
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} muted>
          This article is on the site. Doug&apos;s review is for new articles, before they go live.
        </Text>
      </Card>
    );
  }

  if (!on) {
    return (
      <Card padding={3} radius={2} border>
        <Stack space={3}>
          <Flex wrap="wrap" gap={3} align="center">
            <Button icon={EnvelopeIcon} text={sending ? "Sending..." : "Send to Doug"} tone="primary" disabled={readOnly || busy || !hasTitle} onClick={props.onSend} />
            <Text size={1} muted>
              {hasTitle ? "Doug gets an email with a link to read it. Nothing goes on the site without his OK." : "Give the article a title first."}
            </Text>
          </Flex>
          {answer ? <Text size={1}>{answer}</Text> : null}
        </Stack>
      </Card>
    );
  }

  const status = emailed
    ? `With Doug. Emailed ${mailedWhen}${/\.$/.test(mailedWhen) ? "" : "."}`
    : sending
      ? "With Doug. Sending the email..."
      : "With Doug. The email hasn't gone yet: press Email Doug now, or it goes tomorrow morning.";

  return (
    <Card padding={3} radius={2} border tone={emailed || sending ? "positive" : "caution"}>
      <Stack space={3}>
        <Flex gap={2} align="flex-start">
          <Text size={1}>{emailed ? <CheckmarkCircleIcon /> : <ClockIcon />}</Text>
          <Text size={1} weight="semibold">
            {status}
          </Text>
        </Flex>
        <Text size={1} muted>
          It shows on his review page until it goes live. His reply comes back to Vern.
        </Text>
        <Flex wrap="wrap" gap={2}>
          {page ? <Button as="a" href={page} target="_blank" rel="noopener" icon={LaunchIcon} text="View Doug's page" mode="ghost" /> : null}
          {!emailed && !sending ? <Button icon={EnvelopeIcon} text="Email Doug now" mode="ghost" disabled={readOnly} onClick={props.onEmailNow} /> : null}
          <Button icon={UndoIcon} text="Take it back" mode="bleed" disabled={readOnly || busy} onClick={props.onTakeBack} />
        </Flex>
        {answer ? <Text size={1}>{answer}</Text> : null}
      </Stack>
    </Card>
  );
}

/** If the panel fails, Sanity's own switch takes its place. */
export default function ForReviewInput(props: BooleanInputProps) {
  return (
    <QuietBoundary name="Doug's review" fallback={props.renderDefault(props)}>
      <ReviewPanel {...props} />
    </QuietBoundary>
  );
}

function ReviewPanel(props: BooleanInputProps) {
  const { value, onChange, readOnly } = props;
  const id = useFormValue(["_id"]) as string | undefined;
  const title = useFormValue(["title"]) as string | undefined;
  const publishedId = getPublishedId(id ?? "");
  const editState = useEditState(publishedId, "blogPost");
  const client = useClient({ apiVersion: "2024-01-01" });

  const [mailed, setMailed] = useState<Mailed | undefined>(undefined);
  const [dougsPage, setDougsPage] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "sending" | "taking back">("idle");
  const [answer, setAnswer] = useState<string | null>(null);

  const readMailed = useCallback(async () => {
    if (!publishedId) return;
    try {
      const doc = await client.fetch<Mailed>(`*[_type == $type && articleId == $id][0]{ state, cleared, mailedAt }`, { type: MAILED_TYPE, id: publishedId });
      setMailed(doc ?? null);
    } catch {
      setMailed(null);
    }
  }, [client, publishedId]);

  useEffect(() => {
    void readMailed();
    if (!publishedId) return;
    // The record changes when the email goes, wherever it was sent from.
    const sub = client
      .listen(`*[_type == $type && articleId == $id]`, { type: MAILED_TYPE, id: publishedId }, { visibility: "query", includeResult: false })
      .subscribe({ next: () => void readMailed(), error: () => undefined });
    return () => sub.unsubscribe();
  }, [client, publishedId, readMailed]);

  useEffect(() => {
    let alive = true;
    client
      .fetch<string | null>(`*[_id == $id][0].url`, { id: DOUGS_LINK_ID })
      .then((url) => { if (alive) setDougsPage(typeof url === "string" && url.startsWith("https://") ? url : null); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [client]);

  // The ask (lib/review-ask.ts): a private record only a signed-in editor
  // can make, so the site acts for an editor and nobody else. If it can't be
  // made, the switch is still saved and the morning run sends the email.
  const ask = useCallback(
    async (send: boolean): Promise<string> => {
      const key = newAskKey();
      try {
        await client.create({ _id: `${ASK_PREFIX}${key}`, _type: ASK_TYPE, articleId: publishedId, on: send, at: new Date().toISOString() });
      } catch {
        return "refused";
      }
      try {
        const res = await fetch("/api/review/notify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ask: key }),
        });
        const body = (await res.json()) as { outcome?: string };
        return body.outcome ?? "error";
      } catch {
        return "error";
      }
    },
    [client, publishedId]
  );

  const send = useCallback(
    async (save: boolean) => {
      setPhase("sending");
      setAnswer(null);
      if (save) onChange(set(true));
      const outcome = await ask(true);
      setAnswer(ANSWERS[outcome] ?? null);
      setPhase("idle");
      void readMailed();
    },
    [ask, onChange, readMailed]
  );

  const takeBack = useCallback(async () => {
    setPhase("taking back");
    setAnswer(null);
    onChange(set(false));
    await ask(false);
    setPhase("idle");
    void readMailed();
  }, [ask, onChange, readMailed]);

  if (!editState.ready || mailed === undefined) return null;

  const emailed = mailed?.state === "sent" && !mailed.cleared;
  return (
    <ReviewPanelView
      live={Boolean(editState.published)}
      on={value === true}
      hasTitle={Boolean(title?.trim())}
      emailed={emailed}
      sending={!emailed && (phase === "sending" || mailed?.state === "sending")}
      mailedWhen={when(mailed?.mailedAt)}
      page={dougsPage ? `${dougsPage}#${anchorFor("article", `drafts.${publishedId}`)}` : null}
      answer={answer}
      readOnly={readOnly}
      busy={phase !== "idle"}
      onSend={() => void send(true)}
      onEmailNow={() => void send(false)}
      onTakeBack={() => void takeBack()}
    />
  );
}
