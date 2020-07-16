// Put OpenWeather API key in a dot env file. 
// Upload to GitHub
// Need to add database to Heroku?
// Upload to Heroku


// -- MODULES -- // 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch')
const Datastore = require('nedb');
require('dotenv').config();

// -- MIDDLEWARE & CONFIG -- //
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let checkinDatabase = new Datastore('checkin.db');
checkinDatabase.loadDatabase();
const port = process.env.PORT || 3000; 

// API Call to OpenWeather to get weather data.
app.get('/weather/:userLocation', async (request, response) => {
        
    // Params look like { userLocation: '117.18, -42.388'}
    let locationParameters = request.params.userLocation.split(',')
    let [userLatitude, userLongitude] = locationParameters;

    // OpenWeather API call
    let openWeatherAPIKey = process.env;
    let openWeather_api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&units=imperial&&appid=${openWeatherAPIKey}`;
    let openWeatherResponse = await fetch(openWeather_api_url);
    let openWeatherJSON = await openWeatherResponse.json();

    // Parse out desired information from OpenWeather's JSON
    let description = openWeatherJSON.weather[0].description;
    let temperature = openWeatherJSON.main.temp;
    let locationName = openWeatherJSON.name;
     
    let data = { 
        locationName : locationName,
        latitude : userLatitude,
        longitude : userLongitude,
        temperature : temperature,
        description : description
    }

    response.json(data);
})

// Retrieve information from database
app.get('/checkins', (request, response) => {
    checkinDatabase.find( {}, function (err, retrievedData) {
        if (err) {
            console.log(err);
        } else {
            response.json(retrievedData);
        }
      });
})

// Store information in database
app.post('/weather', (request, response) => {
    
    // Receive data, timestamp it, & store in database
    let data = request.body;
    data.timestamp = new Date();
    checkinDatabase.insert(data);
    
    // Inform the wonderful user of the fantastic success. 
    response.json({ message : "Data successfully stored, sir! Long live the hegemony." });
})

app.listen(port, () => console.log("Server running on " + port + " brah."));