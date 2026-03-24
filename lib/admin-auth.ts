import { headers } from "next/headers";

export async function verifyAdminRequest() {
  const adminKey =
    process.env.ADMIN_DASHBOARD_KEY ||
    (process.env.NODE_ENV !== "production" ? "local-dev-admin" : undefined);

  if (!adminKey) {
    return { ok: false as const, status: 503, error: "ADMIN_DASHBOARD_KEY is not configured." };
  }

  const headerStore = await headers();
  const providedKey = headerStore.get("x-admin-key");

  if (!providedKey || providedKey !== adminKey) {
    return { ok: false as const, status: 401, error: "Unauthorized admin request." };
  }

  return { ok: true as const };
}
