export const StatCard = ({ label, value, palette }) => (
    <div className={`flex-1 min-w-[90px] px-5 py-4 rounded-2xl border ${palette.bg} ${palette.border}`}>
        <p className={`font-display font-black text-2xl ${palette.val}`}>{value}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-0.5">{label}</p>
    </div>
);