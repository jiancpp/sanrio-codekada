import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import NudgeButton from "../components/ui/NudgeButton";
import StatusBadge from "../components/ui/StatusBadge";
import Toast from "../components/ui/Toast";
import { Avatar } from '../components/ui/Avatar';
import { toMinutes, nowMinutes, timeStatus } from "../hooks/utils";
import AllFamilyMeds from "../features/medications/AllFamilyMeds";
import MemberMedsCard from "../features/medications/MemberMedsCard";

// ── Sample data ───────────────────────────────────────────────────────────────
const MEMBERS = [
  {
    _id: "1", initial: "MA", name: "Mama", age: 58, type: "olive",
    bloodType: "O+", loggedToday: true, streak: 12,
    medsTaken: [
      { name: "Amlodipine 5mg",  time: "08:00 AM", status: true,  note: "After breakfast" },
      { name: "Metformin 500mg", time: "12:00 PM", status: false, note: "After lunch" },
      { name: "Metformin 500mg", time: "07:00 PM", status: false, note: "After dinner" },
    ],
  },
  {
    _id: "2", initial: "PA", name: "Papa", age: 62, type: "jasmine",
    bloodType: "A+", loggedToday: false, streak: 5,
    medsTaken: [
      { name: "Losartan 50mg",     time: "07:00 AM", status: false, note: "Before breakfast" },
      { name: "Atorvastatin 20mg", time: "09:00 PM", status: false, note: "Before bedtime" },
    ],
  },
  {
    _id: "3", initial: "KU", name: "Kuya", age: 30, type: "coral",
    bloodType: "B+", loggedToday: true, streak: 7,
    medsTaken: [
      { name: "Vitamin D 1000IU", time: "08:30 AM", status: true, note: "With breakfast" },
    ],
  },
  {
    _id: "4", initial: "SH", name: "Shielo", age: 25, type: "mauve",
    bloodType: "AB+", loggedToday: false, streak: 3,
    medsTaken: [
      { name: "Ferrous Sulfate 325mg", time: "07:30 AM", status: false, note: "1 hour before meals" },
      { name: "Vitamin C 500mg",       time: "07:30 AM", status: false, note: "Take with Ferrous Sulfate" },
    ],
  },
];

const avatarCls = {
  olive:   "bg-olive-light text-olive-dark",
  jasmine: "bg-jasmine-light text-jasmine-dark",
  coral:   "bg-coral-light text-coral-dark",
  mauve:   "bg-mauve text-jasmine",
};

export default function FamilyMedications() {
  const [members, setMembers]           = useState(MEMBERS);
  const [toasts, setToasts]             = useState([]);
  const [activeTab, setActiveTab]       = useState("all");
  const [memberFilter, setMemberFilter] = useState("All");

  const handleNudge = (memberName, medName) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, member: memberName, med: medName }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const allMeds      = members.flatMap((m) => m.medsTaken);
  const takenCount   = allMeds.filter((m) => m.status).length;
  const overdueCount = allMeds.filter((m) => timeStatus(m.time, m.status) === "overdue").length;

  const filteredMembers = memberFilter === "All"
    ? members
    : members.filter((m) => m.name === memberFilter);

  const STATS = [
    { label: "Total Meds Today", value: allMeds.length,  topBorder: "border-t-midnight",  textColor: "text-midnight" },
    { label: "Taken",            value: takenCount,       topBorder: "border-t-olive",     textColor: "text-olive"   },
    { label: "Overdue",          value: overdueCount,     topBorder: "border-t-coral",     textColor: "text-coral"   },
  ];

  const TABS = [
    { key: "all",        label: "🏠 All Family Meds" },
    { key: "individual", label: "👤 By Member" },
  ];

  return (
    <div className="min-h-screen bg-egg text-midnight font-body">
      <Navbar variant="auth" />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display font-black text-3xl tracking-tight mb-1">💊 Medication Schedule</h1>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS.map(({ label, value, topBorder, textColor }) => (
            <div key={label} className={`bg-white rounded-2xl px-5 py-4 border border-olive-light border-t-4 ${topBorder}`}>
              <p className="text-[11px] text-gray-300 uppercase tracking-widest mb-1.5">{label}</p>
              <p className={`font-display font-black text-3xl ${textColor}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-white border border-olive-light rounded-2xl p-1 mb-5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl font-display font-black text-[13px] border-none cursor-pointer transition-all duration-200
                ${activeTab === tab.key ? "bg-midnight text-egg shadow-sm" : "bg-transparent text-gray-400 hover:text-mauve"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Member filter (individual tab only) */}
        {activeTab === "individual" && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-gray-400 mr-1">Filter by:</span>
            {["All", ...members.map((m) => m.name)].map((name) => {
              const m = members.find((mem) => mem.name === name);
              const active = memberFilter === name;
              return (
                <button
                  key={name}
                  onClick={() => setMemberFilter(name)}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer
                    ${active ? "bg-olive text-egg border-olive" : "bg-white text-mauve border-olive-light hover:border-olive"}`}
                >
                  {name !== "All" && m && (
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${avatarCls[m.type]?.split(" ")[0] || "bg-olive-light"}`} />
                  )}
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {activeTab === "all" ? (
          <AllFamilyMeds members={members} onNudge={handleNudge} />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredMembers.map((member) => (
              <MemberMedsCard key={member._id} member={member} onNudge={handleNudge} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <Toast toasts={toasts} />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}