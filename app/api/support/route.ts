import { NextResponse } from "next/server";
import { Resend } from "resend";

interface SupportRequestBody {
  name?: string;
  email?: string;
  username?: string;
  issueType?: string;
  message?: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const supportToEmail =
    process.env.SUPPORT_TO_EMAIL ?? "support@socialinsight.tech";
  const supportFromEmail = process.env.SUPPORT_FROM_EMAIL;

  if (!resendApiKey || !supportFromEmail) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Support email is not configured yet. Add RESEND_API_KEY and SUPPORT_FROM_EMAIL to enable it.",
      },
      { status: 500 }
    );
  }

  let body: SupportRequestBody;

  try {
    body = (await request.json()) as SupportRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const username = body.username?.replace(/^@/, "").trim() ?? "";
  const issueType = body.issueType?.trim() ?? "General support";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const subject = `[Support] ${issueType} - ${name}`;
  const usernameLine = username ? `@${username}` : "Not provided";
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: supportFromEmail,
    to: [supportToEmail],
    subject,
    html: `
      <div>
        <h2>New support request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Instagram Username:</strong> ${escapeHtml(usernameLine)}</p>
        <p><strong>Issue Type:</strong> ${escapeHtml(issueType)}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      </div>
    `,
    text: [
      "New support request",
      `Name: ${name}`,
      `Email: ${email}`,
      `Instagram Username: ${usernameLine}`,
      `Issue Type: ${issueType}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    replyTo: email,
  });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: `Email provider error: ${error.message}`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
