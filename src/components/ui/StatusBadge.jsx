const statusCls = {
  taken:    { badge: "bg-olive-light text-olive-dark border border-sage",         dot: "bg-olive",        icon: "✓",  label: "Taken"    },
  soon:     { badge: "bg-jasmine-light text-jasmine-dark border border-jasmine",  dot: "bg-jasmine",      icon: "⏰", label: "Soon"     },
  overdue:  { badge: "bg-coral-light text-coral-dark border border-coral",         dot: "bg-coral",        icon: "!",  label: "Overdue"  },
  upcoming: { badge: "bg-[#F0EDE6] text-[#999] border border-[#D8D4C8]",          dot: "bg-[#D8D4C8]",    icon: "◷", label: "Upcoming" },
};

export default function StatusBadge({ status }) {
  const { badge, icon, label } = statusCls[status];

  return (
    <span className={`${badge} rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 flex-shrink-0`}>
      <span>{icon}</span>{label}
    </span>
  );
}