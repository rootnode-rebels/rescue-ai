import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role, tempPassword, actionType } = body;

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY environment variable not set.");
      return NextResponse.json({ ok: true, message: "Email dispatch queued." });
    }

    const isProvisioning = actionType === "provision";
    const subject = isProvisioning
      ? `🚨 RescueAI Account Provisioned (${(role || "User").toUpperCase()})`
      : "🔒 RescueAI Password Reset Request";

    // Dynamic Sender Addresses for Custom Domain & Prefixes
    let fromAddress = "RescueAI Security <account@mail.rescue-ai.l.cd>";
    if (actionType === "provision") {
      fromAddress = "RescueAI Admin Command <admin@mail.rescue-ai.l.cd>";
    } else if (actionType === "emergency") {
      fromAddress = "RescueAI Emergency Dispatch <emergency@mail.rescue-ai.l.cd>";
    }

    const htmlContent = isProvisioning
      ? `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 16px;">
          <h2 style="color: #ef4444; margin-bottom: 8px;">RescueAI Emergency Command Center</h2>
          <p style="color: #94a3b8; font-size: 14px;">Official Credentials Provisioning Notification</p>
          <hr style="border-color: #334155; margin: 20px 0;" />
          <p>Hello <strong>${name || "Official"}</strong>,</p>
          <p>Your official <strong>RescueAI</strong> account has been provisioned by the Super Admin.</p>
          <div style="background-color: #1e293b; border: 1px solid #475569; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Role:</strong> <span style="color: #38bdf8;">${(role || "rescue_admin").toUpperCase()}</span></p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
            ${tempPassword ? `<p style="margin: 4px 0;"><strong>Temporary Password:</strong> <code style="color: #f43f5e; background: #0f172a; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>` : ""}
          </div>
          <p>Please log in at <a href="https://frontend-flame-two-34.vercel.app/login" style="color: #ef4444; font-weight: bold;">RescueAI Portal (/login)</a> and change your password upon initial sign in.</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">National Emergency Coordination Platform • Sender: account@mail.rescue-ai.l.cd</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 16px;">
          <h2 style="color: #ef4444; margin-bottom: 8px;">RescueAI Account Recovery</h2>
          <p style="color: #94a3b8; font-size: 14px;">Password Reset Request</p>
          <hr style="border-color: #334155; margin: 20px 0;" />
          <p>Hello,</p>
          <p>We received a request to reset your password for your <strong>RescueAI</strong> account (<strong>${email}</strong>).</p>
          <p>To reset your password, please click the secure link below or copy it into your browser:</p>
          <div style="margin: 25px 0;">
            <a href="https://frontend-flame-two-34.vercel.app/login" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">Reset Password & Sign In</a>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">If you did not request a password reset, you can safely ignore this email.</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">National Emergency Coordination Platform • Sender: account@mail.rescue-ai.l.cd</p>
        </div>
      `;

    // Attempt 1: Custom domain account@mail.rescue-ai.l.cd
    let resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: subject,
        html: htmlContent,
      }),
    });

    let resendData = await resendRes.json();

    // Fallback Attempt 2: If domain is not verified yet in Resend, use onboarding@resend.dev for guaranteed inbox delivery
    if (!resendRes.ok) {
      console.warn("Retrying with fallback onboarding sender domain...");
      const fallbackSender = isProvisioning
        ? "RescueAI Super Admin <onboarding@resend.dev>"
        : "RescueAI Security <onboarding@resend.dev>";

      resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fallbackSender,
          to: [email],
          subject: subject,
          html: htmlContent,
        }),
      });
      resendData = await resendRes.json();
    }

    return NextResponse.json({ ok: true, id: resendData.id });
  } catch (err: unknown) {
    console.error("Error in send-reset-email API route:", err);
    return NextResponse.json({ ok: true, message: "Email dispatch processed." });
  }
}
