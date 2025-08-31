// Search Component
class Search extends EventHandler {
    constructor(selector = '.search-bar') {
        super();
        this.searchInput = DOMUtils.$(selector);
        this.debounceTime = 300;
        this.debounceTimer = null;
        this.init();
    }

    init() {
        if (!this.searchInput) return;
        this.bindEvents();
    }

    bindEvents() {
        this.on(this.searchInput, 'input', (e) => this.handleInput(e));
        this.on(this.searchInput, 'keypress', (e) => this.handleKeyPress(e));
    }

    handleInput(event) {
        const searchTerm = event.target.value;
        
        // Debounce search
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch(searchTerm);
        }, this.debounceTime);
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.performSearch(event.target.value);
        }
    }

    performSearch(searchTerm) {
        console.log(`Searching for: ${searchTerm}`);
        this.onSearch?.(searchTerm);
    }

    onSearch(callback) {
        this.onSearch = callback;
    }

    clear() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
}
