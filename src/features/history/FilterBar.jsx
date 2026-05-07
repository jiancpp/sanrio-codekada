const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const FilterBar = ({
  year, month, specificDate,
  onYearChange, onMonthChange, onDateChange,
  onClear, hasFilters,
}) => {
  const currentYear = new Date().getFullYear();
  const years       = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const sel = "bg-white border-2 border-olive-light rounded-xl px-3 py-2 text-sm font-bold text-midnight focus:outline-none focus:border-olive cursor-pointer appearance-none pr-8 transition-all";

  return (
    <div className="flex flex-wrap gap-4 items-end">

      {/* Year */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 px-1">Year</label>
        <div className="relative">
          <select value={year} onChange={e => { onYearChange(e.target.value); onDateChange(''); }} className={sel}>
            <option value="">All years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-mauve text-xs pointer-events-none">▾</span>
        </div>
      </div>

      {/* Month */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 px-1">Month</label>
        <div className="relative">
          <select value={month} onChange={e => { onMonthChange(e.target.value); onDateChange(''); }} className={sel}>
            <option value="">All months</option>
            {MONTHS_SHORT.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-mauve text-xs pointer-events-none">▾</span>
        </div>
      </div>

      <div className="flex items-end pb-2.5">
        <span className="text-xs text-mauve/40 font-bold">or</span>
      </div>

      {/* Specific date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-[0.15em] text-mauve/60 px-1">Specific Date</label>
        <input
          type="date"
          value={specificDate}
          onChange={e => { onDateChange(e.target.value); onYearChange(''); onMonthChange(''); }}
          className={sel}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral/10 text-coral-dark font-bold text-sm border border-coral/20 hover:bg-coral hover:text-egg transition-all"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
};