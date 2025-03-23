// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const mainNav = document.querySelector('#mainNav');

hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.textContent = mainNav.classList.contains('active') ? '×' : '≡';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
        mainNav.classList.remove('active');
        hamburger.textContent = '≡';
    }
});

// Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Function to toggle dark mode
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
};

// Initialize dark mode based on user preference or system preference
const initializeDarkMode = () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (localStorage.getItem('darkMode') === null) {
        // If no user preference, use system preference
        isDarkMode = systemPrefersDark;
    }

    toggleDarkMode();
};

// Event listener for dark mode toggle
darkModeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    toggleDarkMode();
});

// Initialize dark mode on page load
initializeDarkMode();