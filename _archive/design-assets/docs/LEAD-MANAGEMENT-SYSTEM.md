# HUBSS Lead Management System — Framework & Scaffold

**Status:** Framework only. No production code lands until Vernon ships his list exports + confirms ICP + decides on the Apollo connection.

**Goal:** A CASL-compliant pipeline that turns Vernon's existing warm + cold contact exports (Constant Contact, Apollo, Google Gemini research) into a steady flow of booked sales calls — on autopilot for the parts that can be safely automated, and gated by a human for the parts that can't.

> ⚖️ **This document is operational guidance, not legal advice.** CASL is enforced by the CRTC with penalties up to $10M per violation for businesses. Confirm specifics with counsel before any cold outreach campaign launches. The conservative reading is used throughout — when in doubt, default to "warm only."

---

## 1. Architecture

```
┌─────────────────────┐
│ Source exports      │  Constant Contact CSV, Apollo CSV, Gemini research CSV,
│                     │  + hubss.com form submissions (contact + lunch-learn)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Ingest + normalize  │  Map each source's columns → canonical lead schema (§3).
│                     │  Stamp `source`, `source_date`, `consent_basis` per row.
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Dedupe              │  Match on lowercased email (primary); fall back to
│                     │  (company + last_name) for missing/role emails.
│                     │  Merge — keep highest consent tier; concat tags+notes.
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Enrich              │  Optional: Apollo enrichment (title, LinkedIn, phone,
│                     │  org size, vertical). Tag enrichment_source + date.
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ SEGMENT             │  Two top-level buckets:
│                     │   WARM   — express consent OR documented EBR
│                     │   COLD   — no consent yet; needs route decision
│                     │  Plus ICP tags: municipality | landscape-architect |
│                     │  contractor | transit | developer | other
└──────────┬──────────┘
           │
   ┌───────┴────────┐
   ▼                ▼
┌──────────┐  ┌──────────────┐
│ WARM     │  │ COLD         │
│ nurture  │  │ review queue │   Human-gated. Vernon/Doug/Cleve decides
│ (auto)   │  │              │   per row whether a CASL exception applies
└────┬─────┘  └──────┬───────┘   (conspicuous publication, etc. — §2).
     │               │
     │               ▼
     │        ┌──────────────┐
     │        │ 1:1 outreach │   Manual send from a real person's mailbox.
     │        │ (manual)     │   NOT mailmerge bulk. CASL boilerplate appended.
     │        └──────┬───────┘
     │               │
     └───────┬───────┘
             ▼
┌─────────────────────┐
│ Engagement tracking │  Opens, clicks, replies, form re-submits, page visits
│                     │  (via UTM + Vercel Analytics or PostHog).
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Scoring + handoff   │  Behavioural threshold → flag SQL → notify
│                     │  cleve.stordy@hubss.com or doug.bain@hubss.com
│                     │  with one-click "book a Lunch & Learn" link.
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Booked call         │  Outcome stamped on the lead record. Loop closed.
└─────────────────────┘
```

**Storage:** start in a single source-of-truth table (Postgres via Supabase, or Airtable if Vernon prefers a UI-first tool). Don't fragment across Constant Contact / Apollo / spreadsheets — those become *import sources only*. The system of record is yours, not theirs.

**Why this shape:**
- Segmentation comes *before* sending — never the other way around. CASL violations come from sending bulk to "the whole list" without segmenting consent.
- The cold lane is a *queue*, not a *campaign*. It's the safest CASL posture and matches how municipal/architectural B2B selling actually works (relationships, not blasts).
- The blog/social engine already exists (Resend for transactional today, Buffer setup doc present at `docs/buffer-setup.md`) — this system *feeds* those channels rather than replacing them.

---

## 2. CASL Compliance Guide

CASL (Canada's Anti-Spam Legislation, in force since 2014) governs any **commercial electronic message** (CEM) sent to a Canadian recipient. Three pillars: **consent**, **identification**, **unsubscribe**.

### 2.1 Consent — express vs implied

| Type | What it is | Evidence required | Expiry |
|---|---|---|---|
| **Express** | The person opted in (checkbox, web form, in-person verbal consent recorded, signed agreement) | Record of opt-in: timestamp, IP, source, exact wording shown | Does **not** expire until revoked |
| **Implied — EBR** | Existing **business** relationship: a purchase, lease, written contract, or barter in the last 24 months | Invoice / contract / order record | **24 months** from the transaction date (or contract end) |
| **Implied — Inquiry** | The person made an inquiry or application within the last 6 months | Form submission record, email thread, phone log | **6 months** from the inquiry |
| **Implied — Conspicuous publication** | Their **business** email is published in a public business context (e.g. on their org's contact page), is **not** accompanied by a "no unsolicited messages" statement, AND your message is relevant to their business role | Screenshot/URL of the published address + dated note tying it to their role | Lasts while the publication conditions hold |
| **Implied — Business card** | They handed you a business card (or equivalent) with no "no spam" notice, and the message relates to their role | Note of how/when card was given | While conditions hold |

**Key warm-list rule of thumb:**
- Anyone who filled out the Contact form or the Lunch & Learn form on hubss.com = **implied–Inquiry**, 6-month window.
- Anyone HUBSS has invoiced/contracted/installed-for in the last 24 months = **implied–EBR**, 24-month window.
- Anyone on the Constant Contact list who actively opted in to receive HUBSS emails = **express** (verify in CC's audit log — Constant Contact stores the opt-in source).

**Cold-list rule of thumb:**
- An Apollo or Gemini-researched contact with **no prior interaction with HUBSS** has **no implied consent by default**.
- The realistic cold path is **conspicuous publication** — and only for municipal engineers, planners, public works directors, landscape architects, and transit authority contacts whose business emails are published on their org's website, where HUBSS pavement solutions are relevant to their role. Each one needs a manual check before send.
- Mass cold outreach (mail-merge a list of 500 architects you scraped) — **don't**. That's the violation class.

### 2.2 Identification — every CEM must contain

| Required | What it looks like |
|---|---|
| Sender's legal name (and "doing business as" if applicable) | "HUB Surface Systems" |
| Mailing address (current, valid for ≥60 days) | A real Canadian mailing address — Milton ON or Ladysmith BC office |
| One of: phone, email, or web URL | doug.bain@hubss.com / 416-540-9287 / hubss.com |

This goes in the footer of every commercial email. The transactional emails sent today via Resend (contact-form reply, lunch-learn confirmation) should also carry it — audit those templates.

### 2.3 Unsubscribe — every CEM must offer

- A working unsubscribe mechanism (link or reply-to email).
- Must remain functional for **at least 60 days** after the message is sent.
- Unsubscribe requests must be honored within **10 business days**, no confirmation step required, no login required.
- Keep an unsubscribe log — these recipients are permanently off the warm list until they re-opt-in.

### 2.4 Safe sequencing — what to do in what order

1. **Warm-list nurture FIRST.** Constant Contact express opt-ins + Lunch & Learn form submitters + past customers. Set up a 3–5 email educational drip (case studies, spec sheets, Lunch & Learn invite). Run this for 60–90 days before touching cold.
2. **Re-engagement of EBR contacts** approaching their 24-month expiry — single re-introduction email asking if they'd like to keep hearing from HUBSS. Captures consent renewal before it lapses.
3. **Cold outreach** — only after the warm system is humming. Conspicuous-publication route only. Manual 1:1 sends from Doug or Cleve's mailbox, not bulk-tool sends. Each message references something concrete (a recent municipal project the recipient is involved in, a published RFP) to demonstrate relevance.

### 2.5 Record-keeping

For every consent record, store: **type** (express/EBR/inquiry/conspicuous/business-card), **basis** (URL, transaction ID, form ID, etc.), **date**, **expiry date** if applicable. The CRTC's first question in a complaint is "show me the consent." Make it one query, not a goose chase.

### 2.6 Penalties (so the stakes are clear)

Up to **$10M per violation** for organizations, $1M for individuals. The CRTC has issued seven-figure penalties to Canadian companies for sending CEMs without verifiable consent. The CASL risk on the cold side is real — which is why this doc treats the cold lane as human-gated.

---

## 3. Data Model Scaffold

### 3.1 Canonical `leads` schema

Implementation-agnostic — works as a Postgres table, an Airtable base, or an Apollo CRM custom view. Field names use snake_case to map cleanly to either.

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `email` | string, lowercased | Required. Primary dedupe key. |
| `first_name` | string | |
| `last_name` | string | |
| `title` | string | e.g. "Manager, Transportation Engineering" |
| `company` | string | Organization name |
| `company_type` | enum | `municipality`, `landscape_architect`, `engineering_firm`, `contractor`, `transit_authority`, `developer`, `university_institutional`, `other` |
| `phone` | string | E.164 preferred |
| `linkedin_url` | string | |
| `country` | enum | `CA`, `US`, `other` — CASL applies to CA recipients |
| `province` | enum | `ON`, `BC`, `AB`, `QC`, `SK`, `MB`, `NS`, `NB`, `PE`, `NL`, `YT`, `NT`, `NU`, `null` |
| `city` | string | |
| `source` | enum | `constant_contact`, `apollo`, `gemini_research`, `lunch_learn_form`, `contact_form`, `manual`, `referral` |
| `source_date` | date | When this lead first entered HUBSS's world from this source |
| `source_ref` | string | Source-specific ID — CC contact ID, Apollo person ID, form submission ID |
| `consent_basis` | enum | `express`, `implied_ebr`, `implied_inquiry`, `implied_conspicuous`, `implied_business_card`, `none` |
| `consent_evidence` | text | URL, transaction ID, form ID, screenshot path — whatever proves the basis |
| `consent_date` | date | When consent was given / EBR transaction occurred / inquiry was made |
| `consent_expires` | date \| null | Auto-calculated: inquiry+6mo, EBR+24mo, express=null, conspicuous=null |
| `subscribed` | boolean | False if they unsubscribed; gates sends regardless of consent |
| `unsubscribe_date` | date \| null | |
| `segment` | enum | `warm`, `cold_review_queue`, `cold_cleared`, `do_not_contact` |
| `icp_tags` | text[] | e.g. `["vision-zero", "crosswalk-spec", "rfp-published-2026"]` — free-form qualifiers |
| `last_interaction_at` | timestamp | Most recent open/click/reply/page-visit |
| `last_interaction_type` | string | `email_open`, `email_click`, `reply`, `form_submit`, `page_visit`, `call_booked` |
| `engagement_score` | int | 0–100, rolled up from interactions (decay over time) |
| `stage` | enum | `new`, `nurturing`, `engaged`, `mql`, `sql`, `booked_call`, `customer`, `lost`, `dormant` |
| `assigned_to` | enum | `doug` (East), `cleve` (West), `unassigned` — routed by `province` |
| `notes` | text | Free-form per-lead notes |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### 3.2 CSV import template

A single canonical CSV layout that Vernon (or his EA, or a script) can use for **any** export source. Place each export in the same shape before import.

**File:** `lead-import-template.csv`

```csv
email,first_name,last_name,title,company,company_type,phone,linkedin_url,country,province,city,source,source_date,source_ref,consent_basis,consent_evidence,consent_date,icp_tags,notes
jane.doe@cityofexample.ca,Jane,Doe,"Manager, Transportation Engineering",City of Example,municipality,604-555-0100,https://linkedin.com/in/janedoe,CA,BC,Vancouver,constant_contact,2025-09-12,cc_12345,express,"Opted in via newsletter signup 2025-09-12 — CC audit log entry",2025-09-12,"vision-zero;crosswalk-spec","Met at FCM 2025 in Calgary"
john.smith@landarch.ca,John,Smith,Principal,LandArch Studio,landscape_architect,416-555-0200,,CA,ON,Toronto,lunch_learn_form,2026-01-15,ll_form_456,implied_inquiry,"Submitted Lunch & Learn form 2026-01-15 — form submission ID ll_form_456",2026-01-15,"public-art;decomark",
```

**Per-source mapping cheat sheet** — how to fill `consent_basis` when bulk-importing:

| Source | Likely `consent_basis` | `consent_evidence` should be |
|---|---|---|
| Constant Contact (opted in via web form / Lunch & Learn etc.) | `express` | Constant Contact contact ID + opt-in source field from CC's audit log |
| Constant Contact (manually added) | Check CC's source field. If admin-added without record of opt-in: `none` until verified. | |
| Apollo prospecting export (net-new, no prior contact) | `none` → route to `cold_review_queue` | Apollo person URL |
| Gemini research export (net-new) | `none` → route to `cold_review_queue` | Source URL where contact info was found |
| hubss.com Contact form | `implied_inquiry` | Form submission ID + date |
| hubss.com Lunch & Learn form | `implied_inquiry` | Form submission ID + date |
| Past invoices / contracts (Doug or Cleve verifies) | `implied_ebr` | Invoice or contract number + date |

The import script's job is to:
1. Validate the CSV against the schema (reject rows missing `email` or `source`).
2. Lowercase `email`.
3. Auto-calculate `consent_expires` from `consent_basis` + `consent_date`.
4. Dedupe against the existing table — merge with `keep highest consent + concat tags + concat notes` rule.
5. Default `segment` from `consent_basis`: express/EBR/inquiry → `warm`; conspicuous → `warm` *if* manually verified else `cold_review_queue`; none → `cold_review_queue`.
6. Route `assigned_to` by `province`: ON/QC/Maritimes/MB → `doug`; BC/AB/SK/Territories → `cleve`; null province → `unassigned`.

---

## 4. Autopilot Options

What can run automatically vs what stays human-gated.

### 4.1 What's safe to automate

| Step | Automation | Tooling option |
|---|---|---|
| Ingest CSV → canonical schema | ✓ fully auto | Node script or n8n / Make.com workflow that watches a Google Drive folder for new CSVs |
| Dedupe + merge | ✓ fully auto | Same script |
| Enrichment lookup | ✓ fully auto (rate-limited) | Apollo API enrichment endpoint per row |
| Segment assignment (warm/cold/dnc) | ✓ fully auto | Rule-based from `consent_basis` |
| Warm-lane nurture send | ✓ fully auto | Resend (already in stack) or upgrade to Customer.io / Brevo / ConvertKit for sequence orchestration. Resend can do sequences via cron + state table; a dedicated tool is friendlier for editing copy. |
| Open / click / reply tracking | ✓ fully auto | Whichever ESP — all support it. Webhook events → write back to `lead.last_interaction_at` |
| Engagement scoring | ✓ fully auto | Background job: +5 open, +15 click, +30 reply, +50 form-resubmit, -1/week decay |
| SQL handoff notification | ✓ fully auto | When `engagement_score ≥ 70` OR `stage == 'engaged'` for >7 days → email `assigned_to` with lead summary + Calendly/Cal.com link to book |
| Booked-call outcome capture | ✓ semi-auto | Calendar webhook → set `stage = 'booked_call'` |
| Consent expiry monitoring | ✓ fully auto | Daily cron: anyone with `consent_expires` within 30 days → flag for re-engagement email; expired → move to `do_not_contact` |

### 4.2 What stays human-gated

| Step | Why human | Cadence |
|---|---|---|
| Cold review queue triage | CASL conspicuous-publication test requires per-row judgment (is the email *publicly published*? does the message *relate to their role*?). Wrong call = up to $10M risk. | Weekly batch — Vernon or VA spends 30 min/week clearing the queue |
| 1:1 cold outreach send | Bulk-tool send from a cold lane invites CRTC scrutiny. Personal sends from a real person's mailbox don't. | When a cleared cold lead is sent to Doug/Cleve, they hand-send the first email |
| Nurture copy approval | Each new email in a sequence should be reviewed once. After that it auto-sends. | Once per sequence revision |
| Unsubscribe handling | Should be automatic (web link), but anyone who replies "unsubscribe" by text should be processed by a human within 10 business days as backup | Daily check |

### 4.3 Apollo plugin (`apollo:prospect` / `enrich-lead`) — should we connect it?

**Recommendation: yes, but only for the enrichment and prospecting half — not for sending.**

- **`enrich-lead`** — enrich existing rows in our `leads` table with title/LinkedIn/phone/company size/vertical. Net-positive, no CASL implication (we're enriching contacts we already have a reason to know about).
- **`apollo:prospect`** — surface net-new prospects from Apollo's database matching ICP filters (e.g. "Manager, Transportation Engineering at Canadian municipalities ≥50k population"). Net-new prospects land directly in `cold_review_queue` with `consent_basis = 'none'`. Vernon/team still has to clear each row before any send.
- **What NOT to do with Apollo:** their built-in sequence sender. Apollo is great prospecting, mediocre CASL hygiene. Use it for *finding* people. Use Resend (or upgrade target) for *contacting* them — and only after the queue gate has cleared each one.

**Decision needed from Vernon:** approve Apollo plugin connection? If yes, also: confirm seat license / API quota and which user account hosts the connection.

### 4.4 Recommended phased rollout

| Phase | Scope | Timeline (rough) |
|---|---|---|
| **P0 — Foundation** | Stand up the `leads` table. Build the CSV importer. Audit Constant Contact for consent records. Define the canonical export format. | 1–2 weeks once Vernon's exports land |
| **P1 — Warm autopilot** | Migrate warm list into the table. Wire 3-email educational drip via Resend or chosen ESP. Wire interaction webhooks → score. Wire SQL handoff to Doug/Cleve. | 2–3 weeks |
| **P2 — Cold queue & 1:1** | Build the cold review UI (Airtable view or a small admin page). Cleared rows → drafted 1:1 templates Doug/Cleve send from their own mailboxes. Track replies. | 2 weeks, after P1 is humming |
| **P3 — Apollo enrichment + prospecting** | Connect Apollo plugin (if approved). Backfill enrichment on warm list. Start trickle of net-new ICP prospects into cold queue. | 1–2 weeks |
| **P4 — Optimization** | Cohort analysis (which source × ICP segment → most booked calls). Iterate sequence copy. Re-engagement campaigns for expiring EBR contacts. | Ongoing |

---

## 5. What I need from Vernon to go live

To move from this framework to a working system, I need:

1. **The three list exports**, ideally already mapped to the canonical CSV template (§3.2). If they're in raw source format that's fine too — I'll write the per-source mapper.
   - **Constant Contact**: full contact export including the *consent source* and *opt-in date* fields (don't skip these — they're the CASL audit trail). CC: Contacts → All Contacts → Export. Pull the "Source" and "Confirmed Opt-In" fields.
   - **Apollo**: export of any saved lists Vernon already has. Apollo: People → saved searches/lists → Export.
   - **Google Gemini research**: whatever format Gemini produced (Doc, Sheet, CSV) + a note on the prompt/criteria used, so I know what "research-stage" means in this batch.
2. **ICP confirmation** — does the §3.1 `company_type` enum match how Vernon actually thinks about his audience? Anything missing (e.g. "First Nations / Indigenous government" as a distinct segment)? Any segment to deprioritize?
3. **Apollo connection decision** — approve connecting the `apollo:prospect` + `enrich-lead` plugins? If yes, which Apollo account/seat hosts the connection.
4. **Storage choice** — Supabase Postgres (programmer-friendly, free tier, integrates cleanly with the existing Next.js app) or Airtable (UI-first, Vernon-friendly for direct edits, paid above ~1,500 records). Default recommendation: **Supabase** since the website is already a Next.js app on Vercel and Supabase is in the standard HUBSS stack per CLAUDE.md.
5. **ESP choice for nurture sequences** — keep Resend and roll our own sequencing, or upgrade to Customer.io / Brevo / ConvertKit. Default recommendation: **stay on Resend for P1**, evaluate upgrade in P4 if sequence editing becomes a bottleneck.
6. **Past-customer dump** — to populate `implied_ebr`, I need a list of HUBSS customers who've purchased / contracted / been invoiced in the last 24 months. This may already be in QuickBooks / Vernon's records. Doug + Cleve are the source of truth here.
7. **Legal sign-off path** — confirm Vernon has counsel on hand to review the cold-lane process before any cold outreach launches. If not, recommend retaining one for a single hour of CASL review.

---

## 6. Open questions for Vernon

- Calendly / Cal.com / something else for the "book a call" link in the SQL handoff?
- Lunch & Learn is the obvious primary CTA — anything else (free site visit, RFP language review session, sample kit) we should rotate in as alternative warm CTAs?
- Volume estimate: roughly how many contacts on Constant Contact today? Apollo? Gemini? Helps size the import + the ESP tier choice.
- Bilingual? Any of the contacts French-language-preferred? (Affects sequence copy for QC municipalities.)

---

## Appendix A — CASL email footer template

Drop this into every commercial email template:

```
HUB Surface Systems
[East: 7700 Hurontario St, Milton, ON L9T 0N2 | West: Ladysmith, BC]
416-540-9287 (East) · 604-309-8212 (West) · hubss.com

You're receiving this because [reason — e.g., "you opted in to HUBSS updates
via our website" / "we worked together on the [project] installation"].
Don't want these? [Unsubscribe link] — we'll stop within 10 business days.
```

(Verify the mailing addresses — the East address is illustrative until Doug confirms the exact street address.)

## Appendix B — Reference documents

- CRTC CASL overview — https://crtc.gc.ca/eng/internet/anti.htm
- Fight Spam Canada (official CASL site) — https://fightspam.gc.ca/
- CASL §6 (CEM requirements) and §10 (consent) — read the full sections before final cold-lane sign-off.
