import { ContactInquiry } from '../models/ContactInquiry.model.js';
import { JobApplication } from '../models/JobApplication.model.js';
import { sendCompanyEmail } from '../services/email.service.js';

const companyRecipient = () => process.env.CONTACT_NOTIFICATION_EMAIL || process.env.EMAIL_USER;

const sendSubmissionEmails = async ({ type, name, email, subject, summary }) => {
  const recipient = companyRecipient();
  if (!recipient) return;

  await sendCompanyEmail({
    to: [recipient],
    subject,
    text: `${summary}\n\nFrom: ${name} <${email}>`,
    html: `<h2>${subject}</h2><p>${summary.replace(/\n/g, '<br />')}</p><p>From: ${name} &lt;${email}&gt;</p>`,
  });

  await sendCompanyEmail({
    to: [email],
    subject: `We received your ${type === 'application' ? 'application' : 'inquiry'}`,
    text: `Hi ${name},\n\nThank you for contacting Dzeno Tech Nepal. Our team has received your ${type === 'application' ? 'application' : 'inquiry'} and will get back to you soon.`,
    html: `<p>Hi ${name},</p><p>Thank you for contacting Dzeno Tech Nepal. Our team has received your ${type === 'application' ? 'application' : 'inquiry'} and will get back to you soon.</p>`,
  });
};

export const createContactInquiry = async (req, res) => {
  try {
    const { name, company, email, phone, service, budget, message } = req.body;
    if (!name?.trim() || !email?.trim() || !service?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Name, email, service, and message are required' });
    }

    const inquiry = await ContactInquiry.create({ name, company, email, phone, service, budget, message });
    try {
      await sendSubmissionEmails({
        type: 'inquiry',
        name,
        email,
        subject: `New Contact Inquiry - ${service}`,
        summary: `Service: ${service}\nBudget: ${budget || 'Not provided'}\nCompany: ${company || 'Not provided'}\nPhone: ${phone || 'Not provided'}\n\n${message}`,
      });
    } catch (emailError) {
      console.error('Contact notification email failed:', emailError.message);
    }

    return res.status(201).json({ success: true, data: { id: inquiry._id }, message: 'Inquiry received successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createJobApplication = async (req, res) => {
  try {
    const { name, portfolio, email, phone, applicationType, position, message } = req.body;
    if (!name?.trim() || !email?.trim() || !applicationType?.trim() || !position?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Name, email, application type, position, and message are required' });
    }

    const application = await JobApplication.create({ name, portfolio, email, phone, applicationType, position, message });
    try {
      await sendSubmissionEmails({
        type: 'application',
        name,
        email,
        subject: `New Job Application - ${position}`,
        summary: `Position: ${position}\nApplication type: ${applicationType}\nPortfolio: ${portfolio || 'Not provided'}\nPhone: ${phone || 'Not provided'}\n\n${message}`,
      });
    } catch (emailError) {
      console.error('Application notification email failed:', emailError.message);
    }

    return res.status(201).json({ success: true, data: { id: application._id }, message: 'Application received successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getContactInquiries = async (req, res) => {
  try {
    const query = req.query.status ? { status: req.query.status } : {};
    const inquiries = await ContactInquiry.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: inquiries, message: 'Inquiries fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactInquiry = async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, { status: req.body.status, adminNotes: req.body.adminNotes }, { new: true, runValidators: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    return res.status(200).json({ success: true, data: inquiry, message: 'Inquiry updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const query = req.query.status ? { status: req.query.status } : {};
    const applications = await JobApplication.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: applications, message: 'Applications fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJobApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(req.params.id, { status: req.body.status, adminNotes: req.body.adminNotes }, { new: true, runValidators: true });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    return res.status(200).json({ success: true, data: application, message: 'Application updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
