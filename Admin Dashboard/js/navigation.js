// Navigation Component
class Navigation extends EventHandler {
    constructor(selector = '.nav-item') {
        super();
        this.navItems = DOMUtils.$$(selector);
        this.activeClass = 'active';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.navItems.forEach(item => {
            this.on(item, 'click', (e) => this.handleClick(e, item));
        });
    }

    handleClick(event, clickedItem) {
        this.setActive(clickedItem);
        this.navigate(clickedItem);
    }

    setActive(activeItem) {
        // Remove active from all
        this.navItems.forEach(item => {
            DOMUtils.removeClass(item, this.activeClass);
        });
        
        // Add active to clicked
        DOMUtils.addClass(activeItem, this.activeClass);
    }

    navigate(item) {
        const section = item.querySelector('span')?.textContent;
        console.log(`Navigating to: ${section}`);
        this.onNavigate?.(section);
    }

    onNavigate(callback) {
        this.onNavigate = callback;
    }
}
