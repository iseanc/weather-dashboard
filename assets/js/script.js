// HTML Elements
var searchMenuEl = document.getElementById("search-menu");
var searchNewEl = document.getElementById("search-new");
var searchCityEl = document.getElementById("city-name");
var searchButtonEl = document.getElementById("search-button");
var searchHistoryEl = document.getElementById("search-history");
var searchHistoryUl = document.getElementById("search-history-list");
var searchResultsEl = document.getElementById("search-results");
var searchResultsMainEl = document.getElementById("results-main");
var searchHistoryLinks = document.getElementsByClassName('search-hist-item');

// JS variables
var DateTime = luxon.DateTime;

// API Key
var openWeatherAPIKey = "bef67c23617c7d859347627ed38b8308";

// Use for Direct Geocode lookup
// URL FORMAT: https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
var locCity = ""; // city name
var locState = ""; // state code
var locCountry = ""; // country code
var locNumRecords = 5; // default = 5. 

// URL FORMAT api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// TEST: api.openweathermap.org/data/2.5/forecast?lat=0&lon=0&appid=bef67c23617c7d859347627ed38b8308
// var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherAPIKey + '&units=' + units + '&cnt=' + count;

// args for weather fetch requestUrl
var lat = 0;
var lon = 0;
var units = "imperial";
var count = 40;

var searchHistory = []; // search history array for temp storage
var searchResults; // temp storage for weather search results
var weatherSubset;
//   "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

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
    console.log(gcr)
    alert(
      "Multiple results found for search criteria: " +
        (locCity + " " + locState + " " + locCountry).trim() +
        ".\n Try entering a City Name, State Code, County Code"
    );
  // otherwise, store latitude/longitude values
  } else if (!gcr[0].lat || !gcr[0].lon) {
    alert(
      "Fetching coordinates did not return valid latitude or longitude.\n Enter a valid City Name.  Include State Code and Country Code to limit search response to a single result."
    );
  } else {
    // log City info to search history
    updateSearchHistory(gcr);
    lat = gcr[0].lat;
    lon = gcr[0].lon;

    // setup request URL for fetching weather
    var requestUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
       + "&lon=" + lon 
       + "&appid=" + openWeatherAPIKey 
       + "&units=" + units 
       + "&cnt=" + count;
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
      if (response.ok) {
        // convert results to JSON
        return response.json();
      } else {
        alert("Error: " + response.statusText + ". Please enter a valid city name.\nInclude state code and country code to narrow the results.");
      }
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

          weatherSubset = {city: weatherSubset.city, country: weatherSubset.country, list: weatherSubset.list.map(function(item){return {dt_txt: item.dt_txt, icon: item.weather[0].icon, humid: item.main.humidity + " %", temp: Math.round(item.main.temp) + " F", wind: item.wind.speed + " MPH"} }) }

          console.log("weatherSubset", weatherSubset);
          displayWeather(weatherSubset);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(error);
    });
}

function updateSearchHistory(gcr) {
  if (Object.hasOwn(gcr[0],"name")) {
    searchHistory.push({
        city: gcr[0].name, 
        state: gcr[0].state, 
        country: gcr[0].country, 
        lat: gcr[0].lat, 
        lon: gcr[0].lon});
    searchHistory.reverse();
    
    console.log("searchHist", searchHistory);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  }
  loadSearchHistory();
  displaySearchHistory();
}

function displayWeather(weather) {
  console.log("USH:Weather", weather);

  // clear the current search results container
  // weatherSubset
  while (searchResultsMainEl.firstChild) {
    searchResultsMainEl.removeChild(searchResultsMainEl.firstChild);
  }

  console.log("weatherList", weather.list);
  console.log("weatherList_0", weather.list[0]);
  var wl = weather.list;
  // Add header indicating main location
  var resultCity = document.createElement("h2");
  resultCity.innerHTML = weather.city + ", " + weather.country;
  searchResultsMainEl.appendChild(resultCity);

  for (var i = 0; i < wl.length; i++) {
    console.log("wli", wl[i]);

    // daily weather container
    var wiDayEl = document.createElement("div"); 
    wiDayEl.setAttribute("class", "has-background-primary-light mt-2")
    // header for date + date info (formatted)
    var wiDate = document.createElement("h4");   
    wiDate.textContent = DateTime.fromFormat(wl[i].dt_txt,"yyyy-LL-dd HH:mm:ss", {zone: "utc"}).toLocal().toLocaleString(DateTime.DATETIME_SHORT);
    // icon of weather  = list[0].weather[0].icon
    var wiIcon = document.createElement('img');
    wiIcon.setAttribute("class", "image is-48x48");
    var weatherIcon = wl[i].icon;
    var weatherIconUrl =
    "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    wiIcon.src = weatherIconUrl;
    // temperature      = list[0].main.temp (F)
    var wiTemp = document.createElement('p');
    wiTemp.textContent = wl[i].temp;
    // humidity         = list[0].main.humidity (%)
    var wiHumidity = document.createElement('p');
    wiHumidity.textContent = wl[i].humid;
    // wind speed       = list[i].wind.speed (mph)
    var wiWind = document.createElement('p');
    wiWind.textContent = wl[i].wind
    
    
    // append date-specific weather elements to Day container
    // wiDayEl.appendChild(wiDate);
    wiDayEl.append(wiDate, wiIcon, wiTemp, wiHumidity, wiWind);

    // append Day container to search results parent element
    searchResultsMainEl.appendChild(wiDayEl);
  }

}

function displaySearchHistory() {

  while (searchHistoryUl.firstChild) {
    searchHistoryUl.removeChild(searchHistoryUl.firstChild);
  }
  
  for (var i = 0; i < searchHistory.length; i++) {

      var searchItem = searchHistory[i];
      console.log("searchItem", searchItem.city);

      var li = document.createElement("li");
      li.textContent = searchItem.city + ", " + searchItem.state + ", " + searchItem.country;
      li.setAttribute("class", "search-hist-item button");
      li.setAttribute("data-index", i);
      li.setAttribute("data-lat", searchItem.lat );
      li.setAttribute("data-lon", searchItem.lon );

      searchHistoryUl.appendChild(li);
  }
}

function loadSearchHistory() {
  // Get stored search history from localStorage
  var storedSearchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));

  // If search history was retrieved from localStorage, update searchHistory array
  if (storedSearchHistory !== null) {
    searchHistory = storedSearchHistory;
  }
}

function onPageLoad() {
  loadSearchHistory();
  //updateSearchHistory();
  displaySearchHistory();
}

function parseSearchText(searchString) {
  var words = searchString.split(',');
  for (var i = 0; i < words.length; i++) {
    words[i] = words[i].trim();
  }

  if (words[0] == "") { 
    alert('You must enter a city name.\nSearch cannot begin with a comma.')
    searchCityEl.value = "";
    return;
  } else { 
    locCity = words[0];
  }
  if (words[1] == "" && words[2] == "") { /* do nothing */}
  if (words[1] !== "") {
    locState = words[1];
  }
  if (words[2] !== "") {
    locCountry = words[2];
  }
  var directGeocodeUrl =
  "https://api.openweathermap.org/geo/1.0/direct?q=" + locCity + "," + locState + "," + locCountry + "&limit=" + locNumRecords + "&appid=" + openWeatherAPIKey;

  fetchCoordinatesFromCity(directGeocodeUrl);
}

onPageLoad();

// EVENT LISTENERS

searchButtonEl.addEventListener("click", function (event) {

  event.preventDefault();
  event.stopPropagation();

  var searchString = searchCityEl.value;

  if (searchString === "") {
    alert("You must provide a search value.")
  } else {
    parseSearchText(searchString);
  }

});

searchHistoryUl.addEventListener("click", function (event) {

  event.preventDefault();
  event.stopPropagation();

  var element = event.target;
  console.log(element);

  if(element && element.nodeName == "LI") {
    // console.log(element.dataset.index + " was clicked");
    lat = element.dataset.lat;
    lon = element.dataset.lon;

    var requestUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
       + "&lon=" + lon 
       + "&appid=" + openWeatherAPIKey 
       + "&units=" + units 
       + "&cnt=" + count;
    // call fetchWeather
    fetchWeather(requestUrl);
  }
});
