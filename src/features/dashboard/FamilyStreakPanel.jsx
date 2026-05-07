import { useEffect, useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router";
import { toPHDate, getMonday, formatLocalDate } from "../../hooks/utils";

const STREAK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const getLoggedDays = (logs, weekStart, familyMembers) => {
  if (!weekStart || isNaN(new Date(weekStart)) || !familyMembers?.length) return [];

  // Get the Monday of the requested week
  const monday = getMonday(new Date(weekStart));
  
  // Map to simple YYYY-MM-DD strings for the 7 days of that week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0]; // Format: "2023-10-27"
  });

  const memberCount = familyMembers.length;
  const loggedDaysIndices = [];

  // Check each day of the week
  weekDates.forEach((dateString, index) => {
    const membersLogged = new Set();

    logs?.forEach((log) => {
      if (!log.date || !log.userId) return;
      
      // Normalize log date to YYYY-MM-DD
      const logDateString = new Date(log.date).toISOString().split('T')[0];

      if (logDateString === dateString) {
        membersLogged.add(log.userId._id.toString());
      }
    });

    // Mark as complete if all members are present
    if (membersLogged.size >= memberCount) {
      loggedDaysIndices.push(index);
    }
  });

  console.log(loggedDaysIndices)

  return loggedDaysIndices;
};

export const FamilyStreakPanel = ({ members }) => {
  const { getFamilyLogs, getFamilyStreak, getFamilyMembers, error, isLoading} = useApi();
  const [familyStreak, setFamilyStreak] = useState(0);
  const [memberStreaks, setMemberStreaks] = useState({});
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
      const [streakData, logsData, members] = await Promise.all([
        getFamilyStreak(parsedUser.familyCode),
        getFamilyLogs(parsedUser.familyCode, {weekStart, weekEnd}),
        getFamilyMembers({ familyCode: parsedUser.familyCode, token })
      ]);

      let streaks = {}
      members.map(m => {
        streaks[m.name] = m.streak;
      })

      // console.log(logsData);

      setFamilyStreak(streakData.familyStreak);
      setLoggedDays(getLoggedDays(logsData, weekStart, members))
      setMemberStreaks(streaks);
    }
    fetchFamilyStreak();

  }, [navigate])

  return (
    <div className="flex flex-col gap-6">
      {/* Global Streak Header */}
      <div className="flex justify-between items-center bg-olive-light/30 p-4 rounded-2xl border border-olive-light">
        <div>
          <p className="font-display font-black text-2xl text-midnight tracking-tight">
            🔥 {familyStreak} {familyStreak != 1 ? 'DAYS' : 'DAY'}
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
            const progress = Math.min(100, ((memberStreaks[m.name] || 0) / 14) * 100);
            
            return (
              <div key={m._id} className="flex items-center gap-4">
                <Avatar initial={m.initial} type={m.avatar} size="size-8" />
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="font-display font-black text-[13px]">
                      {m.name}
                    </span>
                    <span className="text-[10px] font-bold text-coral">
                      {memberStreaks[m.name] || 0}d 🔥
                    </span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="h-1.5 w-full bg-egg rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (memberStreaks[m.name] || 0) >= 7 ? "bg-olive" : "bg-jasmine"
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
          "Every log counts! The family streak only grows when everyone participates. 
          Check in now to build your progress together."
        </p>
      </div>
    </div>
  );
};