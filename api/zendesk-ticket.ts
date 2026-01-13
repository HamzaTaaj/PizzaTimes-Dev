import type { VercelRequest, VercelResponse } from '@vercel/node';

interface TicketSubmission {
  subject: string;
  description: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  requesterEmail: string;
  requesterName?: string;
  attachment?: {
    filename: string;
    content: string; // base64
    contentType: string;
  };
}

/**
 * Zendesk ONLY accepts string priorities
 */
function mapPriority(
  priority?: string
): 'low' | 'normal' | 'high' | 'urgent' {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'low';
    case 'high':
      return 'high';
    case 'urgent':
      return 'urgent';
    case 'medium':
    default:
      return 'normal';
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // ---------- CORS ----------
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const data: TicketSubmission = req.body;

    // ---------- Validation ----------
    if (!data.subject || !data.description || !data.requesterEmail) {
      return res.status(400).json({
        success: false,
        error: 'subject, description and requesterEmail are required',
      });
    }

    // ---------- ENV ----------
    const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;
    const ZENDESK_TOKEN = process.env.ZENDESK_API_TOKEN;
    const ZENDESK_SUBDOMAIN =
      process.env.ZENDESK_SUBDOMAIN || 'highsierravendingcoffee';

    if (!ZENDESK_EMAIL || !ZENDESK_TOKEN) {
      return res.status(500).json({
        success: false,
        error: 'Zendesk credentials not configured',
      });
    }

    const authToken = Buffer.from(
      `${ZENDESK_EMAIL}/token:${ZENDESK_TOKEN}`
    ).toString('base64');

    // ---------- Base Ticket ----------
    const zendeskTicket: any = {
      ticket: {
        subject: data.subject,
        comment: {
          body: `Category: ${data.category || 'N/A'}\n\n${data.description}`,
        },
        requester: {
          email: data.requesterEmail,
          name:
            data.requesterName ||
            data.requesterEmail.split('@')[0],
        },
        priority: mapPriority(data.priority),
        tags: ['web', 'support-ticket', data.category || 'general'],
      },
    };

    // ---------- Attachment (Optional) ----------
    if (data.attachment) {
      try {
        const uploadUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/uploads.json?filename=${encodeURIComponent(
          data.attachment.filename
        )}`;

        const buffer = Buffer.from(
          data.attachment.content,
          'base64'
        );

        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authToken}`,
            'Content-Type': data.attachment.contentType,
            'Content-Length': buffer.length.toString(),
          },
          body: buffer,
        });

        const uploadText = await uploadRes.text();

        if (uploadRes.ok && uploadText) {
          const uploadJson = JSON.parse(uploadText);
          if (uploadJson?.upload?.token) {
            zendeskTicket.ticket.comment.uploads = [
              uploadJson.upload.token,
            ];
          }
        }
      } catch (err) {
        console.error('Attachment upload failed:', err);
      }
    }

    // ---------- Create Ticket ----------
    const ticketRes = await fetch(
      `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zendeskTicket),
      }
    );

    const responseText = await ticketRes.text();

    // ---------- Error Handling ----------
    if (!ticketRes.ok) {
      console.error('Zendesk error:', ticketRes.status, responseText);

      return res.status(500).json({
        success: false,
        error: 'Zendesk ticket creation failed',
        status: ticketRes.status,
        details: responseText || 'Empty response',
      });
    }

    // ---------- Success ----------
    if (!responseText) {
      return res.status(200).json({
        success: true,
        message: 'Ticket created successfully',
        note: 'Zendesk returned empty body',
      });
    }

    const result = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      message: 'Support ticket created successfully',
      ticketId: result.ticket.id,
      ticketUrl: `https://${ZENDESK_SUBDOMAIN}.zendesk.com/agent/tickets/${result.ticket.id}`,
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
}
