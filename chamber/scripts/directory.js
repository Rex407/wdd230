// scripts/directory.js

// Toggle between local and deployed URL for testing
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = isLocal ? "" : "https://rex407.github.io/wdd230/";
const membersURL = isLocal ? "data/members.json" : `${baseURL}chamber/data/members.json`;

// Asynchronous function to get the members data
async function getMembers() {
    try {
        console.log("Attempting to fetch members from:", membersURL);
        const response = await fetch(membersURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched members data:", data);
        if (!data.members || data.members.length === 0) {
            throw new Error("No members found in the JSON data.");
        }
        displayMembers(data.members, 'grid-view'); // Default to grid view
        setupViewToggle(data.members); // Set up the view toggle buttons
    } catch (error) {
        console.error("Error fetching members:", error.message);
        const container = document.getElementById("directory-container");
        if (container) {
            container.innerHTML = `<p>Error loading members: ${error.message}. Please ensure the file is available at <a href="${membersURL}" target="_blank">${membersURL}</a>.</p>`;
        }
    }
}

// Function to display members
function displayMembers(members, viewType) {
    const container = document.getElementById("directory-container");
    if (!container) {
        console.error("Container 'directory-container' not found.");
        return;
    }

    // Clear existing content
    container.innerHTML = '';
    container.className = viewType; // Set the view type class (grid-view or list-view)

    members.forEach(member => {
        if (viewType === 'grid-view') {
            // Grid view: Display as cards
            const card = document.createElement("div");
            card.className = "member-card";

            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                <p>Membership: ${member.membershipLevel}</p>
                <p>${member.description}</p>
            `;

            container.appendChild(card);
        } else {
            // List view: Display as a simple list item
            const listItem = document.createElement("div");
            listItem.className = "member-list-item";

            listItem.innerHTML = `
                <h3>${member.name}</h3>
                <p>${member.address} | ${member.phone} | <a href="${member.website}" target="_blank">Website</a> | Membership: ${member.membershipLevel}</p>
            `;

            container.appendChild(listItem);
        }
    });
}

// Function to set up view toggle buttons
function setupViewToggle(members) {
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");

    gridBtn.addEventListener("click", () => {
        displayMembers(members, 'grid-view');
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
        displayMembers(members, 'list-view');
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });
}

// Call the getMembers function when the page loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired, calling getMembers");
    getMembers();
});