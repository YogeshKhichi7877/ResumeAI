import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { SEO } from '../components/SEO';
import { Mail, MapPin, Send, Linkedin, Github, MessageSquare, Clock, Phone, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const faqs = [
  {
    q: 'How do I analyse my resume?',
    a: 'Create an account, upload your PDF resume, select your target domain, and click Analyse. Results are ready in seconds.',
  },
  {
    q: 'Which payment methods are accepted?',
    a: 'We accept UPI payments (GPay, PhonePe, Paytm, BHIM). After payment, submit your UTR number on the pricing page for instant activation.',
  },
  {
    q: 'How long does plan activation take?',
    a: 'Plans are activated within 2–4 working hours after your UTR number is verified by our team (Mon–Fri, 10 AM – 6 PM IST).',
  },
  {
    q: 'Is my resume data safe?',
    a: 'Yes. Your data is encrypted and stored securely in India. We never sell your data. See our Privacy Policy for full details.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Refund requests are considered only in case of a technical failure on our side. Contact us within 48 hours of payment at resumeaicom@gmail.com.',
  },
  {
    q: 'Do you offer student or group discounts?',
    a: 'Yes! We offer special discounts for students and colleges. Email us at resumeaicom@gmail.com with your institution details.',
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-black">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold pr-4">{q}</span>
        <span className="text-xl flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="p-4 border-t-2 border-black bg-neo-yellow/10">
          <p className="text-gray-700">{a}</p>
        </div>
      )}
    </div>
  );
};

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll respond within 24–48 hours (IST working days).');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with ResumeLens. We answer within 24-48 hours on working days. For instant help, check our FAQ section."
        keywords="contact resume ai, customer support, resume analyzer help, job seeker support"
      />
      <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-neo-green border-b-3 border-black py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-black border-3 border-black flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-neo-green" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-black/60">We're Here to Help</p>
              <h1 className="font-space text-4xl md:text-5xl font-extrabold uppercase">Contact Us</h1>
            </div>
          </div>
          <p className="text-lg font-medium text-black/70 max-w-xl mt-2">
            Have a question, feedback, or a payment issue? Our India-based support team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-10 px-4 border-b-3 border-black bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Mail className="w-6 h-6" />,
              color: 'bg-neo-yellow',
              title: 'Email Support',
              line1: 'resumeaicom@gmail.com',
              line2: 'Response in 24–48 hrs (IST)',
            },
            {
              icon: <MessageSquare className="w-6 h-6" />,
              color: 'bg-neo-green',
              title: 'WhatsApp / Chat',
              line1: 'Available on request',
              line2: 'Mon–Fri, 10 AM–6 PM IST',
            },
            {
              icon: <Clock className="w-6 h-6" />,
              color: 'bg-neo-blue',
              title: 'Support Hours',
              line1: 'Monday – Friday',
              line2: '10:00 AM – 6:00 PM IST',
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              color: 'bg-neo-purple',
              title: 'Based In',
              line1: 'India 🇮🇳',
              line2: 'Serving users worldwide',
            },
          ].map((card, i) => (
            <div key={i} className="border-3 border-black bg-white shadow-[4px_4px_0px_#000] p-4">
              <div className={`w-10 h-10 ${card.color} border-2 border-black flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <p className="font-space font-extrabold text-sm uppercase mb-1">{card.title}</p>
              <p className="text-gray-800 text-sm font-medium">{card.line1}</p>
              <p className="text-gray-500 text-xs mt-0.5">{card.line2}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div>
            <h2 className="font-space text-3xl font-extrabold mb-6 uppercase">Send a Message</h2>
            <div className="neo-card p-6 shadow-[6px_6px_0px_#000]">
              <div className="space-y-5">
                <div>
                  <label className="font-bold mb-1.5 block text-sm uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full border-3 border-black p-3 font-medium focus:outline-none focus:shadow-neo bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold mb-1.5 block text-sm uppercase tracking-wide">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full border-3 border-black p-3 font-medium focus:outline-none focus:shadow-neo bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold mb-1.5 block text-sm uppercase tracking-wide">
                    Phone Number <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                  </label>
                  <div className="flex">
                    <div className="border-3 border-r-0 border-black px-3 flex items-center bg-gray-100 font-bold text-sm">+91</div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="flex-1 border-3 border-black p-3 font-medium focus:outline-none focus:shadow-neo bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold mb-1.5 block text-sm uppercase tracking-wide">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border-3 border-black p-3 font-medium focus:outline-none bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="payment">💳 Payment / UPI Issue</option>
                    <option value="subscription">📦 Subscription / Plan Activation</option>
                    <option value="technical">🔧 Technical Problem</option>
                    <option value="refund">🔄 Refund Request</option>
                    <option value="privacy">🔒 Data / Privacy Concern</option>
                    <option value="feedback">💬 Feedback / Suggestion</option>
                    <option value="other">❓ Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold mb-1.5 block text-sm uppercase tracking-wide">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue or query in detail. If it's a payment issue, please include your UTR number and registered email."
                    rows={5}
                    className="w-full border-3 border-black p-3 font-medium focus:outline-none focus:shadow-neo resize-none bg-white"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className={`neo-button w-full flex items-center justify-center gap-2 ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our{' '}
                  <Link to="/privacy" className="underline font-bold">Privacy Policy</Link>. We'll respond within 24–48 hours on working days (IST).
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ + Social + Grievance */}
          <div className="space-y-8">
            {/* FAQ */}
            <div>
              <h2 className="font-space text-3xl font-extrabold mb-5 uppercase flex items-center gap-2">
                <HelpCircle className="w-7 h-7" /> Quick Help
              </h2>
              <div className="space-y-2 border-3 border-black shadow-[4px_4px_0px_#000]">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} {...faq} />
                ))}
              </div>
            </div>

            {/* Grievance Notice */}
            <div className="border-3 border-black p-5 bg-neo-red/10 shadow-[4px_4px_0px_#000]">
              <h3 className="font-space font-extrabold text-lg mb-2 uppercase">⚖️ Grievance Officer</h3>
              <p className="text-gray-700 text-sm mb-3">
                As per the <strong>IT Act, 2000</strong> and <strong>DPDP Act, 2023</strong>, unresolved complaints can be escalated to our Grievance Officer:
              </p>
              <div className="space-y-1 text-sm text-gray-800">
                <p><strong>Email:</strong> resumeaicom@gmail.com</p>
                <p><strong>Hours:</strong> Mon–Fri, 10 AM–6 PM IST</p>
                <p><strong>Resolution:</strong> Within 30 days</p>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-space font-extrabold text-lg mb-4 uppercase">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', href: '#' },
                  { icon: <Github className="w-5 h-5" />, label: 'GitHub', href: '#' },
                  { icon: <Mail className="w-5 h-5" />, label: 'Email', href: 'mailto:resumeaicom@gmail.com' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="flex items-center gap-2 border-3 border-black bg-black text-white px-4 py-2 font-bold text-sm hover:bg-gray-800 transition-colors shadow-[3px_3px_0px_#666]"
                  >
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-3 border-black p-5 bg-neo-yellow/20 shadow-[4px_4px_0px_#000]">
              <h3 className="font-space font-extrabold text-lg mb-2 uppercase">💳 Payment Issue?</h3>
              <p className="text-gray-700 text-sm mb-2">
                If your UPI payment was deducted but your plan wasn't activated, email us with:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Your registered email address</li>
                <li>• UTR / Transaction Reference Number</li>
                <li>• Screenshot of payment confirmation</li>
                <li>• UPI app used (GPay / PhonePe / Paytm etc.)</li>
              </ul>
              <a
                href="mailto:resumeaicom@gmail.com?subject=Payment Issue - UTR Verification"
                className="mt-3 inline-block neo-button-yellow text-sm"
              >
                📧 Email Payment Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4 border-t-3 border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
          <p>© 2026 ResumeLens. All rights reserved. | India 🇮🇳</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-neo-yellow transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-neo-yellow transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};