import { motion } from 'motion/react';
import { Cpu, Thermometer, Gauge, Wifi, Shield, Wrench, Package, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import vend1Video from '@/assets/vend.mp4';
import vend1Image from '@/assets/vend1.png';

export function ProductPage() {
  const specs = [
    { label: 'Dimensions', value: '72" H × 48" W × 36" D', position: 'left-top' },
    { label: 'Weight', value: '850 lbs', position: 'left-middle' },
    { label: 'Power', value: '220V / 20A', position: 'left-bottom' },
    { label: 'Capacity', value: '70 pizzas', position: 'right-top' },
    { label: 'Cook Time', value: '2-3 minutes', position: 'right-middle' },
    { label: 'Operating Temp', value: '35-95°F', position: 'right-bottom' }
  ];

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Cooking',
      description: 'Machine learning algorithms optimize cooking time and temperature for perfect results'
    },
    {
      icon: Thermometer,
      title: 'Temperature Control',
      description: 'Precision heating system maintains optimal cooking conditions'
    },
    {
      icon: Gauge,
      title: 'Real-time Monitoring',
      description: 'Live performance metrics and inventory tracking via cloud dashboard'
    },
    {
      icon: Wifi,
      title: 'IoT Connected',
      description: 'Remote diagnostics and over-the-air software updates'
    },
    {
      icon: Shield,
      title: 'Food Safety',
      description: 'HACCP compliant with automated sanitation cycles'
    },
    {
      icon: Wrench,
      title: 'Easy Maintenance',
      description: 'Modular design with quick-access service panels'
    }
  ];

  const techHighlights = [
    {
      icon: Package,
      title: 'Automated Inventory',
      description: 'Smart sensors track ingredient levels and send alerts for restocking'
    },
    {
      icon: Zap,
      title: 'Energy Efficient',
      description: 'Energy Star certified with eco-mode for low-traffic periods'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-blue-50 rounded-b-[3rem]">
        
        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/10 bg-white">
                <video
                  src={vend1Video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-[600px] object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Corporate Badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg"
              >
                <span className="text-sm font-medium">Enterprise Ready</span>
              </motion.div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <span className="text-blue-600 font-medium text-sm">Enterprise Solution</span>
              </div>

              <h1 className="text-5xl md:text-6xl mb-6 text-slate-900 font-bold">
                PizzaMatic <span className="text-blue-600">Pro X1</span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Enterprise-grade automated vending solution engineered for high-traffic environments. Advanced robotics, AI-driven operations, and precision food preparation systems.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-1">70</div>
                  <div className="text-sm text-slate-600">Pizza Capacity</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
                  <div className="text-sm text-slate-600">Operation</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-1">2-3min</div>
                  <div className="text-sm text-slate-600">Service Time</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-1">IoT</div>
                  <div className="text-sm text-slate-600">Connected</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20 font-medium"
                >
                  Request Quote
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: '#2563eb',
                    backgroundColor: '#f1f5f9'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-slate-300 rounded-lg transition-colors text-slate-700 font-medium hover:border-blue-600"
                >
                  Schedule Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Specifications with Machine in Center */}
      <section className="relative py-32 bg-white">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#f8fafc"/>
          </svg>
        </div>
        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f1f5f9"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-slate-900 font-bold">
              Technical <span className="text-blue-600">Specifications</span>
            </h2>
            <p className="text-xl text-slate-600">Comprehensive product specifications and technical details</p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Machine in Center - BIGGER AND MORE PLAYFUL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative mx-auto w-full max-w-2xl"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative rounded-2xl overflow-hidden"
              >
                {/* Professional Background with Depth */}
                <div className="absolute inset-0 bg-slate-100 rounded-2xl"></div>
                
                {/* Container with professional styling */}
                <div className="relative bg-white rounded-xl mx-6 my-6 p-8 border-2 border-slate-200">
                  {/* Inner shadow effect for depth */}
                  <div className="absolute inset-0 rounded-xl border border-slate-100 pointer-events-none"></div>
                  
                  {/* Image container with professional styling */}
                  <div className="relative bg-slate-50 rounded-lg p-0 border border-slate-200">
                    <div className="relative">
                      <ImageWithFallback
                        src={vend1Image}
                        alt="PizzaMatic Pro X1 Specifications"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Left Side Specs with Lines */}
              <div className="absolute left-0 top-1/4 -translate-x-full pr-8 hidden lg:block">
                {specs.slice(0, 3).map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-16 relative"
                  >
                    <div className="text-right">
                      <div className="inline-block px-6 py-4 bg-white border-2 border-slate-200 rounded-xl shadow-lg">
                        <div className="text-sm text-slate-500 mb-1 font-medium">{spec.label}</div>
                        <div className="text-xl text-slate-900 font-semibold">{spec.value}</div>
                      </div>
                    </div>
                    {/* Connection Line */}
                    <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
                    <div className="absolute top-1/2 -right-8 w-2 h-2 bg-blue-600 rounded-full" />
                  </motion.div>
                ))}
              </div>

              {/* Right Side Specs with Lines */}
              <div className="absolute right-0 top-1/4 translate-x-full pl-8 hidden lg:block">
                {specs.slice(3, 6).map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-16 relative"
                  >
                    <div className="text-left">
                      <div className="inline-block px-6 py-4 bg-white border-2 border-slate-200 rounded-xl shadow-lg">
                        <div className="text-sm text-slate-500 mb-1 font-medium">{spec.label}</div>
                        <div className="text-xl text-slate-900 font-semibold">{spec.value}</div>
                      </div>
                    </div>
                    {/* Connection Line */}
                    <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-gradient-to-l from-blue-200 to-transparent" />
                    <div className="absolute top-1/2 -left-8 w-2 h-2 bg-blue-600 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mobile Specs */}
            <div className="lg:hidden mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specs.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm"
                >
                  <div className="text-sm text-slate-500 mb-1 font-medium">{spec.label}</div>
                  <div className="text-lg text-slate-900 font-semibold">{spec.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* White Label Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 max-w-4xl mx-auto p-8 bg-blue-50 border-2 border-blue-200 rounded-2xl"
          >
            <h3 className="text-2xl mb-4 text-slate-900 font-semibold">Enterprise Branding Solutions</h3>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              Comprehensive customization options for enterprise deployments. Tailor branding, interface, and integration to align with your corporate identity.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-slate-600">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                Custom exterior wraps and graphics
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                Branded touchscreen interface
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                Custom receipt and packaging branding
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                Integration with enterprise systems
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Advanced Technology Section */}
      <section className="relative py-24 bg-slate-50">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#ffffff"/>
          </svg>
        </div>
        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-slate-900 font-bold">
              Advanced <span className="text-blue-600">Technology</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enterprise-grade components and intelligent systems for optimal performance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -4,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  borderColor: '#2563eb'
                }}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl transition-all group hover:border-blue-600"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                  <feature.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl mb-3 text-slate-900 font-semibold">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Tech Highlights */}
          <div className="grid md:grid-cols-2 gap-6">
            {techHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-8 bg-white border-2 border-blue-200 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <highlight.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-slate-900 font-semibold">{highlight.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden bg-blue-600">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#ffffff"/>
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-6 text-white font-bold">Ready to Deploy?</h2>
            <p className="text-xl text-blue-50 mb-8">
              Contact our enterprise sales team to discuss pricing, installation, and customization options
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-blue-600 rounded-lg text-lg shadow-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Contact Sales
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border-2 border-white/50 rounded-lg transition-colors text-lg text-white font-semibold hover:bg-white/10"
              >
                Download Brochure
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
