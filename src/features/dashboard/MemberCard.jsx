import { useEffect } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { DashboardCard } from './DashboardCard';
import NudgeButton from '../../components/ui/NudgeButton';

export const MemberCard = ({ member, selected, onClick, onNudge }) => {
  // const isWarning = !member.loggedToday && member.medsChecked.includes(false);
  const isWarning = !member.loggedToday;

  useEffect(() => {}, [selected]);

  return (
    <DashboardCard selected={selected} onClick={() => onClick(member)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar initial={member.initial} type={member.type} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display font-black text-[15px] leading-tight truncate">
                {member.name}
              </p>

              <div
                className={`size-2 rounded-full flex-shrink-0 ${
                  isWarning
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
          <NudgeButton memberName={member.name} onNudge={onNudge} />
        </div>
      </div>

      <p className="text-xs text-mauve mb-3 leading-relaxed">{member.status}</p>

      <div className="grid grid-cols-2 gap-2">
        <VitalBox label="BP" value={member.bp || '—'} color="border-coral" />
        <VitalBox label="HR" value={member.hr || '—'} color="border-olive" />
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