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
    
   //const distanceRequest = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=H8MW%2BWP%20Kolkata%20India&destinations=GCG2%2B3M%20Kolkata%20India&key="

    //COVID index
    //for every location in the locations['earlyVoteSites']
    for (var locat in pollloca) {

      var ratio = (Math.random(10) + Math.random()).toFixed(2);
      pollloca[locat] = {...pollloca[locat], index: ratio};
      pollloca[locat] = {...pollloca[locat], distance: ratio*3};
      //get county name??
      //get the region name for population density

      //distance
      //through Google Map API

      //get COVID total infected of a county (totalInfect)
      //get COVID testing positive rate of recent 3 weeks (posiRate)
      //get population density over a region (popuDen)
        //need to figure out how this API works for a region
      //COVID Index = totalInfect*posiRate*popuDen (not scaled)
    }
      //Scaled COVID Index:
      //get total infected of the State
      //get total infected of the county
      //COVID Index = (total infected of the county/total infected of the State)*numbets of counties of a State*population density of region/population density of the county * 5
      //any index greater than 5 could has more severity of COVID than others

      //store them as locations['COVID-Index']

    // sort the res by covid indx
    pollloca.sort((a,b) => a.index - b.index);
    
    return res.json(pollloca);

    //return res.json(locations['pollingLocations']);
});

app.use(express.static('build'))
app.use("*", (req, res) => res.sendFile(process.cwd()+"/build/index.html"));

app.listen(parseInt(port, 10), () =>
  console.log(`Express server is running on localhost:${port}`)
);