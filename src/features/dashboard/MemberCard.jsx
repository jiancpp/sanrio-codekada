import { useEffect, useState } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { DashboardCard } from './DashboardCard';
import NudgeButton from '../../components/ui/NudgeButton';

export const MemberCard = ({ member, selected, onClick, onNudge }) => {
  // const isWarning = !member.loggedToday && member.medsChecked.includes(false);
  const isWarning = !member.loggedToday;
  const [nudged, setNudged] = useState(false);

  useEffect(() => { }, [selected]);

  useEffect(() => {
    if (!nudged) return;
    if (!onNudge) return;

    onNudge(member);

    setNudged(false);
  }, [nudged])

  console.log(member.wi)

  return (
    <DashboardCard selected={selected} onClick={() => onClick(member)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar initial={member.initial} type={member.avatar} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display font-black text-[15px] leading-tight truncate">
                {member.name}
              </p>

              <div
                className={`size-2 rounded-full flex-shrink-0 ${isWarning
                    ? 'bg-coral'
                    : member.loggedToday
                      ? 'bg-olive'
                      : 'bg-jasmine'
                  }`}
              />
            </div>

            <p className="text-[11px] text-gray-400">
              {member.bloodType} · Age {member.age}
            </p>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
          <NudgeButton memberName={member.name} listenNudge={setNudged} />
        </div>
      </div>

      <p className="text-xs text-mauve mb-3 leading-relaxed">{member.status}</p>

      <div className="grid grid-cols-2 gap-2">
        <VitalBox label="Weight" value={member.w ? `${member.w} kg` : '—'} color="border-coral" />
        <VitalBox label="Blood Pressure" value={member.bp || '—'} color="border-olive" />
        <VitalBox label="Heart Rate" value={member.hr || '—'} color="border-jasmine" />
        <VitalBox label="Blood Sugar" value={member.bs || '—'} color="border-mauve" />
        <WaterTracker glasses={member.wi || 0} />
      </div>
    </DashboardCard>
  );
};

const VitalBox = ({ label, value, color }) => (
  <div className={`bg-egg/50 p-2 rounded-xl border-l-3 ${color}`}>
    <span className="block text-[10px] text-gray-400 font-bold tracking-wider">{label}</span>
    <span className="font-display font-black text-sm">{value}</span>
  </div>
);

const WaterTracker = ({ glasses = 0 }) => {
  const TOTAL = 8;
  return (
    <div className="bg-egg/50 p-2 rounded-xl border-l-3 border-[#7BA7BC]">
      <span className="block text-[10px] text-gray-400 font-bold tracking-wider mb-1">Water Intake</span>
      <div className="flex gap-[3px] items-end">
        {Array.from({ length: TOTAL }, (_, i) => (
          <svg key={i} width="9" height="14" viewBox="0 0 9 14">
            <path d="M0.5 1 L1.5 12 Q1.5 13 2.5 13 L6.5 13 Q7.5 13 7.5 12 L8.5 1 Z"
              fill={i < glasses ? '#7BA7BC' : 'rgba(120,160,185,0.18)'}
              stroke={i < glasses ? '#5a8fa8' : 'rgba(120,160,185,0.3)'}
              strokeWidth="0.6"
            />
          </svg>
        ))}
        {(glasses > 8) && <span className="text-[#5a8fa8] text-[10px] leading-[14px] h-[14px] self-end">
          +{glasses - 8}
        </span>}
      </div>
    </div>
  );
};