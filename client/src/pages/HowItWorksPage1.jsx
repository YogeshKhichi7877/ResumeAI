// import { Link } from 'react-router-dom';
// import { 
//   ArrowLeft, Upload, Target, Zap, FileText, 
//   CheckCircle, BarChart2, MessageSquare, Star, Search, Edit3, Mail
// } from 'lucide-react';

// const steps = [
//   {
//     num: '01',
//     icon: <Upload className="w-12 h-12" />,
//     title: 'Upload Your Resume',
//     description: 'Simply drag and drop your PDF resume or browse to upload. We support PDF files up to 5MB.',
//     tips: ['Make sure your resume is in PDF format', 'Ensure the file is readable', 'Include all relevant sections']
//   },
//   {
//     num: '02',
//     icon: <Target className="w-12 h-12" />,
//     title: 'Select Your Target Domain',
//     description: 'Choose the job role you\'re targeting from our wide range of domains including Software Engineer, Data Scientist, Marketing, and more.',
//     tips: ['Select the most relevant domain', 'You can also specify a custom domain', 'This helps tailor the analysis']
//   },
//   {
//     num: '03',
//     icon: <Zap className="w-12 h-12" />,
//     title: 'AI Analysis Begins',
//     description: 'Our advanced AI powered by Groq analyzes your resume across multiple dimensions including ATS compatibility, grammar, readability, and more.',
//     tips: ['Analysis takes just seconds', 'We use cutting-edge AI technology', 'Every aspect is thoroughly checked']
//   },
//   {
//     num: '04',
//     icon: <BarChart2 className="w-12 h-12" />,
//     title: 'Get Your Detailed Report',
//     description: 'Receive a comprehensive analysis with scores, strengths, weaknesses, and actionable recommendations to improve your resume.',
//     tips: ['Review all sections carefully', 'Check the leaderboard ranking', 'Use recommendations to improve']
//   }
// ];

// const useCases = [
//   {
//     icon: <FileText className="w-8 h-8" />,
//     title: 'Resume Analysis',
//     description: 'Get detailed scoring and feedback on your resume'
//   },
//   {
//     icon: <Search className="w-8 h-8" />,
//     title: 'JD Match',
//     description: 'Compare your resume against job descriptions'
//   },
//   {
//     icon: <MessageSquare className="w-8 h-8" />,
//     title: 'Cover Letter',
//     description: 'Generate personalized cover letters'
//   },
//   {
//     icon: <Edit3 className="w-8 h-8" />,
//     title: 'Resume Rewrite',
//     description: 'Enhance your resume with AI suggestions'
//   },
//   {
//     icon: <Mail className="w-8 h-8" />,
//     title: 'Cold Outreach',
//     description: 'Create professional outreach messages'
//   },
//   {
//     icon: <Star className="w-8 h-8" />,
//     title: 'Interview Prep',
//     description: 'Prepare for interviews with AI-generated questions'
//   }
// ];

// export const HowItWorksPage = () => {
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
//             <Link to="/features" className="font-bold hover:text-neo-blue">Features</Link>
//             <Link to="/how-it-works" className="font-bold text-neo-blue">How It Works</Link>
//           </div>
//           <Link to="/auth" className="neo-button text-sm">Get Started</Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="bg-black py-20 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="font-space text-5xl md:text-6xl font-extrabold mb-6 text-white">
//             HOW IT <span className="text-neo-yellow">WORKS</span>
//           </h1>
//           <p className="text-xl text-gray-400 mb-8">
//             Get your resume analyzed in just 4 simple steps. It's that easy!
//           </p>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {steps.map((step, index) => (
//               <div key={index} className="neo-card p-6 text-center">
//                 <div className="text-6xl font-space font-extrabold text-neo-yellow mb-4">{step.num}</div>
//                 <div className="w-20 h-20 bg-neo-yellow border-3 border-black flex items-center justify-center mx-auto mb-4">
//                   {step.icon}
//                 </div>
//                 <h3 className="font-space font-bold text-xl mb-3">{step.title}</h3>
//                 <p className="text-gray-600 mb-4">{step.description}</p>
//                 <ul className="text-left space-y-2">
//                   {step.tips.map((tip, idx) => (
//                     <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
//                       <CheckCircle className="w-4 h-4 text-neo-green flex-shrink-0 mt-0.5" />
//                       {tip}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Use Cases */}
//       <section className="bg-neo-offwhite py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="font-space text-4xl font-extrabold text-center mb-12">
//             WHAT YOU CAN DO
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {useCases.map((useCase, index) => (
//               <div key={index} className="bg-white border-3 border-black p-6 hover:shadow-neo transition-all">
//                 <div className="w-14 h-14 bg-neo-blue border-3 border-black flex items-center justify-center mb-4">
//                   {useCase.icon}
//                 </div>
//                 <h3 className="font-space font-bold text-lg mb-2">{useCase.title}</h3>
//                 <p className="text-gray-600">{useCase.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Benefits */}
//       <section className="py-20 px-4">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="font-space text-4xl font-extrabold text-center mb-12">
//             WHY CHOOSE RESUME AI?
//           </h2>
//           <div className="space-y-6">
//             {[
//               { title: 'Fast & Free', desc: 'Get your resume analyzed in seconds, completely free!' },
//               { title: 'AI-Powered', desc: 'Leverage cutting-edge Groq AI technology for accurate analysis' },
//               { title: 'Comprehensive', desc: 'Get scores for ATS, grammar, readability, and more' },
//               { title: 'Actionable Feedback', desc: 'Receive specific recommendations to improve your resume' },
//               { title: 'Industry Benchmarks', desc: 'See how your resume compares to others in your field' },
//               { title: 'Privacy First', desc: 'Your data is secure and never shared with third parties' }
//             ].map((benefit, index) => (
//               <div key={index} className="flex items-start gap-4 border-3 border-black p-6 bg-white">
//                 <CheckCircle className="w-8 h-8 text-neo-green flex-shrink-0" />
//                 <div>
//                   <h3 className="font-space font-bold text-xl">{benefit.title}</h3>
//                   <p className="text-gray-600">{benefit.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-neo-yellow py-16 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="font-space text-3xl font-extrabold mb-4">
//             READY TO GET STARTED?
//           </h2>
//           <p className="text-xl mb-8">Join thousands of job seekers who improved their resumes!</p>
//           <Link to="/auth" className="neo-button text-lg inline-block">
//             Analyze My Resume
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
  ArrowLeft, Upload, Target, Zap, FileText, 
  CheckCircle, BarChart2, MessageSquare, Star, Search, Edit3, Mail
} from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: <Upload className="w-12 h-12" />,
    title: 'Upload Your Resume',
    description: 'Simply drag and drop your PDF resume or browse to upload. We support PDF files up to 5MB.',
    tips: ['Make sure your resume is in PDF format', 'Ensure the file is readable', 'Include all relevant sections']
  },
  {
    num: '02',
    icon: <Target className="w-12 h-12" />,
    title: 'Select Your Target Domain',
    description: 'Choose the job role you\'re targeting from our wide range of domains including Software Engineer, Data Scientist, Marketing, and more.',
    tips: ['Select the most relevant domain', 'You can also specify a custom domain', 'This helps tailor the analysis']
  },
  {
    num: '03',
    icon: <Zap className="w-12 h-12" />,
    title: 'AI Analysis Begins',
    description: 'Our advanced AI powered by Groq analyzes your resume across multiple dimensions including ATS compatibility, grammar, readability, and more.',
    tips: ['Analysis takes just seconds', 'We use cutting-edge AI technology', 'Every aspect is thoroughly checked']
  },
  {
    num: '04',
    icon: <BarChart2 className="w-12 h-12" />,
    title: 'Get Your Report',
    description: 'Receive a comprehensive report with scores, recommendations, and actionable feedback to improve your resume.',
    tips: ['Download your report as PDF', 'Share with mentors or coaches', 'Track improvements over time']
  }
];

const useCases = [
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Resume Analysis',
    description: 'Get detailed scores and feedback on your resume'
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'JD Matching',
    description: 'Compare your resume against job descriptions'
  },
  {
    icon: <Edit3 className="w-8 h-8" />,
    title: 'Cover Letters',
    description: 'Generate tailored cover letters for each job'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Resume Rewrite',
    description: 'AI-powered enhancement of your resume bullets'
  },
  {
    icon: <Mail className="w-8 h-8" />,
    title: 'Cold Outreach',
    description: 'Create professional outreach messages'
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: 'Interview Prep',
    description: 'Prepare for interviews with AI-generated questions'
  }
];

export const HowItWorksPage = () => {
  return (
    <>
      <SEO
        title="How It Works"
        description="Learn how ResumeLens works - upload your resume, get AI analysis, improve your chances of landing your dream job in India."
        keywords="how it works, resume analyzer process, AI resume analysis steps, job application guide"
      />
      <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-space text-5xl md:text-6xl font-extrabold mb-6 text-white">
            HOW IT <span className="text-neo-yellow">WORKS</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Get your resume analyzed in just 4 simple steps. It's that easy!
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="neo-card p-6 text-center">
                <div className="text-6xl font-space font-extrabold text-neo-yellow mb-4">{step.num}</div>
                <div className="w-20 h-20 bg-neo-yellow border-3 border-black flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-space font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="text-left space-y-2">
                  {step.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-neo-green flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-neo-offwhite py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-space text-4xl font-extrabold text-center mb-12">
            WHAT YOU CAN DO
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white border-3 border-black p-6 hover:shadow-neo transition-all">
                <div className="w-14 h-14 bg-neo-blue border-3 border-black flex items-center justify-center mb-4">
                  {useCase.icon}
                </div>
                <h3 className="font-space font-bold text-lg mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-space text-4xl font-extrabold text-center mb-12">
            WHY CHOOSE RESUME AI?
          </h2>
          <div className="space-y-6">
            {[
              { title: 'Fast & Free', desc: 'Get your resume analyzed in seconds, completely free!' },
              { title: 'AI-Powered', desc: 'Leverage cutting-edge Groq AI technology for accurate analysis' },
              { title: 'Comprehensive', desc: 'Get scores for ATS, grammar, readability, and more' },
              { title: 'Actionable Feedback', desc: 'Receive specific recommendations to improve your resume' },
              { title: 'Industry Benchmarks', desc: 'See how your resume compares to others in your field' },
              { title: 'Privacy First', desc: 'Your data is secure and never shared with third parties' }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 border-3 border-black p-6 bg-white">
                <CheckCircle className="w-8 h-8 text-neo-green flex-shrink-0" />
                <div>
                  <h3 className="font-space font-bold text-xl">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neo-yellow py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-space text-3xl font-extrabold mb-4">
            READY TO GET STARTED?
          </h2>
          <p className="text-xl mb-8">Join thousands of job seekers who improved their resumes!</p>
          <Link to="/auth" className="neo-button text-lg inline-block">
            Analyze My Resume
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