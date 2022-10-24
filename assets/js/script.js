// HTML Elements
var searchMenuEl = document.getElementById("search-menu");
var searchNewEl = document.getElementById("search-new");
var searchHistoryEl = document.getElementById("search-history");
var searchResultsEl = document.getElementById("search-results");
var searchButtonEl = document.getElementById("search-button");

// JS variables
var DateTime = luxon.DateTime;
// URL FORMAT api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// TEST: api.openweathermap.org/data/2.5/forecast?lat=0&lon=0&appid=bef67c23617c7d859347627ed38b8308
// NEED:
// - latitude/longitude (USE Geocoding API)
// API Key
var openWeatherAPIKey = "bef67c23617c7d859347627ed38b8308";

// Use for Direct Geocode lookup
// Geocoding API request URL FORMAT: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
var locCity = "Tucson"; // city name
var locState = "AZ"; // state code
var locCountry = "US"; // country code
var locNumRecords = 5; // default = 5. 
var directGeocodeUrl =
  "http://api.openweathermap.org/geo/1.0/direct?q=" + locCity + "," + locState + "," + locCountry + "&limit=" + locNumRecords + "&appid=" + openWeatherAPIKey;

var lat = 0;
var lon = 0;
var units = "imperial";
var count = 40;

// var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherAPIKey + '&units=' + units + '&cnt=' + count;

var searchHistory = [];
var searchResults;
var weatherIcon;
var weatherIconUrl =
  "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

  var myUnwrap;
  var myUnwrapSubset;

// *******************************
// FUNCTIONS

// Get latitude/longitude for a city from Geocoding API "direct geocode lookup"
function getCoordinates(gcr) {
  // If the array has 0 entries
  if (gcr.length === 0) {
    alert(
      "No results found for search criteria: " +
        (locCity + " " + locState + " " + locCountry).trim()
    );
  // If there are multiple results returned
  } else if (gcr.length > 1) {
    alert(
      "Multiple results found for search criteria: " +
        (locCity + " " + locState + " " + locCountry).trim() +
        ".\n Try entering a City Name, State Code, County Code"
    );
  // otherwise, store latitude/longitude values
  } else {
    lat = gcr[0].lat;
    lon = gcr[0].lon;
    // setup request URL for fetching weather
    var requestUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" +
      lon + "&appid=" + openWeatherAPIKey + "&units=" + units + "&cnt=" + count;
    // call fetchWeather
    fetchWeather(requestUrl);
  }
}

// Fetch latitude/longitude coordinates from City/Zip/Postal info
// NOTE: Only City lookup is supported at this time
function fetchCoordinatesFromCity(directGeocodeUrl) {
  // Initiate webserver call
  fetch(directGeocodeUrl)
    .then(function (response) {
      // convert results to JSON
      return response.json();
    })
    .then(function (data) {
      var geocodeResults = data;
      // get latitude and longitude
      getCoordinates(geocodeResults);
    });
}

function fetchWeather(RequestUrl) {
  fetch(RequestUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          searchResults = data;

          // NEED FIELDS:
          // city name        = city.name (en)
          // country          = city.country
          // timezone         = city.timezone (unix time)
          // date             = list[0].dt_txt (UTC, unix time)
          // icon of weather  = list[0].weather[0].icon
          // temperature      = list[0].main.temp (F)
          // humidity         = list[0].main.humidity (%)
          // wind speed       = list[i].wind.speed (mph)
          
          // Filter for subset of city, country, and 5 day/3 hour weather array
          let filterResults = function ({ city, country, list}) {
            return {
              city: city.name,
              country: city.country,
              list: (list.filter(object => (DateTime.fromFormat(object.dt_txt,"yyyy-LL-dd HH:mm:ss").toFormat("HH:mm:ss") == "00:00:00")))
              }
          }
          // Second filter on weather list for subset of required fields
          weatherSubset = filterResults(searchResults);
          console.log("myUnwrap", myUnwrap);

          weatherSubset = {city: myUnwrap.city, list: myUnwrap.list.map(function(item){return {dt_txt: item.dt_txt, icon: item.weather[0].icon, humid: item.main.humidity + " %", temp: Math.round(item.main.temp) + " F", wind: item.wind.speed + " MPH"} }) }

          console.log("myUnwrapSubset", myUnwrapSubset);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(error);
    });
}

function updateSearchHistory() {}

function populateSearchResults() {}

function loadSearchHistory() {}

function onPageLoad() {}

function getWeather() {
  fetchCoordinatesFromCity(directGeocodeUrl);
}

// EVENT LISTENERS

searchButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  getWeather();
});
