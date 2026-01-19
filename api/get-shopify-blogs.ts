import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Shopify Admin API configuration
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopifyDomain || !accessToken) {
      console.error('❌ Missing Shopify configuration:', {
        hasDomain: !!shopifyDomain,
        hasToken: !!accessToken
      });
      return res.status(500).json({ 
        error: 'Server configuration error: Missing Shopify credentials',
        details: {
          hasDomain: !!shopifyDomain,
          hasToken: !!accessToken,
          message: 'Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN environment variables'
        }
      });
    }

    // Get limit from query params (default to 3 for homepage)
    const limit = parseInt(req.query.limit as string) || 3;

    // First, get all blogs
    console.log(`Fetching blogs from Shopify: https://${shopifyDomain}/admin/api/2024-10/blogs.json`);
    
    const blogsResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-10/blogs.json`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken
        }
      }
    );

    if (!blogsResponse.ok) {
      const errorText = await blogsResponse.text();
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      console.error('Shopify API error fetching blogs:', {
        status: blogsResponse.status,
        statusText: blogsResponse.statusText,
        error: errorData
      });
      return res.status(500).json({ 
        error: 'Failed to fetch blogs from Shopify',
        details: errorData,
        message: 'Please ensure your Shopify app has "read_content" permission enabled. See SHOPIFY_BLOG_PERMISSIONS.md for instructions.'
      });
    }

    const blogsData = await blogsResponse.json();
    console.log(`Found ${blogsData.blogs?.length || 0} blogs in Shopify`);
    
    if (!blogsData.blogs || blogsData.blogs.length === 0) {
      console.warn('No blogs found in Shopify');
      return res.status(200).json({ 
        success: true,
        articles: [],
        blogs: [], // Return empty blogs array for tabs
        message: 'No blogs found in Shopify'
      });
    }

    // Extract blog names for tabs
    const blogNames = blogsData.blogs.map((blog: any) => blog.title);
    console.log('📋 Blog names found for tabs:', blogNames);

    // Fetch articles from all blogs
    const allArticles: any[] = [];
    
    for (const blog of blogsData.blogs) {
      console.log(`Fetching articles from blog: ${blog.title} (ID: ${blog.id})`);
      const articlesResponse = await fetch(
        `https://${shopifyDomain}/admin/api/2024-10/blogs/${blog.id}/articles.json?limit=250&published_status=published`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
          }
        }
      );

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        console.log(`Found ${articlesData.articles?.length || 0} articles in blog: ${blog.title}`);
        if (articlesData.articles && articlesData.articles.length > 0) {
          // Filter only published articles (including future-dated ones for scheduled posts)
          const publishedArticles = articlesData.articles.filter((article: any) => {
            // Include articles that have published_at set (even if future dated)
            return article.published_at != null;
          });
          
          console.log(`${publishedArticles.length} published articles found in blog: ${blog.title}`);
          allArticles.push(...publishedArticles.map((article: any) => ({
            ...article,
            blogHandle: blog.handle,
            blogTitle: blog.title
          })));
        }
      } else {
        const errorText = await articlesResponse.text();
        console.warn(`Failed to fetch articles from blog ${blog.title}:`, errorText);
      }
    }
    
    console.log(`Total articles found: ${allArticles.length}`);

    // Sort articles by published date (newest first)
    allArticles.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });

    console.log(`After sorting, ${allArticles.length} articles available`);

    // Take only the requested limit
    const limitedArticles = allArticles.slice(0, limit);
    console.log(`Returning ${limitedArticles.length} articles (limit: ${limit})`);

    // Transform articles to match frontend structure
    const formattedArticles = limitedArticles.map((article: any) => {
      // Extract excerpt from summary or body_html
      let excerpt = article.summary || '';
      if (!excerpt && article.body_html) {
        // Remove HTML tags and get first 150 characters
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
      // If still no image, use a placeholder
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
        bodyHtml: article.body_html // Keep original HTML
      };
    });

    // Return articles and blogs list for tabs
    return res.status(200).json({ 
      success: true,
      articles: formattedArticles,
      blogs: blogsData.blogs.map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        handle: blog.handle
      })) // Return blog names for tabs
    });

  } catch (error) {
    console.error('❌ Error fetching blogs from Shopify:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    });
  }
}
