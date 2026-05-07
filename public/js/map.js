let map; export let clubsDB = []; let citiesDB = {}; let geoObjects = [];
export function initData() {
    fetch('/api/v1/clubs')
        .then(response => response.json())
        .then(data => {
            clubsDB = data;
            updateDistricts("Находка");
        });
    fetch('/api/v1/cities')
        .then(response => response.json())
        .then(data => {
            citiesDB = data;
            citySelect();
            const defaultCity = "Находка";
            document.getElementById("city").value = defaultCity;
            ymaps.ready(() => init(defaultCity));
        });
}
export function citySelect() {
    const citySelect = document.getElementById("city");
    Object.keys(citiesDB).forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.value = "Находка";
}
export function updateDistricts(city) {
    const districtSelect = document.getElementById("district");
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
export function updateMap(clubs) {
    geoObjects.forEach(obj => map.geoObjects.remove(obj));
    geoObjects = [];
    clubs.forEach(club => {
        const link = club.link ? `<a href=${club.link}>${club.name}</a>` : club.name
        let price = club.price === 0 ? "бесплатно" : `${club.price} руб.`;
        const isTV = window.innerWidth >= 3840;
        const placemark = new ymaps.Placemark(
            club.coordinates,
            {
                hintContent: club.name,
                balloonContentHeader: link,
                balloonContentBody: `Адрес: ${club.address}<br>Стоимость: ${price}`,
                balloonContentFooter: `Телефон: ${club.contact}`
            },
            {
                preset: 'islands#blueDotIcon',
                iconColor: '#0066cc',
                hasBalloon: !isTV
            }
        );
        map.geoObjects.add(placemark);
        geoObjects.push(placemark)
    });
}
export function init(city) {
    const cfg = citiesDB[city];
    if (!cfg) {
        console.error("Город не найден: ", city);
        return;
    }
    map = new ymaps.Map("map", {
        center: [cfg.lat, cfg.lon],
        zoom: window.innerWidth >= 3840 ? cfg.zoom + 2 : cfg.zoom,
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