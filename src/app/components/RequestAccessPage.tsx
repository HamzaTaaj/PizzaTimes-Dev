import { motion } from 'motion/react';
import { Lock, Mail, User, MapPin, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function RequestAccessPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-slate-50/30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Enterprise Access Portal</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-slate-900 font-bold">
              Request <span className="text-blue-600">Access</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join the Pizza Anytime enterprise network and transform your food service operations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.75fr] gap-18">
            {/* Left Side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-3xl mb-8 text-slate-900 font-bold">Enterprise Benefits</h2>
                <div className="space-y-8">
                  {[
                    {
                      title: 'Priority Deployment',
                      description: 'Expedited access to our enterprise-grade vending technology solutions'
                    },
                    {
                      title: 'Enterprise Pricing',
                      description: 'Competitive pricing and volume discounts for enterprise clients'
                    },
                    {
                      title: 'Dedicated Support',
                      description: 'Comprehensive onboarding and 24/7 enterprise technical assistance'
                    },
                    {
                      title: 'Business Intelligence',
                      description: 'Advanced analytics dashboard with real-time performance metrics'
                    }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg mb-1 text-slate-900 font-semibold">{benefit.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <h3 className="text-lg mb-2 text-slate-900 font-semibold">Need Assistance?</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Our enterprise team is available to assist with the application process
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:access@pizzaanytime.com" className="hover:underline">
                    access@pizzaanytime.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-8 bg-white border-2 border-slate-200 rounded-2xl shadow-xl">
                <h2 className="text-2xl mb-8 text-slate-900 font-semibold">Create Enterprise Account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm mb-2 text-slate-700 font-medium">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-slate-900 placeholder-slate-400"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm mb-2 text-slate-700 font-medium">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-slate-900 placeholder-slate-400"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2 text-slate-700 font-medium">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-slate-900 placeholder-slate-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Password and Confirm Password */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm mb-2 text-slate-700 font-medium">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-slate-900 placeholder-slate-400"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm mb-2 text-slate-700 font-medium">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-slate-900 placeholder-slate-400"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm mb-2 text-slate-700 font-medium">
                      Business Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={1}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-slate-900 placeholder-slate-400 resize-none"
                        placeholder="123 Business Street, City, State, ZIP"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 rounded border-2 border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-600/50"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all font-semibold hover:bg-blue-700"
                  >
                    Request Access
                  </motion.button>

                  <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Sign in here
                    </a>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Note */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl mb-4 text-slate-900 font-semibold">Enterprise-Grade Security</h3>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We employ industry-standard encryption and security protocols to protect your information. Your data will never be shared with third parties without your explicit consent.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
