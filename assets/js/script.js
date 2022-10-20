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
var searchCity ="";
var lat = 32.248814;
var lon = -110.987419;
var searchStartDate;
var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherAPIKey;
var searchHistory = [];
var searchResults;

// FUNCTIONS

function getWeather2(RequestUrl) {

  fetch(RequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        
      }
    })
}

function getWeather(RequestUrl) {

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
      // alert('Unable to connect to OpenWeather');
      alert(error);
    });
}

//console.log(getWeather(requestUrl));
getWeather(requestUrl);

function updateSearchHistory() {

}

// Get Latitude and Longitude from City name
function getCoordinatesFromCity () {

}

function populateSearchResults() {

}

function loadSearchHistory() {

}

function onPageLoad() {

}

// EVENT LISTENERS

//searchButton.addEventListener('click', getWeather);