/**
 * HUBSS AI chat — upgraded from generic assistant to product-aware HUBSS agent.
 * Model: claude-haiku (fast + cheap ~$0.001/conversation vs Opus at 10× the cost).
 * Gated behind SITE_FLAGS.showAIChat (default: false — Vernon enables when ready).
 * Feature flag lives in lib/site-flags.ts.
 */
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { SITE_FLAGS } from "@/lib/site-flags";

const HUBSS_PRODUCTS = `HUB Surface Systems — Canadian decorative pavement systems:
TrafficPatternsXD: 150-mil aggregate-reinforced preformed thermoplastic. BPN 65+ skid resistance. For BRT corridors, bus stops, high-volume intersections.
TrafficPatterns: 125-mil standard preformed thermoplastic. Crosswalks, bike lanes, regulatory markings. Heat-fused, traffic-ready within hours.
StreetPrint: In-place stamped asphalt, 12+ patterns (brick/cobblestone/slate/herringbone). Flush, snowplow-safe. Sealed with StreetBond colour.
StreetBond: Flexible acrylic coating for asphalt/concrete. Bike lanes, bus zones, plazas, driveways. Full Pantone matching. BC MoT recognized.
StreetBondSR: Solar reflective — SRI ≥ 0.33. Meets LEED v4 SS Credit: Heat Island Reduction.
DecoMark: Custom preformed thermoplastic to vector artwork. Pride crosswalks, Indigenous art, civic murals.
MMAX: MMA resin, cures 45–60 min at +3°C. Red bus lanes, protected bike lanes, BRT.
DuraTherm: Preformed thermoplastic inlaid into milled groove — flush with road, zero raised edges, snowplow-safe.
DuraShield: Epoxy-modified acrylic maintenance coating. SR 0.34. Parking lots, driveways.
PreMark: Preformed thermoplastic road symbols. 125mil, heat-applied, traffic-ready immediately.
AirMark: Preformed thermoplastic for taxiways, aprons, helipads. Certified to airfield standards.
Contacts: West — Cleve Stordy 604.309.8212 cleve.stordy@hubss.com | East — Doug Bain 416.540.9287 doug.bain@hubss.com
Lunch & Learn: Free 45-min technical session. AIBC/RAIC/PEO CE credits. hubss.com/lunch-learn`;

const SYSTEM_PROMPT = `You are a product-knowledgeable assistant for HUB Surface Systems (hubss.com), a Canadian leader in decorative pavement and surface marking systems.

Help municipal engineers, planners, contractors, and developers choose the right product for their project.

Brand voice: Technical authority, civic pride. Direct and specific. Canadian English (colour/centre/fibre).

${HUBSS_PRODUCTS}

Rules:
- Answer only HUBSS product questions, pavement topics, or Canadian municipal infrastructure
- For off-topic questions: "I'm set up to help with HUB Surface Systems products and specifications."
- Never claim AODA compliance, warranty specifics, or regulatory guarantees
- Recommend specific products by name when they clearly fit the use case
- Keep responses to 2-4 short paragraphs — engineers don't need fluff
- For complex project specs: suggest a Lunch & Learn or direct contact with the regional rep`;

// Keyword-to-product mapping for lightweight context hints
const PRODUCT_HINTS: [string, string[]][] = [
  ["TrafficPatternsXD", ["tpxd", "150mil", "brt", "bus rapid", "aggregate reinforced"]],
  ["TrafficPatterns", ["125mil", "thermoplastic crosswalk", "bike lane marking", "regulatory"]],
  ["StreetPrint", ["stamped asphalt", "brick pattern", "cobblestone", "herringbone", "driveway"]],
  ["StreetBond", ["streetbond", "coloured pavement", "acrylic coating", "plaza colour"]],
  ["StreetBondSR", ["leed", "solar reflective", "heat island", "sri", "sustainability"]],
  ["DecoMark", ["custom graphic", "pride crosswalk", "indigenous art", "mural", "cultural"]],
  ["MMAX", ["mma resin", "overnight cure", "red lane", "bus lane colour", "45 minute cure"]],
  ["DuraTherm", ["inlaid thermoplastic", "flush crosswalk", "milled groove", "snowplow safe inlay"]],
  ["DuraShield", ["maintenance coating", "parking lot seal", "asphalt rejuvenation"]],
  ["PreMark", ["arrow marking", "stop bar", "bike symbol", "school zone legend"]],
  ["AirMark", ["airfield", "taxiway", "apron", "helipad", "airport marking"]],
];

function buildContextHint(message: string): string {
  const lower = message.toLowerCase();
  const matches = PRODUCT_HINTS.filter(([, kws]) => kws.some((kw) => lower.includes(kw))).map(([p]) => p);
  return matches.length ? ` [Context: question likely about ${matches.join(", ")}]` : "";
}

export async function POST(request: NextRequest) {
  // Feature-gated — enable in lib/site-flags.ts when ready
  if (!SITE_FLAGS.showAIChat) {
    return Response.json({ error: "AI chat is not currently enabled." }, { status: 503 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "AI chat is not configured. Contact site admin." }, { status: 503 });
  }

  let message: string;
  try {
    const body = await request.json();
    message = String(body.message ?? "").slice(0, 2000).trim();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!message) return Response.json({ error: "Message is required." }, { status: 400 });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = client.messages.stream({
          // Haiku: 10× cheaper than Opus, still excellent for product Q&A
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: message + buildContextHint(message) }],
        });

        for await (const chunk of aiStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "text", content: chunk.delta.text })}\n\n`)
            );
          }
        }
        controller.close();
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", content: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
