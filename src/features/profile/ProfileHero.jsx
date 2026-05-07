import { Avatar } from '../../components/ui/Avatar';

export const ProfileHero = ({
  p,
  editing,
  onEdit,       // ProfilePage passes onEdit — was being received as onEditClick
  onSave,
  onCancel,
  set,
  fullName,
  age,
  saved,
  isSaving,
}) => (
  <div className="bg-midnight rounded-[24px] p-8 mb-5 relative overflow-hidden shadow-xl">

    {/* Decorative background */}
    <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-olive/10 pointer-events-none" />

    <div className="flex flex-col md:flex-row items-center gap-6">

      {/* Avatar */}
      <Avatar name={fullName} />

      {/* Name + badges */}
      <div className="flex-1 text-center md:text-left">
        {editing ? (
          <input
            value={p.name ?? ''}
            onChange={e => set('name', e.target.value)}   // ← was set("firstName", ...)
            placeholder="Full name"
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-egg font-display font-black text-lg outline-none w-full max-w-xs mb-3 focus:border-white/40 transition-colors"
          />
        ) : (
          <h1 className="font-display font-black text-3xl text-egg mb-2">{fullName}</h1>
        )}

        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {age && <Badge color="bg-jasmine/20 text-jasmine" label={`${age} years old`} />}
          {p.bloodType && <Badge color="bg-coral/20 text-coral" label={p.bloodType} />}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4 md:mt-0 flex-shrink-0">
        {editing ? (
          <>
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full border border-white/20 text-egg font-bold text-sm hover:bg-white/10 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full bg-olive text-egg font-bold text-sm shadow-lg hover:bg-olive-dark transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving…' : 'Save Profile'}
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}                              // ← was onEditClick
            className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-egg font-bold text-sm hover:bg-white/20 transition-all active:scale-95"
          >
            Edit Medical Info
          </button>
        )}
      </div>
    </div>

    {/* Saved toast */}
    {saved && (
      <div className="absolute bottom-4 right-6 bg-olive text-egg text-[12px] font-bold px-4 py-1.5 rounded-full animate-bounce">
        ✓ Profile saved!
      </div>
    )}
  </div>
);

const Badge = ({ color, label }) => (
  <span className={`${color} px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight`}>
    {label}
  </span>
);