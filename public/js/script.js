import * as init from './map.js';
init.initData();
function determineAgeGroup(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    const ageRanges = { '3-5': [3, 5], '6-7': [6, 7], '8-10': [8, 10], '11-14': [11, 14], '15-17': [15, 17] };
    for (const [range, [min, max]] of Object.entries(ageRanges)) if (age >= min && age <= max) return `${range} лет`;
    return "Вне диапазона";
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