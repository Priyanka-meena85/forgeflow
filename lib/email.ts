/**
 * Production-ready Transactional Email Engine for ForgeFlow
 *
 * Supports:
 * 1. Resend API HTTP transport (via RESEND_API_KEY)
 * 2. Automated Development fallback: logs full preview & clickable direct link to console
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/+$/, "");
}

async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim() || "ForgeFlow <notifications@forgeflow.ai>";

  if (apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[Email Engine] Resend delivery failed:", response.status, errText);
        return { success: false, error: `Resend HTTP error ${response.status}: ${errText}` };
      }

      const data = (await response.json()) as { id?: string };
      return { success: true, messageId: data.id };
    } catch (err) {
      console.error("[Email Engine] Transport exception:", err);
      return { success: false, error: err instanceof Error ? err.message : "Transport failure" };
    }
  }

  // Development Fallback: output formatted preview to terminal
  console.log("\n====================================================================");
  console.log(`[TRANSACTIONAL EMAIL - DEVELOPMENT CONSOLE PREVIEW]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`--------------------------------------------------------------------`);
  console.log(text);
  console.log("====================================================================\n");

  return { success: true, messageId: `dev-msg-${Date.now()}` };
}

/**
 * 1. Send Email Verification Link
 */
export async function sendVerificationEmail({
  to,
  token,
  name,
}: {
  to: string;
  token: string;
  name?: string | null;
}): Promise<EmailResult> {
  const appUrl = getAppUrl();
  const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;

  const subject = "Verify your email address for ForgeFlow";
  const recipientName = name ? name.trim() : to.split("@")[0];

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;">
      <span style="font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: #0284c7;">ForgeFlow</span>
      <span style="font-size: 11px; font-family: monospace; color: #64748b; margin-left: 8px; text-transform: uppercase;">Industrial SEO & AEO</span>
    </div>

    <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Verify your work email</h1>
    
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
      Hello ${recipientName},<br>
      Please confirm that this email address belongs to you to activate your closed-loop industrial SEO workspace.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; display: inline-block;">
        Verify Email Address →
      </a>
    </div>

    <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-top: 28px;">
      If the button above does not work, copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #0284c7; word-break: break-all;">${verifyUrl}</a>
    </p>

    <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 32px; margin-bottom: 0;">
      This link will expire in 24 hours. If you did not sign up for ForgeFlow, please disregard this email.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
ForgeFlow - Verify your email address

Hello ${recipientName},

Please click the link below to verify your email address and activate your ForgeFlow workspace:
${verifyUrl}

This verification link will expire in 24 hours.
If you did not sign up for ForgeFlow, you can safely ignore this email.
  `.trim();

  const res = await sendEmail({ to, subject, html, text });
  return { ...res, previewUrl: verifyUrl };
}

/**
 * 2. Send Password Recovery Email
 */
export async function sendPasswordResetEmail({
  to,
  token,
  name,
}: {
  to: string;
  token: string;
  name?: string | null;
}): Promise<EmailResult> {
  const appUrl = getAppUrl();
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const subject = "Reset your ForgeFlow password";
  const recipientName = name ? name.trim() : to.split("@")[0];

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;">
      <span style="font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: #0284c7;">ForgeFlow</span>
      <span style="font-size: 11px; font-family: monospace; color: #64748b; margin-left: 8px; text-transform: uppercase;">Security</span>
    </div>

    <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h1>
    
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
      Hello ${recipientName},<br>
      We received a request to reset the password for your ForgeFlow enterprise account. Click the button below to choose a new password.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; display: inline-block;">
        Reset Account Password →
      </a>
    </div>

    <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-top: 28px;">
      Direct reset link:<br>
      <a href="${resetUrl}" style="color: #0284c7; word-break: break-all;">${resetUrl}</a>
    </p>

    <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 32px; margin-bottom: 0;">
      This password reset link will expire in 1 hour. If you did not request a password reset, you can safely disregard this message; your account remains secure.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
ForgeFlow - Password Reset Request

Hello ${recipientName},

We received a request to reset your ForgeFlow account password.
Please click the link below to select a new password:
${resetUrl}

This link will expire in 1 hour.
If you did not make this request, no action is needed.
  `.trim();

  const res = await sendEmail({ to, subject, html, text });
  return { ...res, previewUrl: resetUrl };
}

/**
 * 3. Send Team Member Workspace Invitation Email
 */
export async function sendInvitationEmail({
  to,
  token,
  organizationName,
  inviterName,
  role = "MEMBER",
}: {
  to: string;
  token: string;
  organizationName: string;
  inviterName?: string | null;
  role?: string;
}): Promise<EmailResult> {
  const appUrl = getAppUrl();
  const inviteUrl = `${appUrl}/accept-invite?token=${encodeURIComponent(token)}`;

  const subject = `You've been invited to join ${organizationName} on ForgeFlow`;
  const inviterText = inviterName ? inviterName.trim() : "An administrator";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;">
      <span style="font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: #0284c7;">ForgeFlow</span>
      <span style="font-size: 11px; font-family: monospace; color: #64748b; margin-left: 8px; text-transform: uppercase;">Team Workspace</span>
    </div>

    <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">You've been invited to join ${organizationName}</h1>
    
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
      ${inviterText} has invited you to collaborate on the <strong>${organizationName}</strong> team workspace on ForgeFlow as a <strong>${role}</strong>.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 16px; margin-bottom: 28px; font-size: 13px; color: #166534;">
      ✓ Full access to deterministic content generation, QA Review Studio, and multi-channel publishing pipelines.
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${inviteUrl}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; display: inline-block;">
        Accept Invitation & Join Workspace →
      </a>
    </div>

    <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-top: 28px;">
      Direct invitation link:<br>
      <a href="${inviteUrl}" style="color: #0284c7; word-break: break-all;">${inviteUrl}</a>
    </p>

    <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 32px; margin-bottom: 0;">
      This invitation will expire in 7 days. If you believe this invitation was sent by mistake, you can ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
ForgeFlow - Team Workspace Invitation

${inviterText} has invited you to join ${organizationName} on ForgeFlow as a ${role}.

Accept your invitation and join the workspace here:
${inviteUrl}

This invitation link will expire in 7 days.
  `.trim();

  const res = await sendEmail({ to, subject, html, text });
  return { ...res, previewUrl: inviteUrl };
}
