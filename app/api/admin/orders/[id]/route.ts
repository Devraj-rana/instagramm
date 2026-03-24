import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdminRequest } from "@/lib/admin-auth";

const ALLOWED_STATUSES = ["pending", "processing", "completed", "cancelled"];

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
  const status = typeof body.status === "string" ? body.status.trim().toLowerCase() : "";

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ success: false, error: "Invalid order status." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
