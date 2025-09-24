// Tracks the last focused paragraph index
let lastFocusedIndex = -1;
// Debounced scroll handler
let scrollTimeoutId = null;

const turtleWidth = 64;
const turtleHeight = 64;

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
    let closestParagraph = null;
    // Candidate position for the turtle
    let chosenPosition = null;

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

        // Defining candidate positions for the turtle
        candidatePositions = [
            {top: currentRect.bottom + window.scrollY, left: currentRect.right + window.scrollX - turtleHeight}, // Bottom-right
            {top: currentRect.bottom + window.scrollY, left: currentRect.left + window.scrollX}, // Bottom-left
            {top: currentRect.top + window.scrollY - turtleWidth, left: currentRect.right + window.scrollX - turtleHeight}, // Top-right
            {top: currentRect.top + window.scrollY - turtleWidth, left: currentRect.left + window.scrollX} // Top-left
        ];
        // Choose the best position that is within the viewport
        candidatePositions.forEach((candidate) => {
            if (isPositionClear(candidate.top, candidate.left, turtleWidth, turtleHeight)) {
                chosenPosition = candidate;
                return;
            }
        });
        if (chosenPosition !== null) {
            turtle.style.top = chosenPosition.top + "px";
            turtle.style.left = chosenPosition.left + "px";
        }
        else {
            // If none of the candidate positions are clear default to bottom-right corner of the screen
            const margin = 32;
            const viewportBottom = window.innerHeight + window.scrollY;
            const viewportRight = window.innerWidth + window.scrollX;
            turtle.style.top = (viewportBottom - turtleHeight - margin) + "px";
            turtle.style.left = (viewportRight - turtleWidth - margin) + "px";
        }
    }
}

function isPositionClear(top, left, width, height) {
    // Check several points within the turtle's area
    for (let dx = 0; dx < width; dx += width / 2) {
        for (let dy = 0; dy < height; dy += height / 2) {
            const unsafeTags = [
                "p", "span", "a", "li", "ul", "ol", "table", "td", "th",
                "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "cite", "em", "strong",
                "b", "i", "u", "small", "mark", "sup", "sub", "img", "svg", "canvas", "pre", "code"
    ];
            // Would probably add a special check for Divs that renders the turtle in a safe spot near them
            const candidateX = left + dx;
            const candidateY = top + dy;
            const element = document.elementFromPoint(candidateX - window.scrollX, candidateY - window.scrollY);
            if (element &&
                element !== turtle &&
                element.tagName.toLowerCase() != "body" &&
                element.tagName.toLowerCase() != "html" &&
                unsafeTags.includes(element.tagName.toLowerCase())) {
                console.log("Position blocked by:", element.tagName, element);
                return false; // Overlaps with paragraph or is part of the paragraph
            }
        }
    }
    console.log("Position clear at:", top, left);
    return true; // No overlap
}

