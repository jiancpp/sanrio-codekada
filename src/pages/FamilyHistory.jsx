import { useEffect, useState, useMemo } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../hooks/constants';
import { getAge, isSameDay } from '../hooks/utils';
import { VitalChip, MedBadge } from '../components/ui/HealthChips';
import { LogCard } from '../features/history/LogCard';
import { MemberTabs } from '../features/history/MemberTabs';
import { FilterBar } from '../features/history/FilterBar';
import { StatCard } from '../components/ui/StatCard';
import { useApi } from '../hooks/useApi';

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ══════════════════════════════════════════════
   AVATAR COLOR CYCLING
══════════════════════════════════════════════ */
const AVATAR_STYLES = [
  { bg: 'bg-midnight', text: 'text-jasmine' },
  { bg: 'bg-olive', text: 'text-egg' },
  { bg: 'bg-coral', text: 'text-egg' },
  { bg: 'bg-mauve', text: 'text-jasmine' },
  { bg: 'bg-jasmine', text: 'text-midnight' },
  { bg: 'bg-olive-dark', text: 'text-egg' },
];
const avatarStyle = (i) => AVATAR_STYLES[i % AVATAR_STYLES.length];

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function HealthHistory() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberIndex, setMemberIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [specificDate, setSpecificDate] = useState('');

  const hasFilters = year || month !== '' || specificDate;
  const clearFilters = () => { setYear(''); setMonth(''); setSpecificDate(''); };

  // Mock members — replace the fetchMembers useEffect body
  useEffect(() => {
    const enriched = MOCK_MEMBERS.map(m => ({
      ...m,
      initial: m.name.slice(0, 2).toUpperCase(),
      age: getAge(new Date(m.birthdate)) || 'N/A',
    }));
    setMembers(enriched);
    setSelectedMember(enriched[0]);
    setMemberIndex(0);
    setIsLoadingMembers(false);
  }, []);

  // Mock logs — replace the fetchLogs useEffect body
  useEffect(() => {
    if (!selectedMember) return;
    setIsLoadingLogs(true);
    setTimeout(() => {
      const memberLogs = MOCK_LOGS
        .filter(l => l.userId === selectedMember._id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(memberLogs);
      setIsLoadingLogs(false);
    }, 400); // fake loading delay so the skeleton shows
  }, [selectedMember]);

  // /* ── Fetch members ── */
  // useEffect(() => {
  //   const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
  //   const token  = localStorage.getItem('token') || sessionStorage.getItem('token');
  //   if (!stored) { navigate('/login'); return; }

  //   const parsedUser = JSON.parse(stored);

  //   const fetchMembers = async () => {
  //     try {
  //       const res  = await fetch(`${BASE_URL}/family/get/${parsedUser.familyCode}`, {
  //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  //       });
  //       const data = await res.json();
  //       if (res.ok) {
  //         const enriched = data.members.map(m => ({
  //           ...m,
  //           initial: m.name.slice(0, 2).toUpperCase(),
  //           age: getAge(new Date(m.birthdate)) || 'N/A',
  //         }));
  //         setMembers(enriched);
  //         setSelectedMember(enriched[0]);
  //         setMemberIndex(0);
  //       }
  //     } catch (e) { console.error(e); }
  //     finally { setIsLoadingMembers(false); }
  //   };
  //   fetchMembers();
  // }, [navigate]);

  // /* ── Fetch logs on member change ── */
  // useEffect(() => {
  //   if (!selectedMember) return;
  //   const fetchLogs = async () => {
  //     setIsLoadingLogs(true);
  //     try {
  //       const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  //       const res   = await fetch(`${BASE_URL}/daily-log/all/${selectedMember._id}`, {
  //         headers: { 'Authorization': `Bearer ${token}` }
  //       });
  //       const data = await res.json();
  //       if (res.ok) setLogs(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  //     } catch (e) { console.error(e); }
  //     finally { setIsLoadingLogs(false); }
  //   };
  //   fetchLogs();
  // }, [selectedMember]);

  /* ── Filter ── */
  const filteredLogs = useMemo(() => logs.filter(log => {
    const d = new Date(log.date);
    if (specificDate) return isSameDay(log.date, specificDate);
    if (year && d.getFullYear() !== Number(year)) return false;
    if (month !== '' && d.getMonth() !== Number(month)) return false;
    return true;
  }), [logs, year, month, specificDate]);

  /* ── Group by month ── */
  const grouped = useMemo(() => {
    const g = {};
    filteredLogs.forEach(log => {
      const d = new Date(log.date);
      const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      if (!g[key]) g[key] = [];
      g[key].push(log);
    });
    return g;
  }, [filteredLogs]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    if (!logs.length) return null;
    const now = new Date();
    const thisMonth = logs.filter(l => {
      const d = new Date(l.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    let streak = 0;
    for (let i = 0; i < logs.length; i++) {
      const expected = new Date(logs[0].date);
      expected.setDate(expected.getDate() - i);
      if (isSameDay(logs[i].date, expected)) streak++;
      else break;
    }
    return { total: logs.length, thisMonth: thisMonth.length, streak };
  }, [logs]);

  const av = avatarStyle(memberIndex);

  return (
    <div className="min-h-screen bg-egg text-midnight">
      <Navbar variant="auth" />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* ── PAGE HEADER ── */}
        <header className="max-w-6xl mx-auto px-6 pt-28 pb-8">
          <h1 className="font-display font-black text-4xl tracking-tight text-midnight">Health History</h1>
          <p className="text-mauve text-sm mt-1">A full archive of your family's daily logs</p>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-24 space-y-5">

          {/* ── MEMBER TABS ── */}
          {isLoadingMembers ? (
            <div className="flex gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-28 h-10 rounded-full bg-olive-light/60 animate-pulse" />
              ))}
            </div>
          ) : (
            <MemberTabs
              members={members}
              selected={selectedMember}
              onSelect={(m, i) => { setSelectedMember(m); setMemberIndex(members.indexOf(m)); clearFilters(); }}
            />
          )}

          {selectedMember && (
            <>
              {/* ── MEMBER HERO CARD ── */}
              <div className="relative bg-midnight rounded-[2rem] overflow-hidden px-8 py-7">
                {/* Decorative blobs */}
                <div className={`absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none ${av.bg}`} />
                <div className="absolute bottom-0 left-1/3 w-80 h-20 rounded-full opacity-10 blur-3xl bg-jasmine pointer-events-none" />

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                  {/* Identity */}
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-lg shadow-lg ${av.bg} ${av.text}`}>
                      {selectedMember.initial}
                    </div>
                    <div>
                      <p className="font-display font-black text-2xl text-egg">{selectedMember.name}</p>
                      <p className="text-sage text-sm">{selectedMember.age} years old</p>
                    </div>
                  </div>

                  {/* Stats */}
                  {stats ? (
                    <div className="flex gap-3 flex-wrap">
                      <StatCard label="Total Logs" value={stats.total}
                        palette={{ bg: 'bg-white/8', border: 'border-white/10', val: 'text-egg' }} />
                      <StatCard label="This Month" value={stats.thisMonth}
                        palette={{ bg: 'bg-olive/20', border: 'border-olive/30', val: 'text-sage' }} />
                      <StatCard label="Streak" value={`🔥 ${stats.streak}d`}
                        palette={{ bg: 'bg-jasmine/15', border: 'border-jasmine/20', val: 'text-jasmine' }} />
                    </div>
                  ) : (
                    <p className="text-sage text-sm">No logs yet.</p>
                  )}
                </div>
              </div>

              {/* ── FILTER BAR ── */}
              <div className="bg-white rounded-[1.5rem] border border-olive-light px-6 py-5 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 mb-4">Filter Logs</p>
                <FilterBar
                  year={year} month={month} specificDate={specificDate}
                  onYearChange={setYear} onMonthChange={setMonth} onDateChange={setSpecificDate}
                  onClear={clearFilters} hasFilters={hasFilters}
                />
                {hasFilters && (
                  <p className="text-xs text-mauve mt-3">
                    Showing <span className="font-bold text-midnight">{filteredLogs.length}</span> {filteredLogs.length === 1 ? 'entry' : 'entries'}
                  </p>
                )}
              </div>

              {/* ── LOGS ── */}
              {isLoadingLogs ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[72px] rounded-[1.5rem] bg-white border border-olive-light animate-pulse"
                      style={{ opacity: 1 - i * 0.15 }} />
                  ))}
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="bg-white rounded-[1.5rem] border border-olive-light px-6 py-20 text-center shadow-sm">
                  <div className="w-16 h-16 bg-olive-light rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">📭</div>
                  <p className="font-display font-black text-xl text-midnight mb-2">No logs found</p>
                  <p className="text-sm text-mauve max-w-xs mx-auto">
                    {hasFilters
                      ? 'Try a different date range or clear your filters.'
                      : `${selectedMember.name} hasn't logged any health data yet.`}
                  </p>
                  {hasFilters && (
                    <button onClick={clearFilters}
                      className="mt-5 px-6 py-2.5 bg-midnight text-egg rounded-full font-bold text-sm hover:bg-mauve transition-all shadow-sm">
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-10">
                  {Object.entries(grouped).map(([monthYear, monthLogs]) => (
                    <div key={monthYear}>
                      {/* Month divider */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <p className="font-display font-black text-base text-midnight leading-none">{monthYear}</p>
                          <p className="text-[10px] font-bold text-mauve/60 mt-0.5">
                            {monthLogs.length} {monthLogs.length === 1 ? 'entry' : 'entries'}
                          </p>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-olive-light to-transparent" />
                      </div>

                      <div className="space-y-3">
                        {monthLogs.map((log, i) => <LogCard key={log._id} log={log} index={i} />)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════════ */

export const MOCK_MEMBERS = [
  {
    _id: 'member-001',
    name: 'Mama',
    birthdate: '1967-03-14',
    familyCode: 'PUSO-847',
  },
  {
    _id: 'member-002',
    name: 'Papa',
    birthdate: '1963-11-02',
    familyCode: 'PUSO-847',
  },
  {
    _id: 'member-003',
    name: 'Kuya Andrei',
    birthdate: '1995-07-21',
    familyCode: 'PUSO-847',
  },
  {
    _id: 'member-004',
    name: 'Shielo',
    birthdate: '1999-01-08',
    familyCode: 'PUSO-847',
  },
];

export const MOCK_LOGS = [

  /* ─── MAMA (member-001) ─── */
  {
    _id: 'log-001', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-05-07T08:00:00.000Z',
    vitals: { weight: 63, bloodPressure: '122/80', heartRate: 74, bloodSugarLevel: 101 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: true },
      { name: 'Metformin 500mg', time: '8:00 AM', status: true },
    ],
    waterIntake: 1800,
    notes: 'Feeling good today. Took meds right after breakfast.',
    proofImage: null,
  },
  {
    _id: 'log-002', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-05-06T08:15:00.000Z',
    vitals: { weight: 63, bloodPressure: '128/84', heartRate: 78, bloodSugarLevel: 109 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: true },
      { name: 'Metformin 500mg', time: '8:00 AM', status: false },
    ],
    waterIntake: 1400,
    notes: 'Forgot evening Metformin. A bit tired.',
    proofImage: null,
  },
  {
    _id: 'log-003', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-05-05T07:45:00.000Z',
    vitals: { weight: 62.5, bloodPressure: '120/78', heartRate: 72, bloodSugarLevel: 98 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: true },
      { name: 'Metformin 500mg', time: '8:00 AM', status: true },
    ],
    waterIntake: 2000,
    notes: null,
    proofImage: null,
  },
  {
    _id: 'log-004', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-05-03T09:00:00.000Z',
    vitals: { weight: 63, bloodPressure: '130/86', heartRate: 80, bloodSugarLevel: 115 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: true },
      { name: 'Metformin 500mg', time: '8:00 AM', status: false },
    ],
    waterIntake: 1200,
    notes: 'Blood pressure slightly high. Stressed from cooking for the reunion.',
    proofImage: null,
  },
  {
    _id: 'log-005', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-04-30T08:00:00.000Z',
    vitals: { weight: 63.5, bloodPressure: '118/76', heartRate: 70, bloodSugarLevel: 96 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: true },
      { name: 'Metformin 500mg', time: '8:00 AM', status: true },
    ],
    waterIntake: 2200,
    notes: 'Best numbers this month!',
    proofImage: null,
  },
  {
    _id: 'log-006', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-04-22T08:30:00.000Z',
    vitals: { weight: 64, bloodPressure: '124/82', heartRate: 76, bloodSugarLevel: 104 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: true },
      { name: 'Metformin 500mg', time: '8:00 AM', status: true },
    ],
    waterIntake: 1600,
    notes: null,
    proofImage: null,
  },
  {
    _id: 'log-007', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-04-15T07:55:00.000Z',
    vitals: { weight: 64, bloodPressure: '126/82', heartRate: 75, bloodSugarLevel: 108 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: true },
      { name: 'Metformin 500mg', time: '8:00 AM', status: false },
    ],
    waterIntake: 1500,
    notes: 'Skipped metformin — ran out. Need to refill.',
    proofImage: null,
  },
  {
    _id: 'log-008', userId: 'member-001', familyCode: 'PUSO-847',
    date: '2026-03-28T08:10:00.000Z',
    vitals: { weight: 64.5, bloodPressure: '132/88', heartRate: 82, bloodSugarLevel: 120 },
    medsTaken: [
      { name: 'Amlodipine 5mg', time: '8:00 AM', status: false },
      { name: 'Metformin 500mg', time: '8:00 AM', status: false },
    ],
    waterIntake: 900,
    notes: 'Sick today. Fever and headache. Did not take meds.',
    proofImage: null,
  },

  /* ─── PAPA (member-002) ─── */
  {
    _id: 'log-009', userId: 'member-002', familyCode: 'PUSO-847',
    date: '2026-05-07T07:30:00.000Z',
    vitals: { weight: 79, bloodPressure: '138/90', heartRate: 82, bloodSugarLevel: 118 },
    medsTaken: [
      { name: 'Losartan 50mg', time: '7:30 AM', status: false },
      { name: 'Atorvastatin 20mg', time: '9:00 PM', status: false },
    ],
    waterIntake: 800,
    notes: null,
    proofImage: null,
  },
  {
    _id: 'log-010', userId: 'member-002', familyCode: 'PUSO-847',
    date: '2026-05-06T07:45:00.000Z',
    vitals: { weight: 79, bloodPressure: '135/88', heartRate: 80, bloodSugarLevel: 112 },
    medsTaken: [
      { name: 'Losartan 50mg', time: '7:30 AM', status: true },
      { name: 'Atorvastatin 20mg', time: '9:00 PM', status: false },
    ],
    waterIntake: 1200,
    notes: 'Forgot evening meds again.',
    proofImage: null,
  },
  {
    _id: 'log-011', userId: 'member-002', familyCode: 'PUSO-847',
    date: '2026-05-05T08:00:00.000Z',
    vitals: { weight: 78.5, bloodPressure: '130/86', heartRate: 78, bloodSugarLevel: 108 },
    medsTaken: [
      { name: 'Losartan 50mg', time: '7:30 AM', status: true },
      { name: 'Atorvastatin 20mg', time: '9:00 PM', status: true },
    ],
    waterIntake: 1600,
    notes: 'Good day. Went for a 20 min walk.',
    proofImage: null,
  },
  {
    _id: 'log-012', userId: 'member-002', familyCode: 'PUSO-847',
    date: '2026-04-29T07:55:00.000Z',
    vitals: { weight: 80, bloodPressure: '142/92', heartRate: 85, bloodSugarLevel: 125 },
    medsTaken: [
      { name: 'Losartan 50mg', time: '7:30 AM', status: false },
      { name: 'Atorvastatin 20mg', time: '9:00 PM', status: false },
    ],
    waterIntake: 700,
    notes: 'High BP again. Ate a lot of salty food at the birthday party.',
    proofImage: null,
  },
  {
    _id: 'log-013', userId: 'member-002', familyCode: 'PUSO-847',
    date: '2026-04-10T08:00:00.000Z',
    vitals: { weight: 79.5, bloodPressure: '133/87', heartRate: 79, bloodSugarLevel: 114 },
    medsTaken: [
      { name: 'Losartan 50mg', time: '7:30 AM', status: true },
      { name: 'Atorvastatin 20mg', time: '9:00 PM', status: true },
    ],
    waterIntake: 1400,
    notes: null,
    proofImage: null,
  },

  /* ─── KUYA ANDREI (member-003) ─── */
  {
    _id: 'log-014', userId: 'member-003', familyCode: 'PUSO-847',
    date: '2026-05-07T06:00:00.000Z',
    vitals: { weight: 74, bloodPressure: '118/76', heartRate: 64, bloodSugarLevel: 88 },
    medsTaken: [
      { name: 'Vitamin D 1000IU', time: '7:00 AM', status: true },
    ],
    waterIntake: 2500,
    notes: 'Morning gym session. Feeling great.',
    proofImage: null,
  },
  {
    _id: 'log-015', userId: 'member-003', familyCode: 'PUSO-847',
    date: '2026-05-06T06:15:00.000Z',
    vitals: { weight: 74, bloodPressure: '120/78', heartRate: 66, bloodSugarLevel: 90 },
    medsTaken: [
      { name: 'Vitamin D 1000IU', time: '7:00 AM', status: true },
    ],
    waterIntake: 3000,
    notes: null,
    proofImage: null,
  },
  {
    _id: 'log-016', userId: 'member-003', familyCode: 'PUSO-847',
    date: '2026-05-05T06:30:00.000Z',
    vitals: { weight: 73.8, bloodPressure: '116/74', heartRate: 62, bloodSugarLevel: 86 },
    medsTaken: [
      { name: 'Vitamin D 1000IU', time: '7:00 AM', status: true },
    ],
    waterIntake: 2800,
    notes: 'Rest day. Watched a movie.',
    proofImage: null,
  },
  {
    _id: 'log-017', userId: 'member-003', familyCode: 'PUSO-847',
    date: '2026-05-04T06:00:00.000Z',
    vitals: { weight: 74.2, bloodPressure: '119/77', heartRate: 65, bloodSugarLevel: 89 },
    medsTaken: [
      { name: 'Vitamin D 1000IU', time: '7:00 AM', status: false },
    ],
    waterIntake: 2000,
    notes: 'Ran out of vitamins. Will order today.',
    proofImage: null,
  },
  {
    _id: 'log-018', userId: 'member-003', familyCode: 'PUSO-847',
    date: '2026-04-30T06:00:00.000Z',
    vitals: { weight: 74, bloodPressure: '117/75', heartRate: 63, bloodSugarLevel: 87 },
    medsTaken: [
      { name: 'Vitamin D 1000IU', time: '7:00 AM', status: true },
    ],
    waterIntake: 2600,
    notes: null,
    proofImage: null,
  },
  {
    _id: 'log-019', userId: 'member-003', familyCode: 'PUSO-847',
    date: '2026-04-18T06:00:00.000Z',
    vitals: { weight: 75, bloodPressure: '122/80', heartRate: 68, bloodSugarLevel: 92 },
    medsTaken: [
      { name: 'Vitamin D 1000IU', time: '7:00 AM', status: true },
    ],
    waterIntake: 2200,
    notes: 'Long shift at work. A bit tired.',
    proofImage: null,
  },
  {
    _id: 'log-020', userId: 'member-003', familyCode: 'PUSO-847',
    date: '2026-03-15T06:00:00.000Z',
    vitals: { weight: 75.5, bloodPressure: '121/79', heartRate: 67, bloodSugarLevel: 91 },
    medsTaken: [
      { name: 'Vitamin D 1000IU', time: '7:00 AM', status: true },
    ],
    waterIntake: 2400,
    notes: null,
    proofImage: null,
  },

  /* ─── SHIELO (member-004) ─── */
  {
    _id: 'log-021', userId: 'member-004', familyCode: 'PUSO-847',
    date: '2026-05-07T09:00:00.000Z',
    vitals: { weight: 52, bloodPressure: '110/70', heartRate: 88, bloodSugarLevel: null },
    medsTaken: [
      { name: 'Ferrous Sulfate 325mg', time: '8:00 AM', status: false },
    ],
    waterIntake: 1000,
    notes: 'Forgot to take iron supplement again. Felt dizzy after lunch.',
    proofImage: null,
  },
  {
    _id: 'log-022', userId: 'member-004', familyCode: 'PUSO-847',
    date: '2026-05-05T09:30:00.000Z',
    vitals: { weight: 52, bloodPressure: '108/68', heartRate: 90, bloodSugarLevel: null },
    medsTaken: [
      { name: 'Ferrous Sulfate 325mg', time: '8:00 AM', status: true },
    ],
    waterIntake: 1500,
    notes: 'Took it with orange juice this time. No nausea.',
    proofImage: null,
  },
  {
    _id: 'log-023', userId: 'member-004', familyCode: 'PUSO-847',
    date: '2026-05-02T08:45:00.000Z',
    vitals: { weight: 51.8, bloodPressure: '112/72', heartRate: 86, bloodSugarLevel: null },
    medsTaken: [
      { name: 'Ferrous Sulfate 325mg', time: '8:00 AM', status: true },
    ],
    waterIntake: 1800,
    notes: null,
    proofImage: null,
  },
  {
    _id: 'log-024', userId: 'member-004', familyCode: 'PUSO-847',
    date: '2026-04-28T09:00:00.000Z',
    vitals: { weight: 52.5, bloodPressure: '114/73', heartRate: 84, bloodSugarLevel: null },
    medsTaken: [
      { name: 'Ferrous Sulfate 325mg', time: '8:00 AM', status: false },
    ],
    waterIntake: 1100,
    notes: 'Skipped. Was running late for class.',
    proofImage: null,
  },
  {
    _id: 'log-025', userId: 'member-004', familyCode: 'PUSO-847',
    date: '2026-04-20T09:15:00.000Z',
    vitals: { weight: 52.2, bloodPressure: '111/71', heartRate: 87, bloodSugarLevel: null },
    medsTaken: [
      { name: 'Ferrous Sulfate 325mg', time: '8:00 AM', status: true },
    ],
    waterIntake: 1600,
    notes: 'Feeling better lately. Energy is up.',
    proofImage: null,
  },
];