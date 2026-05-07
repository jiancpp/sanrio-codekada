import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { BASE_URL } from '../hooks/constants';
import { getAge } from '../hooks/utils';

// Blood type accent colors
const BLOOD_COLORS = {
  'A+':  { bg: 'bg-coral-light',   text: 'text-coral-dark',   border: 'border-coral' },
  'A-':  { bg: 'bg-coral-light',   text: 'text-coral-dark',   border: 'border-coral' },
  'B+':  { bg: 'bg-jasmine-light', text: 'text-jasmine-dark', border: 'border-jasmine' },
  'B-':  { bg: 'bg-jasmine-light', text: 'text-jasmine-dark', border: 'border-jasmine' },
  'AB+': { bg: 'bg-olive-light',   text: 'text-olive-dark',   border: 'border-olive' },
  'AB-': { bg: 'bg-olive-light',   text: 'text-olive-dark',   border: 'border-olive' },
  'O+':  { bg: 'bg-egg',           text: 'text-midnight',     border: 'border-midnight' },
  'O-':  { bg: 'bg-egg',           text: 'text-midnight',     border: 'border-midnight' },
};

const MEMBER_ACCENTS = ['bg-coral', 'bg-jasmine', 'bg-olive', 'bg-sage', 'bg-mauve'];

export default function EmergencyInfo() {
  const [members, setMembers]     = useState([]);
  const [family, setFamily]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [printed, setPrinted]     = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserString = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token            = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!storedUserString || !token) { navigate('/login'); return; }

    const parsedUser = JSON.parse(storedUserString);

    const fetchFamily = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/family/get/${parsedUser.familyCode}`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
          const enriched = data.members.map(m => ({
            ...m,
            age:     getAge(new Date(m.birthdate)) ?? '—',
            initial: m.name.slice(0, 2).toUpperCase(),
          }));
          setFamily(data);
          setMembers(enriched);
        } else {
          console.error('Backend error:', data.message);
        }
      } catch (err) {
        console.error('Network error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamily();
  }, [navigate]);

  const handlePrint = () => {
    setPrinted(true);
    setTimeout(() => { window.print(); setPrinted(false); }, 100);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-egg flex items-center justify-center">
      <p className="font-display font-black text-sm uppercase tracking-widest text-midnight animate-pulse">
        Loading Emergency Info...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-egg text-midnight">
      <Navbar variant='auth' />

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page Header ── */}
        <div className="flex items-end justify-between mb-10 mt-17 flex-wrap gap-4">
          <div>
            {/* 🆘 badge */}
            <div className="inline-flex items-center gap-2 bg-coral text-white px-3 py-1 rounded-full mb-3">
              <span className="text-xs font-black uppercase tracking-widest">🆘 Emergency Info</span>
            </div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight leading-none">
              {family?.familyName ?? 'Family'} Health Cards
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Quick-access medical information for all family members
            </p>
          </div>

          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm print:hidden
              ${printed ? 'bg-olive text-egg' : 'bg-midnight text-egg hover:bg-olive-dark'}`}
          >
            🖨️ Print / Save PDF
          </button>
        </div>

        {/* ── Cards Grid ── */}
        {members.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic">No family members found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member, idx) => (
              <EmergencyCard
                key={member._id ?? idx}
                member={member}
                accentClass={MEMBER_ACCENTS[idx % MEMBER_ACCENTS.length]}
              />
            ))}
          </div>
        )}

        {/* ── Footer disclaimer ── */}
        <p className="text-center text-xs text-gray-400 mt-10 italic">
          Always verify medical information with a licensed professional before treatment.
        </p>
      </main>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────
// Emergency Card
// ─────────────────────────────────────────
function EmergencyCard({ member, accentClass }) {
  const blood    = BLOOD_COLORS[member.bloodType] ?? BLOOD_COLORS['O+'];
  const hasMeds  = member.maintenanceMeds?.length > 0;
  const hasAllergies  = member.allergies?.length > 0;
  const hasConditions = member.medicalConditions?.length > 0;

  return (
    <div className="bg-white rounded-[24px] border border-olive-light shadow-sm overflow-hidden print:break-inside-avoid">

      {/* Colored top stripe + name row */}
      <div className={`${accentClass} px-6 pt-5 pb-4`}>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-black text-white text-lg">{member.initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-white text-lg leading-tight truncate">{member.name}</p>
            <p className="text-white/80 text-sm font-medium">
              {member.age !== '—' ? `${member.age} yrs old` : 'Age unknown'}
            </p>
          </div>
          {/* Blood type badge */}
          <div className={`${blood.bg} ${blood.text} border ${blood.border} px-3 py-1.5 rounded-xl flex-shrink-0`}>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">Blood</p>
            <p className="font-display font-black text-lg leading-none">{member.bloodType ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-5 space-y-4">

        {/* Allergies */}
        <InfoRow
          icon="⚠️"
          label="Allergies"
          empty={!hasAllergies}
          emptyText="No known allergies"
        >
          <div className="flex flex-wrap gap-1.5 mt-1">
            {member.allergies.map((a, i) => (
              <span key={i} className="bg-coral-light text-coral-dark text-xs font-bold px-2.5 py-1 rounded-full border border-coral/20">
                {a}
              </span>
            ))}
          </div>
        </InfoRow>

        {/* Medical Conditions */}
        <InfoRow
          icon="🩺"
          label="Medical Conditions"
          empty={!hasConditions}
          emptyText="No known conditions"
        >
          <div className="flex flex-wrap gap-1.5 mt-1">
            {member.medicalConditions.map((c, i) => (
              <span key={i} className="bg-jasmine-light text-jasmine-dark text-xs font-bold px-2.5 py-1 rounded-full border border-jasmine/30">
                {c}
              </span>
            ))}
          </div>
        </InfoRow>

        {/* Maintenance Meds */}
        <InfoRow
          icon="💊"
          label="Maintenance Meds"
          empty={!hasMeds}
          emptyText="No maintenance medications"
        >
          <div className="space-y-2 mt-1">
            {member.maintenanceMeds.map((med, i) => (
              <div key={i} className="bg-egg rounded-xl px-3 py-2.5 border border-olive-light">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm leading-tight">{med.name}</p>
                  {med.notes && med.notes !== 'As prescribed' && (
                    <p className="text-[11px] text-gray-400 text-right leading-tight">{med.notes}</p>
                  )}
                </div>

                {/* Schedule */}
                {(med.days?.length > 0 || med.time?.length > 0) && (
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {med.days?.length > 0 && (
                      <div className="flex gap-1">
                        {['mon','tue','wed','thu','fri','sat','sun'].map(d => (
                          <span key={d}
                            className={`text-[9px] font-black uppercase w-5 h-5 rounded-full flex items-center justify-center
                              ${med.days.includes(d)
                                ? 'bg-olive text-egg'
                                : 'bg-olive-light text-olive/40'}`}>
                            {d[0]}
                          </span>
                        ))}
                      </div>
                    )}
                    {med.time?.length > 0 && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        {med.time.join(', ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </InfoRow>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Info Row
// ─────────────────────────────────────────
function InfoRow({ icon, label, empty, emptyText, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{icon}</span>
        <p className="font-display font-black text-[10px] uppercase tracking-widest text-gray-400">{label}</p>
      </div>
      {empty
        ? <p className="text-sm text-gray-300 italic pl-1">{emptyText}</p>
        : children
      }
    </div>
  );
}