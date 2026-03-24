import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { SEO } from '../components/SEO';
import { FileText, ChevronDown, ChevronUp, Scale, Shield, AlertTriangle, CreditCard, User, Gavel } from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-neo-yellow',
    title: '1. Acceptance of Terms',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed">
          By accessing or using <strong>ResumeLens</strong> ("the Platform"), you confirm that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws of India. These Terms constitute a legally binding agreement under the <strong>Indian Contract Act, 1872</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          If you do not agree to these Terms, you must immediately stop using the Platform. Continued use of the Platform after any revision of these Terms constitutes your acceptance of the revised Terms.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    icon: <User className="w-5 h-5" />,
    color: 'bg-neo-blue',
    title: '2. Eligibility & User Accounts',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed mb-3">
          To use ResumeLens, you must be at least <strong>18 years of age</strong> and capable of entering into a legally binding contract under Indian law. By registering, you agree to:
        </p>
        <ul className="space-y-2 text-gray-700">
          {[
            'Provide accurate, complete, and current information during registration',
            'Maintain the confidentiality of your login credentials',
            'Accept full responsibility for all activity under your account',
            'Notify us immediately at resumeaicom@gmail.com if you suspect unauthorised access',
            'Not share, transfer, or sell your account to any third party',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'services',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-neo-green',
    title: '3. Description of Services',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed mb-3">
          ResumeLens provides AI-powered career tools including, but not limited to:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            '📄 Resume Scoring & ATS Analysis',
            '🎯 Job Description Matching',
            '✉️ Cover Letter Generation',
            '📧 Cold Outreach Message Creation',
            '✏️ Resume Rewriting & Enhancement',
            '🎤 Mock Interview Preparation',
            '💬 Resume Chat Assistant',
            '📊 Usage Analytics Dashboard',
          ].map((item, i) => (
            <div key={i} className="border-2 border-black p-2 bg-white text-sm font-medium">
              {item}
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-3 italic">
          Services are subject to fair usage limits as per your subscription plan. We reserve the right to modify or discontinue any service with prior notice.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'bg-neo-red',
    title: '4. Acceptable Use Policy',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed mb-3">
          In compliance with the <strong>Information Technology Act, 2000</strong> and the <strong>IT (Amendment) Act, 2008</strong>, you agree NOT to use the Platform to:
        </p>
        <ul className="space-y-2 text-gray-700">
          {[
            'Upload or transmit any malicious code, virus, or harmful software',
            'Submit false, misleading, or fraudulent personal or professional information',
            'Infringe upon any intellectual property rights of ResumeLens or third parties',
            'Attempt unauthorised access to our systems or servers',
            'Publish, post, or transmit any obscene, defamatory, or illegal content',
            'Impersonate any person or entity, or misrepresent your affiliation',
            'Use the Platform for any unlawful purpose under Indian law',
            'Scrape, copy, or reproduce any part of the Platform without written permission',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 bg-neo-red rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 p-3 bg-neo-red/10 border-2 border-neo-red">
          <p className="text-sm font-bold text-gray-800">⚠️ Violation of these terms may result in immediate account termination and legal action under applicable Indian laws.</p>
        </div>
      </>
    ),
  },
  {
    id: 'payment',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'bg-neo-purple',
    title: '5. Payment, Billing & Refund Policy',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed mb-3">
          ResumeLens offers both free and paid subscription plans. All payments are processed in <strong>Indian Rupees (INR)</strong> via UPI (Unified Payments Interface). By making a payment, you agree to the following:
        </p>
        <ul className="space-y-2 text-gray-700 mb-4">
          {[
            'Plans are billed on a monthly or annual basis as selected at checkout',
            'Payments via UPI must include a valid UTR (Unique Transaction Reference) for verification',
            'Subscription fees are non-refundable once the billing cycle has commenced',
            'We reserve the right to change pricing with 30 days prior written notice via email',
            'Failed or disputed UPI transactions must be reported within 7 working days',
            'GST (Goods and Services Tax) will be applicable as per Indian tax regulations',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 bg-neo-purple rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="p-3 bg-neo-purple/10 border-2 border-black">
          <p className="text-sm font-bold">🔄 Refund Requests:</p>
          <p className="text-sm text-gray-700 mt-1">Refund requests may be considered only in cases of technical failure on our end. Contact us at <strong>resumeaicom@gmail.com</strong> within 48 hours of payment. Refunds, if approved, will be credited to the original UPI account within 5–7 working days.</p>
        </div>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    icon: <Scale className="w-5 h-5" />,
    color: 'bg-neo-orange',
    title: '6. Intellectual Property Rights',
    content: (
      <>
        <div className="space-y-3 text-gray-700">
          <p><strong>Our Content:</strong> All content, branding, features, and functionality of ResumeLens are owned by us and protected under the <strong>Copyright Act, 1957</strong> and other applicable Indian intellectual property laws.</p>
          <p><strong>Your Content:</strong> You retain full ownership of the resume and personal data you submit. By uploading content, you grant us a limited, non-exclusive, royalty-free licence to use it solely for providing the Service to you.</p>
          <p><strong>AI-Generated Content:</strong> Content generated by our AI models is provided to you for personal use. You acknowledge that AI output may not be unique and should be reviewed and edited before professional use.</p>
          <p><strong>Restrictions:</strong> You may not reproduce, duplicate, copy, sell, or exploit any portion of the Platform without our express written permission.</p>
        </div>
      </>
    ),
  },
  {
    id: 'disclaimer',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'bg-neo-yellow',
    title: '7. Disclaimer of Warranties',
    content: (
      <>
        <div className="p-4 bg-neo-yellow/30 border-3 border-black">
          <p className="text-gray-800 font-medium leading-relaxed">
            THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. RESUME PRO DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT ANY DEFECTS WILL BE CORRECTED.
          </p>
        </div>
        <p className="text-gray-700 mt-3 leading-relaxed">
          ResumeLens does not guarantee job placement, interview calls, or career outcomes as a result of using the Platform. Results depend on individual effort, market conditions, and third-party decisions.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    icon: <Gavel className="w-5 h-5" />,
    color: 'bg-neo-blue',
    title: '8. Limitation of Liability',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed mb-3">
          To the maximum extent permitted under Indian law, ResumeLens shall not be liable for any indirect, incidental, special, or consequential damages arising from:
        </p>
        <ul className="space-y-2 text-gray-700">
          {[
            'Your use or inability to use the Platform',
            'Unauthorised access to or alteration of your data',
            'Any interruption or cessation of the Service',
            'Any errors or omissions in AI-generated content',
            'Decisions made by employers or recruiters based on AI-generated content',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 bg-neo-blue rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-700 mt-3">
          Our maximum aggregate liability to you shall not exceed the amount paid by you in the <strong>3 months preceding</strong> the claim.
        </p>
      </>
    ),
  },
  {
    id: 'grievance',
    icon: <Gavel className="w-5 h-5" />,
    color: 'bg-neo-green',
    title: '9. Grievance Officer (IT Act, 2000)',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed mb-4">
          In compliance with the <strong>Information Technology Act, 2000</strong> and the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, the details of our Grievance Officer are as follows:
        </p>
        <div className="border-3 border-black p-4 bg-neo-green/10">
          <div className="space-y-2 text-gray-800">
            <p><strong>Name:</strong> Grievance Officer, ResumeLens</p>
            <p><strong>Email:</strong> resumeaicom@gmail.com</p>
            <p><strong>Address:</strong> India</p>
            <p><strong>Working Hours:</strong> Monday – Friday, 10:00 AM – 6:00 PM IST</p>
            <p><strong>Response Time:</strong> Within 48 hours of receipt of complaint</p>
            <p><strong>Resolution Time:</strong> Within 30 days of receipt of complaint</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'governing-law',
    icon: <Scale className="w-5 h-5" />,
    color: 'bg-black',
    title: '10. Governing Law & Dispute Resolution',
    content: (
      <>
        <p className="text-gray-700 leading-relaxed mb-3">
          These Terms are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of <strong>India</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed">
          In the event of any dispute, the parties agree to first attempt resolution through mutual negotiation. If unresolved within 30 days, the dispute shall be referred to arbitration under the <strong>Arbitration and Conciliation Act, 1996</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-neo-yellow',
    title: '11. Changes to These Terms',
    content: (
      <p className="text-gray-700 leading-relaxed">
        We reserve the right to modify these Terms at any time. We will provide at least <strong>30 days' notice</strong> of any material changes by email and by posting the updated Terms on this page. Your continued use of the Platform after the effective date constitutes your acceptance of the revised Terms.
      </p>
    ),
  },
];

const AccordionItem = ({ section }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-3 border-black ${open ? 'shadow-[6px_6px_0px_#000]' : 'shadow-[4px_4px_0px_#000]'} transition-all duration-150`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${section.color} border-2 border-black flex items-center justify-center flex-shrink-0`}>
            {section.icon}
          </div>
          <span className="font-space font-extrabold text-left text-lg">{section.title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
      </button>
      {open && (
        <div className="p-5 border-t-3 border-black bg-white">
          {section.content}
        </div>
      )}
    </div>
  );
};

export const TermsPage = () => {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="ResumeLens Terms of Service - Read our terms and conditions governing the use of our AI resume analyzer platform."
        keywords="terms of service, terms and conditions, resume ai legal agreement, platform usage terms"
      />
      <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-neo-yellow border-b-3 border-black py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-black border-3 border-black flex items-center justify-center">
              <Scale className="w-7 h-7 text-neo-yellow" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-black/60">Legal Agreement</p>
              <h1 className="font-space text-4xl md:text-5xl font-extrabold uppercase">Terms of Service</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-bold">📅 Last Updated: March 2026</span>
            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-bold">⚖️ Indian Contract Act, 1872</span>
            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-bold">🇮🇳 IT Act, 2000 Compliant</span>
            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-bold">🔒 DPDP Act, 2023 Aligned</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Intro note */}
          <div className="mb-8 p-5 border-3 border-black bg-neo-blue/10 shadow-[4px_4px_0px_#000]">
            <p className="text-gray-700 leading-relaxed">
              Please read these Terms of Service carefully before using ResumeLens. These terms govern your use of our AI-powered resume enhancement platform and form a binding legal agreement between you and ResumeLens under <strong>Indian law</strong>. Click on any section below to expand it.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {sections.map((section) => (
              <AccordionItem key={section.id} section={section} />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-10 p-6 bg-neo-yellow border-3 border-black shadow-[6px_6px_0px_#000]">
            <h2 className="font-space text-2xl font-extrabold mb-2">Questions About These Terms?</h2>
            <p className="text-gray-700 mb-4">
              If you have any queries regarding these Terms of Service, please reach out to our team.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:resumeaicom@gmail.com" className="neo-button text-sm">
                📧 resumeaicom@gmail.com
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
          <p>© 2026 ResumeLens. All rights reserved. | Governed by Laws of India</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-neo-yellow transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-neo-yellow transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};