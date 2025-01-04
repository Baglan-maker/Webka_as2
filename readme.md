Weather and News App

A simple web app that fetches weather data, news articles, and country facts based on user input.

Features

Weather: Displays current weather for any city.

News: Fetches latest news related to the city.

Country Facts: Shows basic information about the country.

API Usage
1. Weather API
   
Endpoint: /api/weather

Method: GET

Query Params: city (e.g., city=London)

Response: Weather data (temp, humidity, wind speed, etc.)

2. News API
   
Endpoint: /api/gnews

Method: GET

Query Params: q (city), country (country code)

Response: News articles related to the city.

3. Country Facts API
   
Endpoint: /api/facts

Method: GET

Query Params: country (country code)

Response: Country facts (capital, population, languages, etc.)

Key Design Decisions

Logic in script.js: All app logic is placed in script.js.

Separation of Concerns: The HTML file only handles structure, while JavaScript handles data fetching and UI updates.

Modular Code: Functions are separated for weather, news, and country facts to keep the code clean and extendable.
