import express from 'express';
import cors from 'cors';

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

app.listen(PORT, () => {
  console.log(`✅ Local API server running on http://localhost:${PORT}`);
  console.log(`📝 Contact form endpoint: http://localhost:${PORT}/api/contact-submit`);
  console.log(`🔗 Ready to receive contact form submissions!`);
});
