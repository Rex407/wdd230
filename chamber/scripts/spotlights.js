// Spotlight Configuration
const spotlightConfig = {
    dataSource: 'data/members.json',
    eligibleLevels: ['silver', 'gold'],
    minSpotlights: 2,
    maxSpotlights: 3,
    cacheDuration: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

// DOM Elements
const spotlightContainer = document.getElementById('spotlight-container');

/**
 * Fetches member data with caching support
 * @returns {Promise<Array>} Array of member objects
 */
async function fetchMemberData() {
    try {
        // Check cache first
        const cachedData = localStorage.getItem('cachedMemberData');
        const cacheTime = localStorage.getItem('cachedMemberTime');
        
        if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < spotlightConfig.cacheDuration) {
            return JSON.parse(cachedData);
        }

        // Fetch fresh data if cache is expired or doesn't exist
        const response = await fetch(spotlightConfig.dataSource);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const members = await response.json();
        
        // Cache the new data
        localStorage.setItem('cachedMemberData', JSON.stringify(members));
        localStorage.setItem('cachedMemberTime', Date.now().toString());
        
        return members;
    } catch (error) {
        console.error('Error fetching member data:', error);
        throw error;
    }
}

/**
 * Filters and selects random spotlights
 * @param {Array} members - All member data
 * @returns {Array} Selected spotlight members
 */
function selectSpotlights(members) {
    const eligible = members.filter(member => 
        spotlightConfig.eligibleLevels.includes(member.membership.toLowerCase())
    );

    if (eligible.length === 0) return null;

    // Determine number of spotlights to show (2 or 3)
    const showThree = eligible.length >= spotlightConfig.maxSpotlights && 
                     Math.random() < 0.5;
    const count = showThree ? spotlightConfig.maxSpotlights : spotlightConfig.minSpotlights;

    // Select random members without duplicates
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, eligible.length));
}

/**
 * Creates HTML for a spotlight card
 * @param {Object} member - Member data
 * @returns {String} HTML string
 */
function createSpotlightCard(member) {
    return `
        <div class="spotlight-card" aria-label="${member.name} business spotlight">
            <div class="spotlight-header">
                <h3>${member.name}</h3>
                ${member.tagline ? `<p class="slogan">"${member.tagline}"</p>` : ''}
            </div>
            <div class="spotlight-body">
                ${member.image ? `<img src="${member.image}" alt="${member.name} logo" loading="lazy">` : ''}
                <div class="spotlight-contact">
                    ${member.email ? `<p><i class="fas fa-envelope"></i> ${member.email}</p>` : ''}
                    ${member.phone ? `<p><i class="fas fa-phone"></i> ${member.phone}</p>` : ''}
                    ${member.address ? `<p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>` : ''}
                </div>
            </div>
            <div class="spotlight-footer">
                <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="spotlight-link">
                    Visit Website <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
}

/**
 * Displays error message in the spotlight container
 * @param {String} message - Error message to display
 */
function displayError(message = 'Spotlights currently unavailable') {
    spotlightContainer.innerHTML = `
        <div class="spotlight-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Main function to load and display spotlights
 */
async function displaySpotlights() {
    try {
        const members = await fetchMemberData();
        const selectedSpotlights = selectSpotlights(members);
        
        if (!selectedSpotlights || selectedSpotlights.length === 0) {
            displayError('No spotlight members available');
            return;
        }

        spotlightContainer.innerHTML = selectedSpotlights
            .map(member => createSpotlightCard(member))
            .join('');
            
    } catch (error) {
        console.error('Error displaying spotlights:', error);
        displayError();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', displaySpotlights);

// Optional: Refresh spotlights periodically
// setInterval(displaySpotlights, spotlightConfig.cacheDuration);