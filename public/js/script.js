let map; let clubsDB = []; let citiesDB = {}; let geoObjects = [];
fetch('/api/clubs')
    .then(response => response.json())
    .then(data => {
        clubsDB = data;
        updateDistricts("Находка");
    });
fetch('/api/cities')
    .then(response => response.json())
    .then(data => {
        citiesDB = data;
        citySelect();
        const defaultCity = "Находка";
        document.getElementById("city-select").value = defaultCity;
        ymaps.ready(() => init(defaultCity));
    });
function citySelect() {
    const citySelect = document.getElementById("city-select");
    Object.keys(citiesDB).forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.value = "Находка";
}
function updateDistricts(city) {
    const districtSelect = document.getElementById("district-select");
    districtSelect.innerHTML = '<option value="">Все районы</option>';
    const districts = [...new Set(
        clubsDB
            .filter(club => club.city === city)
            .map(club => club.district)
    )];
    districts.forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}
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
function calculateAgeGroup() {
    const birthDate = document.getElementById("birth-date").value;
    if (!birthDate) return alert("Введите дату рождения");
    const ageGroup = determineAgeGroup(birthDate);
    document.getElementById("age-group-result").textContent = ageGroup;
}
function applyFilters() {
    const city = document.getElementById("city-select").value;
    const district = document.getElementById("district-select").value;
    const activity = document.getElementById("activity-select").value;
    const priceMin = parseInt(document.getElementById("price-min").value) || 0;
    const priceMax = parseInt(document.getElementById("price-max").value) || Infinity;
    const ageGroup = document.getElementById("age-group-result").textContent;
    const filtered = clubsDB.filter(club => {
        return (
            club.city === city &&
            (district === "" || club.district === district) &&
            (activity === "" || club.activity === activity) &&
            club.price >= priceMin &&
            club.price <= priceMax &&
            (ageGroup === "" || club.ageGroup === ageGroup)
        );
    });
    updateMap(filtered);
}
function updateMap(clubs) {
    geoObjects.forEach(obj => map.geoObjects.remove(obj));
    clubs.forEach(club => {
        const geoObject = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: club.coordinates
            },
            properties: {
                hintContent: club.name,
                balloonContent: `${club.name}<br>
                                Адрес: ${club.address}<br>
                                Стоимость: ${club.price} руб.<br>
                                Телефон: ${club.contact}`
            }
        });
        map.geoObjects.add(geoObject);
        geoObjects.push(geoObject)
    });
}
function init(city) {
    const cfg = citiesDB[city];
    if (!cfg) {
        console.error("Город не найден: ", city);
        return;
    }
    map = new ymaps.Map("map", {
        center: [cfg.lat, cfg.lon],
        zoom: cfg.zoom,
        controls: ['zoomControl', 'fullscreenControl']
    });
    document.getElementById("city-select").addEventListener("change", function () {
        const selectedCity = this.value;
        const c = citiesDB[selectedCity];
        if (c) map.setCenter([c.lat, c.lon], c.zoom);
        updateDistricts(selectedCity);
    });
    updateMap(clubsDB);
}