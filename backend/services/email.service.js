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
    throw new Error('Email service is not configured');
  }
  if (!Array.isArray(to) || to.length === 0) {
    throw new Error('At least one recipient is required');
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || `Dzeno Tech Nepal <${process.env.EMAIL_USER}>`,
    to: to.join(', '),
    subject,
    text,
    html,
  });
};

export const verifyEmailTransport = async () => {
  if (!isEmailConfigured()) return false;
  await transporter.verify();
  return true;
};
