document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    const mapContainer = document.getElementById('map');
    let map;

    const initMap = (lat, lon) => {
      if (map) {
        map.remove(); 
      }
      map = L.map(mapContainer).setView([lat, lon], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup(`Latitude: ${lat}, Longitude: ${lon}`)
        .openPopup();
    };

    const fetchWeather = async (city) => {
      try {
        const response = await fetch(`/api/weather?city=${city}`);
        if (!response.ok) throw new Error('Weather data not found.');
        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        console.error(error.message);
        alert(`Error fetching weather data: ${error.message}`);
      }
    };

    const fetchGNews = async (city, countryCode) => {
      if (city.toLowerCase() === 'nur-sultan') {
          city = 'Astana'; 
      }
      try {
        const response = await fetch(`/api/gnews?q=${city}&country=${countryCode}`);
        if (!response.ok) throw new Error('Error fetching news.');
        const articles = await response.json();
        displayNews(articles);
      } catch (error) {
        console.error('Error fetching news:', error.message);
        alert(`Error fetching news: ${error.message}`);
      }
    };

    const displayNews = (articles) => {
      const newsContainer = document.getElementById('news-container');
      newsContainer.innerHTML = ''; 

      const newsTitle = document.createElement('h3');
      newsTitle.textContent = 'News';
      newsContainer.appendChild(newsTitle);

      articles.slice(0, 5).forEach((article) => {
          const newsItem = document.createElement('p');
          newsItem.innerHTML = `
              <strong>${article.title}</strong> - ${article.description || 'No description available.'}
              <a href="${article.url}" target="_blank">Read more</a>
          `;
          newsContainer.appendChild(newsItem);
      });
    };

    const displayWeather = (data) => {
      const { name, main, weather, wind, sys, coord, rain } = data;
      weatherInfo.innerHTML = `
        <h2>Weather in ${name}, ${sys.country}</h2>
        <p>Temperature: ${main.temp}°C (Feels like: ${main.feels_like}°C)</p>
        <p>Condition: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Pressure: ${main.pressure} hPa</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Rain Volume (last 3h): ${rain ? rain['3h'] : 0} mm</p>
        <p>Coordinates: [${coord.lat}, ${coord.lon}]</p>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="Weather icon">
      `;
      initMap(coord.lat, coord.lon); 
      fetchGNews(name, sys.country);
      fetchCountryFacts(sys.country);
    };

    const fetchCountryFacts = async (countryCode) => {
      try {
        const response = await fetch(`/api/facts?country=${countryCode}`);
        if (!response.ok) throw new Error('Country facts not found.');
        const data = await response.json();

        displayCountryFacts(data);
      } catch (error) {
        console.error(error.message);
        alert(`Error fetching country facts: ${error.message}`);
      }
    };

    const displayCountryFacts = (data) => {
      const countryFactsContainer = document.getElementById('country-facts-container');
      countryFactsContainer.innerHTML = ''; 

      const factsTitle = document.createElement('h3');
      factsTitle.textContent = `Facts about ${data.name}`;
      countryFactsContainer.appendChild(factsTitle);

      const factsContent = `
          <p><strong>Capital:</strong> ${data.capital}</p>
          <p><strong>Population:</strong> ${data.population}</p>
          <p><strong>Area:</strong> ${data.area} km²</p>
          <p><strong>Region:</strong> ${data.region}</p>
          <p><strong>Languages:</strong> ${data.languages}</p>
      `;

      const factsContainer = document.createElement('div');
      factsContainer.innerHTML = factsContent;
      countryFactsContainer.appendChild(factsContainer);
    };

    // Обработчик кнопки поиска
    searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) fetchWeather(city);
    });
});
