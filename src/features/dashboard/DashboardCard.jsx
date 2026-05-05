export const DashboardCard = ({ children, onClick, selected, className = "" }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-[20px] p-5 border transition-all cursor-pointer shadow-sm
      ${selected ? 'border-olive ring-4 ring-olive-light -translate-y-0.5' : 'border-olive-light hover:shadow-md hover:-translate-y-1'} 
      ${className}`}
  >
    {children}
  </div>
);