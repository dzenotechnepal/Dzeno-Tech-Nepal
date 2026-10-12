import "dotenv/config";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || process.env.API_KEY,
});

const senderEmail = process.env.MAILERSEND_FROM_EMAIL || process.env.EMAIL_USER;
const senderName = process.env.MAILERSEND_FROM_NAME || "Dzeno Tech Nepal";

export const isEmailConfigured = () =>
  Boolean((process.env.MAILERSEND_API_KEY || process.env.API_KEY) && senderEmail);

export const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));

export const sendCompanyEmail = async ({ to, subject, text, html }) => {
  if (!isEmailConfigured()) {
    const error = new Error("Email service is not configured");
    console.error("[email] send failed", { reason: error.message, subject });
    throw error;
  }
  if (!Array.isArray(to) || to.length === 0) {
    const error = new Error("At least one recipient is required");
    console.error("[email] send failed", { reason: error.message, subject });
    throw error;
  }

  const recipients = [...new Set(to.map(normalizeEmail).filter(Boolean))];
  if (recipients.length === 0) {
    const error = new Error("At least one valid recipient is required");
    console.error("[email] send failed", { reason: error.message, subject });
    throw error;
  }

  const invalidRecipients = recipients.filter((recipient) => !isValidEmail(recipient));
  if (invalidRecipients.length > 0) {
    const error = new Error(`Invalid recipient email address: ${invalidRecipients.join(", ")}`);
    console.error("[email] send failed", { reason: error.message, subject });
    throw error;
  }

  console.log("[email] sending", {
    from: senderEmail,
    recipients,
    subject,
  });

  try {
    const emailParams = new EmailParams()
      .setFrom(new Sender(senderEmail, senderName))
      .setTo(recipients.map((recipient) => new Recipient(recipient)))
      .setReplyTo(new Sender(senderEmail, senderName))
      .setSubject(subject)
      .setHtml(html || `<p>${text || ""}</p>`)
      .setText(text || "");
    const info = await mailerSend.email.send(emailParams);
    console.log("[email] sent", {
      messageId: info?.headers?.["x-message-id"] || info?.messageId || null,
      recipientCount: recipients.length,
    });
    return info;
  } catch (error) {
    console.error("[email] send failed", {
      recipients,
      subject,
      statusCode: error.statusCode,
      reason: error.message,
      body: error.body ?? error.response?.body ?? null,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    throw error;
  }
};

export const sendWelcomeEmail = async ({ name, email, password }) => {
  const configuredAdminUrls = (process.env.ADMIN_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  const adminUrl =
    process.env.ADMIN_LOGIN_URL ||
    configuredAdminUrls.find((url) => url.startsWith("https://")) ||
    configuredAdminUrls[0] ||
    "http://localhost:5174";
  return sendCompanyEmail({
    to: [email],
    subject: "Your Dzeno Tech Nepal account is ready",
    text: `Hi ${name},\n\nYour Dzeno Tech Nepal employee account has been created.\n\nLogin: ${adminUrl}/admin/login\nEmail: ${email}\nTemporary password: ${password}\n\nPlease change your password after logging in.`,
    html: `<p>Hi ${name},</p><p>Your Dzeno Tech Nepal employee account has been created.</p><p><strong>Login:</strong> <a href="${adminUrl}/admin/login">${adminUrl}/admin/login</a><br /><strong>Email:</strong> ${email}<br /><strong>Temporary password:</strong> ${password}</p><p>Please change your password after logging in.</p>`,
  });
};

export const verifyEmailTransport = async () => {
  if (!isEmailConfigured()) return false;
  console.log("[email] MailerSend configuration verified");
  return true;
};

// ─── Leave email helpers ──────────────────────────────────────────────────────

/**
 * Notify all admins / CEO that an employee has applied for leave.
 * @param {object} opts
 * @param {string[]} opts.adminEmails  - list of admin/ceo email addresses
 * @param {string}   opts.employeeName
 * @param {string}   opts.employeeId  - e.g. "EMP-001"
 * @param {string}   opts.leaveType   - e.g. "annual"
 * @param {string}   opts.startDate   - e.g. "2025-10-15"
 * @param {string}   opts.endDate
 * @param {number}   opts.totalDays
 * @param {string}   opts.reason
 * @param {string}   opts.adminUrl    - base URL of admin panel
 */
export const sendLeaveAppliedEmail = async ({
  adminEmails,
  employeeName,
  employeeId,
  leaveType,
  startDate,
  endDate,
  totalDays,
  reason,
  adminUrl = "http://localhost:5174",
}) => {
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const subject = `[Leave Request] ${employeeName} (${employeeId}) — ${cap(leaveType)} Leave`;

  const text = `
New Leave Request

Employee  : ${employeeName} (${employeeId})
Leave Type: ${cap(leaveType)}
From      : ${startDate}
To        : ${endDate}
Days      : ${totalDays}
Reason    : ${reason}

Please log in to the admin panel to approve or reject this request:
${adminUrl}/admin/hr

— Dzeno Tech Nepal HR System
`.trim();

  const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;border:1px solid #e4e4e7">
  <div style="background:#6d28d9;padding:24px 28px">
    <h2 style="color:#fff;margin:0;font-size:18px">New Leave Request</h2>
    <p style="color:#ddd6fe;margin:4px 0 0;font-size:13px">Dzeno Tech Nepal — HR System</p>
  </div>
  <div style="padding:28px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#6b7280;width:120px">Employee</td><td style="padding:6px 0;font-weight:600;color:#111827">${employeeName} <span style="color:#6b7280;font-weight:400">(${employeeId})</span></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Leave Type</td><td style="padding:6px 0;color:#111827">${cap(leaveType)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">From</td><td style="padding:6px 0;color:#111827">${startDate}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">To</td><td style="padding:6px 0;color:#111827">${endDate}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Total Days</td><td style="padding:6px 0;color:#111827">${totalDays}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;vertical-align:top">Reason</td><td style="padding:6px 0;color:#111827">${reason}</td></tr>
    </table>
    <div style="margin-top:24px">
      <a href="${adminUrl}/admin/hr" style="display:inline-block;background:#6d28d9;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">Review Request →</a>
    </div>
  </div>
  <div style="padding:16px 28px;background:#f3f4f6;font-size:12px;color:#9ca3af">
    This is an automated notification from the Dzeno Tech Nepal HR system.
  </div>
</div>
`.trim();

  return sendCompanyEmail({ to: adminEmails, subject, text, html });
};

/**
 * Notify the employee that their leave has been approved or rejected.
 * @param {object} opts
 * @param {string}  opts.employeeEmail
 * @param {string}  opts.employeeName
 * @param {string}  opts.leaveType
 * @param {string}  opts.startDate
 * @param {string}  opts.endDate
 * @param {number}  opts.totalDays
 * @param {'approved'|'rejected'} opts.status
 * @param {string}  [opts.reviewerName]
 * @param {string}  [opts.note]          - optional review note
 */
export const sendLeaveStatusEmail = async ({
  employeeEmail,
  employeeName,
  leaveType,
  startDate,
  endDate,
  totalDays,
  status,
  reviewerName = "HR / Management",
  note = "",
}) => {
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const isApproved = status === "approved";
  const statusLabel = isApproved ? "Approved ✅" : "Rejected ❌";
  const accentColor = isApproved ? "#059669" : "#dc2626";
  const bgColor = isApproved ? "#ecfdf5" : "#fef2f2";
  const subject = `[Leave ${cap(status)}] Your ${cap(leaveType)} Leave Request — Dzeno Tech Nepal`;

  const text = `
Hi ${employeeName},

Your ${leaveType} leave request has been ${status}.

Leave Type: ${cap(leaveType)}
From      : ${startDate}
To        : ${endDate}
Days      : ${totalDays}
Status    : ${cap(status)}
Reviewed by: ${reviewerName}
${note ? `\nNote: ${note}` : ""}

${isApproved ? "Please plan accordingly." : "You may contact HR to discuss further."}

— Dzeno Tech Nepal HR System
`.trim();

  const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;border:1px solid #e4e4e7">
  <div style="background:${accentColor};padding:24px 28px">
    <h2 style="color:#fff;margin:0;font-size:18px">Leave Request ${statusLabel}</h2>
    <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">Dzeno Tech Nepal — HR System</p>
  </div>
  <div style="padding:28px">
    <p style="font-size:15px;color:#111827;margin:0 0 18px">Hi <strong>${employeeName}</strong>,</p>
    <p style="font-size:14px;color:#374151;margin:0 0 20px">
      Your <strong>${cap(leaveType)}</strong> leave request has been
      <strong style="color:${accentColor}">${status}</strong> by ${reviewerName}.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#6b7280;width:120px">Leave Type</td><td style="padding:6px 0;color:#111827">${cap(leaveType)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">From</td><td style="padding:6px 0;color:#111827">${startDate}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">To</td><td style="padding:6px 0;color:#111827">${endDate}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Total Days</td><td style="padding:6px 0;color:#111827">${totalDays}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Status</td><td style="padding:6px 0;font-weight:700;color:${accentColor}">${cap(status)}</td></tr>
      ${note ? `<tr><td style="padding:6px 0;color:#6b7280;vertical-align:top">Note</td><td style="padding:6px 0;color:#111827">${note}</td></tr>` : ""}
    </table>
    <div style="margin-top:20px;padding:14px;background:${bgColor};border-radius:6px;font-size:13px;color:${accentColor}">
      ${isApproved ? "Your leave has been approved. Please plan your work handover accordingly." : "Your leave request was not approved. Please contact HR for more details or to resubmit."}
    </div>
  </div>
  <div style="padding:16px 28px;background:#f3f4f6;font-size:12px;color:#9ca3af">
    This is an automated notification from the Dzeno Tech Nepal HR system.
  </div>
</div>
`.trim();

  return sendCompanyEmail({ to: [employeeEmail], subject, text, html });
};

