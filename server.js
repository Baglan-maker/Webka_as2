require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error fetching weather data.');
  }
});


app.get('/api/gnews', async (req, res) => {
  const query = req.query.q || ''; // Поисковый запрос
  const country = req.query.country || 'us'; 
  const language = req.query.language || 'en'; 
  const gnewsApiKey = process.env.GNEWS_API_KEY;

  const apiUrl = `https://gnews.io/api/v4/top-headlines?token=${gnewsApiKey}&lang=${language}&country=${country}&q=${query}`;

  try {
      const response = await axios.get(apiUrl);
      res.json(response.data.articles);
  } catch (error) {
      console.error('Error fetching news:', error.message);
      res.status(500).send('Error fetching news data.');
  }
});


app.get('/api/facts', async (req, res) => {
    const countryCode = req.query.country; // Код страны
    
    const apiUrl = `https://restcountries.com/v3.1/alpha/${countryCode}`;

    try {
        const response = await axios.get(apiUrl);
  
        if (!response.data || response.data.length === 0) {
            return res.status(500).json({ error: 'No country data found.' });
        }

        const countryData = response.data[0];
        const facts = {
            name: countryData.name.common,
            capital: countryData.capital ? countryData.capital[0] : 'N/A',
            population: countryData.population,
            area: countryData.area,
            region: countryData.region,
            languages: countryData.languages ? Object.values(countryData.languages).join(', ') : 'Unknown'
        };

        res.json(facts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error fetching country data.');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});