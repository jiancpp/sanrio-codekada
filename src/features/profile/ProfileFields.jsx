import { useState } from 'react';

// ─── FIELD COMPONENT ──────────────────────────────────────────
export const Field = ({ label, value, editing, type = "text", options, onChange, placeholder }) => {
  // Fix for date inputs: they require YYYY-MM-DD format
  const displayValue = (type === "date" && value) ? value.split('T')[0] : value;

  return (
    <div className="mb-4">
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      {editing ? (
        type === "select" ? (
          <select 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            className="w-full bg-egg border-1.5 border-olive rounded-xl p-2.5 text-sm outline-none appearance-none"
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type} 
            value={displayValue || ""} 
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-egg border-1.5 border-olive rounded-xl p-2.5 text-sm outline-none"
          />
        )
      ) : (
        <p className={`text-sm py-2 border-b border-olive-light font-medium ${value ? 'text-midnight' : 'text-gray-300'}`}>
          {displayValue || "Not set"}
        </p>
      )}
    </div>
  );
};

// ─── TAGLIST COMPONENT ────────────────────────────────────────
export const TagList = ({ items = [], editing, onAdd, onRemove, placeholder, color = "olive" }) => {
  const [input, setInput] = useState("");
  const colors = {
    olive: { bg: 'bg-olive-light', text: 'text-olive-dark' },
    coral: { bg: 'bg-coral-light', text: 'text-coral-dark' },
    jasmine: { bg: 'bg-jasmine-light', text: 'text-jasmine-dark' },
  };
  const theme = colors[color] || colors.olive;

  const handleAdd = () => {
    if (input.trim() && !items.includes(input.trim())) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.length === 0 && !editing && <span className="text-gray-300 text-xs italic">No data</span>}
        {items.map(item => (
          <span key={item} className={`${theme.bg} ${theme.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 transition-all`}>
            {item}
            {editing && (
              <button 
                onClick={() => onRemove(item)} 
                className="opacity-50 hover:opacity-100 hover:scale-125 transition-transform"
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      {editing && (
        <div className="flex gap-2 mt-4">
          <input 
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 bg-egg border-1.5 border-olive rounded-xl px-3 py-2 text-xs outline-none"
            placeholder={placeholder}
          />
          <button 
            onClick={handleAdd} 
            className="bg-olive text-egg px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            + Add
          </button>
        </div>
      )}
    </div>
  );
};

// ─── MEDLIST COMPONENT ────────────────────────────────────────
export const MedList = ({ meds = [], editing, onAdd, onRemove, onChange }) => {
  const [newMed, setNewMed] = useState({ name: "", days: [] });
  const dayLabels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const handleAdd = () => {
    if (newMed.name.trim()) {
      onAdd({ ...newMed, time: [] }); // Syncs with schema
      setNewMed({ name: "", days: [] });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {meds.map((med, i) => (
        <div key={i} className="bg-white border border-olive-light rounded-2xl p-4 flex gap-4 items-center">
          <div className="size-2 rounded-full bg-coral" />
          <div className="flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={med.name}
                  onChange={e => onChange(i, "name", e.target.value)}
                  className="w-full bg-egg border border-olive rounded-lg px-3 py-1 font-bold text-sm outline-none"
                />
                <div className="flex gap-1">
                  {dayLabels.map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        const days = med.days.includes(day) 
                          ? med.days.filter(d => d !== day) 
                          : [...med.days, day];
                        onChange(i, "days", days);
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        med.days.includes(day) ? 'bg-olive text-egg' : 'bg-egg text-olive/20'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="font-display font-black text-midnight text-sm m-0">{med.name}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  {med.days.length > 0 ? med.days.join(' • ') : "No schedule set"}
                </p>
              </div>
            )}
          </div>
          {editing && (
            <button onClick={() => onRemove(i)} className="text-coral font-bold text-xs hover:underline">
              Remove
            </button>
          )}
        </div>
      ))}

      {editing && (
        <div className="bg-olive-light/10 border-2 border-dashed border-olive-light rounded-2xl p-4 mt-2">
          <input
            value={newMed.name}
            onChange={e => setNewMed({ ...newMed, name: e.target.value })}
            placeholder="New medicine name..."
            className="w-full bg-white border border-olive-light rounded-xl px-4 py-2 text-sm outline-none mb-3"
          />
          <div className="flex gap-1 mb-4">
            {dayLabels.map(day => (
              <button
                key={day}
                onClick={() => {
                  const days = newMed.days.includes(day) 
                    ? newMed.days.filter(d => d !== day) 
                    : [...newMed.days, day];
                  setNewMed({ ...newMed, days });
                }}
                className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                  newMed.days.includes(day) ? 'bg-olive text-egg' : 'bg-white text-olive/20 border border-olive-light'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <button onClick={handleAdd} className="w-full bg-olive text-egg py-2.5 rounded-xl font-black text-xs uppercase tracking-widest">
            + Add to Medications
          </button>
        </div>
      )}
    </div>
  );
};