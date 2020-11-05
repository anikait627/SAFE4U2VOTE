const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');
const app = express();

const port = process.env.PORT || 8888;

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));

// google civic api endpoint
app.get("/locations", async (req, res) => {

    const baseCivicsRequest = "https://www.googleapis.com/civicinfo/v2/voterinfo";
    const { address, city, state, zipCode }  = req.query;
    const addressVar = `${address} ${city} ${state} ${zipCode}`;
    const fullRequest = baseCivicsRequest + "?key=" + process.env.GOOGLE_API_KEY + "&address=" + encodeURIComponent(addressVar) + "&electionid=7000";
    const locations = await fetch(fullRequest).then((resp) => resp.json());
    return res.json(locations['earlyVoteSites']);

});

const baseCovidRequest = "https://knowi.com/api/data/ipE4xJhLBkn8H8jisFisAdHKvepFR5I4bGzRySZ2aaXlJgie?entityName=County%207%20day%20growth%20rates";
const county = "Brazos%20County";
const fullCovidRequest = baseCovidRequest + "&c9SqlFilter=select%20*%20where%20County%20like%20" + county + "%20and%20Type%20like%20confirmed%20limit%201";

app.use(express.static('build'))
app.use("*", (req, res) => res.sendFile(process.cwd()+"/build/index.html"));

app.listen(parseInt(port, 10), () =>
  console.log(`Express server is running on localhost:${port}`)
);