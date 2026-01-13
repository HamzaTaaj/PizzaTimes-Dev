import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData: ContactSubmission = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!formData[field as keyof ContactSubmission]) {
        return res.status(400).json({ 
          error: `Missing required field: ${field}` 
        });
      }
    }

    // Shopify Admin API configuration
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopifyDomain || !accessToken) {
      console.error('Missing Shopify configuration');
      return res.status(500).json({ 
        error: 'Server configuration error' 
      });
    }

    // Create a metaobject entry in Shopify for contact submission
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
      `https://${shopifyDomain}/admin/api/2024-01/metaobjects.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify(metaobjectData)
      }
    );

    if (!shopifyResponse.ok) {
      let errorData: any = {};
      try {
        const errorText = await shopifyResponse.text();
        if (errorText) {
          errorData = JSON.parse(errorText);
        }
      } catch (parseError) {
        console.error('Failed to parse Shopify error response:', parseError);
        errorData = { message: `Shopify API error: ${shopifyResponse.status} ${shopifyResponse.statusText}` };
      }
      console.error('Shopify API error:', errorData);
      
      // Check for common errors
      if (errorData.errors) {
        const errorMessage = JSON.stringify(errorData.errors);
        
        // Metaobject type doesn't exist
        if (errorMessage.includes('type') || errorMessage.includes('not found')) {
          return res.status(500).json({ 
            error: 'Metaobject type not configured. Please create "contact_submission" metaobject definition in Shopify admin first.',
            setupUrl: 'https://admin.shopify.com/store/pizza-anytime-2/settings/custom_data',
            details: errorData
          });
        }
        
        // Permission error
        if (errorMessage.includes('permission') || errorMessage.includes('access')) {
          return res.status(500).json({ 
            error: 'API permissions missing. Please add read_metaobjects and write_metaobjects permissions to your Shopify app.',
            details: errorData
          });
        }
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
}
