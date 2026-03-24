import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { SEO } from '../components/SEO';
import { Shield, Lock, Eye, User, Mail, Trash2, Database, Bell, FileCheck } from 'lucide-react';

const Section = ({ icon, color, title, children }) => (
  <div className="neo-card p-6 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all duration-150">
    <h2 className="font-space text-xl font-extrabold mb-4 flex items-center gap-3">
      <div className={`w-9 h-9 ${color} border-2 border-black flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      {title}
    </h2>
    {children}
  </div>
);

export const PrivacyPage = () => {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="ResumeLens Privacy Policy - Learn how we collect, use, and protect your personal information and resume data."
        keywords="privacy policy, data protection, resume privacy, personal information security"
      />
      <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-neo-blue border-b-3 border-black py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-black border-3 border-black flex items-center justify-center">
              <Shield className="w-7 h-7 text-neo-blue" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-black/60">Data Protection</p>
              <h1 className="font-space text-4xl md:text-5xl font-extrabold uppercase">Privacy Policy</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-bold">📅 Last Updated: March 2026</span>
            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-bold">🔒 DPDP Act, 2023 Compliant</span>
            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-bold">🇮🇳 IT Rules, 2021 Aligned</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Intro */}
          <div className="p-5 border-3 border-black bg-neo-blue/10 shadow-[4px_4px_0px_#000]">
            <p className="text-gray-700 leading-relaxed">
              ResumeLens ("we", "our", "us") is committed to protecting your personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and the <strong>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>. This Policy explains how we collect, use, store, and protect your information when you use our Platform.
            </p>
          </div>

          <Section icon={<Lock className="w-5 h-5" />} color="bg-neo-green" title="1. Information We Collect">
            <p className="text-gray-700 mb-3">We collect the following categories of personal data:</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'Account Data', detail: 'Name, email address, password (hashed)' },
                { label: 'Resume Data', detail: 'Work history, education, skills, contact info in your uploaded resume' },
                { label: 'Payment Data', detail: 'UPI transaction ID / UTR number (we do not store bank account details)' },
                { label: 'Usage Data', detail: 'Features used, session duration, pages visited, subscription plan' },
                { label: 'Device Data', detail: 'IP address, browser type, operating system, and device identifiers' },
                { label: 'Communication Data', detail: 'Messages sent to our support team' },
              ].map((item, i) => (
                <div key={i} className="border-2 border-black p-3 bg-white">
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<Eye className="w-5 h-5" />} color="bg-neo-blue" title="2. How We Use Your Information">
            <p className="text-gray-700 mb-3">
              Under the DPDP Act, 2023, we process your personal data only for lawful purposes, on the basis of your <strong>explicit consent</strong>. We use your data to:
            </p>
            <ul className="space-y-2 text-gray-700">
              {[
                'Create and manage your account on the Platform',
                'Analyse your resume and generate AI-powered feedback and content',
                'Process UPI payments and verify subscription status',
                'Send transactional emails (account activity, payment receipts)',
                'Provide customer support and resolve complaints',
                'Improve our AI models and Platform features (using anonymised data only)',
                'Comply with applicable Indian legal and regulatory obligations',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-neo-blue rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-neo-green/10 border-2 border-black">
              <p className="text-sm font-bold">✅ We do NOT sell, rent, or trade your personal data to any third party for marketing purposes.</p>
            </div>
          </Section>

          <Section icon={<Database className="w-5 h-5" />} color="bg-neo-yellow" title="3. Data Storage, Retention & Security">
            <p className="text-gray-700 mb-3">
              Your data is stored on secure servers <strong>located in India</strong> in compliance with Indian data localisation norms. We implement the following security measures as required under the <strong>IT (SPDI) Rules, 2011</strong>:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              {[
                'AES-256 encryption for data at rest and TLS 1.3 for data in transit',
                'Role-based access controls — only authorised personnel can access your data',
                'Regular security audits and vulnerability assessments',
                'Secure password hashing using bcrypt',
                'Automatic session expiry and token invalidation',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-neo-yellow rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="border-2 border-black p-3 bg-white">
              <p className="font-bold text-sm mb-1">📦 Data Retention Period:</p>
              <p className="text-gray-700 text-sm">Your account data is retained for the duration of your account. Upon account deletion, we will erase your personal data within <strong>30 days</strong>, except where retention is required by Indian law (e.g., GST records for 6 years).</p>
            </div>
          </Section>

          <Section icon={<User className="w-5 h-5" />} color="bg-neo-purple" title="4. Your Rights Under DPDP Act, 2023">
            <p className="text-gray-700 mb-4">
              As a <strong>Data Principal</strong> under the Digital Personal Data Protection Act, 2023, you have the following rights which you may exercise by contacting us at <strong>resumeaicom@gmail.com</strong>:
            </p>
            <div className="space-y-3">
              {[
                { right: '🔍 Right to Access', desc: 'Request a summary of the personal data we hold about you and how it is being processed.' },
                { right: '✏️ Right to Correction', desc: 'Request correction of inaccurate or incomplete personal data.' },
                { right: '🗑️ Right to Erasure', desc: 'Request deletion of your personal data when it is no longer necessary for the purpose for which it was collected.' },
                { right: '📤 Right to Data Portability', desc: 'Receive your personal data in a structured, machine-readable format.' },
                { right: '❌ Right to Withdraw Consent', desc: 'Withdraw your consent for data processing at any time, without affecting the lawfulness of processing before withdrawal.' },
                { right: '📋 Right to Grievance Redressal', desc: 'File a complaint with our Grievance Officer if you believe your data rights have been violated.' },
                { right: '🏛️ Right to Appeal', desc: 'Lodge a complaint with the Data Protection Board of India if your grievance is not resolved satisfactorily.' },
              ].map((item, i) => (
                <div key={i} className="border-2 border-black p-3 bg-white flex gap-3">
                  <div>
                    <p className="font-bold text-sm">{item.right}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<FileCheck className="w-5 h-5" />} color="bg-neo-orange" title="5. Third-Party Services & Data Sharing">
            <p className="text-gray-700 mb-3">
              We may share your data with the following categories of third parties, who are bound by confidentiality obligations:
            </p>
            <div className="space-y-3">
              {[
                { party: 'AI Service Providers', detail: 'We use Groq\'s API to power AI features. Your resume content is sent for processing but is NOT stored by Groq beyond the API call.' },
                { party: 'Cloud Infrastructure', detail: 'Our servers are hosted on secure cloud platforms. Data is encrypted and stored in India.' },
                { party: 'Payment Processing', detail: 'UPI payments are verified manually via UTR numbers. We do not process card payments or store any financial account details.' },
                { party: 'Legal Authorities', detail: 'We may disclose data to law enforcement agencies when required by Indian law or a court order.' },
              ].map((item, i) => (
                <div key={i} className="border-2 border-black p-3 bg-white">
                  <p className="font-bold text-sm">{item.party}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<Bell className="w-5 h-5" />} color="bg-neo-red" title="6. Cookies & Tracking">
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar technologies to maintain session state and improve your experience. We do <strong>not</strong> use cookies for advertising or cross-site tracking.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { type: '🔐 Session Cookies', desc: 'Required for login and authentication. Deleted when you close your browser.' },
                { type: '⚙️ Preference Cookies', desc: 'Store your settings and preferences. Expire after 30 days.' },
                { type: '📊 Analytics Cookies', desc: 'Anonymised data to understand how users interact with the Platform.' },
              ].map((item, i) => (
                <div key={i} className="border-2 border-black p-3 bg-white">
                  <p className="font-bold text-sm">{item.type}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-3">You can disable cookies in your browser settings, though this may affect certain features of the Platform.</p>
          </Section>

          <Section icon={<Shield className="w-5 h-5" />} color="bg-neo-green" title="7. Grievance Officer (DPDP Act, 2023 / IT Act, 2000)">
            <p className="text-gray-700 mb-4">
              In compliance with the DPDP Act, 2023 and IT Rules, 2021, we have appointed a Grievance Officer to address your data protection concerns:
            </p>
            <div className="border-3 border-black p-5 bg-neo-green/10">
              <div className="space-y-2 text-gray-800">
                <p><strong>Designation:</strong> Grievance & Data Protection Officer</p>
                <p><strong>Organisation:</strong> ResumeLens</p>
                <p><strong>Email:</strong> resumeaicom@gmail.com</p>
                <p><strong>Postal Address:</strong> India</p>
                <p><strong>Working Hours:</strong> Monday – Friday, 10:00 AM – 6:00 PM IST</p>
                <p><strong>Acknowledgement:</strong> Within 48 hours</p>
                <p><strong>Resolution:</strong> Within 30 days of receipt</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3">
              If your complaint is not resolved within 30 days, you may escalate it to the <strong>Data Protection Board of India</strong> once constituted under the DPDP Act, 2023.
            </p>
          </Section>

          {/* Contact */}
          <div className="p-6 bg-neo-yellow border-3 border-black shadow-[6px_6px_0px_#000]">
            <h2 className="font-space text-2xl font-extrabold mb-2">Questions About Your Privacy?</h2>
            <p className="text-gray-700 mb-4">
              For any privacy-related queries, data access requests, or to withdraw your consent, contact us:
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:resumeaicom@gmail.com" className="neo-button text-sm">
                🔒 resumeaicom@gmail.com
              </a>
              <Link to="/contact" className="neo-button-green text-sm">
                📞 Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4 border-t-3 border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
          <p>© 2026 ResumeLens. All rights reserved. | DPDP Act, 2023 Compliant</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-neo-yellow transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-neo-yellow transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};