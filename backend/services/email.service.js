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
      reason: error.message,
      statusCode: error.statusCode,
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
