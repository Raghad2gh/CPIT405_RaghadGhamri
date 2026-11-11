const ACCESS_KEY = "sTl_kpKXpq_0nTdKJgPSM3x_AiMtC0fsf7uq2xeck9s";

const searchInput = document.getElementById("searchInput");
const imageContainer = document.getElementById("imageContainer");
const statusText = document.getElementById("status");


function getURL() {
    const query = searchInput.value.trim();

    if (query === "") {
        statusText.textContent = "Please enter a keyword.";
        return null;
    }

    return `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}`;
}


function displayImages(data) {
    imageContainer.innerHTML = "";

    if (data.results.length === 0) {
        statusText.textContent = "No images found.";
        return;
    }

    statusText.textContent = "Images loaded successfully!";

    data.results.forEach(photo => {
        const card = document.createElement("div");
        card.className = "photo-card";

        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || "Unsplash image";

        const credit = document.createElement("p");
        const link = document.createElement("a");
        link.href = photo.user.links.html +
            "?utm_source=cpit405_lab7&utm_medium=referral";
        link.textContent = `Photo by ${photo.user.name} on Unsplash`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        credit.appendChild(link);
        card.appendChild(img);
        card.appendChild(credit);
        imageContainer.appendChild(card);
    });
}


function searchXHR() {
    const url = getURL();
    if (!url) return;

    statusText.textContent = "Loading...";

    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.setRequestHeader(
        "Authorization",
        `Client-ID ${ACCESS_KEY}`
    );

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            displayImages(data);
        } else {
            statusText.textContent = "Error loading images.";
        }
    };

    xhr.onerror = function () {
        statusText.textContent = "Network error.";
    };

    xhr.send();
}


function searchFetch() {
    const url = getURL();
    if (!url) return;

    statusText.textContent = "Loading...";

    fetch(url, {
        headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }

        return response.json();
    })
    .then(data => {
        displayImages(data);
    })
    .catch(error => {
        statusText.textContent = error.message;
    });
}


async function searchAsync() {
    const url = getURL();
    if (!url) return;

    statusText.textContent = "Loading...";

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID ${ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        displayImages(data);

    } catch (error) {
        statusText.textContent = error.message;
    }
}


document.getElementById("xhrBtn")
    .addEventListener("click", searchXHR);

document.getElementById("fetchBtn")
    .addEventListener("click", searchFetch);

document.getElementById("asyncBtn")
    .addEventListener("click", searchAsync);


searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchAsync();
    }
});