/**
 * Library View Class
 * Handles the display and rendering of books in the library
 */
class LibraryView {
    constructor() {
        this.libraryContainer = document.getElementById('library');
        this.emptyMessage = document.getElementById('emptyMessage');
        this.statsContainer = document.getElementById('libraryStats');
        this.bindElements();
    }
    
    /**
     * Bind DOM elements and cache references
     */
    bindElements() {
        this.totalBooksElement = document.getElementById('totalBooks');
        this.readBooksElement = document.getElementById('readBooks');
        this.unreadBooksElement = document.getElementById('unreadBooks');
    }
    
    /**
     * Render all books in the library
     * @param {Book[]} books - Array of books to display
     */
    renderBooks(books) {
        this.clearLibraryContainer();
        
        if (books.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.hideEmptyState();
        
        books.forEach(book => {
            const bookCard = this.createBookCard(book);
            this.libraryContainer.appendChild(bookCard);
        });
        
        // Add animation to newly rendered books
        this.animateBookCards();
    }
    
    /**
     * Create a book card element
     * @param {Book} book - Book instance
     * @returns {HTMLElement} Book card element
     */
    createBookCard(book) {
        const bookCol = HTMLUtils.createElement('div', {
            className: 'col-lg-4 col-md-6 col-sm-12'
        });
        
        const ratingDisplay = book.rating ? 
            `<div class="mb-2">
                <small class="text-muted">Rating: </small>
                ${book.getStarRating()}
            </div>` : '';
        
        const genreDisplay = book.genre ? 
            `<div class="mb-2">
                <span class="badge rounded-pill" style="background-color: var(--olive-400); color: var(--olive-800);">
                    ${HTMLUtils.escapeHtml(book.genre)}
                </span>
            </div>` : '';
        
        const cardContent = `
            <div class="card book-card ${book.read ? 'read' : 'unread'}" data-book-id="${book.id}">
                <div class="card-body">
                    <h5 class="book-title">${HTMLUtils.escapeHtml(book.title)}</h5>
                    <p class="book-author">by ${HTMLUtils.escapeHtml(book.author)}</p>
                    <p class="book-pages">
                        <i class="bi bi-file-earmark-text me-1"></i>
                        ${book.pages} pages
                    </p>
                    ${genreDisplay}
                    ${ratingDisplay}
                    <div class="mb-3">
                        <span class="badge status-badge ${book.read ? 'status-read' : 'status-unread'}">
                            <i class="bi bi-${book.read ? 'check-circle' : 'clock'} me-1"></i>
                            ${book.read ? 'Read' : 'To Read'}
                        </span>
                    </div>
                    <div class="d-grid gap-2">
                        <button class="btn btn-toggle" data-action="toggle-read" data-book-id="${book.id}">
                            <i class="bi bi-${book.read ? 'arrow-counterclockwise' : 'check-circle'} me-1"></i>
                            ${book.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button class="btn btn-remove" data-action="remove" data-book-id="${book.id}">
                            <i class="bi bi-trash me-1"></i>
                            Remove Book
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        bookCol.innerHTML = cardContent;
        return bookCol;
    }
    
    /**
     * Update library statistics display
     * @param {Object} stats - Statistics object
     */
    updateStats(stats) {
        if (this.totalBooksElement) {
            this.totalBooksElement.textContent = stats.totalBooks;
        }
        if (this.readBooksElement) {
            this.readBooksElement.textContent = stats.readBooks;
        }
        if (this.unreadBooksElement) {
            this.unreadBooksElement.textContent = stats.unreadBooks;
        }
        
        // Show/hide stats container based on whether there are books
        if (this.statsContainer) {
            HTMLUtils.toggleElement(
                this.statsContainer, 
                stats.totalBooks > 0, 
                'block'
            );
        }
    }
    
    /**
     * Show empty state message
     */
    showEmptyState() {
        if (this.emptyMessage) {
            HTMLUtils.toggleElement(this.emptyMessage, true, 'block');
        }
    }
    
    /**
     * Hide empty state message
     */
    hideEmptyState() {
        if (this.emptyMessage) {
            HTMLUtils.toggleElement(this.emptyMessage, false);
        }
    }
    
    /**
     * Clear the library container
     */
    clearLibraryContainer() {
        if (this.libraryContainer) {
            this.libraryContainer.innerHTML = '';
        }
    }
    
    /**
     * Add animation to book cards
     */
    animateBookCards() {
        const cards = this.libraryContainer.querySelectorAll('.book-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Highlight a specific book card
     * @param {string} bookId - ID of the book to highlight
     */
    highlightBook(bookId) {
        const bookCard = this.libraryContainer.querySelector(`[data-book-id="${bookId}"]`);
        if (bookCard) {
            HTMLUtils.animateElement(bookCard, 'highlight-animation', 2000);
        }
    }
    
    /**
     * Get book card element by book ID
     * @param {string} bookId - Book ID
     * @returns {HTMLElement|null} Book card element
     */
    getBookCardElement(bookId) {
        return this.libraryContainer.querySelector(`[data-book-id="${bookId}"]`);
    }
    
    /**
     * Remove book card with animation
     * @param {string} bookId - ID of the book to remove
     */
    removeBookCard(bookId) {
        const bookCard = this.getBookCardElement(bookId);
        if (bookCard) {
            const cardContainer = bookCard.closest('.col-lg-4');
            if (cardContainer) {
                cardContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                cardContainer.style.opacity = '0';
                cardContainer.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (cardContainer.parentNode) {
                        cardContainer.parentNode.removeChild(cardContainer);
                    }
                }, 300);
            }
        }
    }
    
    /**
     * Add search highlighting
     * @param {string} searchTerm - Term to highlight
     */
    highlightSearchResults(searchTerm) {
        if (!searchTerm) return;
        
        const cards = this.libraryContainer.querySelectorAll('.book-card');
        cards.forEach(card => {
            const title = card.querySelector('.book-title');
            const author = card.querySelector('.book-author');
            
            if (title) {
                this.highlightText(title, searchTerm);
            }
            if (author) {
                this.highlightText(author, searchTerm);
            }
        });
    }
    
    /**
     * Highlight specific text within an element
     * @param {HTMLElement} element - Element containing text
     * @param {string} searchTerm - Term to highlight
     */
    highlightText(element, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const originalText = element.textContent;
        const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
        
        if (highlightedText !== originalText) {
            element.innerHTML = highlightedText;
        }
    }
}
