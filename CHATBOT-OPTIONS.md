# HUBSS AI Chatbot — Options Analysis

> Decision doc for Vernon. Three paths; one recommendation.

---

## The Site Already Has Crisp Chat

`client.crisp.chat` is in your CSP headers. That's the widget at bottom-right. Any AI option needs to either replace it or work alongside it.

---

## Option A — Custom Claude-Powered Chat (Recommended)

**What it is:** A Next.js API route at `/api/chat` that reads HUBSS product/application data from your codebase and uses Claude Haiku to answer product questions intelligently.

**Already built:** `app/api/ai-chat/route.ts` exists with a basic version. This option upgrades it with actual HUBSS product knowledge injection (RAG-lite).

**How it works:**
1. User types a question in Crisp (or a custom chat widget)
2. Request hits `/api/chat` API route
3. Route injects relevant HUBSS context (products, applications matching the query)
4. Claude Haiku answers in HUBSS brand voice
5. Response streams back to the user

**Cost:** ~$0.001–0.003 per conversation (Haiku pricing). At 100 conversations/month = $0.10–0.30/month.

**Pros:**
- Product-aware: knows the difference between MMAX and StreetBond
- Brand voice: answers like HUBSS, not a generic chatbot
- No third-party AI subscription needed (uses your existing ANTHROPIC_API_KEY)
- Can link to specific product pages
- Completely private — conversations stay on your infrastructure

**Cons:**
- Needs an `ANTHROPIC_API_KEY` in Vercel (you already have one for blog gen)
- Requires a frontend chat widget (Crisp can be the UI — just route questions to this API)
- You need to set a Vercel spending limit to cap costs

**To activate:**
1. Add `showAIChat: true` to `lib/site-flags.ts`
2. Confirm `ANTHROPIC_API_KEY` is in Vercel env vars
3. Connect Crisp to the `/api/chat` endpoint via Crisp's custom integration, OR build a simple chat widget

**Verdict: This is the right path.** It's cheap, smart, and branded.

---

## Option B — Crisp's Built-In AI Add-On

**What it is:** Crisp offers "Crisp AI" — their own AI that learns from your help center content.

**Cost:** Requires Crisp "Pro" plan (~$45/month) or "Unlimited" plan (~$95/month). Their AI is available on Pro+.

**Pros:**
- Zero code — just enable in Crisp dashboard
- Uses your Crisp help articles as the knowledge base
- Native UI integration

**Cons:**
- $45–95/month (vs. $0.30/month for Option A)
- Requires writing help centre articles (content work)
- Generic AI, not trained on your specific product specs
- Less controllable brand voice

**Verdict:** Too expensive relative to Option A unless you're already on a paid Crisp plan.

---

## Option C — Rule-Based FAQ Bot

**What it is:** A simple decision-tree bot. "Are you asking about crosswalks? → [link]", "About bike lanes? → [link]", etc.

**Cost:** Free (Crisp's built-in bot functionality is included on free plan).

**Pros:**
- Truly free
- Reliable — never hallucinates
- Fast to set up in Crisp dashboard

**Cons:**
- Not actually AI — just a fancy FAQ link system
- Frustrating for users with questions outside the predefined tree
- Gives a poor impression compared to real AI

**Verdict:** Only choose this if cost is the absolute constraint. Not recommended.

---

## Recommendation: Option A, activated now (gated off by default)

The upgraded API route is already built in this PR. It's off by default (feature flag). Here's what Vernon needs to do to turn it on:

### Activation Checklist

- [ ] Confirm `ANTHROPIC_API_KEY` exists in Vercel env vars (needed for blog gen too)
- [ ] Set a monthly Anthropic spend limit of $5 (more than enough)
- [ ] Set `showAIChat: true` in `lib/site-flags.ts` when ready to test
- [ ] Optionally: build a simple chat widget or connect Crisp to the `/api/chat` endpoint

### What the upgraded route does

- Detects which products/applications are relevant to the user's question
- Injects that context into the Claude prompt
- Answers in HUBSS brand voice (no filler, no warranty claims, technical authority)
- Streams the response for a fast UX
- Refuses off-topic questions politely ("I can help with HUB Surface Systems products...")
- Falls back gracefully if API key is missing

---

## What "Truly Free" Means

Nothing with real AI is truly free. The realistic options:
- **Option A at scale:** $1–5/month if the site gets meaningful chat traffic
- **Option B:** $45–95/month regardless of usage
- **Option C:** Free but not AI

For HUBSS's current traffic level, Option A costs about the same as 1-2 coffees per year. That's the realistic answer to "would be cool, free if possible."
