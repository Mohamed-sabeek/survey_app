import React, { useState, useRef, useEffect } from 'react';
import { PUDUKOTTAI_PLACES } from '../data/questions';

/* ── Location autocomplete input (Compact) ── */
const LocationInput = ({ value, onChange, error }) => {
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
    <div ref={ref} className="relative w-full max-w-sm mx-auto">
      <div className={`group flex items-center border rounded-2xl overflow-hidden bg-white transition-all shadow-sm ${error ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus-within:border-green-500'}`}>
        <span className="pl-4 text-lg"><img src="/assets/emojis/round_pushpin.png" className="w-5 h-5" alt="pin"/></span>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="ஊர் பெயர்... (Search place)"
          className="flex-1 px-3 py-4 text-sm text-gray-700 outline-none bg-transparent font-semibold"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); onChange(''); setOpen(false); }}
            className="pr-4 text-gray-300 hover:text-gray-500 text-xl font-light"
          >×</button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-[100] w-full mt-2 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl max-h-52 overflow-y-auto animate-scaleIn p-2">
          {filtered.map(place => (
            <li key={place}>
              <button
                type="button"
                onClick={() => select(place)}
                className={`w-full text-left px-4 py-3 text-sm font-bold transition-all rounded-xl mb-1
                  ${value === place ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-green-50'}`}
              >
                {place}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ── Main Question Renderer (Compact & Mobile Optimized) ── */
export default function QuestionRenderer({ q, answer, otherValue, onChange, error }) {
  if (!q) return null;
  const isOther = q.type === 'radio' ? answer === 'other' : Array.isArray(answer) && answer.includes('other');

  const toggleCheckbox = (val) => {
    const current = Array.isArray(answer) ? answer : [];
    const newVal = current.includes(val)
      ? current.filter(v => v !== val)
      : [...current, val];
    onChange(q.id, newVal);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full animate-fadeIn" id={`q-${q.id}`}>
      {/* Question Header (Compact) */}
      <div className="text-center px-4 flex flex-col items-center w-full">
        {q.icon && (
          <div className="mb-4 bg-white/50 w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white shadow-md relative z-10">
            <img src={q.icon} alt="" className="w-8 h-8 drop-shadow-sm" />
          </div>
        )}
        <h2 className="text-lg font-bold text-gray-900 leading-snug mb-1 tracking-tight">{q.question_ta}</h2>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">({q.question_en})</p>
      </div>

      {/* Answer Options Area (Compact) */}
      <div className="w-full flex flex-col gap-2.5 max-w-sm mx-auto">
        {(q.type === 'radio' || q.type === 'checkbox') && (
          <>
            {q.options?.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => q.type === 'radio' ? onChange(q.id, opt.value) : toggleCheckbox(opt.value)}
                className={`group w-full text-left p-3.5 rounded-xl border text-sm font-bold transition-all active:scale-95 flex items-center justify-between gap-3
                  ${(q.type === 'radio' ? answer === opt.value : answer?.includes(opt.value))
                    ? 'bg-green-600 border-green-500 text-white shadow-lg'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-green-200'}`}
              >
                <div className="flex items-center gap-3">
                  {opt.img && <img src={opt.img} alt="" className="w-7 h-7" loading="lazy" />}
                  <span className="tracking-tight">{opt.label}</span>
                </div>
                
                {/* Small Radio Indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${(q.type === 'radio' ? answer === opt.value : answer?.includes(opt.value)) ? 'border-white bg-white' : 'border-gray-100 bg-gray-50'}`}>
                  {(q.type === 'radio' ? answer === opt.value : answer?.includes(opt.value)) && (
                    <div className={q.type === 'radio' ? 'w-1.5 h-1.5 rounded-full bg-green-600' : 'text-green-600 text-[10px] font-black'}>{q.type === 'radio' ? '' : '✓'}</div>
                  )}
                </div>
              </button>
            ))}

            {q.hasOther && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => q.type === 'radio' ? onChange(q.id, 'other') : toggleCheckbox('other')}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm font-bold transition-all active:scale-95 flex items-center justify-between gap-3
                    ${isOther ? 'bg-green-600 border-green-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-600 hover:border-green-200'}`}
                >
                  <div className="flex items-center gap-3 uppercase tracking-tight">
                    <img src="/assets/emojis/pencil.png" alt="" className="w-7 h-7" />
                    <span>{q.otherLabel || 'மற்றவை (Other)'}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isOther ? 'border-white bg-white' : 'border-gray-100 bg-gray-50'}`}>
                    {isOther && <div className={q.type === 'radio' ? 'w-1.5 h-1.5 rounded-full bg-green-600' : 'text-green-600 text-[10px] font-black'}>{q.type === 'radio' ? '' : '✓'}</div>}
                  </div>
                </button>
                {isOther && (
                  <input
                    type={q.otherType || 'text'}
                    min={q.otherType === 'number' ? "0" : undefined}
                    autoFocus
                    value={otherValue || ''}
                    onChange={e => onChange(`${q.id}_other`, e.target.value)}
                    placeholder={q.otherPlaceholder || 'விவரம்... (Specify here)'}
                    className="w-full border border-green-500 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none shadow-sm bg-white"
                  />
                )}
              </div>
            )}
          </>
        )}

        {q.type === 'location' && (
          <div className="py-2">
            <LocationInput
              value={answer}
              onChange={v => onChange(q.id, v)}
              error={error}
            />
          </div>
        )}

        {q.type === 'text' && (
          <textarea
            rows={4}
            value={answer || ''}
            onChange={e => onChange(q.id, e.target.value)}
            placeholder={q.placeholder || 'எழுதுங்கள்... (Write here)'}
            className={`w-full border rounded-2xl p-4 text-sm font-semibold text-gray-700 focus:outline-none resize-none transition-all ${error ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white focus:border-green-500'}`}
          />
        )}

        {q.type === 'number' && (
          <div className="py-2 w-full max-w-sm mx-auto">
            <div className={`group flex items-center border rounded-2xl overflow-hidden bg-white transition-all shadow-sm ${error ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus-within:border-green-500'}`}>
              <span className="pl-4 text-lg"><img src="/assets/emojis/check_mark_button.png" className="w-5 h-5" alt="count"/></span>
              <input
                type="number"
                min="0"
                value={answer || ''}
                onChange={e => onChange(q.id, e.target.value)}
                placeholder="எண்ணிக்கையை உள்ளிடவும்... (Enter count)"
                className="flex-1 px-3 py-4 text-sm text-gray-700 outline-none bg-transparent font-black"
              />
            </div>
          </div>
        )}
      </div>

      {/* Compact Error Message */}
      {error && (
        <div className="w-full max-w-sm bg-rose-50 border border-rose-100 text-rose-600 p-2.5 rounded-xl text-center flex items-center justify-center gap-2 animate-shake">
          <span className="font-bold text-xs tracking-tight uppercase">{error}</span>
        </div>
      )}
    </div>
  );
}
