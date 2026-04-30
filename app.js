const express = require('express'); const fs = require('fs'); const path = require('path');
const app = express();
app.use(express.static('public'));
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
module.exports = app;