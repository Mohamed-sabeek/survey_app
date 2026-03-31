import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { questions, PUDUKOTTAI_PLACES } from '../questions';

/* ── Progress Bar ── */
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full px-4 pt-3 pb-2 bg-white">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-600">கேள்வி {current} / {total}</span>
        <span className="font-bold text-green-600">{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
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
      <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden focus-within:border-green-400 bg-white">
        <span className="pl-4 pb-1"><img src="/assets/emojis/round_pushpin.png" className="w-6 h-6 inline-block" alt="pin"/></span>
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
            className="pr-4 text-gray-400 text-xl"
          >×</button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto">
          {filtered.map(place => (
            <li key={place}>
              <button
                onClick={() => select(place)}
                className={`w-full text-left px-5 py-3 text-base font-medium transition-colors
                  ${value === place ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`}
              >
                <img src="/assets/emojis/round_pushpin.png" className="w-5 h-5 inline-block mr-2" alt="pin"/> {place}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Radio with optional "Other" text field ── */
function RadioOther({ options, value, otherValue, onChange, onOtherChange }) {
  const isOther = value === 'other';
  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-start gap-3
            ${value === opt.value
              ? 'bg-green-500 border-green-500 text-white shadow-md'
              : 'bg-white border-gray-200 text-gray-700'}`}
        >
          {opt.img && <img src={opt.img} alt="" className="w-8 h-8 drop-shadow-sm" loading="lazy" />}
          <span>{opt.label}</span>
        </button>
      ))}
      {/* Other option */}
      <button
        onClick={() => onChange('other')}
        className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-start gap-3
          ${isOther
            ? 'bg-green-500 border-green-500 text-white shadow-md'
            : 'bg-white border-gray-200 text-gray-700'}`}
      >
        <img src="/assets/emojis/pencil.png" alt="" className="w-8 h-8 drop-shadow-sm" />
        <span>மற்றவை (Other)</span>
      </button>
      {isOther && (
        <input
          autoFocus
          type="text"
          value={otherValue || ''}
          onChange={e => onOtherChange(e.target.value)}
          placeholder="இங்கே எழுதுங்கள்... (Type here)"
          className="w-full border-2 border-green-300 rounded-2xl px-4 py-3 text-base text-gray-700 focus:outline-none focus:border-green-500"
        />
      )}
    </div>
  );
}

/* ── Single question card ── */
function QuestionCard({ q, answers, onChange }) {
  const value = answers[q.id];
  const otherValue = answers[`${q.id}_other`];

  return (
    <div className="animate-fadeIn flex flex-col gap-5">
      <div className="text-center px-2 flex flex-col items-center">
        <div className="mb-3">
          <img src={q.icon} alt="" className="w-16 h-16 drop-shadow-md mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 leading-snug">{q.tamil}</h2>
        <p className="text-sm text-gray-400 mt-1">({q.english})</p>
      </div>

      {q.type === 'radio' && (
        <div className="flex flex-col gap-3">
          {q.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange(q.id, opt.value)}
              className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-start gap-3
                ${value === opt.value
                  ? 'bg-green-500 border-green-500 text-white shadow-md'
                  : 'bg-white border-gray-200 text-gray-700'}`}
            >
              {opt.img && <img src={opt.img} alt="" className="w-8 h-8 drop-shadow-sm" loading="lazy" />}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {q.type === 'radio-other' && (
        <RadioOther
          options={q.options}
          value={value}
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
          rows={4}
          value={value || ''}
          onChange={e => onChange(q.id, e.target.value)}
          placeholder={q.placeholder}
          className="w-full border-2 border-gray-200 rounded-2xl p-4 text-base text-gray-700 focus:outline-none focus:border-green-400 resize-none"
        />
      )}
    </div>
  );
}

/* ── Success screen ── */
function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 animate-fadeIn">
      <div className="mb-5">
        <img src="/assets/emojis/party_popper.png" alt="party" className="w-24 h-24 drop-shadow-lg mx-auto" />
      </div>
      <h2 className="text-3xl font-bold text-green-600 mb-2">நன்றி!</h2>
      <p className="text-lg text-gray-600 mb-1">உங்கள் பதில்கள் பதிவு செய்யப்பட்டன.</p>
      <p className="text-sm text-gray-400 mb-8">(Thank you! Your responses have been recorded.)</p>
      <div className="bg-green-50 border border-green-200 rounded-2xl px-8 py-5 w-full max-w-xs flex items-center justify-center gap-3">
        <img src="/assets/emojis/check_mark_button.png" className="w-6 h-6" alt="check" />
        <p className="text-green-700 font-semibold text-lg">Successfully Submitted</p>
      </div>
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
    !q.showIf || answers[q.showIf.id] === q.showIf.value
  );

  const current = visibleQuestions[step];
  const isLast = step === visibleQuestions.length - 1;
  const value = answers[current?.id];

  // For radio-other: required means a selection AND if "other" is chosen, text must be filled
  const canProceed = (() => {
    if (!current?.required) return true;
    if (!value) return false;
    if (current.type === 'radio-other' && value === 'other') {
      return !!(answers[`${current.id}_other`]?.trim());
    }
    return true;
  })();

  function handleChange(key, val) {
    setAnswers(prev => ({ ...prev, [key]: val }));
  }

  async function handleNext() {
    if (!canProceed) {
      alert('Please select at least one option before proceeding.');
      return;
    }
    if (isLast) {
      await handleSubmit();
    } else {
      setStep(s => s + 1);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const payload = { ...answers };
      // Flatten "other" text into the main field for cleaner storage
      questions.forEach(q => {
        if (q.type === 'radio-other' && payload[q.id] === 'other' && payload[`${q.id}_other`]) {
          payload[q.id] = payload[`${q.id}_other`];
          delete payload[`${q.id}_other`];
        }
      });

      // Format array fields for the database
      const arrayFields = ['buyItems', 'buyingProblems', 'missingProducts', 'sellItems', 'sellingProblems', 'services'];
      arrayFields.forEach(field => {
        if (payload[field] && !Array.isArray(payload[field])) {
          payload[field] = [payload[field]];
        } else if (!payload[field]) {
          payload[field] = [];
        }
      });

      const res = await api.post('/survey', payload);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="w-full max-w-md"><SuccessScreen /></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 pt-safe-top">
        <div className="text-center py-3 px-4 flex items-center justify-center gap-2">
          <img src="/assets/emojis/partying_face.png" className="w-6 h-6" alt="survey" />
          <h1 className="text-base font-bold text-green-700">கருத்துக் கணிப்பு</h1>
        </div>
        <p className="text-xs text-gray-400 text-center pb-2">Community Survey – Pudukottai</p>
        <ProgressBar current={step + 1} total={visibleQuestions.length} />
      </div>

      {/* Scrollable question area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <QuestionCard q={current} answers={answers} onChange={handleChange} />
        {error && <p className="mt-4 text-red-500 text-center text-sm">{error}</p>}
        <div className="h-6" />
      </div>

      {/* Sticky bottom nav */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 pb-safe-bottom">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-300 text-gray-600 text-lg font-bold active:bg-gray-100 transition"
            >
              ← பின்
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            className={`flex-[2] py-4 rounded-2xl text-lg font-bold text-white transition-all duration-150
              ${canProceed && !loading
                ? 'bg-green-500 active:bg-green-600 shadow-md active:scale-[0.98]'
                : 'bg-green-300 opacity-80 cursor-not-allowed'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                சமர்ப்பிக்கிறது...
              </span>
            ) : isLast ? '✅ சமர்ப்பி (Submit)' : 'அடுத்து →'}
          </button>
        </div>
      </div>

    </div>
  );
}
