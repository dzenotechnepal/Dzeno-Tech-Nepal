import { User } from '../models/User.model.js';
import { sendCompanyEmail, isEmailConfigured } from '../services/email.service.js';

export const getEmailStatus = (req, res) => {
  return res.status(200).json({ success: true, data: { configured: isEmailConfigured() }, message: 'Email status fetched' });
};

export const sendInternalEmail = async (req, res) => {
  try {
    const { userIds, subject, message } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Select at least one company user' });
    }
    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const users = await User.find({ _id: { $in: userIds }, isActive: true }).select('email').lean();
    const recipients = users.map(user => user.email).filter(Boolean);
    if (recipients.length !== userIds.length) {
      return res.status(400).json({ success: false, message: 'One or more selected users are inactive or unavailable' });
    }

    const info = await sendCompanyEmail({
      to: recipients,
      subject: subject.trim(),
      text: message.trim(),
      html: `<div style="font-family:Arial,sans-serif;white-space:pre-line">${message.trim().replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]))}</div>`,
    });

    return res.status(200).json({ success: true, data: { messageId: info.messageId, recipientCount: recipients.length }, message: 'Email sent successfully' });
  } catch (error) {
    return res.status(502).json({ success: false, message: error.message || 'Email delivery failed' });
  }
};
