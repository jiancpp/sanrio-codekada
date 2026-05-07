import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from "../components/layout/Navbar";
import Footer from '../components/layout/Footer';

import { ProfileHero }              from '../features/profile/ProfileHero';
import { Field, TagList, MedList }  from '../features/profile/ProfileFields';
import HealthSummary                from '../features/profile/HealthSummary';
import LabTestCard                  from '../features/profile/LabTestCard';

import { SectionHeader, EmptyState } from '../components/ui/ProfileComponents';
import { getAge }                    from '../hooks/utils';
import { BASE_URL }                  from '../hooks/constants';

export default function ProfilePage() {
  const [profile, setProfile]           = useState(null);
  const [editing, setEditing]           = useState(false);
  const [draft, setDraft]               = useState(null);
  const [saved, setSaved]               = useState(false);
  const [saveError, setSaveError]       = useState(null);
  const [isSaving, setIsSaving]         = useState(false);
  const [isLoading, setIsLoading]       = useState(true);
  const [summaries, setSummaries]       = useState([]);
  const [labTests, setLabTests]         = useState([]);
  const [activeMonth, setActiveMonth]   = useState(0);

  const navigate = useNavigate();

  // ── Helpers ────────────────────────────────────────────────
  // loginUser stores { id } — fetched doc has { _id }
  const resolveId = (obj) => obj?._id ?? obj?.id ?? null;

  const getAuth = () => ({
    stored: localStorage.getItem('user') || sessionStorage.getItem('user'),
    token:  localStorage.getItem('token') || sessionStorage.getItem('token'),
  });

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    const { stored, token } = getAuth();
    if (!stored || !token) { navigate('/login'); return; }

    const fetchAll = async () => {
      try {
        const parsedUser = JSON.parse(stored);
        const userId     = parsedUser?.id ?? parsedUser?._id;
        if (!userId) { navigate('/login'); return; }

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const [pRes, sRes, lRes] = await Promise.all([
          fetch(`${BASE_URL}/users/get/${userId}`,            { headers }),
          fetch(`${BASE_URL}/monthly-summary/user/${userId}`, { headers }),
          fetch(`${BASE_URL}/lab-tests/user/${userId}`,       { headers }),
        ]);

        // getMemberInfo returns User doc directly
        if (pRes.ok) {
          setProfile(await pRes.json());
        } else {
          console.warn('Profile fetch failed — falling back to stored user');
          setProfile(parsedUser);
        }

        if (sRes.ok) {
          const d = await sRes.json();
          setSummaries(Array.isArray(d) ? d : (d?.summaries ?? []));
        }

        if (lRes.ok) {
          const d = await lRes.json();
          setLabTests(Array.isArray(d) ? d : (d?.labTests ?? []));
        }

      } catch (err) {
        console.error('Fetch error:', err);
        try {
          setProfile(JSON.parse(getAuth().stored));
        } catch {
          setProfile(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  // ── Edit handlers ──────────────────────────────────────────
  const startEdit = () => {
    setSaveError(null);
    setDraft(JSON.parse(JSON.stringify(profile)));
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditing(false);
    setSaveError(null);
  };

  // editMemberInfo: PUT /users/profile/edit-info/:id
  // Accepts: name, birthdate, bloodType, allergies, medicalConditions, maintenanceMeds
  // Returns: updated User doc directly
  const handleSave = async () => {
    const { token } = getAuth();
    const userId    = resolveId(draft);

    if (!userId) { setSaveError('Could not determine user ID — please log in again.'); return; }
    if (!token)  { navigate('/login'); return; }

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`${BASE_URL}/users/profile/edit-info/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name:              draft.name,
          birthdate:         draft.birthdate,
          bloodType:         draft.bloodType,
          allergies:         draft.allergies         ?? [],
          medicalConditions: draft.medicalConditions ?? [],
          maintenanceMeds:   draft.maintenanceMeds   ?? [],
        }),
      });

      if (res.ok) {
        const updatedDoc = await res.json();

        setProfile(updatedDoc);
        setEditing(false);
        setDraft(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);

        // Sync storage — preserve login fields, update editable fields
        const store      = localStorage.getItem('user') ? localStorage : sessionStorage;
        const storedUser = JSON.parse(store.getItem('user') ?? '{}');
        store.setItem('user', JSON.stringify({
          ...storedUser,
          name:              updatedDoc.name,
          bloodType:         updatedDoc.bloodType,
          birthdate:         updatedDoc.birthdate,
          allergies:         updatedDoc.allergies,
          medicalConditions: updatedDoc.medicalConditions,
          maintenanceMeds:   updatedDoc.maintenanceMeds,
        }));
      } else {
        const errData = await res.json().catch(() => ({}));
        setSaveError(errData.message ?? 'Save failed — please try again.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveError('Network error — check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Guards ─────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-egg flex items-center justify-center">
      <p className="font-display font-black text-midnight text-lg animate-pulse">Loading...</p>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-egg flex items-center justify-center">
      <p className="font-display font-black text-coral">Could not load profile.</p>
    </div>
  );

  // ── Derived ────────────────────────────────────────────────
  const p         = editing ? draft : profile;
  const set       = (key, val) => setDraft(prev => ({ ...prev, [key]: val }));
  const profileId = resolveId(p);

  const storedUser  = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const loggedInId  = resolveId(storedUser);
  const currentRole = profile?.role ?? storedUser?.role;
  const canEdit     = loggedInId === profileId || currentRole === 'Manager';

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-egg text-midnight">
      <Navbar variant="auth" />

      <main className="max-w-3xl mx-auto px-6 py-10 pt-30">

        {/* Profile Hero */}
        <ProfileHero
          p={p}
          editing={editing}
          onEdit={canEdit ? startEdit : undefined}
          onSave={handleSave}
          onCancel={cancelEdit}
          set={set}
          fullName={p.name}
          saved={saved}
          isSaving={isSaving}
          age={p.birthdate ? getAge(new Date(p.birthdate)) : null}
        />

        {/* Save error banner */}
        {saveError && (
          <div className="mb-4 flex items-center gap-3 bg-coral-light border border-coral text-coral-dark rounded-2xl px-5 py-3">
            <span className="flex-shrink-0">⚠️</span>
            <p className="text-sm font-medium flex-1">{saveError}</p>
            <button
              onClick={() => setSaveError(null)}
              className="text-coral-dark/60 hover:text-coral-dark text-xl leading-none"
            >×</button>
          </div>
        )}

        {/* ── Account Details ── */}
        <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-6 shadow-sm">
          <SectionHeader icon="👤" label="Account Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            <Field
              label="Full Name"
              value={p.name ?? ''}
              editing={editing}
              onChange={v => set('name', v)}
            />
            <Field
              label="Email Address"
              value={p.email ?? ''}
              editing={false}
            />
            <Field
              label="Birthday"
              value={p.birthdate ? p.birthdate.split('T')[0] : ''}
              type="date"
              editing={editing}
              onChange={v => set('birthdate', v)}
            />
            <Field
              label="Blood Type"
              value={p.bloodType ?? ''}
              type="select"
              options={['A+','A-','B+','B-','AB+','AB-','O+','O-']}
              editing={editing}
              onChange={v => set('bloodType', v)}
            />
            <Field
              label="Family Code"
              value={p.familyCode ?? storedUser?.familyCode ?? ''}
              editing={false}
            />
            <Field
              label="Role"
              value={p.role ?? currentRole ?? ''}
              editing={false}
            />
          </div>
        </div>

        {/* ── Allergies + Conditions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-[24px] p-8 border border-olive-light shadow-sm">
            <SectionHeader icon="⚠️" label="Allergies" />
            <TagList
              items={p.allergies ?? []}
              editing={editing}
              color="coral"
              onAdd={v    => set('allergies', [...(p.allergies ?? []), v])}
              onRemove={v => set('allergies', (p.allergies ?? []).filter(a => a !== v))}
            />
          </div>
          <div className="bg-white rounded-[24px] p-8 border border-olive-light shadow-sm">
            <SectionHeader icon="🩺" label="Conditions" />
            <TagList
              items={p.medicalConditions ?? []}
              editing={editing}
              color="jasmine"
              onAdd={v    => set('medicalConditions', [...(p.medicalConditions ?? []), v])}
              onRemove={v => set('medicalConditions', (p.medicalConditions ?? []).filter(c => c !== v))}
            />
          </div>
        </div>

        {/* ── Maintenance Meds ── */}
        <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-6 shadow-sm">
          <SectionHeader icon="💊" label="Maintenance Medications" />
          <MedList
            meds={p.maintenanceMeds ?? []}
            editing={editing}
            onAdd={m    => set('maintenanceMeds', [...(p.maintenanceMeds ?? []), m])}
            onRemove={i => set('maintenanceMeds', (p.maintenanceMeds ?? []).filter((_, j) => j !== i))}
            onChange={(i, key, val) => set(
              'maintenanceMeds',
              (p.maintenanceMeds ?? []).map((m, j) => j === i ? { ...m, [key]: val } : m)
            )}
          />
        </div>

        {/* ── Monthly Summary — now a standalone component ── */}
        <HealthSummary
          summaries={summaries}
          activeMonth={activeMonth}
          setActiveMonth={setActiveMonth}
          userId={profileId}
        />

        {/* ── Lab Test History ── */}
        <div className="bg-white rounded-[24px] p-8 border border-olive-light mb-10 shadow-sm">
          <SectionHeader icon="🔬" label="Lab Test History" />
          {labTests.length === 0 ? (
            <EmptyState message="No lab tests uploaded." />
          ) : (
            <div className="space-y-3">
              {labTests.map((t, i) => (
                <LabTestCard key={t._id ?? t.id ?? i} test={t} />
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}