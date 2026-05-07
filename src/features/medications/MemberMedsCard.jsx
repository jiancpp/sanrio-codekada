import NudgeButton from "../../components/ui/NudgeButton";
import StatusBadge from "../../components/ui/StatusBadge";
import { Avatar } from '../../components/ui/Avatar';
import { timeStatus, toMinutes } from "../../hooks/utils";

const statusCls = {
  taken:    { badge: "bg-olive-light text-olive-dark border border-sage",         dot: "bg-olive",        icon: "✓",  label: "Taken"    },
  soon:     { badge: "bg-jasmine-light text-jasmine-dark border border-jasmine",  dot: "bg-jasmine",      icon: "⏰", label: "Soon"     },
  overdue:  { badge: "bg-coral-light text-coral-dark border border-coral",         dot: "bg-coral",        icon: "!",  label: "Overdue"  },
  upcoming: { badge: "bg-[#F0EDE6] text-[#999] border border-[#D8D4C8]",          dot: "bg-[#D8D4C8]",    icon: "◷", label: "Upcoming" },
};

export default function MemberMedsCard({ member, onNudge }) {
  const taken   = member.medsTaken.filter((m) => m.status).length;
  const total   = member.medsTaken.length;
  const pct     = total ? Math.round((taken / total) * 100) : 0;
  const allDone = taken === total;

  const sorted = [...member.medsTaken]
    .map((med, i) => ({ ...med, _i: i, status: timeStatus(med.time, med.status) }))
    .sort((a, b) => toMinutes(a.time) - toMinutes(b.time));

  return (
    <div className="bg-white rounded-2xl border border-olive-light overflow-hidden">

      {/* Member header */}
      <div className={`px-5 py-4 flex items-center gap-3 border-b border-olive-light ${allDone ? "bg-olive-light" : "bg-egg"}`}>
        <Avatar initial={member.initial} type={member.type} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-black text-[15px] text-midnight">{member.name}</h3>
            {allDone && (
              <span className="bg-olive text-egg text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                All done ✓
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{taken}/{total} medications taken today</p>
        </div>

        {/* Progress ring */}
        <div className="relative w-9 h-9 flex-shrink-0">
          <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#EAF0EB" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke="#738A77" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${pct * 0.879} 87.96`}
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display font-black text-[9px] text-midnight">
            {pct}%
          </span>
        </div>
      </div>

      {/* Meds list */}
      <div className="px-5 py-1.5">
        {member.medsTaken.length === 0 && (
          <p className="text-sm text-gray-300 py-3">No medications scheduled.</p>
        )}
        {sorted.map((med, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 py-3 
              ${i < sorted.length - 1 ? "border-b border-olive-light" : ""}
              ${med.status === "taken" ? "opacity-55" : ""}`}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCls[med.status].dot}`} />

            <div className="flex-1 min-w-0">
              <p className={`font-display font-black text-[13px] text-midnight truncate ${med.status === "taken" ? "line-through" : ""}`}>
                {med.name}
              </p>
              <p className="text-[11px] text-gray-400">{med.time} · {med.note}</p>
            </div>

            <StatusBadge status={med.status} />
            {med.status !== "taken" && (
              <NudgeButton memberName={member.name} medName={med.name} onNudge={onNudge} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}