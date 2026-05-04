const express = require('express'); const fs = require('fs').promises; const path = require('path');
const app = express();
app.use(express.static('public')); app.use(express.json());
app.get('/', async (req, res) => {
    try { res.sendFile(path.join(__dirname, 'views', 'index.html')) }
    catch (error) { res.status(500).json({ error: 'Ошибка при загрузке страницы' }); }
});
app.get('/admin', async (req, res) => {
    try { res.sendFile(path.join(__dirname, 'views', 'admin.html')) }
    catch (error) { res.status(500).json({ error: 'Ошибка при загрузке страницы администратора' }); }
});
app.get('/api/v1/cities', async (req, res) => {
    try {
        const data = await fs.readFile('./data/cities.json', 'utf8');
        res.json(JSON.parse(data));
    }
    catch (error) { res.status(500).json({ error: 'Не удалось прочитать список кружков' }); }
});
app.get('/api/v1/clubs', async (req, res) => {
    try {
        const data = await fs.readFile('./data/clubs.json', 'utf8');
        res.json(JSON.parse(data));
    }
    catch (error) { res.status(500).json({ error: 'Не удалось прочитать список кружков' }); }
});
app.post('/api/v1/clubs', async (req, res) => {
    try {
        const data = await fs.promises.readFile('./data/clubs.json', 'utf8');
        let clubs = JSON.parse(data);
        clubs.push(req.body);
        await fs.promises.writeFile('./data/clubs.json', JSON.stringify(clubs, null, 2));
        res.status(201).json(req.body);
    }
    catch (error) { res.status(500).json({ error: 'Ошибка при сохранении данных' }); }
});
module.exports = app;