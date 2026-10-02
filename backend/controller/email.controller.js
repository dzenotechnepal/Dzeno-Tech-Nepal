import { User } from "../models/User.model.js";
import {
  sendCompanyEmail,
  isEmailConfigured,
  isValidEmail,
  normalizeEmail,
} from "../services/email.service.js";

export const getEmailStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    data: { configured: isEmailConfigured() },
    message: "Email status fetched",
  });
};

export const sendInternalEmail = async (req, res) => {
  try {
    const { userIds, subject, message } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "Select at least one company user" });
    }
    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: "Subject and message are required" });
    }

    const users = await User.find({ _id: { $in: userIds }, isActive: true })
      .select("email")
      .lean();
    const recipients = users.map((user) => normalizeEmail(user.email)).filter(Boolean);
    if (recipients.length !== userIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected users are inactive or unavailable",
      });
    }

    const invalidRecipients = recipients.filter((recipient) => !isValidEmail(recipient));
    if (invalidRecipients.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid user email address: ${invalidRecipients.join(", ")}`,
      });
    }

    const html = `<div style="font-family:Arial,sans-serif;white-space:pre-line">${message.trim().replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char])}</div>`;
    const results = await Promise.allSettled(
      recipients.map((recipient) =>
        sendCompanyEmail({
          to: [recipient],
          subject: subject.trim(),
          text: message.trim(),
          html,
        }),
      ),
    );
    const failedRecipients = results
      .map((result, index) =>
        result.status === "rejected"
          ? { email: recipients[index], reason: result.reason?.message || "Email delivery failed" }
          : null,
      )
      .filter(Boolean);

    if (failedRecipients.length > 0) {
      return res.status(502).json({
        success: false,
        data: { sentCount: recipients.length - failedRecipients.length, failedRecipients },
        message: `Email failed for ${failedRecipients.length} selected user(s)`,
      });
    }

    return res.status(200).json({
      success: true,
      data: { recipientCount: recipients.length },
      message: "Email sent successfully",
    });
  } catch (error) {
    return res
      .status(502)
      .json({ success: false, message: error.message || "Email delivery failed" });
  }
};
