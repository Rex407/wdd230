const baseURL = "https://rex407.github.io/wdd230/";
const membersURL = `${baseURL}chamber/data/members.json`;

async function getMembers() {
    try {
        console.log("Fetching from:", membersURL);
        const response = await fetch(membersURL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched members data:", data);
        displayMembers(data.members, 'grid-view');
        setupViewToggle(data.members);
    } catch (error) {
        console.error("Error fetching members:", error.message);
        document.getElementById("directory-container").innerHTML = "<p>Error loading members.</p>";
    }
}

function displayMembers(members, viewType) {
    const container = document.getElementById("directory-container");
    if (!container) return console.error("Container not found.");
    container.innerHTML = '';
    container.className = viewType;

    members.forEach(member => {
        const element = document.createElement("div");
        element.className = viewType === 'grid-view' ? "member-card" : "member-list-item";
        element.innerHTML = viewType === 'grid-view'
            ? `<img src="${baseURL}images/${member.image}" alt="${member.name} logo" loading="lazy">
               <h3>${member.name}</h3><p>${member.address}</p><p>${member.phone}</p>
               <p><a href="${member.website}" target="_blank">Visit Website</a></p>
               <p>Membership: ${member.membershipLevel}</p><p>${member.description}</p>`
            : `<h3>${member.name}</h3><p>${member.address} | ${member.phone} | 
               <a href="${member.website}" target="_blank">Website</a> | Membership: ${member.membershipLevel}</p>`;
        container.appendChild(element);
    });
}

function setupViewToggle(members) {
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");
    if (!gridBtn || !listBtn) return console.error("Buttons not found.");
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

document.addEventListener("DOMContentLoaded", getMembers);