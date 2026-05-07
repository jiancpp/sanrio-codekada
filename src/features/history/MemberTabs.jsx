import { Avatar } from '../../components/ui/Avatar';

export const MemberTabs = ({ members, selected, onSelect }) => (
  <div 
    className="flex gap-2.5 overflow-x-auto pb-1" 
    style={{ scrollbarWidth: 'none' }}
  >
    {members.map((m, i) => {
      const isSelected = selected?._id === m._id;

      return (
        <button
          key={m._id}
          onClick={() => onSelect(m, i)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 border-2
            ${isSelected
              ? 'bg-midnight text-egg border-midnight shadow-lg shadow-midnight/20'
              : 'bg-white border-olive-light text-mauve hover:border-olive hover:text-midnight'
            }`}
        >
          <Avatar 
            initial={m.initial} 
            type={m.avatar || 'olive'} 
            size="size-6 text-[10px]" 
          />
          
          <span>{m.name}</span>
        </button>
      );
    })}
  </div>
);