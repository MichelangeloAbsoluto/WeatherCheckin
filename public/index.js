
// If there is no name, the submit process should stop. 
// It should throw an error saying "Please enter your name. Weatherapp takes internet anonnymity very seriously"

// If there is a name, the name should be sent to the server with the POST request. 
  

// A successful submit should render a success message to the user. Or some indication that it went through. 




let isUserLocationAvail = true; 
let lati = 0;
let long = 0;
let temperatureFahrenheit = 0;
let userName;

let getUserLocation = function(){
    if (navigator.geolocation) {
        isUserLocationAvail = true;
        navigator.geolocation.getCurrentPosition( position => {
            lati = position.coords.latitude;
            long = position.coords.longitude;
        }); 
    } else {
        isUserLocationAvail = false; 
        lati = 45;
        long = 45;
        console.log("No location available. Sorry.");
    }
    console.log(lati, long);
}

let displayUserLocation = function(){
    // This will display a rounded version of the lati & long. Actual values are not changed.
    let trimmedLatitude = Math.round(lati * 10000) / 10000;
    let trimmedLongitude = Math.round(long * 10000) / 10000;
    document.getElementById('latitudeDisplay').textContent = trimmedLatitude;
    document.getElementById('longitudeDisplay').textContent = trimmedLongitude;
}

let displayTemperature = function(JSON){
    document.getElementById('temperatureDisplay').textContent = JSON.temperature;
    document.getElementById('descriptionDisplay').textContent = JSON.description
    temperatureFahrenheit = JSON.temperature;
}

// Makes a POST request to server with JSON data
// Data contains { lat, lon, temp, description, location }
let storeData = function(data){
    data.userName = document.getElementById('checkinUserName').value;
    const postRequestOptions = {
        method : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    fetch('/weather', postRequestOptions)
        .then( response => response.json()
        .then( jsonResponse => { 
            console.log(jsonResponse);
            window.confirm(`Thanks for checking in, ${userName}!`);
        } ));
}

let handleSubmit = async function(){
    // Check if userName is filled
    if (document.getElementById('checkinUserName').value.length > 0) {
        userName = document.getElementById('checkinUserName').value;
        document.getElementById('checkinUserName').value = "";
    } else {
        window.alert("please enter a name, stranger!")
        throw new Error("Please enter a name.");
    }
    getUserLocation();
    displayUserLocation();
    let getWeatherRequestURL = `/weather/${lati},${long}`;
    let getWeatherResponse = await fetch(getWeatherRequestURL);
    let weatherJSON = await getWeatherResponse.json();
    displayTemperature(weatherJSON);
    storeData(weatherJSON);
}

getUserLocation();

document.getElementById('checkinButton').addEventListener('click', handleSubmit);