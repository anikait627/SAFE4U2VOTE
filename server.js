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
    const fullRequest = baseCivicsRequest + "?key=" + process.env.GOOGLE_API_KEY + "&address=" + encodeURIComponent(addressVar) + "&electionid=2000";
    const locations = await fetch(fullRequest).then((resp) => resp.json());
    const pollloca = locations['pollingLocations'];
    

    //COVID index
    //for every location in the locations['earlyVoteSites']
    for (var locat in pollloca) {
      var ratio = (Math.random(10) + Math.random()).toFixed(2);
      pollloca[locat] = {...pollloca[locat], index: ratio};
      

      const baseDisRequest = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial";
      const addressVarOri = `${address} ${city} ${state} $`;
      const addressVarDis = `${address} ${city} ${state} $`; //need to be fixed
      const fullRequestDis = baseDisRequest + "&origins=" + encodeURIComponent(addressVarOri) + "&destinations=" + encodeURIComponent(addressVarDis) + "&key=" + process.env.GOOGLE_API_KEY;
      const distances = await fetch(fullRequestDis).then((resp) => resp.json());
      const distance = distances['rows']['distance']['text'];
      //https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=YOUR_API_KEY
      pollloca[locat] = {...pollloca[locat], distance: distances};
    }
    pollloca.sort((a,b) => a.index - b.index);
    
    return res.json(pollloca);
});

app.use(express.static('build'))
app.use("*", (req, res) => res.sendFile(process.cwd()+"/build/index.html"));

app.listen(parseInt(port, 10), () =>
  console.log(`Express server is running on localhost:${port}`)
);