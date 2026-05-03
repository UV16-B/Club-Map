function determineAgeGroup(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    if (age >= 3 && age <= 5) return "3-5 лет";
    if (age >= 6 && age <= 7) return "6-7 лет";
    if (age >= 8 && age <= 10) return "8-10 лет";
    if (age >= 11 && age <= 14) return "11-14 лет";
    if (age >= 15 && age <= 17) return "15-17 лет";
    return "Вне диапазона";
}
module.exports = { determineAgeGroup };