// HTML Elements
var searchMenu = document.getElementById('search-menu');
var searchNew = document.getElementById('search-new');
var searchHistory = document.getElementById('search-history');
var searchResults = document.getElementById('search-results');

// JS variables
var requestUrlBase = 'https://...';
var searchCity;
var requestUrl = requestUrl + '?' + searchCity;
var searchHistory = [];
var searchResults;

// FUNCTIONS

function getWeather(RequestUrl) {

  fetch(RequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return "garbage";
    })
}

function updateSearchHistory() {

}

// Get Latitude and Longitude from City name
function getCoordinatesFromCity () {

}

function populateSearchResults() {

}
// EVENT LISTENERS

searchButton.addEventListener('click', getWeather);