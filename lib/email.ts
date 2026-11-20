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
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:8080")
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
      [VERIFIED] Full access to deterministic content generation, QA Review Studio, and multi-channel publishing pipelines.
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

/**
 * 4. Send Review Pending Alert to Application Engineer
 */
export async function sendReviewPendingAlert({
  to,
  reviewerName,
  draftTitle,
  equipment,
  vertical,
  draftId,
}: {
  to: string;
  reviewerName?: string | null;
  draftTitle: string;
  equipment?: string;
  vertical?: string;
  draftId: string;
}): Promise<EmailResult> {
  const appUrl = getAppUrl();
  const reviewUrl = `${appUrl}/?tab=qa&draftId=${encodeURIComponent(draftId)}`;
  const subject = `[Action Required] Engineering Sign-Off Needed: ${draftTitle.slice(0, 50)}…`;
  const name = reviewerName ? reviewerName.trim() : "Application Engineer";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <span style="font-size: 16px; font-weight: 800; color: #0284c7;">ForgeFlow</span>
      <span style="font-size: 11px; font-family: monospace; color: #64748b; margin-left: 8px;">ENGINEERING QA DISPATCH</span>
    </div>

    <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0;">New Technical Slice Awaiting Verification</h2>
    
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      Hello ${name},<br>
      A new zero-volume programmatic technical article has passed automated quality gates and is pending your human engineering verification.
    </p>

    <div style="background-color: #f1f5f9; border-left: 4px solid #0284c7; padding: 14px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${draftTitle}</div>
      <div style="font-size: 11px; font-family: monospace; color: #64748b; margin-top: 4px;">
        Target: ${equipment || "Industrial Asset"} &bull; Vertical: ${vertical || "General Engineering"}
      </div>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${reviewUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; display: inline-block;">
        Review Operating Limits &amp; Sign Off →
      </a>
    </div>

    <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
      As a certified Application Engineer, your sign-off ensures zero-hallucination compliance and generates Schema.org reviewedBy Person metadata.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
ForgeFlow - Engineering Sign-Off Needed

Hello ${name},

A new technical article is pending your application engineering review:
"${draftTitle}"
Target Equipment: ${equipment || "Industrial Asset"}
Vertical: ${vertical || "General Engineering"}

Review operating envelopes and sign off here:
${reviewUrl}
  `.trim();

  return sendEmail({ to, subject, html, text });
}

/**
 * 5. Send Review Decision Alert to Content Strategist / Author
 */
export async function sendReviewDecisionAlert({
  to,
  authorName,
  draftTitle,
  status,
  reviewerName,
  reviewerNotes,
  draftId,
}: {
  to: string;
  authorName?: string | null;
  draftTitle: string;
  status: "APPROVED" | "CHANGES_REQUESTED";
  reviewerName: string;
  reviewerNotes?: string | null;
  draftId: string;
}): Promise<EmailResult> {
  const appUrl = getAppUrl();
  const draftUrl = `${appUrl}/?tab=qa&draftId=${encodeURIComponent(draftId)}`;
  const isApproved = status === "APPROVED";
  const subject = isApproved
    ? `[Approved] ${draftTitle.slice(0, 45)}… ready for syndication`
    : `[Revisions Requested] ${draftTitle.slice(0, 45)}…`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px;">
    <h2 style="font-size: 18px; font-weight: 700; color: ${isApproved ? "#15803d" : "#b45309"}; margin-top: 0;">
      ${isApproved ? "Engineering Sign-Off Complete" : "Revisions Requested by Application Engineer"}
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      <strong>${reviewerName}</strong> has marked <em>"${draftTitle}"</em> as <strong>${status}</strong>.
    </p>
    ${reviewerNotes ? `<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 13px; color: #334155; margin: 16px 0;"><strong>Engineer Notes:</strong><br>${reviewerNotes}</div>` : ""}
    <div style="margin-top: 24px;">
      <a href="${draftUrl}" style="background-color: ${isApproved ? "#15803d" : "#0284c7"}; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; display: inline-block;">
        ${isApproved ? "View Approved Draft →" : "Edit Tolerances in QA Studio →"}
      </a>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
ForgeFlow - Review Update: ${status}

${reviewerName} marked "${draftTitle}" as ${status}.
${reviewerNotes ? `Notes: ${reviewerNotes}\n` : ""}
Link: ${draftUrl}
  `.trim();

  return sendEmail({ to, subject, html, text });
}

/**
 * 6. Send Published Page Notification to Organization Lead
 */
export async function sendPublishedAlert({
  to,
  organizationName,
  draftTitle,
  publishedUrl,
  cmsType,
}: {
  to: string;
  organizationName: string;
  draftTitle: string;
  publishedUrl: string;
  cmsType: string;
}): Promise<EmailResult> {
  const subject = `[Published] Live on ${cmsType}: ${draftTitle.slice(0, 50)}…`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px;">
    <h2 style="font-size: 18px; font-weight: 700; color: #0284c7; margin-top: 0;">Technical Article Successfully Published</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      <em>"${draftTitle}"</em> has been dispatched and published to your <strong>${cmsType}</strong> instance with embedded TechArticle JSON-LD schema.
    </p>
    <div style="margin: 24px 0;">
      <a href="${publishedUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; display: inline-block;">
        View Live Article on CMS →
      </a>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `ForgeFlow - Article Published to ${cmsType}\n\n"${draftTitle}" is now live at: ${publishedUrl}`;
  return sendEmail({ to, subject, html, text });
}
