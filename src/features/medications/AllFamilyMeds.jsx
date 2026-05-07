import NudgeButton from "../../components/ui/NudgeButton";
import StatusBadge from "../../components/ui/StatusBadge";
import { Avatar } from '../../components/ui/Avatar';
import { buildAllMeds } from "../../hooks/utils";

const statusCls = {
  taken:    { badge: "bg-olive-light text-olive-dark border border-sage",         dot: "bg-olive",        icon: "✓",  label: "Taken"    },
  soon:     { badge: "bg-jasmine-light text-jasmine-dark border border-jasmine",  dot: "bg-jasmine",      icon: "⏰", label: "Soon"     },
  overdue:  { badge: "bg-coral-light text-coral-dark border border-coral",         dot: "bg-coral",        icon: "!",  label: "Overdue"  },
  upcoming: { badge: "bg-[#F0EDE6] text-[#999] border border-[#D8D4C8]",          dot: "bg-[#D8D4C8]",    icon: "◷", label: "Upcoming" },
};

export default function AllFamilyMeds({ members, onNudge }) {
  const allMeds = buildAllMeds(members);
  const pending = allMeds.filter((m) => m.status !== "taken");
  const done    = allMeds.filter((m) => m.status === "taken");
  const pct     = allMeds.length ? (done.length / allMeds.length) * 100 : 0;

  const MedRow = ({ item, divider }) => (
    <div className={`flex items-center gap-3 py-3.5 ${divider ? "border-b border-olive-light" : ""} ${item.status === "taken" ? "opacity-55" : ""} transition-opacity duration-200`}>

      {/* Time */}
      <div className="w-14 flex-shrink-0 text-center">
        <p className="font-display font-black text-[13px] text-midnight leading-none">{item.time.split(" ")[0]}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{item.time.split(" ")[1]}</p>
      </div>

      {/* Timeline dot */}
      <div className={`w-2.5 h-2.5 rounded-full border-2 border-egg flex-shrink-0 ${statusCls[item.status].dot} ${item.status === "soon" ? "ring-2 ring-jasmine-light" : ""}`} />

      {/* Avatar */}
      <Avatar initial={item.member.initial} type={item.member.type} size="w-8 h-8 text-[10px]" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-display font-black text-sm text-midnight truncate ${item.status === "taken" ? "line-through" : ""}`}>
          {item.name}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{item.member.name} · {item.note}</p>
      </div>

      <StatusBadge status={item.status} />
      {item.status !== "taken" && (
        <NudgeButton memberName={item.member.name} medName={item.name} onNudge={onNudge} />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-olive-light overflow-hidden">

      {/* Header */}
      <div className="bg-midnight px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="font-display font-black text-[17px] text-egg tracking-tight mb-0.5">All Family Medications</h2>
          <p className="text-xs text-sage">
            Sorted by schedule time · {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="font-display font-black text-xl text-jasmine leading-none">{pending.length}</p>
            <p className="text-[10px] text-sage mt-0.5">Pending</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="font-display font-black text-xl text-olive leading-none">{done.length}</p>
            <p className="text-[10px] text-sage mt-0.5">Taken</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-olive-light">
        <div className="h-full bg-olive rounded-r-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* List */}
      <div className="px-6 pb-3">
        {pending.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">Pending</p>
            {pending.map((item, i) => (
              <MedRow key={`p-${item.member._id}-${i}`} item={item} divider={i < pending.length - 1} />
            ))}
          </>
        )}
        {done.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">Completed</p>
            {done.map((item, i) => (
              <MedRow key={`d-${item.member._id}-${i}`} item={item} divider={i < done.length - 1} />
            ))}
          </>
        )}
        {allMeds.length === 0 && (
          <p className="text-sm text-gray-300 text-center py-8">No medications scheduled for today.</p>
        )}
      </div>
    </div>
  );
}
