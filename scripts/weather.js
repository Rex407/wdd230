// Weather API configuration
const apiKey = "83e1b6e1b067833ca85ea2aeb13f895a"; // Replace with your OpenWeatherMap API key
const city = "Lilongwe, MW";
const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

// DOM elements
const currentTemp = document.getElementById("current-temp");
const weatherDesc = document.getElementById("weather-desc");
const weatherIcon = document.getElementById("weather-icon");

// Asynchronous function to get weather data
async function getWeather() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Weather data:", data); // Debug: Check the data structure
        currentTemp.textContent = data.main.temp.toFixed(1);
        weatherDesc.textContent = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.src = iconURL;
        weatherIcon.alt = data.weather[0].description;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        currentTemp.textContent = "N/A";
        weatherDesc.textContent = "Weather data unavailable";
        weatherIcon.src = "";
        weatherIcon.alt = "Weather icon unavailable";
    }
}

// Call the getWeather function when the page loads
document.addEventListener("DOMContentLoaded", getWeather);