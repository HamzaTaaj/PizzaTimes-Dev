import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface SupportTicketSubmission {
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requesterEmail: string;
  requesterName?: string;
  attachment?: {
    filename: string;
    content: string; // base64 encoded
    contentType: string;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const ticketData: SupportTicketSubmission = req.body;

    // Validate required fields
    if (!ticketData.subject || !ticketData.description || !ticketData.requesterEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: subject, description, and requesterEmail are required'
      });
    }

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const supportEmail = 'contact@highsierravendingcoffee.com';

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('Missing SMTP configuration');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: SMTP credentials not configured'
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Format email subject
    const emailSubject = `[Support Ticket] ${ticketData.subject} | Priority: ${ticketData.priority}`;

    // Format email body (plain text)
    const emailBody = `
Support Ticket Details:

Name: ${ticketData.requesterName || ticketData.requesterEmail.split('@')[0]}
Email: ${ticketData.requesterEmail}
Category: ${ticketData.category || 'N/A'}
Priority: ${ticketData.priority || 'medium'}

Description:
${ticketData.description}

---
This ticket was submitted through the Pizza Anytime support form.
Submitted at: ${new Date().toISOString()}
`.trim();

    // Prepare email options
    const mailOptions: any = {
      from: smtpUser,
      to: supportEmail,
      subject: emailSubject,
      text: emailBody,
      replyTo: ticketData.requesterEmail,
    };

    // Add attachment if provided
    if (ticketData.attachment) {
      mailOptions.attachments = [
        {
          filename: ticketData.attachment.filename,
          content: ticketData.attachment.content,
          encoding: 'base64',
          contentType: ticketData.attachment.contentType,
        }
      ];
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Support ticket submitted successfully. Our team will respond via email.',
      messageId: info.messageId,
    });

  } catch (error: any) {
    console.error('Error sending support email:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit support ticket. Please try again later.',
      message: error.message || 'An unexpected error occurred',
    });
  }
}
