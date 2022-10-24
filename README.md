# Weather Dashboard
Module 6 Challenge: Weather Dashboard 

## Description

Provide a short description explaining the what, why, and how of your project. Use the following questions as a guide:

- What was your motivation?
- Why did you build this project? (Note: the answer is not "Because it was a homework assignment.")
- What problem does it solve?
- What did you learn?

This program uses the [OpenWeather.org 5 Day/3 Hour API](https://openweathermap.org/forecast5) to obtain a 5-day weather forecast for a specified city (city, state, country).  Potential travelers to the location, and other interest parties, can get an idea of the current and upcoming weather conditions.

The application extends previously learned web-development concepts with client-server communication using HTTP GET calls.  This application uses the 'Luxon.js' library for date/time data, instead of 'Moment.js'.

## Table of Contents (Optional)

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [Features](#features)
- [License](#license)

## Installation

[View my deployed Weather Dashboard](https://iseanc.github.io/weather-dashboard/)

## Usage

Instructions and examples for use.
- To initiate a search, enter "city name, state code, country code" (without quotations). 
- You can also select a previously selected city from your search history to retrieve updated weather forecasts for those locations.

NOTES:
- If you only enter a city name, it is likely the OpenWeather API will not find a location, or it will return multiple locations.  In it's current form, the application only retrieves information when only one location match is identified.
- The City name displayed in the Weather results may be different than the name you entered in the Search field.  This is because the Weather forecast display is using the City name returned in the forecast results for the Latitude/Longitude coordinates identified in the original City search.



To add a screenshot, create an `assets/images` folder in your repository and upload your screenshot to it. Then, using the relative filepath, add it to your README using the following syntax:

    ```md
    ![alt text](assets/images/screenshot.png)
    ```

## Credits

I rely on heavily on [StackOverflow](https://stackoverflow.com/) posts to obtain guidance on solving the myriad problems I encounter while coding.

## Features

- Weather forecast for 5 days (including current date).  The application currently shows one time period for each day, around 5 PM (the hottest part of the day).
- Previous search locations are stored on the local client device, and search history should display when the page loads.  Click any history entry to retrieve a current forecast for the location.
- New search locations should only be added to Search History if they have resulted in a valid Geocode Location response from OpenWeather.org.
- Various error messages are displayed for different situations, especially for the following: no data entered in search bar; no location results, or multiple location results returned from the lookup; web-site connectivity issues; and invalid data retrieval.

KNOWN ISSUES:
- Some location searches may return multiple results in the initial City search.  Currently there is no ability to display the list to allow the user to choose from one of the locations.  
- To ensure only a single location result, users must enter a valid city name, state code (2 character), country code (2 character) combination.
- The city name displayed in the Weather Forecast may be different from the city name entered in the Search field.  This is because we are using the City name returned in the secondary weather lookup.  This city name may be slightly or completely different than what the user entered.

## License

[MIT License](LICENSE/).