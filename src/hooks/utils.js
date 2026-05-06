
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