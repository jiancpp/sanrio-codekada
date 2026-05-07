
export const getAge = (birthdate) => {
    if (!(birthdate instanceof Date) || isNaN(birthdate)) {
        return null;
    }

    const today = new Date();

    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    return age
}

export const formatDate = (dateInput) => {
  if (!dateInput) return null;

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper: format LOCAL date to YYYY-MM-DD
export const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  
export const getMonday = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDay(); // 0 = Sun
  
    const diff = day === 0 ? -6 : 1 - day; // shift to Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    monday.setHours(0, 0, 0, 0); // true local midnight
  
    return monday;
  };
  
export const toPHDate = (rawDate) => {
    const date = new Date(rawDate);
  
    // Convert UTC → PH time (+8 hours)
    const phDate = new Date(date.getTime() + (8 * 60 * 60 * 1000));
    
    return formatLocalDate(phDate);
  };

export const isSameDay = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear()
    && da.getMonth()    === db.getMonth()
    && da.getDate()     === db.getDate();
};

export const toMinutes = (timeStr) => {
  const [time, ampm] = timeStr.split(" ");
  let [h, m] = time.split(":").map(Number);

  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  return h * 60 + m;
};

export const nowMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const timeStatus = (scheduleStr, taken) => {
  if (taken) return "taken";

  const scheduled = toMinutes(scheduleStr);
  const now = nowMinutes();

  if (scheduled < now - 10) return "overdue";
  if (scheduled <= now + 60) return "soon";
  return "upcoming";
};

export function buildAllMeds(members) {
  const flat = members.flatMap(member =>
    (member.medsTaken ?? []).map(med => ({
      name:   med.name,
      time:   med.time  ?? '—',
      note:   med.note  ?? 'As prescribed',
      status: timeStatus(med.time, med.status), // "taken"|"soon"|"overdue"|"upcoming"
      member,                                 
    }))
  );
 
  // Sort chronologically
  flat.sort((a, b) => {
    const tA = toMinutes(a.time);
    const tB = toMinutes(b.time);
    if (tA !== tB) return tA - tB;
    const doneA = a.status === 'taken' ? 1 : 0;
    const doneB = b.status === 'taken' ? 1 : 0;
    return doneA - doneB;
  });
 
  return flat;
}

export function getTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const secondsDiff = Math.round((now - date) / 1000);
  const minutesDiff = Math.round(secondsDiff/ 60);
  const hoursDiff = Math.round(minutesDiff / 60);
  const daysDiff = Math.round(hoursDiff / 24);

  if (secondsDiff < 60) return "Just now";
  if (minutesDiff < 60) return `${minutesDiff}m ago`;
  if (hoursDiff < 24) return `${hoursDiff}h ago`;
  if (daysDiff < 7) return `${daysDiff}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})
} 