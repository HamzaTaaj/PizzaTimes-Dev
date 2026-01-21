import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, TrendingUp, Award, Users, Globe, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fadeInUp, staggerContainer, viewportConfig } from '../utils/animations';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useAuth } from '../context/AuthContext';
import { GetStartedPopup } from './MarketingPage';

export function BlogPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showGetStartedPopup, setShowGetStartedPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [blogArticles, setBlogArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all blogs from Shopify
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/get-shopify-blogs?limit=100'); // Get all blogs
        
        if (response.ok) {
          const data = await response.json();
          console.log('📰 Blog data received:', data);
          
          if (data.success) {
            // Set articles
            if (data.articles && data.articles.length > 0) {
              console.log(`✅ Setting ${data.articles.length} articles`);
              setBlogArticles(data.articles);
            } else {
              console.warn('⚠️ No articles found in response');
              setBlogArticles([]);
            }
            
            // Extract categories from blogs array (blog names from Shopify)
            if (data.blogs && data.blogs.length > 0) {
              const blogNames = data.blogs.map((blog: any) => blog.title).filter(Boolean).sort();
              console.log('📋 Blog names for tabs:', blogNames);
              setCategories(['All', ...blogNames]);
            } else if (data.articles && data.articles.length > 0) {
              // Fallback: extract from articles if blogs array not available
              const uniqueCategories = Array.from(
                new Set(data.articles.map((article: any) => article.blogTitle || article.category || 'Uncategorized'))
              ).filter(Boolean).sort() as string[];
              console.log('📋 Categories from articles:', uniqueCategories);
              setCategories(['All', ...uniqueCategories]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter articles by selected category (match by blogTitle which is the blog name from Shopify)
  const filteredArticles = selectedCategory === 'All' 
    ? blogArticles 
    : blogArticles.filter((article: any) => {
        // Match by blogTitle (which is the blog name) or category
        const articleBlogName = article.blogTitle || article.category;
        const matches = articleBlogName === selectedCategory;
        if (!matches && selectedCategory !== 'All') {
          console.log(`❌ Article "${article.title}" doesn't match "${selectedCategory}". Blog: "${articleBlogName}"`);
        }
        return matches;
      });

  console.log(`🔍 Filtered articles for "${selectedCategory}":`, filteredArticles.length, 'out of', blogArticles.length);
  if (blogArticles.length > 0) {
    console.log('📝 Sample article:', {
      title: blogArticles[0]?.title,
      blogTitle: blogArticles[0]?.blogTitle,
      category: blogArticles[0]?.category
    });
  }

  // Fallback static data
  const fallbackReleases = [
    {
      id: 1,
      date: 'December 15, 2025',
      category: 'Expansion',
      title: 'Pizza Anytime Expands to 50 Locations Nationwide',
      excerpt: 'Revolutionary vending technology brings fresh pizza to transit hubs, corporate campuses, and universities across the country.',
      image: 'https://images.unsplash.com/photo-1689942007101-de5d836afcf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NjYwNjY3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      content: 'We are thrilled to announce that Pizza Anytime has reached a major milestone with our 50th installation. Our automated pizza vending machines are now serving customers in major metropolitan areas, bringing the convenience of fresh, hot pizza to locations where it matters most.',
      icon: Globe
    },
    {
      id: 2,
      date: 'November 28, 2025',
      category: 'Awards',
      title: 'Innovation Award: Best Automated Food Service 2025',
      excerpt: 'Industry recognition for pioneering smart vending machine technology and revolutionizing the quick-service food industry.',
      image: 'https://images.unsplash.com/photo-1652212976547-16d7e2841b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBibHVlfGVufDF8fHx8MTc2NjAxMzUyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      content: 'Pizza Anytime has been honored with the prestigious Food Service Innovation Award 2025, recognizing our groundbreaking approach to automated food preparation and delivery. This award celebrates our commitment to excellence in technology and customer service.',
      icon: Award
    },
    {
      id: 3,
      date: 'November 10, 2025',
      category: 'Partnership',
      title: 'Strategic Partnership with Leading Food Chains Announced',
      excerpt: 'Major collaboration to revolutionize quick-service restaurant industry through advanced automation technology.',
      image: 'https://images.unsplash.com/photo-1642789736356-d7122adfe91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzY1OTk5MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      content: 'Today we announced a strategic partnership with several leading food service brands to integrate our technology into their operations. This collaboration will bring automated pizza preparation to millions of new customers.',
      icon: Users
    },
    {
      id: 4,
      date: 'October 22, 2025',
      category: 'Technology',
      title: 'AI-Powered Quality Control System Launch',
      excerpt: 'New machine learning algorithms ensure consistent quality and reduce waste by 40%.',
      image: 'https://images.unsplash.com/photo-1754195451509-00c25c20fdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdmVuZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzY2MDY1NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      content: 'Our latest software update introduces advanced AI algorithms that monitor every aspect of the cooking process. The system learns from millions of data points to optimize temperature, timing, and ingredient distribution for perfect results every time.',
      icon: TrendingUp
    },
    {
      id: 5,
      date: 'October 5, 2025',
      category: 'Sustainability',
      title: 'Carbon Neutral Operations Achieved',
      excerpt: 'Pizza Anytime becomes first automated food service to reach carbon neutrality.',
      image: 'https://images.unsplash.com/photo-1689942007101-de5d836afcf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NjYwNjY3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      content: 'We are proud to announce that all Pizza Anytime operations are now carbon neutral. Through energy-efficient design, renewable energy partnerships, and sustainable sourcing, we are leading the industry in environmental responsibility.',
      icon: Globe
    },
    {
      id: 6,
      date: 'September 18, 2025',
      category: 'Product Launch',
      title: 'PizzaMatic Pro X1 - Next Generation Machine Unveiled',
      excerpt: 'New model features enhanced capacity, faster cooking, and advanced customization options.',
      image: 'https://images.unsplash.com/photo-1652212976547-16d7e2841b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBibHVlfGVufDF8fHx8MTc2NjAxMzUyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      content: 'Introducing the PizzaMatic Pro X1, our most advanced vending machine yet. With 69-pizza capacity, IoT connectivity, and AI-powered cooking, this machine sets a new standard for automated food service.',
      icon: TrendingUp
    }
  ];

  // Use dynamic categories from Shopify, show only "All" while loading
  const displayCategories = loading ? ['All'] : (categories.length > 1 ? categories : ['All']);
  
  // Show filtered articles if available, otherwise show fallback only when not loading and no blog articles from Shopify
  const displayArticles = (filteredArticles.length > 0) 
    ? filteredArticles 
    : (!loading && blogArticles.length === 0 && filteredArticles.length === 0) 
      ? fallbackReleases 
      : filteredArticles; // Show filteredArticles even if empty (will show "No articles" message)

  console.log('📊 Display state:', {
    displayArticlesCount: displayArticles.length,
    loading,
    filteredCount: filteredArticles.length,
    blogArticlesCount: blogArticles.length,
    selectedCategory,
    hasFallback: fallbackReleases.length
  });

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <section className="relative py-24 overflow-hidden bg-blue-50 rounded-b-[3rem]">

        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <span className="text-blue-600 font-medium text-sm">Corporate Updates</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-slate-900 font-bold">
              Latest <span className="text-blue-600">Updates</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Stay informed about the latest developments, innovations, and corporate achievements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-wrap gap-3 justify-center"
          >
            {displayCategories.map((category, index) => (
              <motion.button
                key={category}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all font-medium ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600'
                  }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Updates Grid */}
      <section className="relative py-16 bg-white">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="space-y-8"
          >
            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid md:grid-cols-3 gap-6 p-6 bg-white border border-slate-200 rounded-2xl animate-pulse">
                    <div className="h-48 bg-slate-200 rounded-xl" />
                    <div className="md:col-span-2 space-y-4">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                      <div className="h-8 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              displayArticles.map((release: any, index: number) => (
              <motion.article
                key={release.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="grid md:grid-cols-3 gap-6 p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all">
                  {/* Image */}
                  <div className="relative rounded-xl overflow-hidden aspect-video md:aspect-square">
                    <ImageWithFallback
                      src={release.image}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {release.icon && (
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <release.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{release.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-blue-600" />
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                            {release.category || release.blogTitle || 'Uncategorized'}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl md:text-3xl mb-4 text-slate-900 font-semibold group-hover:text-blue-600 transition-colors">
                        {release.title}
                      </h2>

                      <p className="text-slate-600 mb-4 line-clamp-4 md:line-clamp-4 leading-relaxed text-base">
                        {release.excerpt || 'No excerpt available.'}
                      </p>
                    </div>

                    <div className="mt-4">
                      <motion.button
                        onClick={() => {
                          setSelectedArticle(release);
                          setIsModalOpen(true);
                        }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors font-medium"
                      >
                        Read Full Release
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.article>
              ))
            )}
          </motion.div>

          {!loading && displayArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Get Started CTA - same as Marketing page (dark bg, orbs, wave, Get Started Now) */}
      <section className="relative py-24 overflow-hidden bg-[#0f172a]">
        {/* Animated blue orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#2563eb] rounded-full"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-[#3b82f6] rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.10, 0.06] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#60a5fa] rounded-full"
          />
        </div>
        {/* Curved bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-6 text-white font-bold">Ready to Turn Unused Floor Space into Reliable Revenue?</h2>
            <p className="text-xl text-blue-50 mb-8">
              More advanced technology. A more flexible business model. The lowest cost of entry in the category. That's why smart operators choose Pizza Anytime. Ready to turn unused floor space into reliable revenue? Let's get baking.
            </p>
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGetStartedPopup(true)}
                className="px-12 py-5 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      <GetStartedPopup isOpen={showGetStartedPopup} onClose={() => setShowGetStartedPopup(false)} />

      {/* Blog Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-[1400px] sm:!max-w-[1400px] w-[95vw] max-h-[90vh] overflow-hidden bg-white p-0 flex flex-col">
          {selectedArticle && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Scrollable Content Area */}
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {/* Article Image - Top */}
                {selectedArticle.image && (
                  <div className="w-full h-64 md:h-80 overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6 md:p-8">
                  {/* Date and Category - Below Image */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{selectedArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                        {selectedArticle.category || selectedArticle.blogTitle || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl mb-6 text-slate-900 font-bold leading-tight">
                    {selectedArticle.title}
                  </h2>

                  {/* Full Content - Complete Article */}
                  <div className="prose prose-lg max-w-none">
                    {selectedArticle.bodyHtml ? (
                      <div 
                        className="text-slate-700 leading-relaxed blog-content"
                        style={{ 
                          fontSize: '1.125rem',
                          lineHeight: '1.75rem'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: selectedArticle.bodyHtml
                        }}
                      />
                    ) : selectedArticle.content ? (
                      <div 
                        className="text-slate-700 leading-relaxed blog-content"
                        style={{ 
                          fontSize: '1.125rem',
                          lineHeight: '1.75rem'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: selectedArticle.content
                        }}
                      />
                    ) : (
                      <div className="text-slate-700 leading-relaxed whitespace-pre-wrap" style={{ fontSize: '1.125rem', lineHeight: '1.75rem' }}>
                        {selectedArticle.excerpt}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button - Fixed at Bottom */}
              <div className="p-6 md:p-8 pt-4 border-t border-slate-200 flex-shrink-0 bg-white">
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-base"
                >
                  Close Article
                </motion.button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}