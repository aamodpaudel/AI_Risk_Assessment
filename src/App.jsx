import React, { useState, useEffect } from 'react';
import {
  Compass, ShieldAlert, Rocket, Target, Briefcase,
  Laptop, CheckCircle, Download, ChevronRight,
  ChevronLeft, AlertTriangle, PlayCircle, BarChart3, Users,
  BookOpen, Wrench, MessageSquare, Network, Brain
} from 'lucide-react';

// --- DATA & CONFIG ---

const RESOURCE_LINKS = {
  entrepreneur: { title: "Entrepreneur's Guide to 2026", url: "https://gps.careerlink.ai/resource/entrepreneurs-guide-for-2026-and-beyond-to-navigate-ai-disruption-e926e3ad0c" },
  org_leader: { title: "Organization Leader's Guide to 2026", url: "https://gps.careerlink.ai/resource/careergps-the-organization-leaders-guide-to-2026-c19457e709" },
  mid_career: { title: "Mid-Career Non-Tech Professionals", url: "https://gps.careerlink.ai/resource/mid-career-non-tech-professionals-navigating-ai-disruption-f8e4c80827" },
  academia: { title: "Academia & Research Guide", url: "https://gps.careerlink.ai/resource/academia-and-research-navigating-ai-based-disruption-in-2026-beyond-625723c16b" },
  college_nontech: { title: "College Students (Non-Tech/Humanities)", url: "https://gps.careerlink.ai/resource/college-students-navigating-ai-disruption-for-the-non-tech-and-humanities-students-b7b0f76c85" },
  college_cs: { title: "CS & Engineering Students", url: "https://gps.careerlink.ai/resource/the-cs-and-engineering-college-students-navigating-ai-disruption-58f2a217ad" },
  high_school: { title: "High Schooler's Guide to 2026", url: "https://gps.careerlink.ai/resource/the-high-schoolers-guide-to-2026-and-beyond-juniors-seniors-02c94f8cb6" }
};

const getResourceMatch = (answers) => {
  const stage = answers.q6;
  const industry = answers.q1;

  if (stage === 'c_build') return RESOURCE_LINKS.entrepreneur;
  if (industry === 'leadership') return RESOURCE_LINKS.org_leader;
  if (stage === 'c_launch') {
    if (industry === 'digital') return RESOURCE_LINKS.college_cs;
    return RESOURCE_LINKS.college_nontech;
  }
  return RESOURCE_LINKS.mid_career;
};

const THEME = {
  primary: '#db2777', // pink-600
  light: '#fdf2f8', // pink-50
  border: '#fbcfe8', // pink-200
  text: '#1f2937', // gray-800
  textLight: '#6b7280' // gray-500
};

const QUESTIONS = [
  {
    id: 'q1',
    title: 'Confirmation of Your Role',
    subtitle: 'Here is your profile information. Please confirm these are correct so we can calibrate your report.\n\nRole: [High School Student]\nIndustry: [Education/General]\nCareer Stage: [Entry/Student]',
    type: 'options',
    options: [
      { id: 'confirm', label: 'Confirm and Continue', desc: 'I verify these details are correct.', value: 75, icon: <CheckCircle size={24} /> }
    ]
  },
  {
    id: 'q2',
    title: 'Why is AI Career Assessment Important to You?',
    type: 'text',
    placeholder: 'I worry about AI taking computer jobs and so struggling whether I should apply to CS major'
  },
  {
    id: 'q3',
    title: 'If you had a perfect AI assistant, how much of your weekly tasks could AI do for you?',
    type: 'options',
    options: [
      { id: 'v_low', label: '0 - 25%', desc: 'My work is almost entirely human-dependent (physical, emotional, or high-stakes).', value: 10 },
      { id: 'v_med', label: '26 - 50%', desc: 'Some of my routine work is automatable, but the "core" requires my touch.', value: 40 },
      { id: 'v_high', label: '51 - 75%', desc: 'A large portion of my daily output is digital and predictable.', value: 75 },
      { id: 'v_max', label: '76 - 100%', desc: 'Almost my entire tasks can possibly be handled by AI.', value: 100 }
    ]
  },
  {
    id: 'q4',
    title: 'How often do you use AI tools to get things done?',
    type: 'options',
    options: [
      { id: 's_rare', label: 'Rarely (Passenger)', desc: 'I rarely use them, or I only use them for simple web searches.', value: 100 },
      { id: 's_daily', label: 'Daily (Co-Pilot)', desc: 'I use them daily to help me write, brainstorm, or solve problems faster.', value: 50 },
      { id: 's_power', label: 'Power User (Captain)', desc: 'I’ve customized my tools or connected them to handle my work automatically.', value: 0 }
    ]
  },
  {
    id: 'q5',
    title: 'Trust and Oversight',
    subtitle: 'AI technology and tools can hallucinate, and can often provide biased or even misleading information. How easily you can determine any critical mistake made by AI and intervene.',
    type: 'options',
    options: [
      { id: 'o_miss', label: 'I might miss it', desc: 'because I have no idea how AI works', value: 100 },
      { id: 'o_catch', label: "I'd catch big ones", desc: 'but based on common sense', value: 50 },
      { id: 'o_spot', label: "I'd spot it instantly", desc: 'because I have a good understanding of how AI works under the hood', value: 0 }
    ]
  },
  {
    id: 'q6',
    title: 'With AI career disruption, where do you want to go next?',
    type: 'options',
    options: [
      { id: 'c_launch', label: 'I want to stay safe.', desc: '(Future-Proofing)', value: 15 },
      { id: 'c_climb', label: 'I want to get ahead.', desc: '(The Leap)', value: 5 },
      { id: 'c_pivot', label: 'I want to change paths.', desc: '(The Pivot)', value: 10 },
      { id: 'c_build', label: 'I want to be a boss by creating something big.', desc: '(The Build)', value: -15 }
    ]
  },
  {
    id: 'q7',
    title: 'Tell us your specific dream or biggest worry from AI in your career.',
    type: 'text',
    placeholder: 'Type your answer here...'
  }
];

const USE_CASES = [
  { title: 'AI for Everyday Productivity', desc: 'Manage Emails, Documents, and Tasks efficiently with AI partners.', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80' },
  { title: 'Ideation to Rapid Prototyping', desc: 'Entrepreneurs can go from idea to working prototype in days without a dev team.', img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80' },
  { title: 'AI for Coding', desc: 'Learn basic tools to generate and test code. Build software smarter with Gen AI.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80' }
];

const CIRCLES = [
  { title: 'Prompt Engineering: Everyday AI Skills', desc: 'Join discussions on essential AI skills for the modern workplace.', level: 'Beginner' },
  { title: 'Turn AI into Business Opportunity', desc: 'For Startup Founders and Entrepreneurs looking to leverage AI.', level: 'Advanced' },
  { title: 'Vibe Coding: AI-Powered MVP Building', desc: 'Learn how to build software faster using Generative AI approaches.', level: 'Intermediate' }
];

// --- MAIN COMPONENT ---

export default function App() {
  const [step, setStep] = useState(0); // 0 = Intro, 1-7 = Qs, 8 = Calc, 9 = Result
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  // Print Styles Setup
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
        .no-print { display: none !important; }
        .print-break { page-break-before: always; }
        .shadow-lg { box-shadow: none !important; border: 1px solid #e5e7eb; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSelectOption = (questionId, optionValue, optionObj) => {
    setAnswers({ ...answers, [questionId]: optionValue, [`${questionId}_obj`]: optionObj });
  };

  const handleTextChange = (questionId, text) => {
    setAnswers({ ...answers, [questionId]: text });
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    setStep(8); // Loader

    setTimeout(() => {
      // Formula: Risk Score = (I * 0.35) + (V * 0.40) + (S * 0.15) + (O * 0.10)
      const baseI = answers.q1 || 75; // Default 75 if skipped
      const offset = answers.q6 || 0;
      let I = baseI + offset;
      I = Math.max(0, Math.min(100, I)); // Clamp 0-100

      const V = answers.q3 !== undefined ? answers.q3 : 50;
      const S = answers.q4 !== undefined ? answers.q4 : 50;
      const O = answers.q5 !== undefined ? answers.q5 : 50;

      const riskScore = Math.round((I * 0.35) + (V * 0.40) + (S * 0.15) + (O * 0.10));

      let profile = '';
      let interpretation = '';

      if (riskScore <= 25) {
        profile = 'The Pilot (Low Risk)';
        interpretation = "You're in a great spot, [Username]! You've successfully integrated AI into your daily routine and are acting as a true 'Director of Intelligence'. Keep expanding your strategic vision and leading the way.";
      } else if (riskScore <= 50) {
        profile = 'The Navigator (Medium Risk)';
        interpretation = "You're doing well, [Username], but it's important to stay alert. You're safe for now, but to ensure long-term security, let's proactively close your AI Skill Gap to stay ahead of the curve.";
      } else if (riskScore <= 75) {
        profile = 'The Passenger (High Risk)';
        interpretation = "It looks like your current role is shifting, [Username]. A large portion of your tasks is becoming commoditized by AI. But don't worry—now is the perfect time to start steering the ship and taking control of your AI journey.";
      } else {
        profile = 'High Risk (Critical Transformation)';
        interpretation = "This is a pivotal moment for you, [Username]. Your current workflow is highly exposed to automation. The best move right now is to embrace a dramatic pivot or focus heavily on upskilling. We're here to guide you through it.";
      }

      setResults({
        score: riskScore,
        profile,
        interpretation,
        breakdown: { I, V, S, O }
      });

      setStep(9); // Show Results
    }, 2000);
  };

  // UI Renderers
  const renderIntro = () => (
    <div className="max-w-3xl mx-auto text-center py-20 px-6 fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center transform rotate-3 shadow-sm">
          <Compass size={40} />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">CLAIRA Risk Assessment</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Discover your AI Career Risk Profile. Answer 7 tailored questions to find out if you are a Pilot, a Navigator, or a Passenger in the age of AI disruption.
      </p>
      <button
        onClick={() => setStep(1)}
        className="bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-700 transition shadow-lg hover:shadow-xl flex items-center mx-auto"
      >
        Start My Assessment <ChevronRight className="ml-2" />
      </button>
    </div>
  );

  const renderQuestion = () => {
    const q = QUESTIONS[step - 1];
    const isLast = step === 7;
    const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== '';

    return (
      <div className="max-w-2xl mx-auto py-12 px-6 fade-in">
        <div className="mb-8">
          <div className="text-sm font-bold text-pink-600 tracking-wider uppercase mb-2">Question {step} of 7</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{q.title}</h2>
          {q.subtitle && <p className="text-gray-500 text-lg whitespace-pre-line">{q.subtitle}</p>}
        </div>

        {q.type === 'options' && (
          <div className="space-y-4 mb-10">
            {q.options.map(opt => {
              const isSelected = answers[q.id] === opt.value;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(q.id, opt.value, opt)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-4 ${isSelected ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'}`}
                >
                  <div className={`mt-1 flex-shrink-0 ${isSelected ? 'text-pink-600' : 'text-gray-400'}`}>
                    {opt.icon || <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-pink-600 bg-pink-600' : 'border-gray-300'}`} />}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${isSelected ? 'text-pink-700' : 'text-gray-800'}`}>{opt.label}</h3>
                    <p className={`text-sm ${isSelected ? 'text-pink-600/80' : 'text-gray-500'}`}>{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {q.type === 'text' && (
          <div className="mb-10">
            <textarea
              rows={5}
              className="w-full p-5 rounded-2xl border-2 border-gray-200 focus:border-pink-600 focus:ring-4 focus:ring-pink-100 outline-none transition text-lg resize-none text-gray-800"
              placeholder={q.placeholder}
              value={answers[q.id] || ''}
              onChange={(e) => handleTextChange(q.id, e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(step - 1)}
            className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2 flex items-center transition"
          >
            <ChevronLeft className="mr-1 w-5 h-5" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={`px-8 py-3 rounded-full font-semibold flex items-center transition ${hasAnswer ? 'bg-gray-900 text-white hover:bg-pink-600 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {isLast ? 'Calculate My Risk' : 'Continue'} <ChevronRight className="ml-1 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderLoader = () => (
    <div className="max-w-xl mx-auto text-center py-32 px-6 fade-in">
      <div className="inline-block relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-pink-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-pink-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-pink-600">
          <Compass size={32} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Profile</h2>
      <p className="text-gray-500">CLAIRA is calculating your unique AI Risk and generating a personalized action plan...</p>
    </div>
  );

  const renderResults = () => {
    const { score, profile, interpretation, breakdown } = results;
    const recommendedResource = getResourceMatch(answers);

    // Determine gradient/colors based on score
    let scoreColor = 'text-green-600';
    let bgColor = 'bg-green-50';
    let progressColor = 'bg-green-500';

    if (score > 25 && score <= 50) {
      scoreColor = 'text-yellow-600';
      bgColor = 'bg-yellow-50';
      progressColor = 'bg-yellow-500';
    } else if (score > 50 && score <= 75) {
      scoreColor = 'text-orange-600';
      bgColor = 'bg-orange-50';
      progressColor = 'bg-orange-500';
    } else if (score > 75) {
      scoreColor = 'text-red-600';
      bgColor = 'bg-red-50';
      progressColor = 'bg-red-500';
    }

    return (
      <div className="max-w-5xl mx-auto py-10 px-6 fade-in pb-24">

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8 no-print">
          <div className="flex items-center gap-2 text-pink-600 font-bold text-xl">
            <Compass size={28} /> CLAIRA
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm font-medium">
            <Download size={18} /> Download Report
          </button>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-8 text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">CareerGPS AI Risk Report</h1>
          <p className="text-gray-500 mt-2">Generated by CLAIRA (Careerlink AI Risk Assessment)</p>
        </div>

        {/* Main Score Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100 print:shadow-none print:border-gray-300">
          <div className="md:flex">
            <div className={`p-10 md:w-2/5 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-100 ${bgColor}`}>
              <div className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-500">Your AI Risk Score</div>
              <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 opacity-50" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * score) / 100} className={`${scoreColor} transition-all duration-1000 ease-out`} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-5xl font-extrabold ${scoreColor}`}>{score}</span>
                  <span className="text-gray-500 font-medium mt-1">/ 100</span>
                </div>
              </div>
              <div className={`text-xl font-bold text-center px-4 ${scoreColor}`}>{profile}</div>
            </div>

            <div className="p-10 md:w-3/5 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What this means for you, [Username]</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{interpretation}</p>

              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Risk Factors Breakdown</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-gray-600">Industry Exposure (35%)</span>
                    <span className="text-gray-900">{breakdown.I}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${breakdown.I}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-gray-600">Automation Vulnerability (40%)</span>
                    <span className="text-gray-900">{breakdown.V}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${breakdown.V}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-gray-600">AI Skill Gap (15%)</span>
                    <span className="text-gray-900">{breakdown.S}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-pink-400 h-2 rounded-full" style={{ width: `${breakdown.S}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-gray-600">Lack of AI Oversight (10%)</span>
                    <span className="text-gray-900">{breakdown.O}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-pink-400 h-2 rounded-full" style={{ width: `${breakdown.O}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Resolution Section */}
        <div className="print-break">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Your Personalized 4-Step Resolution</h2>
            <p className="text-gray-500 mt-2 text-lg max-w-2xl mx-auto">This isn't just about identifying risks; it's about providing a clear roadmap to secure your future in an AI-driven world.</p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-pink-200 before:to-transparent">

            {/* STEP 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-pink-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100 ml-4 md:ml-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center"><Target className="text-pink-600 mr-2" size={20} /> Acknowledge & Assess</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  You indicated your main concern: <em className="text-gray-800 font-medium">"{answers.q2 || 'The impact of AI on your industry'}"</em>.
                  Recognizing your exposure level ({breakdown.I} Industry Risk) is the critical first step. You've successfully benchmarked your current vulnerability.
                </p>
                <p className="text-gray-900 text-sm font-semibold mb-3">
                  We've found one valuable resource for you based on your answers. Please make sure to browse it on our platform:
                </p>
                <a href={recommendedResource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-lg font-semibold text-sm transition border border-pink-200 no-print w-full sm:w-auto text-center justify-center">
                  <BookOpen size={16} /> Read: {recommendedResource.title}
                </a>
                <p className="hidden print:block text-sm text-pink-600 font-medium mt-2">Recommended Reading: {recommendedResource.title}</p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-pink-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100 ml-4 md:ml-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center"><Laptop className="text-pink-600 mr-2" size={20} /> Upskill via AI Use Cases</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  To lower your Automation vulnerability ({breakdown.V}), you must turn AI from a threat into a tool. Explore these tailored Use Cases:
                </p>
                <div className="space-y-3 no-print">
                  {USE_CASES.slice(0, 2).map((uc, i) => (
                    <div key={i} className="flex gap-3 items-center bg-pink-50/50 p-3 rounded-xl border border-pink-100 hover:border-pink-300 transition cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${uc.img})` }}></div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{uc.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{uc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="hidden print:block text-sm text-pink-600 font-medium mt-2">Recommended: {USE_CASES[0].title}, {USE_CASES[1].title}</p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-pink-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100 ml-4 md:ml-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center"><Users className="text-pink-600 mr-2" size={20} /> Join Careerlink Circles</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  You are not on this journey alone. Reduce your AI Skill Gap ({breakdown.S}) by collaborating with peers in Careerlink Circles. Solve real-world problems together.
                </p>
                <div className="space-y-3 no-print">
                  {CIRCLES.slice(0, 2).map((circle, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-pink-200 transition cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight pr-2">{circle.title}</h4>
                        <span className="text-[10px] uppercase font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full shrink-0">{circle.level}</span>
                      </div>
                      <p className="text-xs text-gray-500">{circle.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="hidden print:block text-sm text-pink-600 font-medium mt-2">Recommended: {CIRCLES[0].title}, {CIRCLES[1].title}</p>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-pink-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100 ml-4 md:ml-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center"><Rocket className="text-pink-600 mr-2" size={20} /> Take Continuous Action</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Your vision is: <em className="text-gray-800 font-medium">"{answers.q7 || 'To secure and grow my future career'}"</em>.
                  Keep revisiting the platform to test your skills, stay updated on new AI capabilities, and re-assess your risk profile every 6 months as technology evolves.
                </p>

                <p className="text-pink-700 font-medium text-xs sm:text-sm mt-3 bg-pink-50 p-3 rounded-xl border border-pink-100 leading-relaxed">
                  <strong className="font-bold">Fact:</strong> 86% of our users who complete at least up to step three have 3x more chance of getting their AI Risk factor decrease by 35%.
                </p>

                <button className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-pink-600 transition shadow-md no-print">
                  Explore Careerlink Platform Now
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Your Monday Move Section */}
        <div className="mt-16 pt-10 border-t border-gray-200 print-break">
          <div className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-800 p-10 text-center relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Your Monday Move</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                The AI landscape is shifting fast. Don't wait until it's too late. What is the <strong className="text-white">one action</strong> you will take this Monday to future-proof your career?
              </p>
              <button
                onClick={() => window.open('https://careerlink.ai', '_blank')}
                className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-500 transition shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:shadow-[0_0_30px_rgba(219,39,119,0.6)] flex items-center mx-auto"
              >
                Commit to My Move <Rocket className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-pink-200 selection:text-pink-900">
      <style dangerouslySetInnerHTML={{
        __html: `
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      {/* Top Navigation / Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(0)}>
          {/* Using uploaded Logo filename with stylized fallback */}
          <img
            src="NewCareerlink Logo.png"
            alt="Careerlink"
            className="h-8 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback styling shown if the image fails to load */}
          <div className="hidden items-center gap-1 text-pink-600 font-extrabold text-2xl tracking-tight">
            <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">ai</span>
            <span>career<span className="text-gray-800">link</span></span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-500 hidden sm:block">
          CLAIRA (Careerlink AI Risk Assessment)
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {step === 0 && renderIntro()}
        {step >= 1 && step <= 7 && renderQuestion()}
        {step === 8 && renderLoader()}
        {step === 9 && renderResults()}
      </main>

    </div>
  );
}
