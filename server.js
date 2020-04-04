const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => console.log(`Listening on port: ${port} ...`));

const coords = {
    start: {
        lat: process.env.START_LAT,
        lon: process.env.START_LON
    },    
    end: {
        lat: process.env.END_LAT,
        lon: process.env.END_LON
    }
}

app.get('/weather', async (req, res) => {
    const key = process.env.DARKSKY_KEY;
    const url = 'https://api.darksky.net/forecast/' + key;

    const start_response = await fetch(url + `/${coords.start.lat},${coords.start.lon}`);
    const start_json = await start_response.json();
    
    const end_response = await fetch(url + `/${coords.end.lat},${coords.end.lon}`);
    const end_json = await end_response.json();

    data = {
        start: start_json,
        end: end_json
    }

    res.json(data)
});