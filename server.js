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

app.use(express.static('build'))
app.use("*", (req, res) => res.sendFile(process.cwd()+"/build/index.html"));

app.listen(parseInt(port, 10), () =>
  console.log(`Express server is running on localhost:${port}`)
);