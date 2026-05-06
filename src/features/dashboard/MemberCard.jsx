import { Avatar } from '../../components/ui/Avatar';
import { DashboardCard } from './DashboardCard';

export const MemberCard = ({ member, selected, onClick }) => {
  // const isWarning = !member.loggedToday && member.medsChecked.includes(false);
  const isWarning = !member.loggedToday;

  return (
    <DashboardCard selected={selected} onClick={() => onClick(member)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar initial={member.initial} type={member.type} />
          <div>
            <p className="font-display font-black text-[15px] leading-tight">{member.name}</p>
            <p className="text-[11px] text-gray-400">{member.bloodType} · Age {member.age}</p>
          </div>
        </div>
        <div className={`size-2 rounded-full ${isWarning ? 'bg-coral' : member.loggedToday ? 'bg-olive' : 'bg-jasmine'}`} />
      </div>

      <p className="text-xs text-mauve mb-3 leading-relaxed">{member.status}</p>

      <div className="grid grid-cols-2 gap-2">
        <VitalBox label="BP" value={member.bp} color="border-coral" />
        <VitalBox label="HR" value={member.hr} color="border-olive" />
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