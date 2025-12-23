import { motion } from 'motion/react';
import { Download, FileText, BookOpen, Video, HelpCircle, CheckCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, viewportConfig, scaleUp } from '../utils/animations';

export function ManualPage() {
  const manuals = [
    {
      title: 'Quick Start Guide',
      description: 'Get started with your PizzaMatic Pro X1 in minutes',
      size: '2.4 MB',
      pages: '12 pages',
      version: 'v1.2',
      type: 'PDF',
      icon: FileText
    },
    {
      title: 'Complete User Manual',
      description: 'Comprehensive guide covering all features and operations',
      size: '15.8 MB',
      pages: '86 pages',
      version: 'v1.2',
      type: 'PDF',
      icon: BookOpen
    },
    {
      title: 'Installation Guide',
      description: 'Step-by-step installation and setup instructions',
      size: '8.5 MB',
      pages: '34 pages',
      version: 'v1.2',
      type: 'PDF',
      icon: FileText
    },
    {
      title: 'Maintenance Manual',
      description: 'Regular maintenance and troubleshooting procedures',
      size: '6.2 MB',
      pages: '28 pages',
      version: 'v1.2',
      type: 'PDF',
      icon: FileText
    },
    {
      title: 'Technical Specifications',
      description: 'Detailed technical specifications and diagrams',
      size: '4.1 MB',
      pages: '18 pages',
      version: 'v1.2',
      type: 'PDF',
      icon: FileText
    },
    {
      title: 'Safety & Compliance',
      description: 'Safety guidelines and regulatory compliance documentation',
      size: '3.7 MB',
      pages: '22 pages',
      version: 'v1.2',
      type: 'PDF',
      icon: FileText
    }
  ];

  const videos = [
    {
      title: 'Machine Setup Tutorial',
      duration: '12:34',
      thumbnail: 'https://images.unsplash.com/photo-1754195451509-00c25c20fdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdmVuZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzY2MDY1NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Daily Maintenance Routine',
      duration: '8:15',
      thumbnail: 'https://images.unsplash.com/photo-1689942007101-de5d836afcf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NjYwNjY3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Troubleshooting Common Issues',
      duration: '15:42',
      thumbnail: 'https://images.unsplash.com/photo-1652212976547-16d7e2841b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBibHVlfGVufDF8fHx8MTc2NjAxMzUyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const faqs = [
    {
      question: 'What file formats are the manuals available in?',
      answer: 'All manuals are provided in PDF format for easy viewing on any device.'
    },
    {
      question: 'How often are the manuals updated?',
      answer: 'We release updated documentation with each software version. Current version is v1.2.'
    },
    {
      question: 'Can I access training materials?',
      answer: 'Yes, video tutorials and training materials are available in the resources section below.'
    },
    {
      question: 'Is technical support available?',
      answer: '24/7 technical support is available for all Pizza Anytime machine owners.'
    }
  ];

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
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Enterprise Documentation</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-slate-900 font-bold">
              User <span className="text-blue-600">Manuals</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Access comprehensive documentation, guides, and training materials for your PizzaMatic Pro X1
            </p>
          </motion.div>
        </div>
      </section>

      {/* Download Manuals */}
      <section className="relative py-16 bg-white">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#f8fafc" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            className="mb-12"
          >
            <h2 className="text-4xl mb-4 text-slate-900 font-bold">
              Download <span className="text-blue-600">Documentation</span>
            </h2>
            <p className="text-xl text-slate-600">
              All manuals are current as of version 1.2 (December 2025)
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {manuals.map((manual, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                    <manual.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {manual.type}
                  </span>
                </div>

                <h3 className="text-xl mb-2 text-slate-900 font-semibold">{manual.title}</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{manual.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                  <span>{manual.size}</span>
                  <span>•</span>
                  <span>{manual.pages}</span>
                  <span>•</span>
                  <span>{manual.version}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Bulk Download */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl mb-2 text-slate-900 font-semibold">Complete Documentation Package</h3>
                <p className="text-slate-600">Download all manuals in a single ZIP file (40.7 MB)</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 whitespace-nowrap font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download All
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="relative py-16 bg-slate-50">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#ffffff" />
          </svg>
        </div>
        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            className="mb-12"
          >
            <h2 className="text-4xl mb-4 text-slate-900 font-bold">
              Video <span className="text-blue-600">Tutorials</span>
            </h2>
            <p className="text-xl text-slate-600">
              Step-by-step video guides for setup and maintenance
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {videos.map((video, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-white border border-slate-200">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 rounded text-sm text-white">
                    {video.duration}
                  </div>
                </div>
                <h3 className="text-lg text-slate-900 font-semibold group-hover:text-blue-600 transition-colors">{video.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 bg-white">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#f1f5f9" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl mb-4 text-slate-900 font-bold">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-xl text-slate-600">
              Common questions about our documentation
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-600 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2 text-slate-900 font-semibold">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="relative py-24 bg-blue-600">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={scaleUp}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl mb-6 text-white font-bold">Need Additional Support?</h2>
            <p className="text-xl text-blue-50 mb-8">
              Our enterprise technical support team is available 24/7 to assist you
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Contact Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/50 rounded-lg hover:bg-white/10 transition-colors text-white font-semibold"
              >
                Schedule Training
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
