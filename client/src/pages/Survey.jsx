import { useState, useEffect, useRef, useMemo } from 'react';
import api from '../api/axios';
import { questions } from '../data/questions';
import QuestionRenderer from '../components/QuestionRenderer';
import { validateSurvey } from '../utils/validation';
import { formatPayload } from '../utils/payloadFormatter';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

/* ── Success screen ── */
function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-24 animate-fadeIn min-h-[60vh] bg-white rounded-[3rem] shadow-2xl border border-gray-100 max-w-2xl mx-auto">
      <div className="mb-10 relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-40 scale-150"></div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-8 border-white/50 backdrop-blur-sm">
          <CheckCircle2 className="w-16 h-16 text-white drop-shadow-lg" />
        </div>
      </div>
      <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">நன்றி!</h2>
      <p className="text-2xl text-gray-600 font-bold mb-2 leading-tight">உங்கள் பதில்கள் வெற்றிகரமாக பதிவு செய்யப்பட்டன.</p>
      <p className="text-base font-black text-gray-300 uppercase tracking-[0.2em] mb-16">(Responses Recorded Successfully)</p>
      
      <button 
        onClick={() => window.location.reload()}
        className="w-full max-w-xs bg-gray-900 text-white rounded-3xl py-6 font-black text-lg shadow-2xl hover:shadow-gray-300 hover:-translate-y-1 active:scale-95 transition-all"
      >
        புதிய கருத்துக் கணிப்பு (New Survey)
      </button>
    </div>
  );
}

export default function Survey() {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const prevOccupation = useRef();

  // ── Branching Logic (Computed visible questions) ──
  const visibleQuestions = useMemo(() => {
    return questions.filter(q => {
      if (!q.dependsOn) return true;
      const { questionId, value } = q.dependsOn;
      const actualValue = answers[questionId];
      return Array.isArray(value) ? value.includes(actualValue) : actualValue === value;
    });
  }, [answers]);

  // ── Reset Logic (CRITICAL) ──
  useEffect(() => {
    const occupation = answers.q_occupation;
    if (occupation && prevOccupation.current && occupation !== prevOccupation.current) {
      setAnswers(prev => ({
        q_gender: prev.q_gender,
        q_area: prev.q_area,
        q_age: prev.q_age,
        q_occupation: occupation
      }));
      setErrors({});
    }
    prevOccupation.current = occupation;
  }, [answers.q_occupation]);

  const handleUpdate = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    if (errors[id]) {
        const next = { ...errors };
        delete next[id];
        setErrors(next);
    }
  };

  const handleNext = () => {
    const currentQ = visibleQuestions[currentStep];
    const validation = validateSurvey([currentQ], answers);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setLoading(true);
    try {
      const payload = formatPayload(visibleQuestions, answers);
      await api.post('/survey', payload);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'சமர்ப்பிப்பதில் தோல்வி. மீண்டும் முயலவும். (Submission failed)');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <SuccessScreen />
      </div>
    );
  }

  const currentQ = visibleQuestions[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / visibleQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans flex flex-col items-center selection:bg-green-100 relative">
      
      {/* Compact Header (Sticky) */}
      <header className="sticky top-0 z-[60] w-full max-w-md bg-white/80 backdrop-blur-3xl border-b border-gray-100/50 shadow-sm px-5 py-3 flex justify-center">
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-gray-900 uppercase tracking-tighter flex items-center gap-1.5">
                Survey
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Progress</span>
              <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100 shadow-inner">{currentStep + 1} / {visibleQuestions.length}</span>
            </div>
          </div>
          
          {/* Thinner Progress Bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
             <div 
               className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(34,197,94,0.3)]"
               style={{ width: `${progressPercent}%` }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </header>

      {/* Main Layout (Max-w-md) */}
      <main className="w-full max-w-md px-5 py-4 pb-32 flex-1 animate-slideUp">
        <div className="space-y-4">
          <QuestionRenderer
            q={currentQ}
            answer={answers[currentQ?.id]}
            otherValue={answers[`${currentQ?.id}_other`]}
            onChange={handleUpdate}
            error={errors[currentQ?.id]}
          />
          
          {submitError && (
            <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-4 rounded-2xl text-center font-bold text-xs animate-shake shadow-lg shadow-rose-100/20 flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span> 
              <span className="leading-tight">{submitError}</span>
            </div>
          )}
        </div>
      </main>

      {/* Compact Floating Bottom Navigation */}
      <footer className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-5">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-3xl p-2.5 rounded-2xl border border-white/50 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-scaleIn">
          
          {/* Smaller Back Button */}
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="group p-3 rounded-xl bg-white text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-200 shadow-sm transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3px]" />
            </button>
          ) : (
            <div className="w-[46px]" /> 
          )}

          {/* Compact Next/Submit Button */}
          <button
            onClick={handleNext}
            disabled={loading || !validateSurvey([currentQ], answers).isValid}
            className={`flex-1 py-3 rounded-xl text-sm font-black text-white transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden
              ${loading || !validateSurvey([currentQ], answers).isValid ? 'bg-gray-300 shadow-none cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200/40'}`}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-4 border-white/30 border-t-white rounded-full" />
            ) : (
              <div className="flex items-center gap-2 relative z-10 uppercase tracking-tight">
                <span>{currentStep === visibleQuestions.length - 1 ? 'பதிவு செய் (SUBMIT)' : 'அடுத்த கேள்வி (NEXT)'}</span>
                <ChevronRight className="w-5 h-5 stroke-[3px] group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </div>
      </footer>

      {/* Rich Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gray-50/50">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-50 rounded-full blur-[120px] opacity-60 animate-blob" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-blob animation-delay-2000" />
      </div>
    </div>
  );
}
