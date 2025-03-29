// Discover Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set current year and last modified
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
    
    // Visit tracking
    const visitMessage = document.getElementById('visitMessage');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = Date.now();
    const daysSince = lastVisit ? Math.floor((currentVisit - lastVisit) / 86400000) : null;

    if (!lastVisit) {
        visitMessage.innerHTML = '<i class="fas fa-hand-wave"></i><p>Welcome to Springfield! Let us know if you have questions.</p>';
    } else if (daysSince < 1) {
        visitMessage.innerHTML = '<i class="fas fa-bolt"></i><p>Back so soon! Awesome!</p>';
    } else {
        const plural = daysSince === 1 ? '' : 's';
        visitMessage.innerHTML = `<i class="fas fa-clock"></i><p>You last visited ${daysSince} day${plural} ago.</p>`;
    }

    localStorage.setItem('lastVisit', currentVisit);

    // Lazy loading images
    const images = document.querySelectorAll('img[data-src]');
    const imgOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px"
    };

    const loadImage = (image) => {
        image.src = image.dataset.src;
        image.onload = () => {
            image.removeAttribute('data-src');
            image.parentElement.classList.add('loaded');
        };
    };

    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, imgOptions);

        images.forEach(image => imgObserver.observe(image));
    } else {
        images.forEach(image => loadImage(image));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const navigation = document.querySelector('.navigation');
    
    menuButton.addEventListener('click', () => {
      navigation.classList.toggle('open');
      menuButton.textContent = navigation.classList.contains('open') ? '✕' : '☰';
    });
    
    // Close banner functionality if you have one
    const closeBanner = document.querySelector('.close-banner');
    if (closeBanner) {
      closeBanner.addEventListener('click', () => {
        document.querySelector('.banner').style.display = 'none';
      });
    }
  });