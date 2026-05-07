/* ── Vital Chip ── */
const VITAL_META = {
  BP: { icon: '🫀', bg: 'bg-coral-light', border: 'border-coral/20', label: 'text-coral-dark' },
  HR: { icon: '💓', bg: 'bg-jasmine-light', border: 'border-jasmine/30', label: 'text-jasmine-dark' },
  Sugar: { icon: '🩸', bg: 'bg-olive-light', border: 'border-olive/20', label: 'text-olive-dark' },
  Weight: { icon: '⚖️', bg: 'bg-mauve/10', border: 'border-mauve/20', label: 'text-mauve' },
  Water: { icon: '💧', bg: 'bg-olive-light', border: 'border-olive/20', label: 'text-olive-dark' },
};

export const VitalChip = ({ label, value }) => {
  const m = VITAL_META[label] || VITAL_META.Weight;
  const empty = value === '—';
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border ${m.bg} ${m.border} ${empty ? 'opacity-35' : ''}`}>
      <span className="text-base leading-none">{m.icon}</span>
      <div className="flex flex-col">
        <span className={`text-[9px] font-black uppercase tracking-widest opacity-60 ${m.label}`}>{label}</span>
        <span className={`font-display font-black text-sm leading-tight ${m.label}`}>{value}</span>
      </div>
    </div>
  );
};

/* ── Med Badge ── */
export const MedBadge = ({ med }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border
    ${med.status
      ? 'bg-olive-light border-olive/20 text-olive-dark'
      : 'bg-coral-light border-coral/20 text-coral-dark'}`}
  >
    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black
      ${med.status ? 'bg-olive text-egg' : 'bg-coral text-egg'}`}>
      {med.status ? '✓' : '✗'}
    </span>
    {med.name}
    {med.time && <span className="opacity-50 font-medium">· {med.time}</span>}
  </span>
);