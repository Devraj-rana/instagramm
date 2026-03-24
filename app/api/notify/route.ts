import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { subject, html, to } = await req.json();
    if (!subject || !html) {
      return NextResponse.json({ error: "Missing subject or html" }, { status: 400 });
    }
    const sendTo = to || process.env.NOTIFY_EMAIL;
    if (!sendTo) {
      return NextResponse.json({ error: "No recipient email set" }, { status: 400 });
    }
    await resend.emails.send({
      from: process.env.NOTIFY_FROM_EMAIL || "notify@yourdomain.com",
      to: sendTo,
      subject,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
