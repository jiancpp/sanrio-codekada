export const SectionHeader = ({ icon, label }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="text-xl">{icon}</span>
    <h3 className="font-display font-black text-xs uppercase tracking-widest">{label}</h3>
    <div className="flex-1 h-px bg-olive-light" />
  </div>
);

export const EmptyState = ({ message }) => (
  <p className="text-center py-8 text-gray-400 text-sm italic">{message}</p>
);

export const VitalAvgCard = ({ label, value, unit, color }) => (
  <div className={`${color} rounded-xl px-4 py-3 border border-olive-light`}>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-xl font-display font-black leading-none">
      {value != null ? Number(value).toFixed(1) : '—'}
      <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
    </p>
  </div>
);