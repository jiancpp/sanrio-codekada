import { useState } from 'react';

// ─── FIELD ────────────────────────────────────────────────────
export const Field = ({ label, value, editing, type = "text", options, onChange, placeholder }) => {
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

// ─── TAGLIST ──────────────────────────────────────────────────
export const TagList = ({ items = [], editing, onAdd, onRemove, placeholder, color = "olive" }) => {
  const [input, setInput] = useState("");

  const colors = {
    olive:   { bg: 'bg-olive-light',   text: 'text-olive-dark'   },
    coral:   { bg: 'bg-coral-light',   text: 'text-coral-dark'   },
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
        {items.length === 0 && !editing && (
          <span className="text-gray-300 text-xs italic">No data</span>
        )}
        {items.map(item => (
          <span
            key={item}
            className={`${theme.bg} ${theme.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 transition-all`}
          >
            {item}
            {editing && (
              <button
                onClick={() => onRemove(item)}
                className="opacity-50 hover:opacity-100 hover:scale-125 transition-transform"
              >×</button>
            )}
          </span>
        ))}
      </div>
      {editing && (
        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
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

// ─── MEDLIST ──────────────────────────────────────────────────

const DAY_LABELS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const EMPTY_MED = { name: "", days: [], time: [] };

export const MedList = ({ meds = [], editing, onAdd, onRemove, onChange }) => {
  const [newMed, setNewMed] = useState(EMPTY_MED);

  const handleAdd = () => {
    if (newMed.name.trim()) {
      onAdd({ ...newMed });
      setNewMed(EMPTY_MED);
    }
  };

  const addTime = (i, val) => {
    if (!val) return;
    const times = meds[i].time ?? [];
    if (!times.includes(val)) onChange(i, "time", [...times, val]);
  };

  const removeTime = (i, val) => {
    onChange(i, "time", (meds[i].time ?? []).filter(t => t !== val));
  };

  const addNewTime = (val) => {
    if (!val || newMed.time.includes(val)) return;
    setNewMed(m => ({ ...m, time: [...m.time, val] }));
  };

  const removeNewTime = (val) => {
    setNewMed(m => ({ ...m, time: m.time.filter(t => t !== val) }));
  };

  const toggleDay = (i, day, currentDays) => {
    const updated = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    onChange(i, "days", updated);
  };

  const toggleNewDay = (day) => {
    const updated = newMed.days.includes(day)
      ? newMed.days.filter(d => d !== day)
      : [...newMed.days, day];
    setNewMed(m => ({ ...m, days: updated }));
  };

  const updateNotes = (i, val) => onChange(i, "notes", val);
  const updateNewNotes = (val) => setNewMed(m => ({ ...m, notes: val }));

  return (
    <div className="flex flex-col gap-3">

      {/* ── Existing meds ── */}
      {meds.map((med, i) => (
        <div key={i} className="bg-white border border-olive-light rounded-2xl p-4 flex gap-4 items-start">

          <div className="flex-1 space-y-2">

            {editing ? (
              <>
                {/* NAME */}
                <input
                  value={med.name}
                  onChange={e => onChange(i, "name", e.target.value)}
                  className="w-full bg-egg border border-olive rounded-lg px-3 py-1.5 font-bold text-sm"
                />

                {/* NOTES */}
                <input
                  value={med.notes || ""}
                  onChange={e => updateNotes(i, e.target.value)}
                  placeholder="Instructions / notes (e.g. after meals)"
                  className="w-full bg-egg border border-olive-light rounded-lg px-3 py-1.5 text-xs text-mauve"
                />

                {/* DAYS */}
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
                    Days
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {DAY_LABELS.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(i, day, med.days ?? [])}
                        className={`px-2 py-1 text-[9px] font-black uppercase rounded
                          ${med.days?.includes(day)
                            ? "bg-olive text-egg"
                            : "bg-egg text-olive/40 border border-olive-light"}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TIMES */}
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
                    Times
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(med.time ?? []).map(t => (
                      <span
                        key={t}
                        className="bg-midnight text-egg text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                      >
                        {t}
                        <button onClick={() => removeTime(i, t)}>×</button>
                      </span>
                    ))}
                  </div>

                  <TimeAdder onAdd={val => addTime(i, val)} />
                </div>
              </>
            ) : (
              <>
                <p className="font-black text-sm">{med.name}</p>

                {/* NOTES DISPLAY */}
                {med.notes && (
                  <p className="text-[11px] text-mauve/70">{med.notes}</p>
                )}

                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {med.days?.length ? med.days.join(" • ") : "No days set"}
                </p>

                <div className="flex flex-wrap gap-2 mt-1">
                  {(med.time ?? []).map(t => (
                    <span
                      key={t}
                      className="bg-midnight text-egg text-[9px] font-bold px-2 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {editing && (
            <button onClick={() => onRemove(i)} className="text-coral text-xs">
              Remove
            </button>
          )}
        </div>
      ))}

      {/* ── NEW MED ── */}
      {editing && (
        <div className="border border-dashed border-olive-light p-4 rounded-2xl space-y-3">

          <input
            value={newMed.name}
            onChange={e => setNewMed(m => ({ ...m, name: e.target.value }))}
            placeholder="New medicine..."
            className="w-full border p-2 rounded"
          />

          {/* NOTES */}
          <input
            value={newMed.notes || ""}
            onChange={e => updateNewNotes(e.target.value)}
            placeholder="Instructions / notes"
            className="w-full border border-olive-light p-2 rounded text-xs"
          />

          {/* DAYS */}
          <div>
            <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
              Days
            </p>

            <div className="flex flex-wrap gap-1">
              {DAY_LABELS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleNewDay(day)}
                  className={`px-2 py-1 text-[9px] font-black uppercase rounded
                    ${newMed.days?.includes(day)
                      ? "bg-olive text-egg"
                      : "bg-white text-olive/40 border border-olive-light"}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* TIMES */}
          <div>
            <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
              Times
            </p>

            <div className="flex flex-wrap gap-1.5">
              {newMed.time.map(t => (
                <span
                  key={t}
                  className="bg-midnight text-egg px-2 py-0.5 rounded-full text-[10px]"
                >
                  {t}
                  <button onClick={() => removeNewTime(t)}>×</button>
                </span>
              ))}
            </div>

            <TimeAdder onAdd={addNewTime} />
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-olive text-egg py-2 rounded-xl font-bold"
          >
            Add Medicine
          </button>
        </div>
      )}
    </div>
  );
};

export const TimeAdder = ({ onAdd }) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [error, setError] = useState("");

  const validate = () => {
    const h = Number(hour);
    const m = Number(minute);

    if (!hour || !minute) return "Complete time required";
    if (h < 1 || h > 12) return "Hour must be 1–12";
    if (m < 0 || m > 59) return "Minute must be 0–59";

    return null;
  };

  const handleAdd = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const formatted = `${Number(hour)}:${String(minute).padStart(2, "0")} ${ampm}`;
    onAdd(formatted);

    setHour("");
    setMinute("");
    setError("");
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-2 items-center">

        {/* HOUR */}
        <input
          type="number"
          placeholder="HH"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="w-16 border px-2 py-1 rounded text-sm"
          min={1}
          max={12}
        />

        <span>:</span>

        {/* MINUTE */}
        <input
          type="number"
          placeholder="MM"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className="w-16 border px-2 py-1 rounded text-sm"
          min={0}
          max={59}
        />

        {/* AM/PM */}
        <select
          value={ampm}
          onChange={(e) => setAmpm(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option>AM</option>
          <option>PM</option>
        </select>

        <button
          onClick={handleAdd}
          className="bg-olive text-egg px-3 py-1 rounded text-xs font-bold"
        >
          Add
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-[10px] text-coral font-bold">{error}</p>
      )}
    </div>
  );
};