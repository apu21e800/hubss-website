// SANDBOX-ONLY preview route for the three Lunch & Learn variants.
// Never pushed to the repo — exists to screenshot the options for Vernon.
import LunchLearnV2 from "@/components/sections/LunchLearnV2";

export const metadata = { robots: { index: false, follow: false } };

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-8 pt-16 pb-2">
      <p className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: "#4ade80" }}>
        {children}
      </p>
    </div>
  );
}

export default function LLPreview() {
  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <div id="v-boardroom">
        <Label>Option A — Boardroom</Label>
        <LunchLearnV2 variant="boardroom" />
      </div>
      <div id="v-ticket">
        <Label>Option B — Ticket</Label>
        <LunchLearnV2 variant="ticket" />
      </div>
      <div id="v-proof">
        <Label>Option C — Proof</Label>
        <LunchLearnV2 variant="proof" />
      </div>
    </main>
  );
}
