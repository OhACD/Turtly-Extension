// Tracks paragraphs on the page and handles the currently focused one
// Find and store all paragraph elements
// calculate which paragraph is closest to the center of the viewport
// Could handle paragraph highlighting (idk WIP)
class ParagraphTracker {
    constructor() {
        this.paragraphs = document.querySelectorAll("p");
    }
    getParagraphs() {
        return this.paragraphs;
    }
    getFocusedParagraph() {
        const currentViewportCenter = window.innerHeight / 2 + window.scrollY;
        let closestIndex = -1;
        let closestDistance = Infinity;
        let closestParagraph = null;

        this.paragraphs.forEach((p, index) => {
            const rect = p.getBoundingClientRect();
            const paragraphCenter = rect.top + window.scrollY + rect.height / 2;
            const distance = Math.abs(paragraphCenter - currentViewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
                closestParagraph = p;
            }
        });
        return {index: closestIndex, paragraph: closestParagraph};
    }

}
