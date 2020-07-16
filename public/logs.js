// Next steps 

// Button to get 'hottest temperature'.

// Button to get 'coldest temperature'.
// Will automatically select marker with lowest temperature on the map.  

// Integrate time into map. These aren't the current temperatures. These are the temperatures when the people checked in. 

// Add a name component to the checkin. 
// You must checkin with a name or the checkin won't be complete. Will throw error.  


// leaflet.js setup
const checkinMap = L.map('checkinMap').setView([0, 0], 2);
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
let tiles = L.tileLayer(tileURL, { attribution });
tiles.addTo(checkinMap);
let allMapMarkers = L.layerGroup([]); 

// Request checkin data from server
let getCheckinData = async function(){
    let checkinData = await fetch('/checkins');
    let checkinJSON = await checkinData.json();
    mapData(checkinJSON);
}

// Display each checkin as a marker on the map. 
let mapData = function(checkinsToMap){
    checkinsToMap.map( element => {  
        // Create marker at element.lati & element.long
        let mapMarker = L.marker([element.latitude, element.longitude]);
        mapMarker.temperature = element.temperature;
        mapMarker.addTo(checkinMap);
        allMapMarkers.addLayer(mapMarker);

        // Add information to marker in form of popup. 
        let markerPopupText = `You're viewing ${element.locationName} at latitude ${roundNumberForDisplay(element.latitude)} & longitude ${roundNumberForDisplay(element.longitude)}. 
        The current temperature is ${element.temperature}° and the weather is what locals call '${element.description}'.`;
        mapMarker.bindPopup(markerPopupText);
    })
}

// Rounds latitude & longitude values for display on the map. Returns new value. 
let roundNumberForDisplay = function(number){
    let roundedNumber = Math.round(number * 10000) / 10000;
    return roundedNumber
}

// Finds checkin with the coldest temperature and opens the popup of the assocaited marker. 
let selectColdestCheckin = function(){
    let coldestMarker;
    let coldestTemp = Number.MAX_SAFE_INTEGER;
    
    allMapMarkers.eachLayer( function(layer) {
        if (layer.temperature < coldestTemp) {
            coldestTemp = layer.temperature;
            coldestMarker = layer;
        }
    });
    console.log(coldestMarker);
    coldestMarker.openPopup();
}

// Finds checkin with the hottest temperature and opens the popup of the assocaited marker. 
let selectHottestCheckin = function(){
    let hottestMarker;
    let hottestTemp = Number.MIN_SAFE_INTEGER;
    
    allMapMarkers.eachLayer( function(layer) {
        if (layer.temperature > hottestTemp) {
            hottestTemp = layer.temperature;
            hottestMarker = layer;
        }
    });
    console.log(hottestMarker);
    hottestMarker.openPopup();

}

let bindClickListeners = function(){
    document.getElementById('getHottest').addEventListener("click", selectHottestCheckin);
    document.getElementById('getColdest').addEventListener("click", selectColdestCheckin);
}

getCheckinData();
bindClickListeners();

 

