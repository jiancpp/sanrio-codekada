import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { MemberRow } from "../components/ui/MemberRow";
import { FeatureCard } from "../features/dashboard/FeatureCard";
import { WhoBox } from "../components/ui/WhoBox";

import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-egg font-body text-midnight selection:bg-jasmine/30">
      <Navbar variant="public" />

      <main>
        {/* ── HERO SECTION ── */}
        <section className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center overflow-visible">
          {/* Left Side: Center text on mobile, left-align on desktop */}
          <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start z-10">
            <span className="fade-up bg-olive-light text-olive-dark text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-6">
              A Family Health Monitoring App
            </span>

            <h1 className="fade-up d1 font-display font-black text-4xl sm:text-5xl lg:text-[52px] leading-[1.1] text-midnight mb-6 max-w-2xl">
              Your family's health,
              <br />
              <span className="highlight-underline text-olive">together</span> —
              <br />
              wherever you are.
            </h1>

            <p className="fade-up d2 text-lg text-mauve mb-10 max-w-md leading-relaxed">
              TalaCare bridges the distance between families by making health
              monitoring collective, simple, and proactive — whether you're in
              the same bahay or halfway across the globe.
            </p>

            <div className="fade-up d3 flex flex-wrap justify-center lg:justify-start gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-midnight text-egg px-8 py-4 rounded-full font-bold shadow-lg hover:-translate-y-1 hover:cursor-pointer active:scale-95 transition-all"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="border-2 border-midnight text-midnight px-8 py-4 rounded-full font-bold hover:bg-midnight hover:cursor-pointer hover:text-egg active:scale-95 transition-all"
              >
                Log in
              </button>
            </div>
          </div>

          {/* Right Side: Floating UI Mockup */}
          <div className="relative hidden lg:flex lg:w-1/2 justify-center h-[500px] items-center">
            {/* Floating Card: Nudge */}
            <div className="float-1 absolute top-4 right-0 z-30 bg-white rounded-2xl shadow-xl p-4 w-52 border border-olive-light">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="font-display font-black text-xs text-midnight">
                    Nudge from Ate!
                  </p>
                  <p className="font-body text-[10px] text-gray-400">
                    Uminom ka na ba ng gamot?
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card: Streak */}
            <div className="float-3 absolute bottom-12 -left-8 z-30 bg-white rounded-2xl shadow-xl px-4 py-3 border border-olive-light">
              <p className="font-display font-black text-xs text-midnight mb-2">
                🔥 7-day streak!
              </p>
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-md bg-olive-light flex items-center justify-center text-olive text-[10px] font-bold"
                  >
                    ✓
                  </div>
                ))}
                <div className="w-6 h-6 rounded-md bg-olive flex items-center justify-center text-egg text-[10px] font-bold">
                  ✓
                </div>
              </div>
            </div>

            {/* Main Family Card */}
            <div className="float-2 relative z-20 bg-white rounded-[2.5rem] shadow-2xl p-8 w-80 border border-olive-light">
              <div className="flex justify-between items-center mb-6">
                <span className="font-display font-black text-midnight text-lg">
                  My Family
                </span>
                <span className="bg-olive-light text-olive text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  4 Active
                </span>
              </div>
              <div className="space-y-4">
                <MemberRow
                  initial="MA"
                  name="Mama"
                  status="BP logged · 1h ago"
                  type="olive"
                  active
                />
                <MemberRow
                  initial="PA"
                  name="Papa"
                  status="⚠️ Missed meds"
                  type="jasmine"
                  warning
                />
                <MemberRow
                  initial="KA"
                  name="Kuya"
                  status="Dubai · Active ✓"
                  type="coral"
                  active
                />
                <MemberRow
                  initial="AT"
                  name="Ate"
                  status="Log vitals →"
                  type="mauve"
                  highlight
                />
              </div>
              <div className="mt-6 bg-egg/50 rounded-2xl p-4 border border-olive-light/30">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 text-center">
                  Family Avg BP
                </p>
                <p className="font-display font-black text-2xl text-midnight text-center">
                  118{" "}
                  <span className="font-normal text-sm text-gray-400">
                    / 76
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section id="features" className="py-24 bg-midnight px-6">
          <div className="max-w-screen-xl mx-auto">
            <p className="font-bold text-xs uppercase tracking-widest text-jasmine mb-3 text-center md:text-left">
              Features
            </p>
            <h2 className="text-egg font-display font-black text-4xl mb-12 text-center md:text-left">
              Everything your family needs.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                title="Maintenance Med Tracker"
                desc="Daily checklist per member's schedule. Never skip meds."
                icon="💊"
                tag="Daily Log"
                tagColor="jasmine"
              />
              <FeatureCard
                title="Vital Signs Log"
                desc="Track BP, heart rate, and sugar in one entry."
                icon="📊"
                tag="Health Data"
                tagColor="sage"
              />
              <FeatureCard
                title="Nudge Reminder"
                desc="Remind family to log or take meds with one tap."
                icon="🔔"
                tag="Family Connect"
                tagColor="coral"
              />
              <FeatureCard
                title="Emergency Info"
                desc="One tap shows blood type, allergies, and meds."
                icon="🆘"
                tag="Emergency"
                tagColor="coral"
              />
              <FeatureCard
                title="Med Archive"
                desc="Store daily logs and lab test attachments per member."
                icon="🖼️"
                tag="Smart Tools"
                tagColor="jasmine"
              />
              <FeatureCard
                title="Health Summary"
                desc="Monthly summaries ready for your next checkup."
                icon="📆"
                tag="Reports"
                tagColor="sage"
              />
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section id="who" className="py-24 px-6">
          <div className="max-w-screen-xl mx-auto">
            <p className="font-bold text-xs uppercase tracking-widest text-olive mb-3">
              Who it's for
            </p>
            <h2 className="font-display font-black text-4xl text-midnight mb-12">
              Built for the modern Filipino family.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <WhoBox
                icon="✈️"
                title="OFWs Abroad"
                color="bg-midnight"
                accent="text-jasmine"
                sub="text-sage"
              />
              <WhoBox
                icon="💼"
                title="Busy Professionals"
                color="bg-olive"
                accent="text-egg"
                sub="text-egg/70"
              />
              <WhoBox
                icon="📱"
                title="Gen Z / Millennials"
                color="bg-mauve"
                accent="text-jasmine"
                sub="text-egg/70"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
