const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => console.log(`Listening on port: ${port} ...`));

app.get('/weather/:start_coords/:end_coords', async (req, res) => {
    const key = process.env.DARKSKY_KEY;
    const base_url = 'https://api.darksky.net/forecast/' + key;

    //start
    const [start_lat, start_lon] = req.params.start_coords.split(",");
    const start_response = await fetch(base_url + `/${start_lat},${start_lon}`);
    const start_json = await start_response.json();

    //end
    const [end_lat, end_lon] = req.params.end_coords.split(',')
    const end_response = await fetch(base_url + `/${end_lat},${end_lon}`);
    const end_json = await end_response.json();

    data = {
        start: start_json,
        end: end_json
    }

    res.json(data)
});

app.get('/train/:depart_id', async (req, res) => {
    const depart_id = req.params.depart_id;
    const url = 'https://dv.njtransit.com/webdisplay/tid-mobile.aspx?sid=' + depart_id;

    const t_response = await fetch(url);
    const t_text = await t_response.text();

    res.send(t_text)
});