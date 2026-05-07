import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Toast from "../components/ui/Toast";
import AllFamilyMeds from "../features/medications/AllFamilyMeds";
import MemberMedsCard from "../features/medications/MemberMedsCard";

import { useApi } from "../hooks/useApi";
import { getAge, timeStatus, toMinutes } from "../hooks/utils";

const ACCENT_TYPES = ["olive", "jasmine", "coral", "mauve"];

const avatarCls = {
  olive:   "bg-olive-light text-olive-dark",
  jasmine: "bg-jasmine-light text-jasmine-dark",
  coral:   "bg-coral-light text-coral-dark",
  mauve:   "bg-mauve text-jasmine",
};

const TABS = [
  { key: "all",        label: "🏠 All Family Meds" },
  { key: "individual", label: "👤 By Member"        },
];

export default function FamilyMedications() {
  const [members, setMembers]           = useState([]);
  const [toasts, setToasts]             = useState([]);
  const [activeTab, setActiveTab]       = useState("all");
  const [memberFilter, setMemberFilter] = useState("All");
  const [isLoading, setIsLoading]       = useState(true);

  const navigate = useNavigate();
  const { getFamilyMembers, getFamilyLogs, remindMember } = useApi();

  // =========== Fetch & merge =========== //
  useEffect(() => {
    const storedStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token     = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!storedStr || !token) { navigate('/login'); return; }

    const parsedUser = JSON.parse(storedStr);
    const familyCode = parsedUser.familyCode ?? parsedUser.family_code;
    if (!familyCode) { navigate('/login'); return; }

    const load = async () => {
      try {
        const rawMembers = await getFamilyMembers({ familyCode, token });
        if (!rawMembers?.length) { setIsLoading(false); return; }

        const today   = new Date().toISOString().split('T')[0];
        const logsRaw = await getFamilyLogs(familyCode, { date: today });

        const logsByUser = {};
        (Array.isArray(logsRaw) ? logsRaw : []).forEach(log => {
          const uid = String(log.userId?._id ?? log.userId);
          logsByUser[uid] = log;
        });

        const todayKey = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];

        const enriched = rawMembers.map((member, idx) => {
          const memberId = String(member._id);
          const todayLog = logsByUser[memberId]; 

          const medsTaken = (member.maintenanceMeds ?? [])
            .filter(med =>
              !med.days?.length || med.days.includes(todayKey)
            )
            .flatMap(med =>
              (med.time?.length ? med.time : ['—']).map(t => {
                const logEntry = todayLog?.medsTaken?.find(
                  l => l.name === med.name && l.time === t
                );

                return {
                  name:   med.name,
                  time:   t,
                  status: logEntry?.status ?? false, // true only if log confirms taken
                  note:   med.notes ?? 'As prescribed',
                };
              })
            );

          // Sort all rows chronologically by time slot
          medsTaken.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));

          return {
            ...member,
            age:        getAge(new Date(member.birthdate)) ?? '—',
            initial:    member.name.slice(0, 2).toUpperCase(),
            type:       ACCENT_TYPES[idx % ACCENT_TYPES.length],
            loggedToday: !!todayLog,
            streak:     member.streak ?? 0,
            medsTaken,
          };
        });

        setMembers(enriched);
      } catch (err) {
        console.error('Load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [navigate]);

  // =========== Nudge =========== //
  const handleNudge = async (memberName, medName) => {
    const storedStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const sender    = JSON.parse(storedStr);
    const target    = members.find(m => m.name === memberName);

    // Don't nudge yourself
    if (!target || String(target._id) === String(sender._id ?? sender.id)) return;

    const messages = [
        `Hey ${memberName}! Don't forget to take your ${medName} 💊`,
        `Reminder: ${medName} is due! Take care 💛`,
        `Just checking in — have you taken your ${medName} yet? 🏡`,
        `Don't forget your ${medName}! Your health matters 🤍`,
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    await remindMember({
        familyCode: sender.familyCode ?? sender.family_code,
        to:         target._id,
        from:       sender._id ?? sender.id ?? null,
        message,
    });

    const id = Date.now();
    setToasts(t => [...t, { id, member: memberName, med: medName }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    };

  // =========== Derived stats =========== //
  const allMeds      = members.flatMap(m => m.medsTaken);
  const takenCount   = allMeds.filter(m => m.status).length;
  const overdueCount = allMeds.filter(m => timeStatus(m.time, m.status) === "overdue").length;

  const STATS = [
    { label: "Total Doses", value: allMeds.length,  topBorder: "border-t-midnight", textColor: "text-midnight" },
    { label: "Taken",       value: takenCount,       topBorder: "border-t-olive",    textColor: "text-olive"   },
    { label: "Overdue",     value: overdueCount,     topBorder: "border-t-coral",    textColor: "text-coral"   },
  ];

  const filteredMembers = memberFilter === "All"
    ? members
    : members.filter(m => m.name === memberFilter);

  if (isLoading) return (
    <div className="min-h-screen bg-egg flex items-center justify-center">
      <p className="font-display font-black text-sm uppercase tracking-widest text-midnight animate-pulse">
        Loading Medications...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-egg text-midnight font-body">
      <Navbar variant="auth" />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display font-black text-3xl tracking-tight mb-1">💊 Medication Schedule</h1>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            })}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS.map(({ label, value, topBorder, textColor }) => (
            <div key={label} className={`bg-white rounded-2xl px-5 py-4 border border-olive-light border-t-4 ${topBorder}`}>
              <p className="text-[11px] text-midnight-300 uppercase tracking-widest mb-1.5">{label}</p>
              <p className={`font-display font-black text-3xl ${textColor}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-white border border-olive-light rounded-2xl p-1 mb-5 gap-1">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl font-display font-black text-[13px] border-none cursor-pointer transition-all duration-200
                ${activeTab === tab.key
                  ? "bg-midnight text-egg shadow-sm"
                  : "bg-transparent text-gray-400 hover:text-mauve"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Member filter (individual tab only) */}
        {activeTab === "individual" && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-gray-400 mr-1">Filter by:</span>
            {["All", ...members.map(m => m.name)].map(name => {
              const m      = members.find(mem => mem.name === name);
              const active = memberFilter === name;
              return (
                <button key={name} onClick={() => setMemberFilter(name)}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer
                    ${active
                      ? "bg-olive text-egg border-olive"
                      : "bg-white text-mauve border-olive-light hover:border-olive"}`}>
                  {name !== "All" && m && (
                    <span className={`w-1.5 h-1.5 rounded-full inline-block
                      ${avatarCls[m.type]?.split(" ")[0] ?? "bg-olive-light"}`} />
                  )}
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {members.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic text-sm">
            No family members or medications found.
          </div>
        ) : activeTab === "all" ? (
          <AllFamilyMeds members={members} onNudge={handleNudge} />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredMembers.map(member => (
              <MemberMedsCard key={member._id} member={member} onNudge={handleNudge} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <Toast toasts={toasts} />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}