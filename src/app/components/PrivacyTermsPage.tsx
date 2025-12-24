import { motion } from 'motion/react';
import { Shield, FileText } from 'lucide-react';

export function PrivacyTermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <section className="relative py-24 overflow-hidden bg-blue-50 rounded-b-[3rem]">
        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Legal & Privacy</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-slate-900 font-bold">
              Privacy Policy & <span className="text-blue-600">Terms</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Your privacy and rights are important to us
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-24 bg-white">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#f8fafc"/>
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl text-slate-900 font-bold">Privacy Policy</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 mb-4">
                Welcome to High Sierra Vending LLC
              </p>
              <p className="text-slate-600 mb-4">
                By accessing or using our website, you agree to be bound by these terms and conditions (Terms). If you do not agree with any part of these Terms, please do not use our website.
              </p>
              
              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">1. Use of Website</h3>
              <p className="text-slate-600 mb-2">
                <strong>1.1</strong> This website is intended to provide information about Vending Technology services and related products or services.
              </p>
              <p className="text-slate-600 mb-4">
                <strong>1.2</strong> You agree to use this site only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of this site by any third party.
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">2. Intellectual Property</h3>
              <p className="text-slate-600 mb-2">
                <strong>2.1</strong> The content, layout, design, data, databases, and graphics on this website are protected by intellectual property laws and are owned by High Sierra Vending LLC or its licensors, unless otherwise stated.
              </p>
              <p className="text-slate-600 mb-4">
                <strong>2.2</strong> You may not reproduce, download, transmit or retransmit, manipulate or store on any other website or electronic retrieval system, any material from this site without prior written consent.
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">3. Liability</h3>
              <p className="text-slate-600 mb-2">
                <strong>3.1</strong> High Sierra Vending LLC does not guarantee the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose.
              </p>
              <p className="text-slate-600 mb-4">
                <strong>3.2</strong> You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">4. Links to Other Websites</h3>
              <p className="text-slate-600 mb-2">
                <strong>4.1</strong> This website may include links to external websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s).
              </p>
              <p className="text-slate-600 mb-4">
                <strong>4.2</strong> We have no responsibility for the content of the linked website(s).
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">5. Changes to Terms</h3>
              <p className="text-slate-600 mb-4">
                <strong>5.1</strong> High Sierra Vending LLC reserves the right to change these terms at any time by posting changes online. Your continued use of this site after changes are posted constitutes your acceptance of this agreement as modified.
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">6. Governing Law</h3>
              <p className="text-slate-600 mb-4">
                <strong>6.1</strong> These terms shall be governed by and interpreted in accordance with the laws of the United States.
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">7. Contact Information</h3>
              <p className="text-slate-600 mb-4">
                <strong>7.1</strong> For any questions or queries regarding these terms, please contact us at info@highsierravending.com
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">8. Communication Preferences</h3>
              <p className="text-slate-600 mb-2">
                <strong>8.1</strong> By providing your mobile number to High Sierra Vending LLC, you agree that you may receive periodic text messages from us regarding your inquiries, orders, or updates about our products and services. Standard text messaging rates may apply as provided by your mobile carrier.
              </p>
              <p className="text-slate-600 mb-2">
                <strong>8.2 Opt-Out of Text Messages:</strong>
              </p>
              <p className="text-slate-600 mb-2">
                If you wish to opt out of receiving text messages from us, you can do so at any time. To stop receiving text messages, please reply "STOP" to any text message you receive from High Sierra Vending LLC. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to start receiving messages again, you can sign up as you did the first time.
              </p>
              <p className="text-slate-600 mb-2">
                <strong>8.3 Assistance with Text Messages:</strong>
              </p>
              <p className="text-slate-600 mb-4">
                If at any time you forget what keywords are supported, just text "HELP" to the number from which you received the messages. After you send the SMS message "HELP" to us, we will respond with instructions on how to use our service as well as how to unsubscribe.
              </p>
              <p className="text-slate-600 mb-4">
                Please note that opting out of receiving text messages may impact your use of our services, as certain notifications and updates may only be provided via SMS.
              </p>

              <h3 className="text-xl text-slate-900 font-semibold mt-8 mb-4">9. Privacy and Data Sharing</h3>
              <p className="text-slate-600 mb-2">
                <strong>9.1</strong> Your personal information is used only to enhance our services. We do not share your data with any third party.
              </p>
              <p className="text-slate-600 mb-2">
                <strong>9.2</strong> High Sierra Vending LLC is committed to protecting your privacy. We do not share, sell, rent, or lease your personal data to any third parties for their marketing purposes.
              </p>
              <p className="text-slate-600 mb-2">
                <strong>9.3</strong> Any information collected on this site will be kept strictly confidential and will not be disclosed to any third party without your prior consent, except as required by law.
              </p>
              <p className="text-slate-600 mb-4">
                <strong>9.4</strong> No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
              </p>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-blue-50 border-2 border-blue-200 rounded-xl"
          >
            <h3 className="text-2xl mb-4 text-slate-900 font-semibold">Questions About Our Policies?</h3>
            <p className="text-slate-600 mb-4">
              If you have any questions about our Privacy Policy or Terms, please contact us:
            </p>
            <div className="space-y-2 text-slate-600">
              <p><strong>Email:</strong> <a href="mailto:info@pizza-vending-machine.com" className="text-blue-600 hover:underline">info@pizza-vending-machine.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+18886991731" className="text-blue-600 hover:underline">(888) 699-1731</a></p>
              <p><strong>Address:</strong> 4600 Snyder Ave, E, Carson City, Nevada, 89701</p>
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center text-slate-600"
          >
            <p>© 2025 High Sierra Vending, LLC</p>
            <p className="mt-2">The Pizza Vending Machine people.</p>
            <p className="mt-2">
              <a href="mailto:Info@HighSierraVending.com" className="text-blue-600 hover:underline">Info@HighSierraVending.com</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
