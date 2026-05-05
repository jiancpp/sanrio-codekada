export const QuickAction = ({ title, icon, colorClass, isDark, sub }) => (
  <button className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all hover:opacity-90 active:scale-95
    ${isDark ? 'bg-midnight text-egg' : 'bg-white border border-olive-light text-midnight shadow-sm'}`}>
    <div className={`size-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${colorClass}`}>
      {icon}
    </div>
    <div className="text-left">
      <p className="font-display font-black text-sm leading-tight">{title}</p>
      {sub && <p className={`text-[10px] ${isDark ? 'text-sage' : 'text-gray-400'}`}>{sub}</p>}
    </div>
    <span className="ml-auto opacity-30">→</span>
  </button>
);