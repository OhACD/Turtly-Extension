let lastFocusedIndex = -1;
// Debounced scroll handler
let scrollTimeoutId = null;

// Create the turtle element
    const turtle = document.createElement("img");
    turtle.src = chrome.runtime.getURL("assets/turtle/turtle-idle/turtle-idle.png");
    turtle.style.position = "absolute";
    turtle.style.width = "64px";
    turtle.style.height = "64px";
    turtle.style.zIndex = 1000;
    document.body.appendChild(turtle);
    console.log("Turtle created!");

// Loads and keep count of the paragraphs on the current webpage
const paragraphs = document.querySelectorAll('p');
console.log("Found", paragraphs.length, "paragraphs on this page.");

// Detects when the user scrolls the page
window.addEventListener("scroll", onScroll);

function onScroll() {
    if (scrollTimeoutId !== null) {
        clearTimeout(scrollTimeoutId);
    }
    scrollTimeoutId = setTimeout(checkFocusedParagraph, 300); // debounce
}

function checkFocusedParagraph() {
    const currentViewportCenter = window.innerHeight / 2 + window.scrollY;
    let closestIndex = -1;
    let closestDistance = Infinity;

    paragraphs.forEach((p, index) => {
        const rect = p.getBoundingClientRect();
        const paragraphCenter = rect.top + window.scrollY + rect.height / 2;
        const distance = Math.abs(paragraphCenter - currentViewportCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
            closestParagraph = p;
        }
    });

    if (closestIndex !== lastFocusedIndex) {
        lastFocusedIndex = closestIndex;
        const currentRect = closestParagraph.getBoundingClientRect();
        // Positions the turtle at the end of the focused paragraph
        // Probably will add a function to handle this
        // Also will add a timer to make it appear after a few seconds of focusing on the same paragraph
        // Maybe also add a cooldown to not make it appear too often
        // Also will add some animation to make it appear smoothly
        turtle.style.top = (currentRect.bottom + window.scrollY) + "px";
        turtle.style.left = (currentRect.right + window.scrollX - 64) + "px";
        console.log("Turtle Appeared at paragraph:", closestIndex);
    }
}

