// Hamburger Menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.querySelector('ul').classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
let isDarkMode = false;

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Optional: Save user preference
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved user preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
    isDarkMode = true;
}

// Optional: System preference detection
if (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode')) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
    isDarkMode = true;
}