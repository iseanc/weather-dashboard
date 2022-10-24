// HTML Elements
var searchMenuEl = document.getElementById('search-menu');
var searchNewEl = document.getElementById('search-new');
var searchHistoryEl = document.getElementById('search-history');
var searchResultsEl = document.getElementById('search-results');

// JS variables
// URL FORMAT api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// TEST: api.openweathermap.org/data/2.5/forecast?lat=0&lon=0&appid=bef67c23617c7d859347627ed38b8308c
// NEED:
// - latitude/longitude (USE Geocoding API)
// API Key
var openWeatherAPIKey = 'bef67c23617c7d859347627ed38b8308';

// Use for Direct Geocode lookup
// Geocoding API request URL FORMAT: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
var locCity = 'Tucson';  // city name
var locState = ''; // state code
var locCountry = 'au'; // country code
var locNumRecords = 10; 
var directGeocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + locCity + ',' + locState + ',' + locCountry + '&limit=' + locNumRecords + '&appid=' + openWeatherAPIKey

//console.log(directGeocodeUrl);

var lat = 0;
var lon = 0;
var units = 'imperial';

// var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherAPIKey + '&units=' + units + '&cnt=9';

var searchHistory = [];
var searchResults;
var weatherIcon;
var weatherIconUrl = 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';

// FUNCTIONS

// Extract coordinates from Geocoding API "direct geocode lookup" result

function getCoordinates(gcr) {
  if (gcr.length === 0) {
    alert('No results found for search criteria: ' + (locCity + ' ' + locState + ' ' + locCountry).trim());
  } else if (gcr.length > 1) {
    alert('Multiple results found for search criteria: ' + (locCity + ' ' + locState + ' ' + locCountry).trim() + '.\n Try entering a City Name, State Code, County Code');
  }
  else {
    //console.log("found 1 result: ", gcr[0].name, gcr[0].state, gcr[0].country);
    lat = gcr[0].lat; 
    lon = gcr[0].lon;

    // var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherAPIKey + '&units=' + units + '&cnt=9';

    // fetchWeather(requestUrl);
  }
}

// Fetch latitude/longitude coordinates from City/Zip/Postal info
// NOTE: Only City lookup is supported at this time
function fetchCoordinatesFromCity(directGeocodeUrl) {
  
  fetch(directGeocodeUrl)
    .then(function (response) {
      //console.log('response', response.json())
      return response.json();
    })
    .then(function (data) {
      var geocodeResults = data;
      console.log("geocodeResults", geocodeResults);
      getCoordinates(geocodeResults);
      //console.log("fcfc", lat, lon);
    })
}

function fetchWeather(RequestUrl) {

  fetch(RequestUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          searchResults = data;
          console.log(searchResults);
          // for (var i = 0; i < data.length; i++) {
          //   // console.log(data);
          //   searchResults.push = data[i];
          //   console.log("this is inside the .then(data) for loop")
          //   console.log(searchResults);
          // };
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert(error);
    });
}

function updateSearchHistory() {

}

function populateSearchResults() {

}

function loadSearchHistory() {

}

function onPageLoad() {

}

function getWeather() {
  console.log(directGeocodeUrl);
  fetchCoordinatesFromCity(directGeocodeUrl);

  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherAPIKey + '&units=' + units + '&cnt=9';

    if(lat > 0 && lon> 0) {
      fetchWeather(requestUrl);
    }
  
}

getWeather()
// EVENT LISTENERS

//searchButton.addEventListener('click', fetchWeather);