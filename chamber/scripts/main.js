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
 * Fetches and displays members from the JSON file
 */
async function fetchMembers() {
    if (!membersContainer) return; // Only run if the element exists (i.e., on directory.html)

    try {
        const response = await fetch('data/members.json');
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

        memberElement.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Icon">
            <h3>${member.name}</h3>
            <p><strong>Category:</strong> ${member.category}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
            <p><strong>Membership Level:</strong> ${member.membershipLevel}</p>
        `;

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
        const members = await response.json();
        displayMembers(members, currentView);
    });

    listViewButton.addEventListener('click', async () => {
        currentView = 'list';
        listViewButton.classList.add('active');
        gridViewButton.classList.remove('active');
        const response = await fetch('data/members.json');
        const members = await response.json();
        displayMembers(members, currentView);
    });
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
    initEventListeners();
    
    // Set initial aria attributes for accessibility
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
});