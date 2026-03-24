// import { Link } from 'react-router-dom';
// import { 
//   Target, CheckCircle, FileText, TrendingUp, Flame ,
//   MessageSquare, Star, Zap, Award, ArrowLeft,
//   Search, Edit3, Mail, BarChart2, Brain, Clock
// } from 'lucide-react';

// const features = [
//   {
//     icon: <Target className="w-10 h-10" />,
//     title: 'AI Score Analysis',
//     description: 'Get comprehensive scoring across multiple dimensions including ATS compatibility, grammar, readability, and experience match.',
//     color: 'bg-neo-yellow',
//     details: ['Overall score out of 100', 'Detailed breakdown by category', 'Comparison with industry standards']
//   },
//   {
//     icon: <CheckCircle className="w-10 h-10" />,
//     title: 'ATS Compatibility',
//     description: 'Ensure your resume passes through Applicant Tracking Systems with optimized formatting and keyword placement.',
//     color: 'bg-neo-green',
//     details: ['Format validation', 'Keyword density check', 'Section structure analysis']
//   },
//   {
//     icon: <FileText className="w-10 h-10" />,
//     title: 'Grammar & Spelling',
//     description: 'Advanced grammar and spelling checks to ensure your resume is polished and professional.',
//     color: 'bg-neo-blue',
//     details: ['Grammar errors detection', 'Spelling corrections', 'Punctuation suggestions']
//   },
//   {
//     icon: <Search className="w-10 h-10" />,
//     title: 'JD Match',
//     description: 'Compare your resume against any job description to see how well you match the requirements.',
//     color: 'bg-purple-500',
//     details: ['Match percentage score', 'Missing keywords identification', 'Skill gap analysis']
//   },
//   {
//     icon: <Edit3 className="w-10 h-10" />,
//     title: 'Cover Letter Generator',
//     description: 'Generate personalized cover letters tailored to specific job applications using AI.',
//     color: 'bg-neo-green',
//     details: ['Multiple tone options', 'Personalized content', 'One-click generation']
//   },
//   {
//     icon: <Zap className="w-10 h-10" />,
//     title: 'Resume Rewrite',
//     description: 'Let AI enhance and rewrite your resume bullets for maximum impact.',
//     color: 'bg-neo-orange',
//     details: ['Bullet point optimization', 'Action verb suggestions', 'Quantifiable achievements']
//   },
//   {
//     icon: <Mail className="w-10 h-10" />,
//     title: 'Cold Outreach',
//     description: 'Generate professional cold emails, LinkedIn DMs, and referral requests.',
//     color: 'bg-pink-500',
//     details: ['Formal email templates', 'LinkedIn DM scripts', 'Referral request messages']
//   },
//   {
//     icon: <MessageSquare className="w-10 h-10" />,
//     title: 'Interview Prep',
//     description: 'Get personalized interview questions based on your resume and target role.',
//     color: 'bg-neo-blue',
//     details: ['Role-specific questions', 'Behavioral questions', 'Technical questions']
//   },
//   {
//     icon: <BarChart2 className="w-10 h-10" />,
//     title: 'Leaderboard',
//     description: 'See how your resume ranks against others in your domain.',
//     color: 'bg-neo-yellow',
//     details: ['Percentile ranking', 'Average scores', 'Industry benchmarks']
//   },
//   {
//     icon: <Flame className="w-10 h-10" />,
//     title: 'Roast My Resume',
//     description: 'Get brutally honest feedback to identify areas for improvement.',
//     color: 'bg-neo-red',
//     details: ['Honest critique', 'Improvement suggestions', 'Actionable feedback']
//   },
//   {
//     icon: <Brain className="w-10 h-10" />,
//     title: 'Skill Gap Analysis',
//     description: 'Identify skills you need to learn to be more competitive in your field.',
//     color: 'bg-indigo-500',
//     details: ['Missing skills identification', 'Learning path suggestions', 'Resource recommendations']
//   },
//   {
//     icon: <Award className="w-10 h-10" />,
//     title: 'Executive Summary',
//     description: 'Generate a compelling professional summary that highlights your value.',
//     color: 'bg-neo-green',
//     details: ['Key achievements highlight', 'Value proposition', 'Professional branding']
//   }
// ];

// export const FeaturesPage = () => {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar */}
//       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-neo-yellow border-3 border-black flex items-center justify-center">
//               <span className="font-space font-extrabold text-lg">R</span>
//             </div>
//             <span className="font-space font-extrabold text-2xl">RESUME AI</span>
//           </Link>
//           <div className="hidden md:flex items-center gap-6">
//             <Link to="/" className="font-bold hover:text-neo-blue">Home</Link>
//             <Link to="/features" className="font-bold text-neo-blue">Features</Link>
//             <Link to="/how-it-works" className="font-bold hover:text-neo-blue">How It Works</Link>
//           </div>
//           <Link to="/auth" className="neo-button text-sm">Get Started</Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="bg-neo-offwhite py-20 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="font-space text-5xl md:text-6xl font-extrabold mb-6">
//             POWERFUL <span className="text-neo-yellow bg-black px-2">FEATURES</span>
//           </h1>
//           <p className="text-xl text-gray-600 mb-8">
//             Everything you need to create the perfect resume and land your dream job.
//           </p>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="neo-card p-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
//                 <div className={`w-16 h-16 ${feature.color} border-3 border-black flex items-center justify-center mb-4`}>
//                   {feature.icon}
//                 </div>
//                 <h3 className="font-space font-bold text-xl mb-3">{feature.title}</h3>
//                 <p className="text-gray-600 mb-4">{feature.description}</p>
//                 <ul className="space-y-2">
//                   {feature.details.map((detail, idx) => (
//                     <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
//                       <CheckCircle className="w-4 h-4 text-neo-green" />
//                       {detail}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-neo-yellow py-16 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="font-space text-3xl font-extrabold mb-4">
//             READY TO TRY OUR FEATURES?
//           </h2>
//           <p className="text-xl mb-8">Start analyzing your resume for free today!</p>
//           <Link to="/auth" className="neo-button text-lg inline-block">
//             Get Started Free
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-black text-white py-8 px-4">
//         <div className="max-w-7xl mx-auto text-center text-gray-400">
//           <p>© 2024 Resume AI. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };





















import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { SEO } from '../components/SEO';
import { 
  Target, CheckCircle, FileText, TrendingUp, Flame ,
  MessageSquare, Star, Zap, Award, ArrowLeft,
  Search, Edit3, Mail, BarChart2, Brain, Clock
} from 'lucide-react';

const features = [
  {
    icon: <Target className="w-10 h-10" />,
    title: 'AI Score Analysis',
    description: 'Get comprehensive scoring across multiple dimensions including ATS compatibility, grammar, readability, and experience match.',
    color: 'bg-neo-yellow',
    details: ['Overall score out of 100', 'Detailed breakdown by category', 'Comparison with industry standards']
  },
  {
    icon: <CheckCircle className="w-10 h-10" />,
    title: 'ATS Compatibility',
    description: 'Ensure your resume passes through Applicant Tracking Systems with optimized formatting and keyword placement.',
    color: 'bg-neo-green',
    details: ['Format validation', 'Keyword density check', 'Section structure analysis']
  },
  {
    icon: <FileText className="w-10 h-10" />,
    title: 'Grammar & Spelling',
    description: 'Advanced grammar and spelling checks to ensure your resume is polished and professional.',
    color: 'bg-neo-blue',
    details: ['Grammar errors detection', 'Spelling corrections', 'Punctuation suggestions']
  },
  {
    icon: <Search className="w-10 h-10" />,
    title: 'JD Match',
    description: 'Compare your resume against any job description to see how well you match the requirements.',
    color: 'bg-purple-500',
    details: ['Match percentage score', 'Missing keywords identification', 'Skill gap analysis']
  },
  {
    icon: <Edit3 className="w-10 h-10" />,
    title: 'Cover Letter Generator',
    description: 'Generate personalized cover letters tailored to specific job applications using AI.',
    color: 'bg-neo-green',
    details: ['Multiple tone options', 'Personalized content', 'One-click generation']
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: 'Resume Rewrite',
    description: 'Let AI enhance and rewrite your resume bullets for maximum impact.',
    color: 'bg-neo-orange',
    details: ['Bullet point optimization', 'Action verb suggestions', 'Quantifiable achievements']
  },
  {
    icon: <MessageSquare className="w-10 h-10" />,
    title: 'Interview Questions',
    description: 'Get tailored interview questions based on your resume and target role.',
    color: 'bg-neo-red',
    details: ['Role-specific questions', 'Behavioral questions', 'Technical question prep']
  },
  {
    icon: <Mail className="w-10 h-10" />,
    title: 'Cold Email Generator',
    description: 'Create personalized cold outreach emails to potential employers or recruiters.',
    color: 'bg-neo-orange',
    details: ['Personalized templates', 'Multiple industry styles', 'Follow-up sequences']
  },
  {
    icon: <Brain className="w-10 h-10" />,
    title: 'Skill Gap Analysis',
    description: 'Identify skills you need to learn to be more competitive in your field.',
    color: 'bg-indigo-500',
    details: ['Missing skills identification', 'Learning path suggestions', 'Resource recommendations']
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: 'Executive Summary',
    description: 'Generate a compelling professional summary that highlights your value.',
    color: 'bg-neo-green',
    details: ['Key achievements highlight', 'Value proposition', 'Professional branding']
  }
];

export const FeaturesPage = () => {
  return (
    <>
      <SEO
        title="Features"
        description="Explore ResumeLens's powerful features: AI resume analysis, ATS scoring, JD matching, cover letter generator, and more."
        keywords="resume features, ATS score, AI resume analysis, cover letter generator, JD match, resume tools"
      />
      <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-neo-offwhite py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-space text-5xl md:text-6xl font-extrabold mb-6">
            POWERFUL <span className="text-neo-yellow bg-black px-2">FEATURES</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to create the perfect resume and land your dream job.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="neo-card p-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <div className={`w-16 h-16 ${feature.color} border-3 border-black flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-space font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-neo-green" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neo-yellow py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-space text-3xl font-extrabold mb-4">
            READY TO TRY OUR FEATURES?
          </h2>
          <p className="text-xl mb-8">Start analyzing your resume for free today!</p>
          <Link to="/auth" className="neo-button text-lg inline-block">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 ResumeLens. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </>
  );
};






















