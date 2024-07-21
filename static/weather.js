const apiKey = '9e9abe7329da43e5a85182647240107';
const city = 'Jaipur';
const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const currentWeather = data.current;
    const forecast = data.forecast.forecastday;

    document.getElementById('current-weather').innerHTML = `
      Current Weather: ${currentWeather.temp_c}°C, ${currentWeather.condition.text}, ${currentWeather.humidity}% Humidity
    `;

    let forecastHTML = '';
    forecast.forEach(day => {
      forecastHTML += `
        <div class="forecast-day">
          <p>${day.date}</p>
          <img src="http:${day.day.condition.icon}" alt="${day.day.condition.text}">
          <p>${day.day.avgtemp_c}°C</p>
        </div>
      `;
    });
    document.getElementById('forecast').innerHTML = forecastHTML;

    const weatherData = {
      temperature: currentWeather.temp_c,
      WeatherCondition: currentWeather.condition.text,
      humidity: currentWeather.humidity
    };

    fetch('http://localhost:5000/irrigation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(weatherData)
    })
    .then(response => response.json())
    .then(result => {
      document.getElementById('irrigation-advice').innerHTML = `
        Irrigation Advice: Water ${result.IrrigationAdvice_mm.toFixed(2)} mm today
      `;
    })
    .catch(error => console.error('Error fetching irrigation advice:', error));
  })
  .catch(error => console.error('Error fetching weather data:', error));
