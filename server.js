const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');
const app = express();

const port = process.env.PORT || 8888;

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/locations", async (req, res) => {
  try {
    const baseCivicsRequest = "https://www.googleapis.com/civicinfo/v2/voterinfo";
    const addressVar = `${address} ${city} ${state} ${zipCode}`;
    const fullRequest = baseCivicsRequest + "?key=" + process.env.GOOGLE_API_KEY + "&address=" + encodeURIComponent(addressVar) + "&electionId=2000";
    const locations = await fetch(fullRequest).then((resp) => resp.json());
    const pollloca = locations['pollingLocations'];
    
    const baseGeoRequest = "https://maps.googleapis.com/maps/api/geocode/json?address="
    const GeoRequest = baseGeoRequest + address + ",+" + city + ",+" + state + "&key=" + process.env.GOOGLE_API_KEY;
    const lnglat = await fetch(GeoRequest).then((resp) => resp.json());
    address_component = lnglat['results'][0]["address_components"]
    county = address_component[address_component.length-4]['short_name'];//.slice(0,-6);
    if (county.substr(county.length-6) == "County"){county = address_component[address_component.length-4]['short_name'].slice(0,-6);}

    const covidRequest = "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0/query?where=Countyname%20%3D%20'" + county+ "'&outFields=Deaths,Confirmed&outSR=4326&f=json";
    const covid = await fetch(covidRequest).then((resp) => resp.json());
    const death = covid['features'][0]['attributes']['Deaths'];
    const confirm = covid['features'][0]['attributes']['Confirmed'];

 
    for (var locat in pollloca) {
      var ratio = (death + confirm + Math.random()).toFixed(2);
      pollloca[locat] = {...pollloca[locat], index: ratio};
      pollloca[locat] = {...pollloca[locat], city: city};
      pollloca[locat] = {...pollloca[locat], state: state};
      pollloca[locat] = {...pollloca[locat], zipCode: zipCode};

      const address1 = pollloca[locat]['vicinity'];
      const distRequest = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+address + "%2B" + city + "%20" + 
      state +"%20united states&destinations="+ address1 + "%2B"+ city + "%20" + state + "%20United States&key="+ process.env.GOOGLE_API_KEY;;
      const dist = await fetch(distRequest).then((resp) => resp.json());
      pollloca[locat] = {...pollloca[locat], dist: dist['rows'][0]['elements'][0]['distance']['text']};
    }
    return res.json(pollloca);
  }
  catch (e) {
    const baseGeoRequest = "https://maps.googleapis.com/maps/api/geocode/json?address="
    const baseCivicsRequest = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
    const { address, city, state, zipCode }  = req.query;
    
    const addressVar = `${address}${city}`;
    const GeoRequest = baseGeoRequest + address + ",+" + city + ",+" + state + "&key=" + process.env.GOOGLE_API_KEY;
    const lnglat = await fetch(GeoRequest).then((resp) => resp.json());
    var address_component = lnglat['results'][0]["address_components"]
    for (addlevel in address_component) {
      if (address_component[addlevel]['types'][0] == "administrative_area_level_2") {
        county = address_component[addlevel]['short_name'];
      }
    }
    if (county.substr(county.length-6) == "County"){county = county.slice(0,-6);}

    const covidRequest = "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0/query?where=Countyname%20%3D%20'" + county+ "'&outFields=Deaths,Confirmed&outSR=4326&f=json";
    const covid = await fetch(covidRequest).then((resp) => resp.json());
    const death = covid['features'][0]['attributes']['Deaths'];
    const confirm = covid['features'][0]['attributes']['Confirmed'];

    const fullRequest = baseCivicsRequest + lnglat['results'][0]["geometry"]["location"]["lat"] + "," + lnglat['results'][0]["geometry"]["location"]["lng"]
    + "&radius=5000&type=restaurants" + "&key=" + process.env.GOOGLE_API_KEY;
    const locations = await fetch(fullRequest).then((resp) => resp.json());

    const pollloca = locations['results'];
    
    for (var locat in pollloca) {
      var ratio = (death + confirm + Math.random()).toFixed(2);
      pollloca[locat] = {...pollloca[locat], index: ratio};
      pollloca[locat] = {...pollloca[locat], address: pollloca[locat]['vicinity']};
      pollloca[locat] = {...pollloca[locat], name: pollloca[locat]['name']};
      pollloca[locat] = {...pollloca[locat], city: city};
      pollloca[locat] = {...pollloca[locat], state: state};
      pollloca[locat] = {...pollloca[locat], zipCode: zipCode};

      const address1 = pollloca[locat]['vicinity'];
      const distRequest = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+address + "%2B" + city + "%20" + state +"%20united states&destinations="
      + address1 + "%2B"+ city + "%20" + state + "%20United States&key="+ process.env.GOOGLE_API_KEY;
      try{
        const dist = await fetch(distRequest).then((resp) => resp.json());
        var num = (dist['rows'][0]['elements'][0]['distance']['text']).split(" ");
        pollloca[locat] = {...pollloca[locat], dist: parseFloat(num[0])};
      }
      catch(d){
        console.log("cannot find distance");
        pollloca[locat] = {...pollloca[locat], dist: "0.0"};
      }
    }
    return res.json(pollloca);
  }
});

app.use(express.static('build'))
app.use("*", (req, res) => res.sendFile(process.cwd()+"/build/index.html"));

app.listen(parseInt(port, 10), () =>
  console.log(`Express server is running on localhost:${port}`)
);