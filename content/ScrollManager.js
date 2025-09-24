// Should detect when the user scrolls on the page
class ScrollManager {
    constructor(scrollCallback, debounceTime = 300) {
        this.scrollCallback = scrollCallback;
        this.debounceTime = debounceTime;
        this.scrollTimeoutId = null;
        window.addEventListener("scroll", this.onScroll.bind(this));
    }

    onScroll() {
        if (this.scrollTimeoutId !== null) {
            clearTimeout(this.scrollTimeoutId);
        }
        this.scrollTimeoutId = setTimeout(() => {
            this.scrollCallback();
        }, this.debounceTime);
    }
}
