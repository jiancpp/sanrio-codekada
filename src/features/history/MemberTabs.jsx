/* features/history/MemberTabs.jsx
   Horizontally scrollable member pill tabs.
   Uses the avatar color cycling system.
   Could be generalized and moved to components/ui if needed elsewhere.
*/

import { Avatar } from '../../components/ui/Avatar';

const AVATAR_STYLES = [
  { bg: 'bg-midnight',   text: 'text-jasmine' },
  { bg: 'bg-olive',      text: 'text-egg'     },
  { bg: 'bg-coral',      text: 'text-egg'     },
  { bg: 'bg-mauve',      text: 'text-jasmine' },
  { bg: 'bg-jasmine',    text: 'text-midnight'},
  { bg: 'bg-olive-dark', text: 'text-egg'     },
];
export const avatarStyle = (i) => AVATAR_STYLES[i % AVATAR_STYLES.length];

export const MemberTabs = ({ members, selected, onSelect }) => (
  <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
    {members.map((m, i) => {
      const av         = avatarStyle(i);
      const isSelected = selected?._id === m._id;
      return (
        <button
          key={m._id}
          onClick={() => onSelect(m, i)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 border-2
            ${isSelected
              ? 'bg-midnight text-egg border-midnight shadow-lg shadow-midnight/20'
              : 'bg-white border-olive-light text-mauve hover:border-olive hover:text-midnight'}`}
        >
          {/* Uses your existing Avatar component — override colors for selected state */}
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all
            ${isSelected ? `${av.bg} ${av.text}` : 'bg-olive-light text-olive-dark'}`}>
            {m.initial}
          </span>
          {m.name}
        </button>
      );
    })}
  </div>
);