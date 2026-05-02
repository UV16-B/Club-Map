import * as init from './map.js';
init.initData();
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
    return "Вне диапозона";
}
document.getElementById('calculator').addEventListener('click', (e) => {
    e.preventDefault();
    const birthDate = document.getElementById("birth-date").value;
    if (!birthDate) return alert("Введите дату рождения");
    const ageGroup = determineAgeGroup(birthDate);
    document.getElementById("age-group-result").textContent = ageGroup;
});
document.getElementById('filter').addEventListener('click', (e) => {
    e.preventDefault();
    const city = document.getElementById("city").value;
    const district = document.getElementById("district").value;
    const activity = document.getElementById("activity").value;
    const priceMin = parseInt(document.getElementById("price-min").value) || 0;
    const priceMax = parseInt(document.getElementById("price-max").value) || Infinity;
    const ageGroup = document.getElementById("age-group-result").textContent;
    const filtered = init.clubsDB.filter(club => {
        return (
            club.city === city &&
            (district === "" || club.district === district) &&
            (activity === "" || club.activity === activity) &&
            club.price >= priceMin &&
            club.price <= priceMax &&
            (ageGroup === "" || club.ageGroup === ageGroup)
        );
    });
    init.updateMap(filtered);
});