import { useState, useEffect } from 'react';
import { Avatar } from '../../components/ui/Avatar';

export const DailyLogPanel = ({ member }) => {
  const [isSaved, setIsSaved] = useState(false);
  
  // Logic for scheduling meds (Sample data)
  const medSchedule = {
    "Amlodipine 5mg": "Every Day",
    "Metformin 500mg": "3x a Day",
    "Vitamin D": "Every other day"
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (!member) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar initial={member.initial} type={member.type} size="size-10" />
        <div>
          <p className="font-display font-black text-sm uppercase">{member.name}'s Health Log</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time update</p>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="space-y-4">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Biometrics</p>
        <div className="grid grid-cols-2 gap-3">
          <LogInput label="Weight" placeholder="0.0" unit="kg" />
          <LogInput label="Blood Pressure" placeholder="120/80" unit="mmHg" />
          <LogInput label="Heart Rate" placeholder="72" unit="bpm" />
          <LogInput label="Blood Sugar" placeholder="95" unit="mg/dL" />
        </div>
        <div className="w-full">
            <LogInput label="Water Intake" placeholder="0" unit="glasses" />
        </div>
      </div>

      {/* Meds Checklist with Schedule Logic */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Maintenance Meds</p>
          <span className="text-[9px] font-bold text-coral bg-coral-light px-2 py-0.5 rounded">Due Today</span>
        </div>
        
        <div className="space-y-2">
          {member.meds?.map((med, i) => (
            <div key={i} className="group relative flex flex-col p-3 rounded-xl border border-olive-light bg-egg/20">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="size-4 accent-olive rounded border-olive-light" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-midnight">{med}</span>
                  <span className="text-[10px] text-olive font-medium italic">
                    Schedule: {medSchedule[med] || "As prescribed"}
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload & Notes */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Proof of Meds / Photos</label>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-olive-light rounded-xl cursor-pointer hover:bg-olive-light/20 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-lg">📸</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Attach Image</p>
            </div>
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Additional Notes</label>
          <textarea 
            className="w-full bg-egg/30 border border-olive-light rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-olive/20 resize-none"
            placeholder="Describe symptoms or mood..."
            rows="2"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-full font-display font-black text-sm uppercase tracking-widest transition-all active:scale-95
          ${isSaved ? 'bg-olive text-egg' : 'bg-midnight text-egg hover:shadow-lg hover:shadow-midnight/20'}`}
      >
        {isSaved ? '✓ Log Entry Saved' : 'Save Daily Log'}
      </button>
    </div>
  );
};

// Internal Helper Component
const LogInput = ({ label, placeholder, unit }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input 
        type="text"
        placeholder={placeholder}
        className="w-full bg-white border border-olive-light rounded-xl p-3 pr-12 text-sm font-display font-black focus:outline-none focus:border-olive shadow-sm"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 uppercase">
        {unit}
      </span>
    </div>
  </div>
);