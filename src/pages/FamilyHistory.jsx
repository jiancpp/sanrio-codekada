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
import { Avatar } from '../components/ui/Avatar';
import { useApi } from '../hooks/useApi';
import { BiColor } from 'react-icons/bi';

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function HealthHistory() {
  const navigate = useNavigate();
  const { getFamilyMembers, getUserLogs } = useApi();

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

/* ── Fetch members on mount ── */
  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token  = localStorage.getItem('token') || sessionStorage.getItem('token');
 
    if (!stored) { navigate('/login'); return; }
 
    const { familyCode } = JSON.parse(stored);
 
    const load = async () => {
      const raw = await getFamilyMembers({ familyCode, token });
 
      if (!raw || raw.length === 0) {
        setIsLoadingMembers(false);
        return;
      }
 
      const enriched = raw.map(m => ({
        ...m,
        initial: m.name.slice(0, 2).toUpperCase(),
        age:     getAge(new Date(m.birthdate)) || 'N/A',
      }));
 
      setMembers(enriched);
      setSelectedMember(enriched[0]);
      setMemberIndex(0);
      setIsLoadingMembers(false);
    };
 
    load();
  }, [navigate]);
 
  /* ── Fetch logs whenever selected member changes ── */
  useEffect(() => {
    if (!selectedMember) return;
 
    const load = async () => {
      setIsLoadingLogs(true);
 
      const data = await getUserLogs(selectedMember._id);
 
      if (Array.isArray(data)) {
        setLogs([...data].sort((a, b) => new Date(b.date) - new Date(a.date)));
      } else {
        setLogs([]);
      }
 
      setIsLoadingLogs(false);
    };
 
    load();
  }, [selectedMember]); 

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

  const av = selectedMember?.avatar || 'olive';

  if (isLoadingMembers || isLoadingLogs) return (
    <div className="min-h-screen bg-egg flex items-center justify-center">
      <p className="font-display font-black text-sm uppercase tracking-widest text-midnight animate-pulse">
        Loading History...
      </p>
    </div>
  );

  return selectedMember? (
    <div className="min-h-screen bg-egg text-midnight">
      <Navbar variant="auth" />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* ── PAGE HEADER ── */}
        <header className="mx-auto pb-8">
          <h1 className="font-display font-black text-3xl tracking-tight mb-1">📑 Health History</h1>
          <p className="text-sm text-gray-400">A full archive of your family's daily logs</p>
        </header>

        <main className="max-w-6xl mx-auto pb-24 space-y-5">

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
                    <Avatar
                      initial={selectedMember.initial}
                      type={selectedMember.avatar || 'olive'}
                      size="w-16 h-16 text-xl shadow-lg !rounded-2xl"
                    />
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
          )
          }
        </main>
      </div>

      <Footer />
    </div>
  ): <div className="py-20 text-center">Loading family members...</div>;
}