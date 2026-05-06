import { formatMonth, formatDate } from '../utils/dateUtils';
import { SectionHeader, EmptyState, VitalAvgCard } from './ProfileComponents';

export default function HealthSummary({ summaries, activeMonth, setActiveMonth, userId }) {
  const currentSummary = summaries[activeMonth];
  const memberSummary = currentSummary?.memberSummaries?.find(m => String(m.memberId) === String(userId));
  const logs = memberSummary?.logsSummary;

  if (summaries.length === 0) return <EmptyState message="No summaries yet." />;

  return (
    <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <SectionHeader icon="📅" label="Monthly Health Summary" />
        <div className="flex gap-2">
          {summaries.slice(0, 6).map((s, i) => (
            <button 
              key={i} 
              onClick={() => setActiveMonth(i)}
              className={`px-3 py-1 rounded-full text-xs font-bold ${activeMonth === i ? 'bg-midnight text-egg' : 'bg-egg border'}`}
            >
              {formatMonth(s.month)}
            </button>
          ))}
        </div>
      </div>

      {logs && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <VitalAvgCard label="Weight" value={logs.averageLogs?.weight} unit="kg" color="bg-jasmine-light" />
          <VitalAvgCard label="Heart Rate" value={logs.averageLogs?.heartRate} unit="bpm" color="bg-coral-light" />
        </div>
      )}
    </div>
  );
}