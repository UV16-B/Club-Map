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
        document.getElementById("city").value = defaultCity;
        ymaps.ready(() => init(defaultCity));
    });
function citySelect() {
    const citySelect = document.getElementById("city");
    Object.keys(citiesDB).forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.value = "Находка";
}
function updateDistricts(city) {
    const districtSelect = document.getElementById("district");
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
    document.getElementById("city").addEventListener("change", function () {
        const selectedCity = this.value;
        const c = citiesDB[selectedCity];
        if (c) map.setCenter([c.lat, c.lon], c.zoom);
        updateDistricts(selectedCity);
    });
    updateMap(clubsDB);
}