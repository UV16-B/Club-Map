import * as init from './map.js';
init.initData();
document.getElementById('add-club-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newClub = {
        id: init.clubsDB.length + 1,
        name: document.getElementById('name').value,
        city: document.getElementById('city').value,
        district: document.getElementById('district').value,
        activity: document.getElementById('activity').value,
        ageGroup: document.getElementById('age-group').value,
        price: parseInt(document.getElementById('price').value),
        address: document.getElementById('address').value,
        coordinates: [
            parseFloat(document.getElementById('lat').value),
            parseFloat(document.getElementById('lon').value)
        ],
        contact: document.getElementById('contact').value
    };
    try {
        const response = await fetch('/api/clubs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClub)
        });
        if (response.ok) {
            const addedClubs = [...init.clubsDB, newClub];
            init.updateMap(addedClubs);
            document.getElementById('message').innerText = 'Кружок добавлен!';
            document.getElementById('add-club-form').reset();
        }
        else throw new Error('Ошибка при добавлении кружка');
    }
    catch (error) { document.getElementById('message').innerText = `Ошибка: ${error.message}`; }
});