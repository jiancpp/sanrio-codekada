import React, { useState } from 'react';

/* ── Utility: generate a readable family code ── */
const generateCode = () => {
  const words = ['PUSO', 'LAYA', 'BUHAY', 'TAHANAN', 'BIGAY', 'YAKAP', 'TULONG', 'LIGTAS'];
  const word = words[Math.floor(Math.random() * words.length)];
  const nums = Math.floor(100 + Math.random() * 900);
  return `${word}-${nums}`;
};

/* ══════════════════════════════════════════════
   STEP 1 — CHOOSE PATH
══════════════════════════════════════════════ */
const ChoosePath = ({ onChoose }) => (
  <div className="fade-up">
    <div className="mb-10">
      <span className="inline-flex items-center gap-2 bg-olive-light text-olive-dark text-xs font-bold px-4 py-1.5 rounded-full mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-olive" />
        Almost there!
      </span>
      <h2 className="font-display font-black text-3xl text-midnight leading-tight mb-2">
        Set up your<br />
        <span className="highlight-underline text-olive">family group</span>
      </h2>
      <p className="text-mauve text-sm leading-relaxed mt-3">
        TalaCare works together — every account must belong to a family. Create a new one or join an existing group.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <button
        onClick={() => onChoose('create')}
        className="group relative overflow-hidden bg-midnight text-egg p-6 rounded-[1.5rem] text-left transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="absolute inset-0 bg-olive opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
            🏠
          </div>
          <div>
            <p className="font-display font-black text-lg mb-1">Create a Family</p>
            <p className="text-sage text-sm leading-relaxed">
              Start a new group and invite your family with a shareable code.
            </p>
          </div>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-sage opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xl">
          →
        </div>
      </button>

      <button
        onClick={() => onChoose('join')}
        className="group relative overflow-hidden bg-white border-2 border-olive-light text-midnight p-6 rounded-[1.5rem] text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:border-olive"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-olive-light flex items-center justify-center text-2xl flex-shrink-0">
            🤝
          </div>
          <div>
            <p className="font-display font-black text-lg mb-1 text-midnight">Join a Family</p>
            <p className="text-mauve text-sm leading-relaxed">
              Enter the code a family member shared with you.
            </p>
          </div>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-mauve opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xl">
          →
        </div>
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   STEP 2A — CREATE FAMILY
══════════════════════════════════════════════ */
const CreateFamily = ({ onBack, onSuccess }) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const generated = generateCode();
    setCode(generated);
    setSubmitted(true);
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="fade-up">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-[1.25rem] bg-olive-light flex items-center justify-center text-3xl mb-6">
            🎉
          </div>
          <h2 className="font-display font-black text-3xl text-midnight mb-2">
            Family created!
          </h2>
          <p className="text-mauve text-sm leading-relaxed">
            <span className="font-bold text-midnight">{name}</span> is ready. Share the code below so your family can join.
          </p>
        </div>

        {/* Code display */}
        <div className="bg-midnight rounded-[1.5rem] p-6 mb-6">
          <p className="text-sage text-xs font-bold uppercase tracking-widest mb-3">Your Family Code</p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-display font-black text-3xl text-jasmine tracking-widest">
              {code}
            </span>
            <button
              onClick={handleCopy}
              className="bg-white/10 hover:bg-white/20 text-egg text-xs font-bold px-4 py-2 rounded-full transition-all border border-white/10"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sage/50 text-xs mt-4 leading-relaxed">
            Keep this safe — family members need it to join your group.
          </p>
        </div>

        {/* Family name chip */}
        <div className="flex items-center gap-3 bg-olive-light rounded-2xl px-5 py-4 mb-8 border border-olive/20">
          <span className="text-xl">🏠</span>
          <div>
            <p className="text-xs text-olive-dark font-bold uppercase tracking-wider">Family Name</p>
            <p className="font-display font-black text-midnight text-lg">{name}</p>
          </div>
        </div>

        <button
          onClick={onSuccess}
          className="w-full py-4 bg-midnight text-egg rounded-full font-bold text-[0.9375rem] transition-all hover:bg-mauve hover:-translate-y-0.5 hover:shadow-xl"
        >
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-mauve text-sm font-bold mb-8 hover:text-midnight transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        ← Back
      </button>

      <div className="mb-8">
        <div className="w-14 h-14 rounded-[1.125rem] bg-midnight flex items-center justify-center text-2xl mb-5">
          🏠
        </div>
        <h2 className="font-display font-black text-3xl text-midnight mb-2">Name your family</h2>
        <p className="text-mauve text-sm leading-relaxed">
          This is how your group will appear to all members. You can change it later.
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="familyName" className="font-semibold text-sm text-midnight">Family Name</label>
          <input
            type="text"
            id="familyName"
            placeholder="e.g. Reyes Family, Dela Cruz Fam..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-5 py-3.5 border-2 border-olive-light rounded-[0.875rem] text-[0.9375rem] text-midnight bg-white placeholder-[#b0b0b0] transition-all focus:outline-none focus:border-olive focus:shadow-[0_0_0_3px_rgba(115,138,119,0.15)]"
          />
          <p className="text-xs text-mauve">A unique invite code will be generated automatically.</p>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-4 bg-midnight text-egg rounded-full font-bold text-[0.9375rem] transition-all hover:bg-mauve hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          Create Family & Get Code
        </button>
      </form>
    </div>
  );
};

/* ══════════════════════════════════════════════
   STEP 2B — JOIN FAMILY
══════════════════════════════════════════════ */
const JoinFamily = ({ onBack, onSuccess }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | found | error
  const [familyName, setFamilyName] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate a lookup — replace with real API call
    setTimeout(() => {
      if (code.toUpperCase().startsWith('PUSO') || code.length >= 8) {
        setFamilyName('Reyes Family'); // mock result
        setStatus('found');
      } else {
        setStatus('error');
      }
    }, 1000);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (status !== 'idle') setStatus('idle');
  };

  return (
    <div className="fade-up">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-mauve text-sm font-bold mb-8 hover:text-midnight transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        ← Back
      </button>

      <div className="mb-8">
        <div className="w-14 h-14 rounded-[1.125rem] bg-olive-light flex items-center justify-center text-2xl mb-5">
          🤝
        </div>
        <h2 className="font-display font-black text-3xl text-midnight mb-2">Enter family code</h2>
        <p className="text-mauve text-sm leading-relaxed">
          Ask a family member for their group code — it looks like <span className="font-bold text-midnight">PUSO-123</span>.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="familyCode" className="font-semibold text-sm text-midnight">Family Code</label>
          <input
            type="text"
            id="familyCode"
            placeholder="e.g. PUSO-123"
            value={code}
            onChange={handleCodeChange}
            required
            className={`w-full px-5 py-3.5 border-2 rounded-[0.875rem] text-[0.9375rem] text-midnight bg-white placeholder-[#b0b0b0] font-bold tracking-widest uppercase transition-all focus:outline-none
              ${status === 'error'
                ? 'border-coral focus:border-coral focus:shadow-[0_0_0_3px_rgba(224,128,119,0.2)]'
                : status === 'found'
                  ? 'border-olive focus:border-olive focus:shadow-[0_0_0_3px_rgba(115,138,119,0.15)]'
                  : 'border-olive-light focus:border-olive focus:shadow-[0_0_0_3px_rgba(115,138,119,0.15)]'
              }`}
          />

          {/* Inline feedback */}
          {status === 'error' && (
            <p className="text-xs text-coral-dark font-semibold flex items-center gap-1.5">
              <span>⚠️</span> Code not found. Double-check and try again.
            </p>
          )}
          {status === 'loading' && (
            <p className="text-xs text-mauve flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border-2 border-olive border-t-transparent rounded-full animate-spin" />
              Looking up code...
            </p>
          )}
        </div>

        {/* Found family preview */}
        {status === 'found' && (
          <div className="flex items-center gap-3 bg-olive-light rounded-2xl px-5 py-4 border border-olive/20">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-xs text-olive-dark font-bold uppercase tracking-wider">Family Found</p>
              <p className="font-display font-black text-midnight text-lg">{familyName}</p>
            </div>
          </div>
        )}

        {status !== 'found' ? (
          <button
            type="submit"
            disabled={!code.trim() || status === 'loading'}
            className="w-full py-4 bg-midnight text-egg rounded-full font-bold text-[0.9375rem] transition-all hover:bg-mauve hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            {status === 'loading' ? 'Searching...' : 'Find Family'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSuccess}
            className="w-full py-4 bg-olive text-egg rounded-full font-bold text-[0.9375rem] transition-all hover:bg-olive-dark hover:-translate-y-0.5 hover:shadow-xl"
          >
            Join {familyName} →
          </button>
        )}
      </form>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const FamilySetup = () => {
  const [step, setStep] = useState('choose'); // choose | create | join

  const handleSuccess = () => {
    // Navigate to dashboard — replace with router push
    alert('Account fully set up! Redirecting to dashboard...');
  };

  const progressSteps = [
    { label: 'Account', done: true },
    { label: 'Family', done: step !== 'choose' || false, active: true },
    { label: 'Done', done: false },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-body">

      {/* ── LEFT: Decorative ── */}
      <div className="hidden lg:flex relative bg-midnight items-center justify-center p-12 overflow-hidden">
        {/* Decorative BG circles */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-olive opacity-10 -top-36 -right-24 pointer-events-none" />
        <div className="absolute w-[250px] h-[250px] rounded-full bg-jasmine opacity-10 -bottom-20 -left-14 pointer-events-none" />
        <div className="absolute w-[150px] h-[150px] rounded-full bg-coral opacity-10 bottom-[20%] right-[10%] pointer-events-none" />

        <div className="relative z-10 max-w-[440px] w-full">
          <a href="/" className="inline-flex items-center gap-2 mb-14 no-underline">
            <span className="font-display font-black text-[1.75rem] text-egg tracking-tight">TalaCare</span>
            <span className="w-2 h-2 rounded-full bg-coral" />
          </a>

          <div className="mb-12">
            <p className="text-sage text-xs font-bold uppercase tracking-widest mb-4">Why this matters</p>
            <h3 className="font-display font-black text-3xl text-egg leading-tight mb-4">
              Health is better when it's shared.
            </h3>
            <p className="text-sage text-sm leading-relaxed">
              TalaCare isn't a solo app — it's built for families. Every feature is designed around the idea that we take better care of ourselves when someone we love is watching.
            </p>
          </div>

          {/* Animated family card mockup */}
          <div
            className="bg-white/[0.06] border border-white/10 rounded-[2rem] p-6"
            style={{ animation: 'float2 6s ease-in-out infinite' }}
          >
            <div className="flex justify-between items-center mb-5">
              <span className="font-display font-black text-egg text-sm">Reyes Family</span>
              <span className="bg-olive/20 text-sage text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">4 Active</span>
            </div>
            <div className="space-y-3">
              {[
                { i: 'MA', name: 'Mama', status: 'BP logged · 1h ago', color: 'bg-olive/20 text-sage' },
                { i: 'PA', name: 'Papa', status: '⚠️ Missed meds', color: 'bg-coral/20 text-coral' },
                { i: 'KA', name: 'Kuya Andrei', status: 'Dubai · Active ✓', color: 'bg-jasmine/20 text-jasmine-dark' },
              ].map(({ i, name, status, color }) => (
                <div key={name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${color}`}>{i}</div>
                  <div>
                    <p className="text-egg text-xs font-bold">{name}</p>
                    <p className="text-sage text-[10px]">{status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form area ── */}
      <div className="flex flex-col items-center justify-center bg-egg px-6 py-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <a href="/" className="lg:hidden inline-flex items-center gap-2 mb-10 no-underline">
            <span className="font-display font-black text-2xl text-midnight">TalaCare</span>
            <span className="w-2 h-2 rounded-full bg-coral" />
          </a>

          {/* Progress indicator */}
          <div className="flex items-center gap-0 mb-10">
            {['Account', 'Family', 'Done'].map((label, i, arr) => {
              const isDone = i === 0;
              const isActive = i === 1;
              const isLast = i === arr.length - 1;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${isDone ? 'bg-olive text-egg' : isActive ? 'bg-midnight text-egg' : 'bg-olive-light text-mauve'}`}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-bold ${isActive ? 'text-midnight' : isDone ? 'text-olive' : 'text-mauve/50'}`}>
                      {label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-px mx-3 ${isDone ? 'bg-olive' : 'bg-olive-light'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step content */}
          {step === 'choose' && <ChoosePath onChoose={setStep} />}
          {step === 'create' && <CreateFamily onBack={() => setStep('choose')} onSuccess={handleSuccess} />}
          {step === 'join'   && <JoinFamily  onBack={() => setStep('choose')} onSuccess={handleSuccess} />}
        </div>
      </div>
    </div>
  );
};

export default FamilySetup;