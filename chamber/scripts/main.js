// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav a');
const lastUpdateElement = document.getElementById('last-modified');
const banner = document.getElementById('meet-greet-banner');
const closeBannerBtn = document.getElementById('close-banner');
const visitMessageElement = document.getElementById('visit-message');
const timestampField = document.getElementById('timestamp');
const membersContainer = document.getElementById('members-container');
const gridViewButton = document.getElementById('grid-view');
const listViewButton = document.getElementById('list-view');
const currentTempElement = document.getElementById('current-temp');
const weatherDescElement = document.getElementById('weather-desc');
const forecastDaysElement = document.getElementById('forecast-days');
const spotlightsContainer = document.getElementById('spotlights');

// OpenWeatherMap API Key (Replace with your own)
const API_KEY = '1a8a4967d62d64dbd1146828aa6d125e';

/**
 * Toggles mobile navigation menu
 */
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    
    // Toggle aria-expanded attribute for accessibility
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle hamburger icon
    hamburger.querySelector('.hamburger-icon').textContent = isExpanded ? '☰' : '✖';
}

/**
 * Closes mobile menu when a link is clicked
 */
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelector('.hamburger-icon').textContent = '☰';
}

/**
 * Formats and displays the last modified date
 */
function displayLastModified() {
    const lastModified = new Date(document.lastModified);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    lastUpdateElement.textContent = lastModified.toLocaleString('en-US', options);
}

/**
 * Manages the meet and greet banner display
 */
function manageBanner() {
    if (!banner) return; // Only run if the element exists

    const today = new Date().getDay(); // 0=Sunday, 1=Monday, etc.
    const currentDate = new Date().toDateString();
    const bannerClosed = localStorage.getItem('bannerClosed');
    const lastClosedDate = localStorage.getItem('bannerClosedDate');

    // Reset banner status if it's a new day
    if (lastClosedDate !== currentDate) {
        localStorage.removeItem('bannerClosed');
        localStorage.removeItem('bannerClosedDate');
    }

    // Show banner only on Monday (1), Tuesday (2), or Wednesday (3)
    if ([1, 2, 3].includes(today) && !localStorage.getItem('bannerClosed')) {
        banner.style.display = 'block';
    }

    // Set up close button functionality
    closeBannerBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        localStorage.setItem('bannerClosed', 'true');
        localStorage.setItem('bannerClosedDate', currentDate);
    });
}

/**
 * Displays a message based on the time since the last visit
 */
function displayVisitMessage() {
    if (!visitMessageElement) return; // Only run if the element exists (i.e., on discover.html)

    const currentTime = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    const oneDayInMs = 24 * 60 * 60 * 1000; // Milliseconds in a day

    if (!lastVisit) {
        // First visit
        visitMessageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDiff = currentTime - lastVisit;
        const daysDiff = Math.floor(timeDiff / oneDayInMs);

        if (timeDiff < oneDayInMs) {
            // Less than a day
            visitMessageElement.textContent = "Back so soon! Awesome!";
        } else {
            // More than a day
            const dayText = daysDiff === 1 ? "day" : "days";
            visitMessageElement.textContent = `You last visited ${daysDiff} ${dayText} ago.`;
        }
    }

    // Update the last visit time
    localStorage.setItem('lastVisit', currentTime);
}

/**
 * Sets the timestamp field value to the current date and time
 */
function setTimestamp() {
    if (!timestampField) return; // Only run if the element exists (i.e., on join.html)

    const now = new Date();
    timestampField.value = now.toISOString(); // ISO format for consistency
}

/**
 * Fetches and displays members from the JSON file
 */
async function fetchMembers() {
    if (!membersContainer) return; // Only run if the element exists (i.e., on directory.html)

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const members = await response.json();
        displayMembers(members, 'grid'); // Default to grid view
    } catch (error) {
        console.error('Error fetching members:', error);
        membersContainer.innerHTML = '<p>Error loading members. Please try again later.</p>';
    }
}

/**
 * Displays members in the specified view (grid or list)
 */
function displayMembers(members, view) {
    membersContainer.innerHTML = ''; // Clear existing content
    membersContainer.className = view === 'grid' ? 'members-grid' : 'members-list';

    members.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = view === 'grid' ? 'member-card' : 'member-list-item';

        // Create the image element with error handling
        const imgElement = document.createElement('img');
        imgElement.src = `images/${member.image}`;
        imgElement.alt = `${member.name} Icon`;
        imgElement.onerror = () => {
            imgElement.src = 'images/placeholder-icon.png'; // Fallback image
            imgElement.alt = 'Image not available';
        };

        // Create the member content
        const contentElement = document.createElement('div');
        contentElement.innerHTML = `
            <h3>${member.name}</h3>
            <p><strong>Category:</strong> ${member.category}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
            <p><strong>Membership Level:</strong> ${member.membershipLevel}</p>
        `;

        memberElement.appendChild(imgElement);
        memberElement.appendChild(contentElement);
        membersContainer.appendChild(memberElement);
    });
}

/**
 * Sets up the view toggle functionality
 */
function setupViewToggle() {
    if (!gridViewButton || !listViewButton) return; // Only run if the elements exist (i.e., on directory.html)

    let currentView = 'grid'; // Default view

    gridViewButton.addEventListener('click', async () => {
        currentView = 'grid';
        gridViewButton.classList.add('active');
        listViewButton.classList.remove('active');
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const members = await response.json();
        displayMembers(members, currentView);
    });

    listViewButton.addEventListener('click', async () => {
        currentView = 'list';
        listViewButton.classList.add('active');
        gridViewButton.classList.remove('active');
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const members = await response.json();
        displayMembers(members, currentView);
    });
}

/**
 * Fetches and displays weather data for Lilongwe
 */
async function fetchWeather() {
    if (!currentTempElement || !weatherDescElement || !forecastDaysElement) return;

    try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Lilongwe,MW&units=metric&appid=${API_KEY}`);
        if (!currentWeatherResponse.ok) throw new Error(`HTTP error! Status: ${currentWeatherResponse.status}`);
        const currentWeather = await currentWeatherResponse.json();

        currentTempElement.textContent = currentWeather.main.temp.toFixed(1);
        weatherDescElement.textContent = currentWeather.weather[0].description;

        // Fetch 3-day forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Lilongwe,MW&units=metric&appid=${API_KEY}`);
        if (!forecastResponse.ok) throw new Error(`HTTP error! Status: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();

        // Process forecast data (one entry per day at 12:00 PM)
        const forecastDays = [];
        const today = new Date();
        let currentDay = today.getDate();

        for (const entry of forecastData.list) {
            const entryDate = new Date(entry.dt * 1000);
            const entryDay = entryDate.getDate();
            const entryHour = entryDate.getHours();

            // Take the 12:00 PM forecast for each day
            if (entryHour === 12 && entryDay !== currentDay && forecastDays.length < 3) {
                forecastDays.push({
                    date: entryDate,
                    temp: entry.main.temp.toFixed(1),
                    desc: entry.weather[0].description
                });
            }
        }

        // Display forecast
        forecastDaysElement.innerHTML = forecastDays.map(day => `
            <div class="forecast-day">
                <p><strong>${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}:</strong> ${day.temp}°C, ${day.desc}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching weather:', error);
        currentTempElement.textContent = 'N/A';
        weatherDescElement.textContent = 'Unable to load weather data';
        forecastDaysElement.innerHTML = '<p>Error loading forecast.</p>';
    }
}

/**
 * Fetches and displays spotlight advertisements for Silver and Gold members
 */
async function fetchSpotlights() {
    if (!spotlightsContainer) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const members = await response.json();

        // Filter for Silver and Gold members
        const eligibleMembers = members.filter(member =>
            member.membershipLevel === 'Silver Membership' || member.membershipLevel === 'Gold Membership'
        );

        // Randomly select 2-3 members
        const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, Math.min(3, eligibleMembers.length));

        // Display spotlights
        spotlightsContainer.innerHTML = `
            <h2>Spotlight Members</h2>
            ${selectedMembers.map(member => `
                <div>
                    <img src="images/${member.image}" alt="${member.name} Icon" onerror="this.src='images/placeholder-icon.png'; this.alt='Image not available';">
                    <p class="spotlight-title">${member.name}</p>
                    <p>${member.category} | <a href="${member.website}" target="_blank">Visit Website</a></p>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error fetching spotlights:', error);
        spotlightsContainer.innerHTML = '<p>Error loading spotlight members.</p>';
    }
}

/**
 * Initializes all event listeners
 */
function initEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Initialize banner if it exists
    if (banner) {
        manageBanner();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayLastModified();
    displayVisitMessage();
    setTimestamp();
    fetchMembers();
    setupViewToggle();
    fetchWeather();
    fetchSpotlights();
    initEventListeners();
    
    // Set initial aria attributes for accessibility
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
});