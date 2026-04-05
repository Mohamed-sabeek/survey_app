import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { questions, PUDUKOTTAI_PLACES } from '../data/questions';

/* ── Progress Bar ── */
function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full px-4 pt-3 pb-2 bg-white">
      <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 text-gray-500 font-bold">
        <span>Question {step + 1} of {total}</span>
        <span className="text-green-600">{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Location autocomplete input ── */
function LocationInput({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = query.length > 0
    ? PUDUKOTTAI_PLACES.filter(p => p.toLowerCase().includes(query.toLowerCase()))
    : PUDUKOTTAI_PLACES;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function select(place) {
    setQuery(place);
    onChange(place);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden focus-within:border-green-400 bg-white transition-all shadow-sm">
        <span className="pl-4"><img src="/assets/emojis/round_pushpin.png" className="w-6 h-6" alt="pin"/></span>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="ஊர் பெயர் தேடுங்கள்... (Search place)"
          className="flex-1 px-3 py-4 text-base text-gray-700 outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); onChange(''); setOpen(false); }}
            className="pr-4 text-gray-400 text-2xl"
          >×</button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
          {filtered.map(place => (
            <li key={place}>
              <button
                onClick={() => select(place)}
                className={`w-full text-left px-5 py-4 text-base font-medium transition-colors border-b border-gray-50 last:border-0
                  ${value === place ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`}
              >
                {place}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Checkbox Group Component ── */
function CheckboxGroup({ options, value = [], onChange, hasOther, otherValue, onOtherChange }) {
  const toggleOption = (val) => {
    const newVal = value.includes(val)
      ? value.filter(v => v !== val)
      : [...value, val];
    onChange(newVal);
  };

  const isOtherSelected = value.includes('other');

  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => toggleOption(opt.value)}
          className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-3
            ${value.includes(opt.value)
              ? 'bg-green-500 border-green-500 text-white shadow-md'
              : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}
        >
          <div className="flex items-center gap-3">
            {opt.img && <img src={opt.img} alt="" className="w-8 h-8" loading="lazy" />}
            <span>{opt.label}</span>
          </div>
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${value.includes(opt.value) ? 'border-white bg-white/20' : 'border-gray-200'}`}>
            {value.includes(opt.value) && <span className="text-white text-xs">✓</span>}
          </div>
        </button>
      ))}
      
      {hasOther && (
        <>
          <button
            onClick={() => toggleOption('other')}
            className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-3
              ${isOtherSelected
                ? 'bg-green-500 border-green-500 text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <img src="/assets/emojis/pencil.png" alt="" className="w-8 h-8" />
              <span>மற்றவை (Other)</span>
            </div>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${isOtherSelected ? 'border-white bg-white/20' : 'border-gray-200'}`}>
              {isOtherSelected && <span className="text-white text-xs">✓</span>}
            </div>
          </button>
          
          {isOtherSelected && (
            <input
              autoFocus
              type="text"
              value={otherValue || ''}
              onChange={e => onOtherChange(e.target.value)}
              placeholder="இங்கே எழுதுங்கள்... (Type here)"
              className="w-full border-2 border-green-300 rounded-2xl px-4 py-4 text-base text-gray-700 focus:outline-none focus:border-green-500 shadow-inner bg-green-50/30"
            />
          )}
        </>
      )}
    </div>
  );
}

/* ── Radio Group Component ── */
function RadioGroup({ options, value, onChange, hasOther, otherValue, onOtherChange }) {
  const isOther = value === 'other';
  return (
    <div className="flex flex-col gap-3">
      {options?.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-3
            ${value === opt.value
              ? 'bg-green-500 border-green-500 text-white shadow-md'
              : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}
        >
          <div className="flex items-center gap-3">
            {opt.img && <img src={opt.img} alt="" className="w-8 h-8" loading="lazy" />}
            <span>{opt.label}</span>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${value === opt.value ? 'border-white bg-white/20' : 'border-gray-200'}`}>
            {value === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </button>
      ))}

      {hasOther && (
        <>
          <button
            onClick={() => onChange('other')}
            className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-3
              ${isOther
                ? 'bg-green-500 border-green-500 text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <img src="/assets/emojis/pencil.png" alt="" className="w-8 h-8" />
              <span>மற்றவை (Other)</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isOther ? 'border-white bg-white/20' : 'border-gray-200'}`}>
              {isOther && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
          
          {isOther && (
            <input
              autoFocus
              type="text"
              value={otherValue || ''}
              onChange={e => onOtherChange(e.target.value)}
              placeholder="இங்கே எழுதுங்கள்... (Type here)"
              className="w-full border-2 border-green-300 rounded-2xl px-4 py-4 text-base text-gray-700 focus:outline-none focus:border-green-500 shadow-inner bg-green-50/30"
            />
          )}
        </>
      )}
    </div>
  );
}

/* ── Single question card ── */
function QuestionCard({ q, answers, onChange }) {
  const value = answers[q.id];
  const otherValue = answers[`${q.id}_other`];

  return (
    <div className="animate-fadeIn flex flex-col gap-6">
      <div className="text-center px-2 flex flex-col items-center">
        <div className="mb-4 bg-green-50 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-green-100">
          <img src={q.icon} alt="" className="w-12 h-12 drop-shadow-md" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">{q.question_ta}</h2>
        <p className="text-sm font-medium text-gray-400">({q.question_en})</p>
      </div>

      <div className="w-full">
        {q.type === 'radio' && (
          <RadioGroup
            options={q.options}
            value={value}
            hasOther={q.hasOther}
            otherValue={otherValue}
            onChange={v => onChange(q.id, v)}
            onOtherChange={v => onChange(`${q.id}_other`, v)}
          />
        )}

        {q.type === 'checkbox' && (
          <CheckboxGroup
            options={q.options}
            value={value}
            hasOther={q.hasOther}
            otherValue={otherValue}
            onChange={v => onChange(q.id, v)}
            onOtherChange={v => onChange(`${q.id}_other`, v)}
          />
        )}

        {q.type === 'location' && (
          <LocationInput
            value={value}
            onChange={v => onChange(q.id, v)}
          />
        )}

        {q.type === 'text' && (
          <textarea
            rows={5}
            value={value || ''}
            onChange={e => onChange(q.id, e.target.value)}
            placeholder={q.placeholder}
            className="w-full border-2 border-gray-200 rounded-2xl p-5 text-base text-gray-700 focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 resize-none shadow-sm transition-all"
          />
        )}
      </div>
    </div>
  );
}

/* ── Success screen ── */
function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 animate-fadeIn min-h-[60vh]">
      <div className="mb-8 relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-20 scale-150"></div>
        <img src="/assets/emojis/party_popper.png" alt="party" className="w-32 h-32 drop-shadow-xl mx-auto relative z-10" />
      </div>
      <h2 className="text-4xl font-black text-gray-900 mb-2">நன்றி!</h2>
      <p className="text-xl text-gray-600 font-medium">பதில்கள் பதிவு செய்யப்பட்டன.</p>
      <p className="text-sm text-gray-400 mt-2 mb-12">(Responses Recorded Successfully)</p>
      
      <button 
        onClick={() => window.location.reload()}
        className="w-full max-w-xs bg-gray-900 text-white rounded-2xl py-5 font-bold shadow-lg active:scale-95 transition-all"
      >
        புதிய கருத்துக் கணிப்பு (New Survey)
      </button>
    </div>
  );
}

/* ── Main App ── */
export default function Survey() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const visibleQuestions = questions.filter(q =>
    !q.conditional || (
      // Simple conditional check: currently only supports one condition
      answers[q.conditional.id] === q.conditional.value
    )
  );

  const current = visibleQuestions[step];
  const isLast = step === visibleQuestions.length - 1;
  const value = answers[current?.id];

  const canProceed = (() => {
    if (!current?.required) return true;
    
    if (current.type === 'checkbox') {
      const hasSelection = value && value.length > 0;
      if (!hasSelection) return false;
      if (value.includes('other')) {
        return !!(answers[`${current.id}_other`]?.trim());
      }
      return true;
    }

    if (!value) return false;

    if (value === 'other') {
      return !!(answers[`${current.id}_other`]?.trim());
    }

    if (current.type === 'text') {
      return value.trim().length > 0;
    }

    return true;
  })();

  function handleChange(key, val) {
    setAnswers(prev => ({ ...prev, [key]: val }));
    setError('');
  }

  async function handleNext() {
    if (!canProceed) {
      setError('Please answer the question before proceeding.');
      return;
    }
    
    if (isLast) {
      await handleSubmit();
    } else {
      setStep(s => s + 1);
      // Scroll to top on step change
      window.scrollTo(0, 0);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const payload = { ...answers };
      
      // Clean up and flatten data before sending
      questions.forEach(q => {
        const val = payload[q.id];
        
        // Handle "Other" inputs for radio/checkbox
        if (q.hasOther) {
          const otherText = payload[`${q.id}_other`];
          
          if (q.type === 'radio') {
            if (val === 'other' && otherText) {
              payload[q.id] = otherText;
            }
          } else if (q.type === 'checkbox' && Array.isArray(val)) {
            if (val.includes('other') && otherText) {
              payload[q.id] = [...val.filter(v => v !== 'other'), otherText];
            }
          }
          delete payload[`${q.id}_other`];
        }

        // Default empty arrays for checkbox if not selected and shown
        if (q.type === 'checkbox' && !payload[q.id]) {
          payload[q.id] = [];
        }
      });

      await api.post('/survey', payload);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md"><SuccessScreen /></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">

      {/* Sticky Top Bar (Mobile-Targeted) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="text-center py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">K</div>
            <h1 className="text-base font-black text-gray-800 tracking-tight uppercase">Survey</h1>
          </div>
          <div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
            Pudukottai Community
          </div>
        </div>
        <ProgressBar step={step} total={visibleQuestions.length} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-5 py-10 pb-32">
        <QuestionCard 
          key={current?.id} // Force re-render on step change for animations
          q={current} 
          answers={answers} 
          onChange={handleChange} 
        />
        
        {error && (
          <div className="mt-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold animate-shake text-center">
            ⚠️ {error}
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50 pointer-events-none">
        <div className="flex gap-3 pointer-events-auto bg-white/60 backdrop-blur-sm p-2 rounded-3xl border border-white/50 shadow-2xl">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-5 rounded-2xl border-2 border-gray-200 bg-white text-gray-600 text-sm font-bold active:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            className={`flex-[2.5] py-5 rounded-2xl text-base font-black text-white transition-all duration-300 shadow-lg active:scale-[0.98]
              ${canProceed && !loading
                ? 'bg-green-500 shadow-green-200 active:bg-green-600'
                : 'bg-gray-300 opacity-60 cursor-not-allowed shadow-none'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </span>
            ) : isLast ? 'SUBMIT (சமர்ப்பி) ✅' : 'NEXT (அடுத்து) →'}
          </button>
        </div>
      </div>

      {/* Mobile styling safe areas */}
      <div className="h-safe-bottom" />
    </div>
  );
}
