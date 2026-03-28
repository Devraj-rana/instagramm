import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const [profilesResult, ordersResult, testimonialsResult, pendingOrdersResult] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id, full_name, username, website, wallet_balance, updated_at, status")
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(50),
    supabaseAdmin
      .from("orders")
      .select("id, created_at, user_id, platform, service, quantity, target_username, status, total_price")
      .order("created_at", { ascending: false })
      .limit(100),
    supabaseAdmin
      .from("testimonials")
      .select("id, created_at, user_id, body, author_name, author_handle, author_image_url, rating")
      .order("created_at", { ascending: false })
      .limit(100),
    supabaseAdmin
      .from("orders")
      .select("id, created_at, user_id, platform, service, quantity, target_username, status, total_price")
      .eq("status", "pending"),
  ]);

  const firstError = profilesResult.error || ordersResult.error || testimonialsResult.error || pendingOrdersResult.error;
  if (firstError) {
    return NextResponse.json({ success: false, error: firstError.message }, { status: 500 });
  }

  const profiles = profilesResult.data ?? [];
  const orders = ordersResult.data ?? [];
  const testimonials = testimonialsResult.data ?? [];
  const pendingOrders = pendingOrdersResult.data ?? [];

  const stats = {
    totalUsers: profiles.length,
    totalOrders: orders.length,
    pendingOrders: pendingOrders.length,
    totalTestimonials: testimonials.length,
    totalRevenue: orders.reduce((sum, order) => sum + Number(order.total_price ?? 0), 0),
    totalWalletBalance: profiles.reduce((sum, profile) => sum + Number(profile.wallet_balance ?? 0), 0),
  };

  // Merge all unique pending orders into the orders list (avoid duplicates)
  const orderIds = new Set(orders.map((o) => o.id));
  const allOrders = [...orders, ...pendingOrders.filter((o) => !orderIds.has(o.id))];

  return NextResponse.json({
    success: true,
    data: {
      stats,
      profiles,
      orders: allOrders,
      testimonials,
      supportInboxMode: "email_only",
    },
  });
}
