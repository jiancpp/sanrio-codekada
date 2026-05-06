import { useEffect, useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router";
import { toPHDate, getMonday, formatLocalDate } from "../../hooks/utils";

const STREAK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const getLoggedDays = (logs, weekStart) => {
  if (!weekStart || isNaN(new Date(weekStart))) return [];

  const monday = getMonday(weekStart);
  const loggedDays = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);

    const dateString = formatLocalDate(currentDay);
    const hasLog = logs?.some(log => {
      const rawDate = log.createdAt;
      if (!rawDate) return false;

      const logDate = toPHDate(rawDate);
      return logDate === dateString;
    });

    if (hasLog) {
      loggedDays.push(i); // Monday = 0
    }
  }

  return loggedDays;
};

export const FamilyStreakPanel = ({ members }) => {
  const { getFamilyLogs, getFamilyStreak, error, isLoading} = useApi();
  const [familyStreak, setFamilyStreak] = useState(0);
  // const [familyLogs, setFamilyLogs] = useState([]);
  const [loggedDays, setLoggedDays] = useState([])
  const navigate = useNavigate()
  
  const now = new Date();

  // Monday-based index (Mon=0)
  const today = now.getDay();
  const dayIdx = today === 0 ? 6 : today - 1;
  
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayIdx);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999); 
  
  useEffect(() => {
    const storedUserString = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!storedUserString) {
      navigate('/login');
    }
    const parsedUser = JSON.parse(storedUserString);
    const fetchFamilyStreak = async () => {
      const [streakData, logsData] = await Promise.all([
        getFamilyStreak(parsedUser.familyCode),
        getFamilyLogs(parsedUser.familyCode, {weekStart, weekEnd})
      ]);

      setFamilyStreak(streakData.familyStreak);
      // setFamilyLogs(logsData);
      setLoggedDays(getLoggedDays(logsData, weekStart))
    }
    fetchFamilyStreak();

  }, [navigate])

  return (
    <div className="flex flex-col gap-6">
      {/* Global Streak Header */}
      <div className="flex justify-between items-center bg-olive-light/30 p-4 rounded-2xl border border-olive-light">
        <div>
          <p className="font-display font-black text-2xl text-midnight tracking-tight">
            🔥 {familyStreak} DAYS
          </p>
          <p className="text-[10px] uppercase font-bold text-olive-dark/60 tracking-widest">
            Family Consistency
          </p>
        </div>
        <div className="size-12 rounded-full bg-olive flex items-center justify-center text-egg text-xl shadow-inner">
          ✨
        </div>
      </div>

      {/* Weekly Visualizer */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Weekly Progress
        </p>
        <div className="flex justify-between gap-1">
          {STREAK_DAYS.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`size-8 rounded-xl flex items-center justify-center font-display font-black text-xs transition-all
                ${loggedDays.includes(i)
                  ? "bg-olive text-egg" 
                  : i === dayIdx 
                    ? "bg-white border-2 border-olive text-olive shadow-sm" 
                    : "bg-egg/50 text-gray-300"}`}
              >
                {loggedDays.includes(i) ? "✓" : day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Progress Bars */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Member Streaks
        </p>
        <div className="space-y-4">
          {members.map((m) => {
            // Calculate progress percentage (mock logic: streak out of 14 days)
            const progress = Math.min(100, (m.streak / 14) * 100);
            
            return (
              <div key={m._id} className="flex items-center gap-4">
                <Avatar initial={m.initial} type={m.type} size="size-8" />
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="font-display font-black text-[13px]">
                      {m.name}
                    </span>
                    <span className="text-[10px] font-bold text-coral">
                      {m.streak}d 🔥
                    </span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="h-1.5 w-full bg-egg rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        m.streak >= 7 ? "bg-olive" : "bg-jasmine"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nudge Context Note */}
      <div className="mt-2 p-3 bg-jasmine-light/50 rounded-xl border border-jasmine/20">
        <p className="text-[11px] text-jasmine-dark leading-tight italic">
          "Your family streak is safe! Just one more log needed from **Papa** to hit 8 days."
        </p>
      </div>
    </div>
  );
};