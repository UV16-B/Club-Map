const express = require('express'); const fs = require('fs'); const path = require('path');
const app = express();
app.use(express.static('public')); app.use(express.json());
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/api/cities', (req, res) => {
    fs.readFile('./data/cities.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Не удалось прочитать файл' });
        res.json(JSON.parse(data));
    });
});
app.get('/api/clubs', (req, res) => {
    fs.readFile('./data/clubs.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Не удалось прочитать файл' });
        res.json(JSON.parse(data));
    });
});
app.post('/api/clubs', async (req, res) => {
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