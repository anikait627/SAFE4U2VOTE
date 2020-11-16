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
    //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,
    //+Mountain+View,+CA&key=YOUR_API_KEY
    const baseGeoRequest = "https://maps.googleapis.com/maps/api/geocode/json?address="
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    const baseCivicsRequest = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
    const { address, city, state, zipCode }  = req.query;
    const addressVar = `${address}${city}`;

    const GeoRequest = baseGeoRequest + address + ",+" + city + ",+" + state + "&key=" + process.env.GOOGLE_API_KEY;
    const lnglat = await fetch(GeoRequest).then((resp) => resp.json());
    console.log(lnglat['results'][0]["geometry"]["location"]["lat"]);

    const fullRequest = baseCivicsRequest + lnglat['results'][0]["geometry"]["location"]["lat"] + "," + lnglat['results'][0]["geometry"]["location"]["lng"]
    + "&radius=1500&type=restaurant" + "&key=" + process.env.GOOGLE_API_KEY;
    const locations = await fetch(fullRequest).then((resp) => resp.json());

    const pollloca = locations['results'];
    console.log(pollloca)
   

    //COVID index
    //for every location in the locations['earlyVoteSites']
    for (var locat in pollloca) {

      var ratio = (Math.random(10) + Math.random()).toFixed(2);
      pollloca[locat] = {...pollloca[locat], index: ratio};
      pollloca[locat] = {...pollloca[locat], address: pollloca[locat]['vicinity']};
      pollloca[locat] = {...pollloca[locat], city: city};
      pollloca[locat] = {...pollloca[locat], state: state};
      pollloca[locat] = {...pollloca[locat], zipCode: zipCode};
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
    //console.log(pollloca)
    return res.json(pollloca);

    //return res.json(locations['pollingLocations']);
});

app.use(express.static('build'))
app.use("*", (req, res) => res.sendFile(process.cwd()+"/build/index.html"));

app.listen(parseInt(port, 10), () =>
  console.log(`Express server is running on localhost:${port}`)
);