import { useState } from 'react';
import { VitalChip, MedBadge } from '../../components/ui/HealthChips';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmt = (val, unit = '') =>
  (val !== null && val !== undefined && val !== '') ? `${val}${unit}` : '—';

export const LogCard = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const d = new Date(log.date);
  const allMedsTaken = log.medsTaken?.length > 0 && log.medsTaken.every(m => m.status);
  const missedCount = log.medsTaken?.filter(m => !m.status).length ?? 0;
  const hasMeds = log.medsTaken?.length > 0;
  const hasAnyVital = log.vitals?.bloodPressure || log.vitals?.heartRate
    || log.vitals?.bloodSugarLevel || log.vitals?.weight || log.waterIntake;
  const hasImage = log.proofImage && !imgError;

  return (
    <div className="group bg-white rounded-[1.5rem] border border-olive-light shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-olive/40">

      {/* ── Header (always visible) ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-5 px-6 py-5 hover:bg-egg/40 transition-colors text-left"
      >
        {/* Mini calendar block */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-midnight text-egg rounded-2xl w-14 h-14 shadow-sm">
          <span className="text-[8px] font-black uppercase text-sage tracking-widest leading-none mb-0.5">
            {MONTHS_SHORT[d.getMonth()]}
          </span>
          <span className="font-display font-black text-2xl leading-none">
            {d.getDate()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-sm text-midnight">
            {d.toLocaleDateString('en-PH', { weekday: 'long' })}
            <span className="font-body font-normal text-mauve text-xs ml-2">{d.getFullYear()}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {log.vitals?.bloodPressure && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-mauve">
                🫀 {log.vitals.bloodPressure}
              </span>
            )}
            {log.vitals?.heartRate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-mauve">
                · 💓 {log.vitals.heartRate} bpm
              </span>
            )}
            {hasMeds && (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full
                ${allMedsTaken ? 'bg-olive-light text-olive-dark' : 'bg-coral-light text-coral-dark'}`}>
                {allMedsTaken ? '💊 All taken' : `⚠️ ${missedCount} missed`}
              </span>
            )}
            {/* Proof image indicator */}
            {hasImage && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-mauve/10 text-mauve">
                📎 Attachment
              </span>
            )}
            {log.notes && (
              <span className="text-[11px] text-mauve/50 font-medium italic truncate max-w-[180px]">
                "{log.notes.slice(0, 40)}{log.notes.length > 40 ? '…' : ''}"
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-egg border border-olive-light flex items-center justify-center text-mauve transition-all duration-300 group-hover:border-olive
          ${expanded ? 'rotate-180 bg-olive-light' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="border-t border-olive-light/60 px-6 py-6 space-y-6 bg-egg/30">

          {/* Vitals */}
          {hasAnyVital && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 mb-3">Vitals</p>
              <div className="flex flex-wrap gap-2">
                <VitalChip label="BP" value={fmt(log.vitals?.bloodPressure)} />
                <VitalChip label="HR" value={fmt(log.vitals?.heartRate, ' bpm')} />
                <VitalChip label="Sugar" value={fmt(log.vitals?.bloodSugarLevel, ' mg/dL')} />
                <VitalChip label="Weight" value={fmt(log.vitals?.weight, ' kg')} />
                <VitalChip label="Water" value={fmt(log.waterIntake, ' mL')} />
              </div>
            </div>
          )}

          {/* Medications */}
          {hasMeds && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 mb-3">Medications</p>
              <div className="flex flex-wrap gap-2">
                {log.medsTaken.map((med, i) => <MedBadge key={i} med={med} />)}
              </div>
            </div>
          )}

          {/* Notes */}
          {log.notes && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 mb-3">Notes</p>
              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-olive to-olive/10 rounded-full" />
                <p className="text-sm text-midnight leading-relaxed italic">{log.notes}</p>
              </div>
            </div>
          )}

          {/* Proof image */}
          {hasImage && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 mb-3">Attachment</p>
              <div className="relative inline-block">
                <img
                  src={log.proofImage}
                  alt="Proof of log"
                  onError={() => setImgError(true)}
                  className="w-full max-w-sm rounded-2xl border border-olive-light object-cover shadow-sm"
                />
                <a
                  href={log.proofImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-midnight/70 hover:bg-midnight text-egg text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm transition-all"
                >
                  View full ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};