let lastFocusedIndex = -1;
const turtleWidth = 64;
const turtleHeight = 64;
const debounceDelay = 300;
class ContentManager {
    constructor() {
        this.paragraphTracker = new ParagraphTracker();
        this.positionCalculator = new PositionCalculator();
        this.turtleManager = new TurtleManager(turtleWidth, turtleHeight);
        this.scrollManager = new ScrollManager(this.onScroll.bind(this), debounceDelay);
        this.lastFocusedIndex = -1;
        this.turtleManager.createTurtle();
    }
    onScroll() {
        const currentParagraph = this.paragraphTracker.getFocusedParagraph();

        if (currentParagraph.index !== this.lastFocusedIndex) {
            this.lastFocusedIndex = currentParagraph.index;

            if (currentParagraph.paragraph) {

                const position = this.positionCalculator.calculatePosition(
                currentParagraph.paragraph,
                this.turtleManager.width,
                this.turtleManager.height,
                this.turtleManager.turtle
);
                this.turtleManager.moveTo(position.top, position.left);
            } else {
                this.turtleManager.hide();
            }
        }
    }
}
new ContentManager();
