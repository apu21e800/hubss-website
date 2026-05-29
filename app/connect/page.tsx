import { cookies } from "next/headers";
import { issueNonce } from "@/lib/connect/security";
import ConnectClient from "./ConnectClient";

// Mint a fresh nonce + read the single-submission cookie on every request.
// /connect traffic is low (booth-scan only), so the loss of static caching
// is irrelevant.
export const dynamic = "force-dynamic";

const DONE_COOKIE = "hbss_draw_done";

export default async function ConnectPage() {
  const { token: formToken } = issueNonce();
  const jar = await cookies();
  const hasEnteredBefore = jar.get(DONE_COOKIE)?.value === "1";

  return <ConnectClient formToken={formToken} hasEnteredBefore={hasEnteredBefore} />;
}
