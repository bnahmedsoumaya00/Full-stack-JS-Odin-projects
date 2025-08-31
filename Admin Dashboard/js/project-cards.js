// Project Cards Component
class ProjectCards extends EventHandler {
    constructor(selector = '.project-card') {
        super();
        this.cards = DOMUtils.$$(selector);
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            this.on(card, 'mouseenter', () => this.handleHover(card, true));
            this.on(card, 'mouseleave', () => this.handleHover(card, false));
            this.on(card, 'click', () => this.handleClick(card));
        });
    }

    handleHover(card, isHovering) {
        Animator.slideUp(card, isHovering);
    }

    handleClick(card) {
        const title = card.querySelector('.project-title')?.textContent;
        console.log(`Opening project: ${title}`);
        this.onCardClick?.(title, card);
    }

    onCardClick(callback) {
        this.onCardClick = callback;
    }

    filter(searchTerm) {
        if (!searchTerm.trim()) {
            this.showAll();
            return;
        }

        this.cards.forEach(card => {
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(searchTerm.toLowerCase()) || 
                          desc.includes(searchTerm.toLowerCase());
            
            DOMUtils.setStyle(card, {
                opacity: matches ? '1' : '0.3'
            });
        });
    }

    showAll() {
        this.cards.forEach(card => {
            DOMUtils.setStyle(card, {
                display: 'block',
                opacity: '1'
            });
        });
    }
}
