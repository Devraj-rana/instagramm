import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;
  const body = await request.json();
  const walletBalance = Number(body.walletBalance);

  if (!Number.isFinite(walletBalance) || walletBalance < 0) {
    return NextResponse.json({ success: false, error: "Invalid wallet balance." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      wallet_balance: Number(walletBalance.toFixed(2)),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
