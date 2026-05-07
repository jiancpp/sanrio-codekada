import { useState, useEffect } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { useApi } from '../../hooks/useApi';
import { useMediaUpload } from '../../hooks/useMediaUpload';

export const DailyLogPanel = ({ member }) => {
  const { addLog, getDailyLog, error, isLoading } = useApi();
  const {
    mediaAttachments, uploading, handleMediaUpload,
    deleteMedia, resetMedia, setMedia,
    cropImageSrc, setCropImageSrc
  } = useMediaUpload(null, { multiple: false });  // Edit multiple later

  const [isSaved, setIsSaved] = useState(false);
  
  const getDayToday = (date = new Date()) => {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days[date.getDay()];
  }

  // Forms Data
  // Todo initialize from member's daily log for the day
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('')
  const [heartRate, setHeartRate] = useState('')
  const [bloodSugar, setBloodSugar] = useState('')
  const [waterIntake, setWaterIntake] = useState('')
  const [checkedMeds, setCheckedMeds] = useState({});
  const [medDays, setMedDays] = useState({});

  useEffect(() => {
    let cancelled = false;
  
    const initializeForm = async () => {
      if (!member?._id) return;
  
      resetMedia();
  
      const today = new Date().toISOString().split('T')[0];
      const existingLog = await getDailyLog(member._id, today);
      let days = {};
      member.maintenanceMeds.forEach((med, i) => {
        days[med.name] = med.days
      })  
      setMedDays(days);

  
      if (cancelled) return;
  
      if (existingLog) {
        setWeight(existingLog.vitals?.weight || '');
        setBloodPressure(existingLog.vitals?.bloodPressure || '');
        setHeartRate(existingLog.vitals?.heartRate || '');
        setBloodSugar(existingLog.vitals?.bloodSugarLevel || '');
        setWaterIntake(existingLog.waterIntake || '');
  
        const medStatus = {};
  
        existingLog.medsTaken?.forEach(med => {
          if (days[med.name]?.includes(getDayToday())) {
            medStatus[`${med.name}-${med.time}`] = med.status;
          }
        });
  
        setCheckedMeds(medStatus);
  
        if (existingLog.proofImage) {
          setMedia({
            file: null,
            url: existingLog.proofImage,
            preview: existingLog.proofImage,
            isPDF: false,
            name: ''
          });
        }
      } else {
        setWeight('');
        setBloodPressure('');
        setHeartRate('');
        setBloodSugar('');
        setWaterIntake('');
        setCheckedMeds({});
      }
    };
  
    initializeForm();
  
    return () => {
      cancelled = true;
    };
  }, [member?._id]);

  const handleSave = async () => {
    const medsArray = Object.entries(checkedMeds).map(([key, status]) => {
      const [name, time] = key.split("-");
    
      return {
        name,
        time,
        status
      };
    });

    const data = await addLog({
      userId: member._id,
      familyCode: member.familyCode,
      vitals: {
        weight: weight,
        bloodPressure: bloodPressure,
        heartRate: heartRate,
        bloodSugarLevel: bloodSugar,
      },
      medsTaken: medsArray,
      waterIntake: waterIntake,
      proofImage: mediaAttachments?.url || ""
    })

    if (data) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  if (!member) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar initial={member.initial} type={member.avatar} size="size-10" />
        <div>
          <p className="font-display font-black text-sm uppercase">{member.name}'s Health Log</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time update</p>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="space-y-4">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Biometrics</p>
        <div className="grid grid-cols-2 gap-3">
          <LogInput label="Weight" value={weight} placeholder="0.0" unit="kg" onChange={setWeight} />
          <LogInput label="Blood Pressure" value={bloodPressure} placeholder="120/80" unit="mmHg" onChange={setBloodPressure} />
          <LogInput label="Heart Rate" value={heartRate} placeholder="72" unit="bpm" onChange={setHeartRate} />
          <LogInput label="Blood Sugar" value={bloodSugar} placeholder="95" unit="mg/dL" onChange={setBloodSugar} />
        </div>
        <div className="w-full">
          <LogInput label="Water Intake" value={waterIntake} placeholder="0" unit="glasses" onChange={setWaterIntake} />
        </div>
      </div>

      {/* Meds Checklist with Schedule Logic */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Maintenance Meds</p>
          <span className="text-[9px] font-bold text-coral bg-coral-light px-2 py-0.5 rounded">Due Today</span>
        </div>

        <div className="space-y-2">
          {member.maintenanceMeds?.map((med, i) =>
            medDays[med.name]?.includes(getDayToday()) &&
            med.time?.map((t, j) => (
              <div
                key={`${i}-${j}`}
                className="group relative flex flex-col p-3 rounded-xl border border-olive-light bg-egg/20"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="size-4 accent-olive rounded border-olive-light"
                    checked={!!checkedMeds[`${med.name}-${t}`]}
                    onChange={(e) => {
                      setCheckedMeds(prev => ({
                          ...prev,
                          [`${med.name}-${t}`]: e.target.checked,
                      }));
                    }}
                  />

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-midnight">
                      {med.name}
                    </span>

                    <span className="text-[10px] text-olive font-medium italic">
                      {t} · {med.notes || "As prescribed"}
                    </span>
                  </div>
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Image Upload & Notes */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Proof of Meds / Photos</label>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-olive-light rounded-xl cursor-pointer hover:bg-olive-light/20 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-lg">📸</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Attach Image </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleMediaUpload}
            />
          </label>
          {mediaAttachments && (
            <div className="mt-3 relative group">
              {mediaAttachments.isPDF ? (
                /* PDF Preview Mode */
                <div className="flex items-center justify-between p-4 bg-white border border-olive-light rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl">📄</span>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-midnight truncate">
                        {mediaAttachments.name || "Medical Document.pdf"}
                      </span>
                      <a
                        href={mediaAttachments.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-olive font-bold uppercase tracking-wider hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteMedia(mediaAttachments.url)}
                    className="p-1.5 bg-coral/10 text-coral rounded-lg hover:bg-coral hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* Image Preview Mode */
                <div className="relative">
                  <img
                    src={mediaAttachments.url}
                    alt="upload"
                    className="w-full rounded-xl border border-olive-light"
                  />
                  <button
                    onClick={() => deleteMedia(mediaAttachments.url)}
                    className="absolute -top-2 -right-2 bg-coral text-white size-6 rounded-full flex items-center justify-center shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
          {uploading && (
            // @Shielo @Jess Don't know how to style this
            <p className="text-xs text-mauve flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border-2 border-olive border-t-transparent rounded-full animate-spin" />
              Uploading File...
            </p>
          )}
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
const LogInput = ({ label, placeholder, value, unit, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        className="w-full bg-white border border-olive-light rounded-xl p-3 pr-12 text-sm font-display font-black focus:outline-none focus:border-olive shadow-sm"
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 uppercase">
        {unit}
      </span>
    </div>
  </div>
);