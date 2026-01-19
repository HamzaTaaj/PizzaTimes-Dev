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

// Get Shopify blogs endpoint
app.get('/api/get-shopify-blogs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    console.log('📰 Blog API endpoint called, limit:', limit);
    
    // Check if credentials are available
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      console.error('❌ Missing Shopify credentials');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing Shopify credentials',
        success: false
      });
    }
    
    console.log(`📡 Fetching blogs from: https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/blogs.json`);
    
    // First, get all blogs
    const blogsResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/blogs.json`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN
        }
      }
    );

    if (!blogsResponse.ok) {
      const errorText = await blogsResponse.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      console.error('❌ Shopify API error fetching blogs:', {
        status: blogsResponse.status,
        statusText: blogsResponse.statusText,
        error: errorData
      });
      return res.status(500).json({ 
        error: 'Failed to fetch blogs from Shopify',
        details: errorData,
        success: false
      });
    }

    const blogsData = await blogsResponse.json();
    console.log(`✅ Found ${blogsData.blogs?.length || 0} blogs in Shopify`);
    
    if (!blogsData.blogs || blogsData.blogs.length === 0) {
      console.warn('⚠️  No blogs found in Shopify');
      return res.status(200).json({ 
        success: true,
        articles: [],
        message: 'No blogs found'
      });
    }

    // Fetch articles from all blogs
    const allArticles = [];
    
    for (const blog of blogsData.blogs) {
      console.log(`📝 Fetching articles from blog: ${blog.title} (ID: ${blog.id})`);
      const articlesResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/blogs/${blog.id}/articles.json?limit=250&published_status=published`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN
          }
        }
      );

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        if (articlesData.articles) {
          // Filter only published articles (including future-dated ones for scheduled posts)
          const publishedArticles = articlesData.articles.filter((article) => {
            // Include articles that have published_at set (even if future dated)
            return article.published_at != null;
          });
          
          console.log(`  ✅ Found ${publishedArticles.length} published articles in "${blog.title}"`);
          allArticles.push(...publishedArticles.map((article) => ({
            ...article,
            blogHandle: blog.handle,
            blogTitle: blog.title
          })));
        }
      } else {
        const errorText = await articlesResponse.text();
        console.warn(`  ❌ Failed to fetch articles from "${blog.title}":`, errorText);
      }
    }
    
    console.log(`📊 Total articles collected: ${allArticles.length}`);

    // Sort articles by published date (newest first)
    allArticles.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });

    // Take only the requested limit
    const limitedArticles = allArticles.slice(0, limit);
    console.log(`📦 Returning ${limitedArticles.length} articles (limit: ${limit})`);

    // Transform articles to match frontend structure
    const formattedArticles = limitedArticles.map((article) => {
      // Extract excerpt from summary or body_html
      let excerpt = article.summary || '';
      if (!excerpt && article.body_html) {
        const text = article.body_html.replace(/<[^>]*>/g, '').trim();
        excerpt = text.substring(0, 150) + (text.length > 150 ? '...' : '');
      }

      // Get image from article image or first image in body_html
      let imageUrl = article.image?.src || '';
      if (!imageUrl && article.body_html) {
        const imgMatch = article.body_html.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }
      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop';
      }

      // Format date
      const publishedDate = new Date(article.published_at || article.created_at);
      const formattedDate = publishedDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

      // Get category from blog title (which represents the blog category)
      const category = article.blogTitle || article.tags?.[0] || 'Uncategorized';

      return {
        id: article.id,
        title: article.title,
        excerpt: excerpt,
        date: formattedDate,
        category: category,
        blogTitle: article.blogTitle, // Keep blogTitle for category extraction
        image: imageUrl,
        imageAlt: article.image?.alt || article.title,
        handle: article.handle,
        blogHandle: article.blogHandle,
        url: `/blog/${article.blogHandle}/${article.handle}`,
        publishedAt: article.published_at || article.created_at,
        content: article.body_html || excerpt, // Full HTML content for modal
        bodyHtml: article.body_html // Keep original HTML for complete content
      };
    });

    console.log('✅ Successfully returning articles');
    return res.status(200).json({ 
      success: true,
      articles: formattedArticles,
      blogs: blogsData.blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        handle: blog.handle
      })) // Return blog names for tabs
    });

  } catch (error) {
    console.error('❌ Error fetching blogs from Shopify:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Unknown error',
      success: false
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Local API server running on http://localhost:${PORT}`);
  console.log(`📝 Contact form endpoint: http://localhost:${PORT}/api/contact-submit`);
  console.log(`✉️  Support email endpoint: http://localhost:${PORT}/api/support-email`);
  console.log(`📰 Blog endpoint: http://localhost:${PORT}/api/get-shopify-blogs`);
  console.log(`🔗 Ready to receive form submissions!`);
});
