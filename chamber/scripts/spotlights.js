async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        const eligible = members.filter(m => ['silver', 'gold'].includes(m.membership));
        const count = eligible.length >= 3 && Math.random() < 0.5 ? 3 : 2;
        const shuffled = eligible.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        const container = document.getElementById('spotlight-container');
        container.innerHTML = selected
            .map(
                m => `
                    <div class="spotlight-card">
                        <h3>${m.name}</h3>
                        <p class="slogan">"${m.tagline}"</p>
                        <p>${m.email}</p>
                        <p>${m.phone}</p>
                        <a href="${m.website}" target="_blank" class="spotlight-link">Visit Site</a>
                    </div>
                `
            )
            .join('') || '<p>No spotlights available.</p>';
    } catch (error) {
        console.error('Spotlight fetch failed:', error);
        document.getElementById('spotlight-container').innerHTML = '<p>Spotlights unavailable.</p>';
    }
}

loadSpotlights();