import 'dotenv/config';
import nodemailer from 'nodemailer';

const smtpPort = Number(process.env.EMAIL_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const isEmailConfigured = () => Boolean(
  process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
);

export const sendCompanyEmail = async ({ to, subject, text, html }) => {
  if (!isEmailConfigured()) {
    const error = new Error('Email service is not configured');
    console.error('[email] send failed', { reason: error.message, subject });
    throw error;
  }
  if (!Array.isArray(to) || to.length === 0) {
    const error = new Error('At least one recipient is required');
    console.error('[email] send failed', { reason: error.message, subject });
    throw error;
  }

  const recipients = to.filter(Boolean);
  if (recipients.length === 0) {
    const error = new Error('At least one valid recipient is required');
    console.error('[email] send failed', { reason: error.message, subject });
    throw error;
  }

  const message = {
    from: process.env.EMAIL_FROM || `Dzeno Tech Nepal <${process.env.EMAIL_USER}>`,
    to: recipients.join(', '),
    subject,
    text,
    html,
  };

  console.log('[email] sending', {
    from: process.env.EMAIL_USER,
    recipients,
    subject,
  });

  try {
    const info = await transporter.sendMail(message);
    console.log('[email] sent', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    return info;
  } catch (error) {
    console.error('[email] send failed', {
      recipients,
      subject,
      reason: error.message,
      code: error.code,
      response: error.response,
    });
    throw error;
  }
};

export const sendWelcomeEmail = async ({ name, email, password }) => {
  const configuredAdminUrls = (process.env.ADMIN_URL || '').split(',').map(url => url.trim()).filter(Boolean);
  const adminUrl = process.env.ADMIN_LOGIN_URL || configuredAdminUrls.find(url => url.startsWith('https://')) || configuredAdminUrls[0] || 'http://localhost:5174';
  return sendCompanyEmail({
    to: [email],
    subject: 'Your Dzeno Tech Nepal account is ready',
    text: `Hi ${name},\n\nYour Dzeno Tech Nepal employee account has been created.\n\nLogin: ${adminUrl}/admin/login\nEmail: ${email}\nTemporary password: ${password}\n\nPlease change your password after logging in.`,
    html: `<p>Hi ${name},</p><p>Your Dzeno Tech Nepal employee account has been created.</p><p><strong>Login:</strong> <a href="${adminUrl}/admin/login">${adminUrl}/admin/login</a><br /><strong>Email:</strong> ${email}<br /><strong>Temporary password:</strong> ${password}</p><p>Please change your password after logging in.</p>`,
  });
};

export const verifyEmailTransport = async () => {
  if (!isEmailConfigured()) return false;
  await transporter.verify();
  return true;
};
