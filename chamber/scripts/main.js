// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav a');
const lastUpdateElement = document.getElementById('last-modified');
const banner = document.getElementById('meet-greet-banner');
const closeBannerBtn = document.getElementById('close-banner');
const visitMessageElement = document.getElementById('visit-message');
const timestampField = document.getElementById('timestamp');

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
    initEventListeners();
    
    // Set initial aria attributes for accessibility
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
});