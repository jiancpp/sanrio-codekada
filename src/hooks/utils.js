
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