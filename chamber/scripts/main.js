// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Last Modification Date
const lastModified = new Date(document.lastModified);
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};
document.getElementById('last-update').textContent = lastModified.toLocaleString('en-US', options);

// Meet and Greet Banner
function showBanner() {
    const today = new Date().getDay();
    const bannerClosed = localStorage.getItem('bannerClosed');
    const lastClosedDate = localStorage.getItem('bannerClosedDate');
    const currentDate = new Date().toDateString();

    // Reset bannerClosed if it's a new day
    if (lastClosedDate !== currentDate) {
        localStorage.removeItem('bannerClosed');
        localStorage.removeItem('bannerClosedDate');
    }

    // Show banner on Monday (1), Tuesday (2), or Wednesday (3) if not closed
    if ([1, 2, 3].includes(today) && !bannerClosed) {
        const banner = document.getElementById('banner');
        if (banner) {
            banner.classList.remove('hidden');
        }
    }

    // Close button event listener
    const closeButton = document.getElementById('close-banner');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const banner = document.getElementById('banner');
            if (banner) {
                banner.classList.add('hidden');
                localStorage.setItem('bannerClosed', 'true');
                localStorage.setItem('bannerClosedDate', currentDate);
            }
        });
    }
}

// Ensure DOM is fully loaded before running
document.addEventListener('DOMContentLoaded', showBanner);