function setCookie(name, value) {
    document.cookie = name + "=" + value + "; expires=" +
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString() + "; path=/";
}


function getCookie(name) {
    let myCookies = document.cookie.split("; ");
    for (let cookie of myCookies) {
        let key = cookie.split("=")[0];
        if (key === name) {
            return cookie.substring(name.length + 1); 
        }
    }
    return null;
}


function deleteCookie(name) {
    document.cookie = name + "=; expires=" + new Date(2000, 0, 1).toUTCString() + "; path=/";
}


let likes = 100;
let dislikes = 20;
let comments = [];


const likeBtn      = document.getElementById("like-btn");
const dislikeBtn   = document.getElementById("dislike-btn");
const likeCount    = document.getElementById("like-count");
const dislikeCount = document.getElementById("dislike-count");
const commentInput = document.getElementById("comment-input");
const submitBtn    = document.getElementById("submit-btn");
const resetBtn     = document.getElementById("reset-btn");
const commentsList = document.getElementById("comments-list");
const message      = document.getElementById("message");


function updateUI() {
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;

   
    const vote = getCookie("vote");
    likeBtn.disabled = vote !== null;
    dislikeBtn.disabled = vote !== null;
    likeBtn.classList.toggle("selected", vote === "like");
    dislikeBtn.classList.toggle("selected", vote === "dislike");

    
    const hasCommented = getCookie("comment") !== null;
    submitBtn.disabled = hasCommented;
    commentInput.disabled = hasCommented;

    
    commentsList.innerHTML = "";
    comments.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        commentsList.appendChild(li);
    });
}

function showMessage(text) {
    message.textContent = text;
    setTimeout(() => (message.textContent = ""), 3000);
}


function loadState() {
    const savedLikes = getCookie("likes");
    const savedDislikes = getCookie("dislikes");
    if (savedLikes !== null) likes = Number(savedLikes);
    if (savedDislikes !== null) dislikes = Number(savedDislikes);

    const savedComment = getCookie("comment");
    if (savedComment !== null) comments = [savedComment];

    updateUI();
}


function vote(type) {
    if (getCookie("vote") !== null) {
        showMessage("You already voted!");
        return;
    }

    if (type === "like") likes++;
    else dislikes++;

    setCookie("vote", type);
    setCookie("likes", likes);
    setCookie("dislikes", dislikes);

    const btn = type === "like" ? likeBtn : dislikeBtn;
    btn.classList.add("pop");
    setTimeout(() => btn.classList.remove("pop"), 400);

    updateUI();
}

likeBtn.addEventListener("click", () => vote("like"));
dislikeBtn.addEventListener("click", () => vote("dislike"));


submitBtn.addEventListener("click", () => {
    
    const text = commentInput.value.split(";").join(",");

    if (getCookie("comment") !== null) {
        showMessage("You already left a comment!");
        return;
    }
    if (text.split(" ").join("") === "") {
        showMessage("Please write a comment first.");
        return;
    }

    comments.push(text);
    setCookie("comment", text);
    commentInput.value = "";
    updateUI();
});


resetBtn.addEventListener("click", () => {
    const vote = getCookie("vote");

    
    if (vote === "like") likes--;
    if (vote === "dislike") dislikes--;

    deleteCookie("vote");
    deleteCookie("comment");
    setCookie("likes", likes);
    setCookie("dislikes", dislikes);

    comments = [];
    commentInput.value = "";
    updateUI();
    showMessage("Your vote and comment have been reset. You can vote again!");
});


loadState();
