import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHero } from '../features/profile/ProfileHero';
import { Field, TagList, MedList } from '../features/profile/ProfileFields';

import Navbar from "../components/layout/Navbar";
import Footer from '../components/layout/Footer';

import { getAge } from '../hooks/utils';
import { BASE_URL } from '../hooks/constants';

import {
  SectionHeader,
  VitalAvgCard,
  EmptyState
} from '../components/ui/ProfileComponents';

import LabTestCard from '../features/profile/LabTestCard';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [summaries, setSummaries] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [activeMonth, setActiveMonth] = useState(0);

  const navigate = useNavigate();

  // ================= FETCH ================= //
  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!stored || !token) {
      navigate('/login');
      return;
    }

    const fetchAll = async () => {
      try {
        const user = JSON.parse(stored);
        const userId = user?._id || user?.id;

        if (!userId) {
          navigate('/login');
          return;
        }

        const authHeader = {
          Authorization: `Bearer ${token}`
        };

        const [pRes, sRes, lRes] = await Promise.all([
          fetch(`${BASE_URL}/users/get/${userId}`, { headers: authHeader }),
          fetch(`${BASE_URL}/monthly-summary/user/${userId}`, { headers: authHeader }),
          fetch(`${BASE_URL}/lab-tests/user/${userId}`, { headers: authHeader }),
        ]);

        // PROFILE
        if (pRes.ok) {
          const d = await pRes.json();
          setProfile(d?.user ?? d ?? null);
        } else {
          setProfile(user);
        }

        // SUMMARIES
        if (sRes.ok) {
          const d = await sRes.json();
          setSummaries(Array.isArray(d) ? d : (d?.summaries ?? []));
        }

        // LAB TESTS (FIXED labRes bug)
        if (lRes.ok) {
          const d = await lRes.json();
          setLabTests(Array.isArray(d) ? d : (d?.labTests ?? []));
        }

      } catch (err) {
        console.error('Fetch error:', err);
        try {
          setProfile(JSON.parse(stored));
        } catch {
          setProfile(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  // ================= EDIT ================= //
  const startEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!draft?._id) return;

    try {
      const res = await fetch(`${BASE_URL}/users/update/${draft._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(draft)
      });

      if (res.ok) {
        const data = await res.json();
        const updated = data?.user ?? draft;

        setProfile(updated);

        const store = localStorage.getItem('user')
          ? localStorage
          : sessionStorage;

        store.setItem('user', JSON.stringify(updated));

        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // ================= LOADING GUARDS ================= //
  if (isLoading) {
    return (
      <div className="p-20 text-center font-black text-midnight">
        LOADING...
      </div>
    );
  }

  if (!profile) return null;

  const p = editing ? draft : profile;
  const set = (key, val) =>
    setDraft(prev => ({ ...prev, [key]: val }));

  const profileId = p?._id || p?.id;

  const currentSummary = summaries[activeMonth];
  const memberSummary = currentSummary?.memberSummaries?.find(
    m => String(m.memberId) === String(profileId)
  );

  // ================= UI ================= //
  return (
    <div className="min-h-screen bg-egg text-midnight">
      <Navbar variant="auth" />
      <main className="max-w-3xl mx-auto px-6 py-10 pt-30">

        <ProfileHero
          p={p}
          editing={editing}
          onEdit={startEdit}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          set={set}
          fullName={p.name}
          saved={saved}
          age={getAge(new Date(p.birthdate))}
        />

        {/* ACCOUNT */}
        <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-6 shadow-sm">
          <SectionHeader icon="👤" label="Account Details" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            <Field label="Full Name" value={p.name} editing={editing} onChange={v => set('name', v)} />
            <Field label="Email Address" value={p.email} editing={false} />
            <Field
              label="Birthday"
              value={p.birthdate?.split('T')[0]}
              type="date"
              editing={editing}
              onChange={v => set('birthdate', v)}
            />
            <Field
              label="Blood Type"
              value={p.bloodType}
              type="select"
              options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
              editing={editing}
              onChange={v => set('bloodType', v)}
            />
          </div>
        </div>

        {/* MEDICAL TAGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-[24px] p-8 border border-olive-light shadow-sm">
            <SectionHeader icon="⚠️" label="Allergies" />
            <TagList
              items={p.allergies ?? []}
              editing={editing}
              color="coral"
              onAdd={v =>
                set('allergies', [...(p.allergies ?? []), v])
              }
              onRemove={v =>
                set('allergies', (p.allergies ?? []).filter(a => a !== v))
              }
            />
          </div>

          <div className="bg-white rounded-[24px] p-8 border border-olive-light shadow-sm">
            <SectionHeader icon="🩺" label="Conditions" />
            <TagList
              items={p.medicalConditions ?? []}
              editing={editing}
              color="jasmine"
              onAdd={v =>
                set('medicalConditions', [...(p.medicalConditions ?? []), v])
              }
              onRemove={v =>
                set('medicalConditions', (p.medicalConditions ?? []).filter(c => c !== v))
              }
            />
          </div>

        </div>

        {/* MEDS */}
        <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-10 shadow-sm">
          <SectionHeader icon="💊" label="Maintenance Medications" />
          <MedList
            meds={p.maintenanceMeds ?? []}
            editing={editing}
            onAdd={m =>
              set('maintenanceMeds', [...(p.maintenanceMeds ?? []), m])
            }
            onRemove={i =>
              set(
                'maintenanceMeds',
                (p.maintenanceMeds ?? []).filter((_, j) => j !== i)
              )
            }
          />
        </div>

        {/* MONTHLY SUMMARY */}
        <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-6 shadow-sm">
          <SummaryHeader
            summaries={summaries}
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
          />

          {!memberSummary ? (
            <EmptyState message="No health data found for this month." />
          ) : (
            <div className="space-y-6">
              <VitalsGrid logs={memberSummary.logsSummary} />
            </div>
          )}
        </div>

        {/* LAB TESTS */}
        <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-10 shadow-sm">
          <SectionHeader icon="🔬" label="Lab Test History" />

          {labTests.length === 0 ? (
            <EmptyState message="No lab tests uploaded." />
          ) : (
            labTests.map((t, i) => (
              <LabTestCard key={t._id ?? i} test={t} />
            ))
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}

// ================= SUBCOMPONENTS ================= //

function SummaryHeader({ summaries, activeMonth, setActiveMonth }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="text-xl">📅</span>
        <h3 className="font-display font-black text-xs uppercase tracking-widest">
          Monthly Health Summary
        </h3>
      </div>

      <div className="flex gap-2">
        {summaries.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveMonth(i)}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeMonth === i
                ? 'bg-midnight text-egg'
                : 'bg-egg border'
            }`}
          >
            {new Date(s.month).toLocaleDateString('en-US', {
              month: 'short'
            })}
          </button>
        ))}
      </div>
    </div>
  );
}

function VitalsGrid({ logs }) {
  if (!logs?.averageLogs) return null;

  const {
    weight,
    heartRate,
    bloodSugarLevel,
    waterIntake
  } = logs.averageLogs;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <VitalAvgCard label="Weight" value={weight} unit="kg" />
      <VitalAvgCard label="Heart Rate" value={heartRate} unit="bpm" />
      <VitalAvgCard label="Blood Sugar" value={bloodSugarLevel} unit="mg/dL" />
      <VitalAvgCard label="Water" value={waterIntake} unit="L" />
    </div>
  );
}