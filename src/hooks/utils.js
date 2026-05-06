
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