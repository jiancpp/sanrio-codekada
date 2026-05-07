import { VitalAvgCard, EmptyState, SectionHeader } from '../../components/ui/ProfileComponents';

// ─── HEALTH SUMMARY ───────────────────────────────────────────
// Drop-in replacement for the old inline summary block.
// Props:
//   summaries    – array from GET /monthly-summary/user/:id
//   activeMonth  – index of currently selected month
//   setActiveMonth – setter
//   userId       – resolvedId(p) so we can find the right memberSummary
export default function HealthSummary({ summaries, activeMonth, setActiveMonth, userId }) {
  const currentSummary = summaries[activeMonth];
  const memberSummary  = currentSummary?.memberSummaries?.find(
    m => String(m.memberId) === String(userId)
  ) ?? null;

  return (
    <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-6 shadow-sm">

      <SummaryHeader
        summaries={summaries}
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
      />

      {summaries.length === 0 ? (
        <EmptyState message="No monthly summaries generated yet." />
      ) : !memberSummary ? (
        <EmptyState message="No health data found for this month." />
      ) : (
        <div className="space-y-6">

          {/* Average vitals grid */}
          <VitalsGrid logs={memberSummary.logsSummary} />

          {/* Blood pressure averages (stored separately from averageLogs) */}
          {memberSummary.logsSummary?.averageBP && (
            <div className="grid grid-cols-2 gap-3">
              <VitalAvgCard
                label="Avg Systolic"
                value={memberSummary.logsSummary.averageBP.systolic}
                unit="mmHg"
                color="bg-coral-light"
              />
              <VitalAvgCard
                label="Avg Diastolic"
                value={memberSummary.logsSummary.averageBP.diastolic}
                unit="mmHg"
                color="bg-coral-light"
              />
            </div>
          )}

          {/* Alarming levels */}
          {memberSummary.logsSummary?.alarmingLevels?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-coral mb-2">
                ⚠ Flagged Readings
              </p>
              <div className="space-y-2">
                {memberSummary.logsSummary.alarmingLevels.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-coral-light rounded-xl px-4 py-2.5"
                  >
                    <span className="text-sm font-bold capitalize">
                      {a.vitalType?.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold">{a.value}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full
                        ${a.severity === 'High' ? 'bg-coral text-white' : 'bg-midnight text-egg'}`}>
                        {a.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General observation */}
          {memberSummary.logsSummary?.generalObservation && (
            <div className="bg-egg rounded-xl px-4 py-3 border border-olive-light">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Observation
              </p>
              <p className="text-sm leading-relaxed">
                {memberSummary.logsSummary.generalObservation}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── SUMMARY HEADER ───────────────────────────────────────────
function SummaryHeader({ summaries, activeMonth, setActiveMonth }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="text-xl">📅</span>
        <h3 className="font-display font-black text-xs uppercase tracking-widest">
          Monthly Health Summary
        </h3>
        <div className="h-px bg-olive-light w-6" />
      </div>
      {summaries.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {summaries.slice(0, 6).map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveMonth(i)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all
                ${activeMonth === i
                  ? 'bg-midnight text-egg'
                  : 'bg-egg border border-olive-light text-midnight hover:bg-olive-light'}`}
            >
              {new Date(s.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── VITALS GRID ──────────────────────────────────────────────
function VitalsGrid({ logs }) {
  if (!logs?.averageLogs) return null;
  const { weight, heartRate, bloodSugarLevel, waterIntake } = logs.averageLogs;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <VitalAvgCard label="Weight"      value={weight}          unit="kg"    color="bg-jasmine-light" />
      <VitalAvgCard label="Heart Rate"  value={heartRate}       unit="bpm"   color="bg-coral-light"   />
      <VitalAvgCard label="Blood Sugar" value={bloodSugarLevel} unit="mg/dL" color="bg-egg"           />
      <VitalAvgCard label="Water"       value={waterIntake}     unit="L"     color="bg-olive-light"   />
    </div>
  );
}