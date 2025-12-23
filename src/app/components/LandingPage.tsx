import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, TrendingUp, Clock, DollarSign, Users, Zap, Shield } from 'lucide-react';
import { fadeInUp, staggerContainer, viewportConfig, scaleUp } from '../utils/animations';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Increase Revenue',
      description: 'Generate consistent revenue 24/7 with automated pizza vending'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'No staffing needed - fully automated operations'
    },
    {
      icon: TrendingUp,
      title: 'Scale Fast',
      description: 'Deploy multiple units quickly across locations'
    },
    {
      icon: Shield,
      title: 'Proven Technology',
      description: 'Trusted by enterprise clients nationwide'
    }
  ];

  const socialProof = [
    { value: '50+', label: 'Active Locations' },
    { value: '300%', label: 'Average ROI' },
    { value: '98%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Sales Focused */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 rounded-b-[3rem]">
        {/* Background Design */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-white/10 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.08, 0.12, 0.08],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-white/10 rounded-full"
          />
        </div>

        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-6"
              >
                <Zap className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">Start Generating Revenue Today</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl mb-6 font-bold text-white leading-tight"
              >
                Transform Your Business with
                <br />
                <span className="text-blue-200">Automated Pizza Vending</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-blue-50 mb-8 max-w-xl leading-relaxed"
              >
                Join 50+ successful businesses generating consistent revenue 24/7. No staffing costs. No overhead. Just pure profit.
              </motion.p>

              {/* Social Proof Stats */}
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {socialProof.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
                  >
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('request-access')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg flex items-center gap-2 group font-semibold text-lg"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: '#ffffff'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('request-access')}
                  className="px-8 py-4 border-2 border-white/30 rounded-lg transition-colors text-white font-semibold hover:bg-white/10 text-lg"
                >
                  Request Access
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Lead Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleUp}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Get Your Quote</h3>
                  <p className="text-blue-100">Start your journey to 24/7 revenue</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onNavigate('request-access');
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                      placeholder="john@company.com"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg mt-2"
                  >
                    Get Started Now
                  </motion.button>

                  <p className="text-xs text-blue-200 text-center mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 font-bold text-slate-900">
              Why Choose <span className="text-blue-600">Pizza Anytime?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to start generating revenue immediately
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  y: -4,
                  borderColor: '#2563eb'
                }}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl transition-all group hover:border-blue-600"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                  <benefit.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl mb-2 text-slate-900 font-semibold">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Multiple CTAs */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={scaleUp}
          >
            <h2 className="text-4xl md:text-5xl mb-6 text-white font-bold">Ready to Start Generating Revenue?</h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Join successful businesses already using Pizza Anytime to increase their revenue
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('request-access')}
                className="px-10 py-5 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Request Access Now
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('roi-calculator')}
                className="px-10 py-5 border-2 border-white/50 rounded-lg hover:bg-white/10 transition-colors text-white font-semibold text-lg"
              >
                Calculate Your ROI
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('product')}
                className="px-10 py-5 border-2 border-white/50 rounded-lg hover:bg-white/10 transition-colors text-white font-semibold text-lg"
              >
                View Machine Details
              </motion.button>
            </div>
            <p className="mt-6 text-blue-100 text-sm">
              All buttons lead to our Request Access form. Get started in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            className="text-center"
          >
            <h3 className="text-2xl mb-8 text-slate-900 font-semibold">Trusted by Industry Leaders</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                'Enterprise Clients',
                '24/7 Support',
                'Proven ROI',
                'Quick Deployment'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  variants={fadeInUp}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl mb-6 text-slate-900 font-bold">Don't Wait - Start Today</h2>
            <p className="text-xl text-slate-600 mb-8">
              Every day you wait is revenue you're missing. Get started with Pizza Anytime now.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(37, 99, 235, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('request-access')}
              className="px-12 py-5 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
