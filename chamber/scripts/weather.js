async function fetchWeather() {
    const apiKey = '1a8a4967d62d64dbd1146828aa6d125e'; // Replace with your OpenWeatherMap API key
    const city = 'Lilongwe';
    try {
        // Current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const current = await currentResponse.json();
        if (current.cod !== 200) throw new Error(current.message);
        document.getElementById('current-temp').textContent = Math.round(current.main.temp);
        document.getElementById('current-desc').textContent = current.weather[0].description;

        // 3-Day Forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const forecast = await forecastResponse.json();
        if (forecast.cod !== '200') throw new Error(forecast.message);
        // Select data points at 12:00 PM for next 3 days
        const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes('12:00:00')).slice(1, 4);
        const forecastHTML = dailyForecasts
            .map(item => {
                const date = new Date(item.dt * 1000);
                return `
                    <div class="forecast-item">
                        <span>${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span>${Math.round(item.main.temp)}°C</span>
                    </div>
                `;
            })
            .join('');
        document.getElementById('forecast').innerHTML = forecastHTML || '<p>No forecast available.</p>';
    } catch (error) {
        console.error('Weather fetch failed:', error);
        document.querySelector('.weather-card').innerHTML = '<p>Weather data unavailable.</p>';
    }
}

fetchWeather();