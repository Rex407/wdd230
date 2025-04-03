// Base URL for the GitHub Pages repository (update with your username)
const baseURL = "https://rex407.github.io/wdd230/"; // Replace with your GitHub username

// URL for the links.json data file
const linksURL = `${baseURL}data/links.json`;

// Asynchronous function to get the links data
async function getLinks() {
    try {
        const response = await fetch(linksURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debug: Check the data structure
        displayLinks(data.weeks);
    } catch (error) {
        console.error("Error fetching links:", error.message);
        const container = document.getElementById("activity-links-container");
        container.innerHTML = "<p>Error loading activities. Check console for details.</p>";
    }
}

// Function to display links
function displayLinks(weeks) {
    const container = document.getElementById("activity-links-container");
    if (!container) {
        console.error("Container 'activity-links-container' not found.");
        return;
    }

    weeks.forEach(week => {
        const p = document.createElement("p");
        let weekText = `${week.week}: `;
        week.links.forEach((link, index) => {
            const a = document.createElement("a");
            a.href = `${baseURL}${link.url}`;
            a.textContent = link.title;
            a.target = "_blank";
            p.appendChild(a);
            if (index < week.links.length - 1) {
                p.appendChild(document.createTextNode(" | "));
            }
        });
        container.appendChild(p);
    });
}

// Call the getLinks function when the page loads
document.addEventListener("DOMContentLoaded", getLinks);