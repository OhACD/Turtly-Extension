// Handles creation and positioning of the turtle on the element
// Create and style the turtle
// Move the turtle to a given position
// Hide/show/animate the turtle
class TurtleManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.turtle = null;
    }
    createTurtle() {
        if (this.turtle) return; // Already created
        this.turtle = document.createElement("img");
        this.turtle.src = chrome.runtime.getURL("assets/turtle/turtle-idle/turtle-idle.png");
        this.turtle.style.position = "absolute";
        this.turtle.style.width = this.width + "px";
        this.turtle.style.height = this.height + "px";
        this.turtle.style.zIndex = 1000;
        document.body.appendChild(this.turtle);
        console.log("Turtle created!");
    }
    moveTo(top, left) {
        if (this.turtle) {
            this.turtle.style.top = top + "px";
            this.turtle.style.left = left + "px";
        }
    }
    hide() {
        if (this.turtle) this.turtle.style.display = "none";
    }
    show() {
        if (this.turtle) this.turtle.style.display = "";
    }
    destroy() {
        if (this.turtle) {
            this.turtle.remove();
            this.turtle = null;
        }
    }
}
