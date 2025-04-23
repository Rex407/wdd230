// Weather Configuration
const weatherConfig = {
    apiKey: '1a8a4967d62d64dbd1146828aa6d125e', // Replace with your actual API key
    city: 'Lilongwe',
    country: 'MW',
    units: 'metric',
    forecastDays: 3,
    updateInterval: 30 * 60 * 1000 // 30 minutes in milliseconds
};

// DOM Elements
const weatherElements = {
    currentTemp: document.getElementById('current-temp'),
    currentDesc: document.getElementById('current-desc'),
    currentHumidity: document.getElementById('current-humidity'),
    weatherIcon: document.getElementById('weather-icon'),
    forecastContainer: document.getElementById('forecast-container')
};

/**
 * Fetches weather data from OpenWeatherMap API
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData() {
    try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weatherConfig.city},${weatherConfig.country}&appid=${weatherConfig.apiKey}&units=${weatherConfig.units}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherConfig.city},${weatherConfig.country}&appid=${weatherConfig.apiKey}&units=${weatherConfig.units}`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        return {
            current: await currentResponse.json(),
            forecast: await forecastResponse.json()
        };
    } catch (error) {
        console.error('Weather API error:', error);
        throw error;
    }
}

/**
 * Processes forecast data into daily segments
 * @param {Array} forecastList - Raw forecast data array
 * @returns {Array} Processed daily forecasts
 */
function processForecastData(forecastList) {
    const dailyForecasts = [];
    const seenDays = new Set();

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString();

        if (!seenDays.has(dayKey) {  
            seenDays.add(dayKey);
            dailyForecasts.push({
                date,
                temp: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                humidity: item.main.humidity
            });
        

            if (dailyForecasts.length >= weatherConfig.forecastDays + 1) {
                return;
            }
        }
    });

    return dailyForecasts.slice(1); // Skip today's forecast
}

/**
 * Updates the weather display with current data
 * @param {Object} current - Current weather data
 */
function updateCurrentWeather(current) {
    weatherElements.currentTemp.textContent = Math.round(current.main.temp);
    weatherElements.currentDesc.textContent = current.weather[0].description;
    weatherElements.currentHumidity.textContent = current.main.humidity;
    weatherElements.weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
    weatherElements.weatherIcon.alt = current.weather[0].main;
}

/**
 * Updates the forecast display
 * @param {Array} forecasts - Processed forecast data
 */
function updateForecast(forecasts) {
    weatherElements.forecastContainer.innerHTML = forecasts.map(day => `
        <div class="forecast-day">
            <p class="forecast-date">${day.date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
            <p class="forecast-temp">${Math.round(day.temp)}°C</p>
            <p class="forecast-desc">${day.description}</p>
        </div>
    `).join('');
}

/**
 * Displays error message when weather data fails to load
 */
function showWeatherError() {
    weatherElements.forecastContainer.innerHTML = '<p class="weather-error">Weather data unavailable</p>';
}

/**
 * Main function to fetch and display weather
 */
async function displayWeather() {
    try {
        const { current, forecast } = await fetchWeatherData();
        updateCurrentWeather(current);
        const processedForecast = processForecastData(forecast.list);
        updateForecast(processedForecast);
    } catch (error) {
        showWeatherError();
    }
}

// Initialize weather display and set up periodic updates
function initWeather() {
    displayWeather();
    setInterval(displayWeather, weatherConfig.updateInterval);
}

// Start weather functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', initWeather);
