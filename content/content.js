let lastFocusedIndex = -1;
// Debounced scroll handler
let scrollTimeoutId = null;

// Loads and keep count of the paragraphs on the current webpage
const paragraphs = document.querySelectorAll('p');
console.log("Found", paragraphs.length, "paragraphs on this page.(content.js)");

// Detects when the user scrolls the page
window.addEventListener('scroll', onScroll);

function onScroll() {
    if (scrollTimeoutId !== null) {
        clearTimeout(scrollTimeoutId);
    }
    scrollTimeoutId = setTimeout(checkFocusedParagraph, 200); // 100ms debounce
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
        }
    });

    if (closestIndex !== lastFocusedIndex) {
        lastFocusedIndex = closestIndex;
        // Run your code here when the focused paragraph changes
        // Start the time for the turtle to appear
        turtleTimer(5000);
        console.log("Focused paragraph changed to:", closestIndex);
        // Example: reset turtle timer here if needed
        // resetTurtleTimer();
    }
}

function turtleTimer(timeout) {
    // Just a timer function that counts down and if it doesn't get reset, it triggers the turtle to appear
    console.log("Turtle timer started");
    setTimeout(turtleAppear, timeout);
}

function turtleAppear() {
    console.log("Turtle appears!");
    // Code to make the turtle appear on the screen
    // If there is already a turtle on screen, do not create another
}
