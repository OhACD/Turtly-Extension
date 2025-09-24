// Takes a paragraph element and turtle dimensions
// Calculates candidate positions around the paragraph
// Checks if the position is clear
// Provides a fallback position if none are clear
class PositionCalculator {
    constructor(paragraphRect, turtleWidth, turtleHeight) {
        this.paragraphRect = paragraphRect;
        this.turtleWidth = turtleWidth;
        this.turtleHeight = turtleHeight;
    }

    getCandidatePositions() {
        const paragraphRect = this.paragraphRect;
        const turtleWidth = this.turtleWidth;
        const turtleHeight = this.turtleHeight;

        return [
            { top: paragraphRect.bottom + window.scrollY, left: paragraphRect.right + window.scrollX - turtleWidth }, // Bottom-right
            { top: paragraphRect.bottom + window.scrollY, left: paragraphRect.left + window.scrollX },               // Bottom-left
            { top: paragraphRect.top + window.scrollY - turtleHeight, left: paragraphRect.right + window.scrollX - turtleWidth }, // Top-right
            { top: paragraphRect.top + window.scrollY - turtleHeight, left: paragraphRect.left + window.scrollX }    // Top-left
        ];
    }

    isPositionClear(top, left, width, height, turtle) {
        // Check several points within the turtle's area
        for (let dx = 0; dx < width; dx += width / 2) {
            for (let dy = 0; dy < height; dy += height / 2) {
                const unsafeTags = [
                    "p", "span", "a", "li", "ul", "ol", "table", "td", "th",
                    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "cite", "em", "strong",
                    "b", "i", "u", "small", "mark", "sup", "sub", "img", "svg", "canvas", "pre", "code"
                ];

                const candidateX = left + dx;
                const candidateY = top + dy;
                const element = document.elementFromPoint(
                    candidateX - window.scrollX,
                    candidateY - window.scrollY
                );

                if (
                    element &&
                    element !== turtle &&
                    element.tagName.toLowerCase() !== "body" &&
                    element.tagName.toLowerCase() !== "html" &&
                    unsafeTags.includes(element.tagName.toLowerCase())
                ) {
                    return false; // Overlaps with unsafe content
                }
            }
        }
        return true; // No overlap
    }

    getFallbackPosition(turtleWidth, turtleHeight) {
        const margin = 32;
        const viewportBottom = window.innerHeight + window.scrollY;
        const viewportRight = window.innerWidth + window.scrollX;
        return {
            top: viewportBottom - turtleHeight - margin,
            left: viewportRight - turtleWidth - margin
        };
    }

    calculatePosition(paragraph, turtleWidth, turtleHeight, turtle) {
        // Update rect & turtle dimensions
        this.paragraphRect = paragraph.getBoundingClientRect();
        this.turtleWidth = turtleWidth;
        this.turtleHeight = turtleHeight;

        // Get candidate positions
        const candidates = this.getCandidatePositions();

        // Return the first clear position
        for (const pos of candidates) {
            if (this.isPositionClear(pos.top, pos.left, turtleWidth, turtleHeight, turtle)) {
                return pos;
            }
        }

        // Fallback if no candidates are valid
        return this.getFallbackPosition(turtleWidth, turtleHeight);
    }
}
