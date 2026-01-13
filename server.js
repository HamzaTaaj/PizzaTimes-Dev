import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Shopify configuration
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'pizzaanytime.myshopify.com';
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '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';

// Contact form submission endpoint
app.post('/api/contact-submit', async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return res.status(400).json({ 
          error: `Missing required field: ${field}` 
        });
      }
    }

    // Map form data to Shopify metaobject format
    const metaobjectData = {
      metaobject: {
        type: 'contact_submission',
        fields: [
          { key: 'full_name', value: formData.name },
          { key: 'email', value: formData.email },
          { key: 'phone', value: formData.phone || '' },
          { key: 'company', value: formData.company || '' },
          { key: 'subject', value: formData.subject },
          { key: 'message', value: formData.message },
          { key: 'source', value: 'vercel-contact-form' },
          { key: 'submitted_at', value: new Date().toISOString() }
        ]
      }
    };

    // Send to Shopify Metaobjects API
    const shopifyResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/metaobjects.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN
        },
        body: JSON.stringify(metaobjectData)
      }
    );

    if (!shopifyResponse.ok) {
      let errorData = {};
      try {
        const errorText = await shopifyResponse.text();
        if (errorText) {
          errorData = JSON.parse(errorText);
        }
      } catch (parseError) {
        errorData = { message: `Shopify API error: ${shopifyResponse.status} ${shopifyResponse.statusText}` };
      }

      return res.status(500).json({ 
        error: 'Failed to submit contact form. Please try again.',
        details: errorData
      });
    }

    const result = await shopifyResponse.json();
    
    return res.status(200).json({ 
      success: true,
      message: 'Contact form submitted successfully',
      id: result.metaobject.id
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Support email submission endpoint
app.post('/api/support-email', async (req, res) => {
  try {
    const ticketData = req.body;

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
    const mailOptions = {
      from: smtpUser,
      to: supportEmail,
      subject: emailSubject,
      text: emailBody,
      replyTo: ticketData.requesterEmail,
      attachments: ticketData.attachment ? [
        {
          filename: ticketData.attachment.filename,
          content: ticketData.attachment.content,
          encoding: 'base64',
          contentType: ticketData.attachment.contentType,
        }
      ] : undefined,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Support ticket submitted successfully. Our team will respond via email.',
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('Error sending support email:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit support ticket. Please try again later.',
      message: error.message || 'An unexpected error occurred',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Local API server running on http://localhost:${PORT}`);
  console.log(`📝 Contact form endpoint: http://localhost:${PORT}/api/contact-submit`);
  console.log(`✉️  Support email endpoint: http://localhost:${PORT}/api/support-email`);
  console.log(`🔗 Ready to receive form submissions!`);
});
