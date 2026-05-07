import { useEffect, useState } from 'react';

import { MemberCard } from '../features/dashboard/MemberCard';
import { QuickAction } from '../features/dashboard/QuickAction';
import { DailyLogPanel } from '../features/dashboard/DailyLogPanel'; // Ensure these are separate
import { FamilyStreakPanel } from '../features/dashboard/FamilyStreakPanel';

import Navbar from "../components/layout/Navbar";
import Footer from '../components/layout/Footer';

import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../hooks/constants';
import { getAge } from '../hooks/utils';

import socket from '../hooks/socket';
import { useApi } from '../hooks/useApi';

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Socket connection error:", err.message);
});

export default function FamilyDashboard() {
  // =========== Frontend Variables ================== //
  
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("log"); // 'log' or 'streak'
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const message = `You're invited to TalaCare ❤️

Join my family using this code: ${family?.familyCode}

🌐 https://talacare.onrender.com/`;
    
    navigator.clipboard.writeText(message);    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // =========== Backend connection ================== //
  const { getDailyLog, remindMember, error } = useApi();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // to prevent page crash

  // Allow real time updates from family
  useEffect(() => {
    if (family?.familyCode) {
      socket.emit("join-family", family.familyCode);
    }
  }, [family]);

  // Get notifications
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  // Load data
  useEffect (() => {
    const storedUserString = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (storedUserString) {
      const parsedUser = JSON.parse(storedUserString);
      setUser(parsedUser);

      const fetchMembers = async () => {
        try {
          const response = await fetch(`${BASE_URL}/family/get/${parsedUser.familyCode}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Security key
            }
          });

          // Unpack the JSON data
          const data = await response.json();

          if (response.ok) {

            const updatedMembers = await Promise.all(
              data.members.map(async (member) => {
            
                const dailyLog = await getDailyLog(member._id, new Date());
                return {
                  ...member,
                  age: getAge(new Date(member.birthdate)) || 'N/A',
                  initial: member.name.slice(0, 2).toUpperCase(),
                  bp: dailyLog?.vitals.bloodPressure || null,
                  hr: dailyLog?.vitals.heartRate || null,
                };
              })
            );

            setFamily(data);
            setMembers(updatedMembers);
            setSelected((prev) => prev || updatedMembers[0]); 
          } else {
            console.error("Backend error:", data.message);
          }

        } catch (error) {
          console.error("Network error:", error);
        } finally {
          setIsLoading(false); // Stop the loading spinner
        }
      }
      
      fetchMembers();

      socket.on("daily-log-updated", () => {
        fetchMembers();
      });
    
      return () => {
        socket.off("daily-log-updated");
      };

    } else {
      navigate('/login')
    }
  }, [navigate])

  // NOT YET TESTED
  const handleNudge = async (memberNudged) => {
    if (memberNudged?.loggedToday) return;

    let message = "Don't forget to save your daily log!"
    const data = await remindMember({
      familyCode: family?.familyCode,
      from: user?._id || null,
      to: memberNudged?._id,
      message
    })
    console.log(data); // REMOVE ME JIA
  }

  // =========================================== //
  return (
    <div className="min-h-screen bg-egg text-midnight">
      <Navbar variant="auth" />
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 pt-30 pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight uppercase">Family Dashboard</h1>
          <p className="text-sm text-gray-400 font-medium italic">{family?.familyName}</p>
        </div>
        
        <button 
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm
            ${copied ? 'bg-olive text-egg' : 'bg-midnight text-egg hover:bg-olive-dark'}`}
        >
          <span>{copied ? '✅' : '🔗'}</span>
          {copied ? 'Copied!' : 'Copy Invite Link'}
        </button>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Members Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
          {members.map((member) => (
            <MemberCard 
              key={member._id} 
              member={member} 
              selected={selected?._id === member._id}
              onClick={setSelected}
              onNudge={handleNudge}
            />
          ))}
        </div>

        {/* Right: Interaction & Tools */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Interaction Panel */}
          <div className="bg-white rounded-[20px] border border-olive-light overflow-hidden shadow-sm flex flex-col">
            {/* Tabs Navigation */}
            <div className="flex border-b border-olive-light">
              <button
                onClick={() => setActiveTab("streak")}
                className={`flex-1 py-4 font-display font-black text-xs uppercase tracking-widest transition-all
                  ${activeTab === "streak" ? "bg-white border-b-2 border-olive text-midnight" : "bg-egg/50 text-gray-400"}`}
              >
                Family Streak
              </button>
              <button
                onClick={() => setActiveTab("log")}
                className={`flex-1 py-4 font-display font-black text-xs uppercase tracking-widest transition-all
                  ${activeTab === "log" ? "bg-white border-b-2 border-olive text-midnight" : "bg-egg/50 text-gray-400"}`}
              >
                Daily Log
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[500px]">
              {activeTab === "streak" ? (
                <FamilyStreakPanel members={members} />
              ) : (
                <DailyLogPanel member={selected} />
              )}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="space-y-3">
            <QuickAction 
              title="Upload Lab Tests" 
              icon="🖼️" 
              colorClass="bg-jasmine-light" 
              sub="Store results per member" 
            />
            <QuickAction 
              title="Medication Schedule" 
              icon="💊" 
              colorClass="bg-coral-light" 
              sub={`${members.filter(m => !m.loggedToday).length} members pending logs`} 
            />
            <QuickAction 
              onClick={() => navigate("/emergency")}
              title="Emergency Info" 
              icon="🆘" 
              colorClass="bg-coral-light" 
              isDark 
              sub="Quick access to blood types & meds" 
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



// Sample Data
const MEMBERS = [
  {
    id: 1, initial: "MA", name: "Mama", age: 58,
    status: "BP logged · 1h ago", type: "olive",
    streak: 12, loggedToday: true,
    bp: "118/76", hr: "72", sugar: "98", weight: "62",
    meds: ["Amlodipine 5mg", "Metformin 500mg"],
    medsChecked: [true, true],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    bloodType: "O+",
  },
  {
    id: 2, initial: "PA", name: "Papa", age: 62,
    status: "⚠️ Missed meds today", type: "jasmine",
    streak: 5, loggedToday: false,
    bp: "135/88", hr: "80", sugar: "112", weight: "78",
    meds: ["Losartan 50mg", "Atorvastatin 20mg"],
    medsChecked: [false, false],
    conditions: ["Hypertension", "High Cholesterol"],
    bloodType: "A+",
  },
  {
    id: 3, initial: "KU", name: "Kuya", age: 30,
    status: "Dubai · Logged today ✓", type: "coral",
    streak: 7, loggedToday: true,
    bp: "120/80", hr: "68", sugar: "90", weight: "74",
    meds: ["Vitamin D 1000IU"],
    medsChecked: [true],
    conditions: [],
    bloodType: "B+",
  },
  {
    id: 4, initial: "SH", name: "Shielo", age: 25,
    status: "Log today's vitals →", type: "mauve",
    streak: 3, loggedToday: false,
    bp: "—", hr: "—", sugar: "—", weight: "—",
    meds: ["Ferrous Sulfate 325mg"],
    medsChecked: [false],
    conditions: ["Iron Deficiency Anemia"],
    bloodType: "AB+",
  },
];