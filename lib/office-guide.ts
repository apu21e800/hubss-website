/**
 * Doug's one-page guide: how to update hubss.com in the Studio, from a phone
 * or a computer, without reading a manual. Ported from Square One's Studio
 * (23 Oct 2026); written in the style of docs/DOUG-PROJECT-POSTS.md: what you
 * do, in the order you do it, and what happens next. Filled in on 4 Nov 2026
 * (the sweep's Studio audit: the only written steps were docs/HOW-TO-PUBLISH.md,
 * which still said "Insights", and nothing told him how to schedule a post
 * or where his review page was).
 *
 * Shown twice from this one source (components/OfficeGuide.tsx): first in
 * the Studio's list ("Start here", sanity/structure.ts), with his review
 * page's button above it (sanity/components/GuidePane.tsx), and as a page to
 * bookmark, hubss.com/studio/guide (noindex, like the Studio).
 *
 * Pure data: safe in the Studio and on the site. `**bold**` marks a label,
 * written exactly as the Studio (or Doug's email, lib/review-notify.ts)
 * prints it. Updated 12 Nov 2026: Doug's email, and "Job photos"; 13 Nov 2026: "Edit this
 * article" on the review page's cards (Doug: "How do I edit the other posts?"). Plain words, as everything Doug
 * reads in the Studio: who does the work is "21e8" or "Vern", never how
 * (scripts/test-office-guide.ts checks every line, with the house style).
 */

export interface GuideShot {
  /** A file under public/images/guide/, one per step. */
  src: string;
  /** What the screenshot shows, read aloud. */
  alt: string;
  width: number;
  height: number;
}

export interface GuideStep {
  /** The anchor: hubss.com/studio/guide#job-photos. */
  id: string;
  title: string;
  /** When this comes up, in a line. */
  when: string;
  /** What you do, in order. */
  steps: string[];
  /** What happens after. */
  next: string[];
  /** One screenshot per step, from the live Studio. */
  shot?: GuideShot;
}

export interface OfficeGuideContent {
  title: string;
  lead: string;
  steps: GuideStep[];
  foot: string;
}

export const GUIDE_PATH = "/studio/guide";
export const GUIDE_TITLE = "How to update the site";

export const OFFICE_GUIDE: OfficeGuideContent = {
  title: GUIDE_TITLE,
  lead: "hubss.com in six jobs, from a phone or a computer. Each one says what you do and what happens next. Anything else, email Vern.",
  steps: [
    {
      id: "article",
      title: "Put a new article on the site",
      when: "You have a job or a topic worth a page of its own.",
      steps: [
        "**Blog posts**, then the **+** at the top.",
        "Give it a **Title** (under 70 characters if you can), then press **Generate** beside **URL slug**: that makes the page's address from the title.",
        "Pick the **Type**: Case Study, Project Profile, Guide, White Paper or Article.",
        "**Excerpt**: two or three sentences. It is the text on the card and the opening line under the headline.",
        "Write the **Body**. A Heading 2 for each section, and no headings in capitals.",
        "**Featured photo**: HUB's own photo of the job, and in **Alt text** say in one line what is in it.",
        "Tick **Systems this post is about**, then press **Publish** (top right).",
      ],
      next: [
        "The page is on hubss.com in about five minutes. An edit to a live article shows within seconds.",
        "The next morning 21e8 writes its social posts and schedules them. Your OK on the article covers them.",
        "A yellow note under a field is a style check: read it, fix what you agree with, carry on. It never stops you.",
      ],
    },
    {
      id: "schedule",
      title: "Have an article go live on a set day",
      when: "It is ready, but should wait: a ribbon cutting, a council date, a Monday.",
      steps: [
        "Open the draft and switch on **Scheduled**.",
        "Pick the day and time in **Goes live at**.",
        "Leave it as a draft: don't press Publish.",
      ],
      next: [
        "It goes live at the morning check on or after that time (about 9 or 10 am Toronto time), and Vern gets the address.",
        "To hold it, switch **Scheduled** off. To change it once it is live, edit and Publish as usual.",
      ],
    },
    {
      id: "review",
      title: "Check an article before it goes out",
      when: "An email tells you an article is ready for your OK. Or any time you like.",
      steps: [
        "Press **Read the article** in the email. Or, in the Studio, press **Open your review page** at the top of this guide.",
        "Read each article: every word and photo is there. The social posts already scheduled are listed too.",
        "To change an article yourself, press **Edit this article** on its card. It opens here in the Studio: change any word or photo, and it saves as you go. The review page shows the change.",
        "Reply to the email with OK, or with what to change. Your reply goes to Vern.",
      ],
      next: [
        "No article goes on the site until you have said OK.",
        "After your OK, Vern releases it, and its social posts follow at their times. To change a scheduled post, tell Vern.",
      ],
    },
    {
      id: "job-photos",
      title: "Send in a finished job",
      when: "A job is done and you have photos of it.",
      steps: [
        "**Job photos**, then **+**.",
        "Add 1 to 10 **Photos**, best first, each with a line saying what is in it. Only HUB's own photos of this job, and no faces of children.",
        "**Where** (town and province), the **HUB system**, and **What was done**: one or two sentences of facts in your own words.",
        "For a full article, write a few lines of **The story**: why the job mattered, what the client wanted, what you noticed.",
        "Press **Publish**.",
      ],
      next: [
        "Without the story, the photos go out in HUB's social posts over the next few days.",
        "With the story, 21e8 writes the job up as a Projects article, and you get an email to read it before it goes live. Its social posts follow once it is live.",
        "The card at the top of the post says which it will be, and how far it has got.",
        "Leave out customers' phone numbers, emails and street addresses, and name a private homeowner by town only.",
      ],
    },
    {
      id: "fix",
      title: "Fix a mistake on a live page",
      when: "A typo, a wrong date, a photo to swap.",
      steps: [
        "Open the article or page in the Studio. Or press **Edit on the page** above its form: the site opens with the text outlined, and a click on a line opens it.",
        "Change the words or the photo, then press **Publish**.",
      ],
      next: [
        "The site shows the change within seconds.",
        "Product and application pages follow the printed Product Portfolio Book: send those changes to Vern instead of editing them here.",
      ],
    },
    {
      id: "wrong",
      title: "If something looks wrong",
      when: "A change is not showing, or a page looks off.",
      steps: [
        "Wait five minutes, then reload the page (on a computer, Ctrl+Shift+R; on a phone, close the tab and open it again).",
        "Check the page is published: a draft with unpublished changes says so at the top of its form.",
        "Still wrong? Email Vern the page address and what you expected to see.",
      ],
      next: ["Vern answers, and 21e8 fixes what needs fixing."],
    },
  ],
  foot: "Nothing you do here can break the site: a draft is invisible until Publish, and a live page can always be edited again. When in doubt, save without publishing and ask Vern.",
};

/** A line with **bold** labels, split into runs for rendering. */
export function labelRuns(line: string): { text: string; bold: boolean }[] {
  return line
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part) => (/^\*\*[^*]+\*\*$/.test(part) ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false }));
}

/** Every sentence the guide prints, labels unmarked: for the house-style check. */
export function guideText(guide: OfficeGuideContent = OFFICE_GUIDE): string[] {
  const plain = (s: string) => s.replace(/\*\*/g, "");
  return [guide.title, guide.lead, guide.foot, ...guide.steps.flatMap((s) => [s.title, s.when, ...s.steps, ...s.next, ...(s.shot ? [s.shot.alt] : [])])].map(plain);
}
