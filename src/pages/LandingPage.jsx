import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-egg font-body text-midnight selection:bg-jasmine/30">
      
      {/* ── NAVBAR ── */}
      <nav className="fixed w-full z-50 top-0 border-b border-olive-light bg-egg/90 backdrop-blur-md">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-2xl text-midnight">TalaCare</span>
            <span className="w-2 h-2 rounded-full bg-coral"></span>
          </div>
          
          <div className="hidden md:flex gap-8 font-bold text-sm text-mauve">
            <a href="#how" className="hover:text-olive transition-colors">How it works</a>
            <a href="#features" className="hover:text-olive transition-colors">Features</a>
            <a href="#who" className="hover:text-olive transition-colors">Who it's for</a>
          </div>

          <button className="bg-midnight text-egg px-6 py-2 rounded-full font-bold text-sm hover:bg-mauve transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="fade-up bg-olive-light text-olive-dark text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-olive"></span>
              Family Health Monitoring
            </span>

            <h1 className="fade-up d1 font-display font-black text-5xl lg:text-[52px] leading-[1.1] text-midnight mb-6">
              Your family's health,<br/>
              <span className="highlight-underline text-olive">together</span> —<br/>
              wherever you are.
            </h1>

            <p className="fade-up d2 text-lg text-mauve mb-10 max-w-md leading-relaxed">
              TalaCare bridges the distance between families by making health monitoring collective, simple, and proactive — whether you're in the same bahay or halfway across the globe.
            </p>

            <div className="fade-up d3 flex flex-wrap gap-4">
              <button className="bg-midnight text-egg px-8 py-4 rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all">
                Start for Free
              </button>
              <button className="border-2 border-midnight text-midnight px-8 py-4 rounded-full font-bold hover:bg-midnight hover:text-egg transition-all">
                See how it works
              </button>
            </div>
          </div>

          {/* Right: Floating UI Mockup */}
          <div className="relative hidden lg:flex justify-center h-[500px] items-center">
            
            {/* FLOATING CARD: Nudge */}
            <div className="float-1 absolute top-4 right-0 z-30 bg-white rounded-2xl shadow-xl p-4 w-52 border border-olive-light">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="font-display font-black text-xs text-midnight">Nudge from Ate!</p>
                  <p className="font-body text-[10px] text-gray-400">Uminom ka na ba ng gamot?</p>
                </div>
              </div>
            </div>

            {/* FLOATING CARD: Streak */}
            <div className="float-3 absolute bottom-12 -left-8 z-30 bg-white rounded-2xl shadow-xl px-4 py-3 border border-olive-light">
              <p className="font-display font-black text-xs text-midnight mb-2">🔥 7-day streak!</p>
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-md bg-olive-light flex items-center justify-center text-olive text-[10px] font-bold">✓</div>
                ))}
                <div className="w-6 h-6 rounded-md bg-olive flex items-center justify-center text-egg text-[10px] font-bold">✓</div>
              </div>
            </div>

            {/* Main Family Card */}
            <div className="float-2 relative z-20 bg-white rounded-[2.5rem] shadow-2xl p-8 w-80 border border-olive-light">
              <div className="flex justify-between items-center mb-6">
                <span className="font-display font-black text-midnight">Reyes Family</span>
                <span className="bg-olive-light text-olive text-[10px] font-bold px-2 py-1 rounded-md uppercase">4 Active</span>
              </div>
              <div className="space-y-4">
                <MemberRow initial="MA" name="Mama" status="BP logged · 1h ago" type="olive" active />
                <MemberRow initial="PA" name="Papa" status="⚠️ Missed meds" type="jasmine" warning />
                <MemberRow initial="KA" name="Kuya Andrei" status="Dubai · Active ✓" type="coral" active />
                <MemberRow initial="IK" name="Ikaw" status="Log vitals →" type="mauve" highlight />
              </div>
              <div className="mt-6 bg-egg/50 rounded-2xl p-4 border border-olive-light/30">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Family Avg BP</p>
                <p className="font-display font-black text-2xl text-midnight">118 <span className="font-normal text-sm text-gray-400">/ 76</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-midnight py-8 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-12 text-sage text-sm font-bold">
          <div className="flex items-center gap-2"><span>🔒</span> Secure & private</div>
          <div className="flex items-center gap-2"><span>🌏</span> Works for OFWs</div>
          <div className="flex items-center gap-2"><span>📵</span> No app download</div>
          <div className="flex items-center gap-2"><span>🆓</span> Free to use</div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6 bg-white/40">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-bold text-xs uppercase tracking-widest text-olive mb-3">How it works</p>
          <h2 className="font-display font-black text-4xl text-midnight mb-12 leading-tight">Simple enough for Lola,<br/>useful enough for OFWs.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard step="01" icon="🏠" title="Create your family" desc="Create a group and share a code. Everyone joins with a tap." color="olive" />
            <StepCard step="02" icon="📋" title="Set up profiles" desc="Add blood type, allergies, and maintenance meds for each member." color="jasmine" />
            <StepCard step="03" icon="📅" title="Log daily" desc="Each member logs vitals. Everyone sees updates in real time." color="coral" />
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-24 bg-midnight px-6">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-bold text-xs uppercase tracking-widest text-jasmine mb-3 text-center md:text-left">Features</p>
          <h2 className="text-egg font-display font-black text-4xl mb-12 text-center md:text-left">Everything your family needs.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Maintenance Med Tracker" desc="Daily checklist per member's schedule. Never skip meds." icon="💊" tag="Daily Log" tagColor="jasmine" />
            <FeatureCard title="Vital Signs Log" desc="Track BP, heart rate, and sugar in one entry." icon="📊" tag="Health Data" tagColor="sage" />
            <FeatureCard title="Nudge Reminder" desc="Remind family to log or take meds with one tap." icon="🔔" tag="Family Connect" tagColor="coral" />
            <FeatureCard title="Emergency Info" desc="One tap shows blood type, allergies, and meds." icon="🆘" tag="Emergency" tagColor="coral" />
            <FeatureCard title="Med Archive" desc="Store lab results and pill label scans per member." icon="🖼️" tag="Smart Tools" tagColor="jasmine" />
            <FeatureCard title="Health Summary" desc="Monthly summaries ready for your next checkup." icon="📆" tag="Reports" tagColor="sage" />
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section id="who" className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-bold text-xs uppercase tracking-widest text-olive mb-3">Who it's for</p>
          <h2 className="font-display font-black text-4xl text-midnight mb-12">Built for the modern Filipino family.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WhoBox icon="✈️" title="OFWs Abroad" color="bg-midnight" accent="text-jasmine" sub="text-sage" />
            <WhoBox icon="💼" title="Busy Professionals" color="bg-olive" accent="text-egg" sub="text-egg/70" />
            <WhoBox icon="📱" title="Gen Z / Millennials" color="bg-mauve" accent="text-jasmine" sub="text-egg/70" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-midnight py-16 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="text-egg font-display font-black text-3xl mb-2">TalaCare</div>
            <p className="text-sage text-sm">Made with pagmamahal para sa pamilyang Pilipino 🇵🇭</p>
          </div>
          <div className="flex gap-10 text-sage/50 text-sm font-bold">
            <a href="#" className="hover:text-egg transition-colors">Privacy</a>
            <a href="#" className="hover:text-egg transition-colors">Terms</a>
            <a href="#" className="hover:text-egg transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- Sub-Components --- */

const MemberRow = ({ initial, name, status, type, warning, highlight, active }) => {
  const styles = {
    olive: "bg-olive-light text-olive",
    coral: "bg-coral-light text-coral",
    jasmine: "bg-jasmine-light text-jasmine-dark",
    mauve: "bg-mauve text-jasmine"
  };
  return (
    <div className="flex items-center gap-4 py-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${styles[type]}`}>
        {initial}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-midnight">{name}</p>
        <p className={`text-[10px] ${highlight ? 'text-olive font-bold' : 'text-gray-400'}`}>{status}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${warning ? 'bg-coral' : active ? 'bg-olive' : 'bg-jasmine'}`}></div>
    </div>
  );
};

const StepCard = ({ step, icon, title, desc, color }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-olive-light shadow-sm">
    <span className={`text-[10px] font-bold text-${color} uppercase tracking-widest`}>Step {step}</span>
    <div className={`w-14 h-14 bg-${color}-light rounded-2xl flex items-center justify-center text-3xl my-5`}>{icon}</div>
    <h3 className="font-display font-black text-lg text-midnight mb-3">{title}</h3>
    <p className="text-mauve text-sm leading-relaxed">{desc}</p>
  </div>
);

const FeatureCard = ({ title, desc, icon, tag, tagColor }) => {
  const tagStyles = {
    jasmine: "bg-jasmine/10 text-jasmine",
    sage: "bg-sage/10 text-sage",
    coral: "bg-coral/10 text-coral"
  };
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-egg font-display font-bold text-lg mb-2">{title}</h3>
      <p className="text-sage text-sm leading-relaxed mb-4">{desc}</p>
      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${tagStyles[tagColor]}`}>{tag}</span>
    </div>
  );
};

const WhoBox = ({ icon, title, color, accent, sub }) => (
  <div className={`${color} p-8 rounded-[2.5rem] shadow-xl`}>
    <div className="text-4xl mb-6">{icon}</div>
    <h3 className={`font-display font-black text-2xl ${accent} mb-4`}>{title}</h3>
    <p className={`${sub} text-sm leading-relaxed`}>Keep everyone connected across distance or busy schedules with real-time health sync.</p>
  </div>
);

export default LandingPage;