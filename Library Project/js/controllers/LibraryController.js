/**
 * Library Controller Class
 * Main controller that coordinates between models and views
 * Implements the MVC (Model-View-Controller) pattern
 */
class LibraryController {
    constructor() {
        // Initialize models
        this.library = new Library();
        
        // Initialize views
        this.libraryView = new LibraryView();
        this.formView = new FormView();
        
        // Initialize utilities
        this.notifications = new NotificationSystem();
        
        // Current state
        this.currentFilter = 'all'; // 'all', 'read', 'unread'
        this.currentSort = { field: 'title', order: 'asc' };
        this.currentSearch = '';
        
        // Initialize the application
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.loadSampleData();
        this.refreshDisplay();
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        this.bindFormEvents();
        this.bindLibraryEvents();
        this.bindModalEvents();
        this.bindKeyboardEvents();
    }
    
    /**
     * Bind form-related events
     */
    bindFormEvents() {
        // Form submission
        if (this.formView.formElement) {
            this.formView.formElement.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
        
        // Add book button
        const addBookBtn = document.querySelector('[data-bs-target="#newBookModal"]');
        if (addBookBtn) {
            addBookBtn.addEventListener('click', () => {
                this.formView.focusFirstInput();
            });
        }
    }
    
    /**
     * Bind library interaction events
     */
    bindLibraryEvents() {
        if (this.libraryView.libraryContainer) {
            // Use event delegation for dynamically created elements
            this.libraryView.libraryContainer.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const bookId = e.target.getAttribute('data-book-id');
                
                if (!action || !bookId) return;
                
                switch (action) {
                    case 'toggle-read':
                        this.handleToggleReadStatus(bookId);
                        break;
                    case 'remove':
                        this.handleRemoveBook(bookId);
                        break;
                }
            });
        }
    }
    
    /**
     * Bind modal events
     */
    bindModalEvents() {
        if (this.formView.modalElement) {
            // Reset form when modal is hidden
            this.formView.modalElement.addEventListener('hidden.bs.modal', () => {
                this.formView.resetForm();
            });
            
            // Focus first input when modal is shown
            this.formView.modalElement.addEventListener('shown.bs.modal', () => {
                this.formView.focusFirstInput();
            });
        }
    }
    
    /**
     * Bind keyboard events
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N to add new book
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.formView.showModal();
            }
            
            // Escape to close modal
            if (e.key === 'Escape') {
                this.formView.hideModal();
            }
        });
    }
    
    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        try {
            // Show loading state
            this.formView.setSubmitLoading(true);
            
            // Get and validate form data
            const formData = this.formView.getFormData();
            const validation = this.formView.validateForm();
            
            if (!validation.isValid) {
                this.formView.showFormErrors(validation.errors);
                return;
            }
            
            // Create new book
            const book = new Book(
                formData.title,
                formData.author,
                formData.pages,
                formData.read,
                formData.genre,
                formData.rating
            );
            
            // Add to library
            this.library.addBook(book);
            
            // Success feedback
            this.notifications.showSuccess(`"${book.title}" has been added to your library!`);
            
            // Close modal and refresh display
            this.formView.hideModal();
            this.refreshDisplay();
            
            // Highlight the newly added book
            setTimeout(() => {
                this.libraryView.highlightBook(book.id);
            }, 500);
            
        } catch (error) {
            console.error('Error adding book:', error);
            
            if (error.message.includes('duplicate')) {
                this.formView.showFormErrors(['This book already exists in your library']);
            } else {
                this.notifications.showError('Failed to add book: ' + error.message);
            }
        } finally {
            this.formView.setSubmitLoading(false);
        }
    }
    
    /**
     * Handle toggling read status of a book
     * @param {string} bookId - ID of the book to toggle
     */
    handleToggleReadStatus(bookId) {
        try {
            const book = this.library.findBookById(bookId);
            if (!book) {
                throw new Error('Book not found');
            }
            
            const oldStatus = book.read ? 'read' : 'unread';
            book.toggleReadStatus();
            const newStatus = book.read ? 'read' : 'unread';
            
            // Save changes
            this.library.saveToStorage();
            
            // Update display
            this.refreshDisplay();
            
            // Show notification
            const message = `"${book.title}" marked as ${newStatus}`;
            this.notifications.showInfo(message);
            
        } catch (error) {
            console.error('Error toggling book status:', error);
            this.notifications.showError('Failed to update book status');
        }
    }
    
    /**
     * Handle removing a book from the library
     * @param {string} bookId - ID of the book to remove
     */
    handleRemoveBook(bookId) {
        try {
            const book = this.library.findBookById(bookId);
            if (!book) {
                throw new Error('Book not found');
            }
            
            // Show confirmation dialog
            const confirmed = confirm(
                `Are you sure you want to remove "${book.title}" from your library?\n\n` +
                'This action cannot be undone.'
            );
            
            if (!confirmed) return;
            
            // Remove from library
            const removed = this.library.removeBook(bookId);
            
            if (removed) {
                // Animate removal
                this.libraryView.removeBookCard(bookId);
                
                // Update display after animation
                setTimeout(() => {
                    this.refreshDisplay();
                }, 350);
                
                // Show success message
                this.notifications.showSuccess(`"${book.title}" has been removed from your library`);
            } else {
                throw new Error('Failed to remove book');
            }
            
        } catch (error) {
            console.error('Error removing book:', error);
            this.notifications.showError('Failed to remove book: ' + error.message);
        }
    }
    
    /**
     * Refresh the entire display
     */
    refreshDisplay() {
        const books = this.getFilteredAndSortedBooks();
        const stats = this.library.getStatistics();
        
        this.libraryView.renderBooks(books);
        this.libraryView.updateStats(stats);
        
        // Apply search highlighting if there's a search term
        if (this.currentSearch) {
            this.libraryView.highlightSearchResults(this.currentSearch);
        }
    }
    
    /**
     * Get books with current filters and sorting applied
     * @returns {Book[]} Filtered and sorted books
     */
    getFilteredAndSortedBooks() {
        let books = this.library.getAllBooks();
        
        // Apply search filter
        if (this.currentSearch) {
            books = this.library.searchBooks(this.currentSearch);
        }
        
        // Apply read status filter
        if (this.currentFilter === 'read') {
            books = books.filter(book => book.read);
        } else if (this.currentFilter === 'unread') {
            books = books.filter(book => !book.read);
        }
        
        // Apply sorting
        if (this.currentSort.field) {
            books = this.library.sortBooks(this.currentSort.field, this.currentSort.order);
            
            // Re-apply filters after sorting since sortBooks returns all books
            if (this.currentSearch) {
                books = books.filter(book => book.matchesSearch(this.currentSearch));
            }
            
            if (this.currentFilter === 'read') {
                books = books.filter(book => book.read);
            } else if (this.currentFilter === 'unread') {
                books = books.filter(book => !book.read);
            }
        }
        
        return books;
    }
    
    /**
     * Set reading status filter
     * @param {string} filter - Filter type ('all', 'read', 'unread')
     */
    setFilter(filter) {
        this.currentFilter = filter;
        this.refreshDisplay();
    }
    
    /**
     * Set search term
     * @param {string} searchTerm - Search term
     */
    setSearch(searchTerm) {
        const validation = ValidationUtils.validateSearch(searchTerm);
        if (!validation.isValid) {
            this.notifications.showWarning(validation.errors.join(', '));
            return;
        }
        
        this.currentSearch = ValidationUtils.sanitizeString(searchTerm);
        this.refreshDisplay();
    }
    
    /**
     * Set sorting criteria
     * @param {string} field - Field to sort by
     * @param {string} order - Sort order ('asc', 'desc')
     */
    setSort(field, order = 'asc') {
        this.currentSort = { field, order };
        this.refreshDisplay();
    }
    
    /**
     * Export library data
     * @returns {string} JSON string of library data
     */
    exportLibrary() {
        try {
            const data = this.library.exportToJSON();
            this.notifications.showSuccess('Library data exported successfully');
            return data;
        } catch (error) {
            console.error('Error exporting library:', error);
            this.notifications.showError('Failed to export library data');
            return null;
        }
    }
    
    /**
     * Import library data
     * @param {string} jsonData - JSON string containing library data
     * @param {boolean} replaceExisting - Whether to replace existing books
     */
    importLibrary(jsonData, replaceExisting = false) {
        try {
            this.library.importFromJSON(jsonData, replaceExisting);
            this.refreshDisplay();
            this.notifications.showSuccess('Library data imported successfully');
        } catch (error) {
            console.error('Error importing library:', error);
            this.notifications.showError('Failed to import library data: ' + error.message);
        }
    }
    
    /**
     * Clear all books from library
     */
    clearLibrary() {
        const confirmed = confirm(
            'Are you sure you want to remove all books from your library?\n\n' +
            'This action cannot be undone.'
        );
        
        if (confirmed) {
            this.library.clearLibrary();
            this.refreshDisplay();
            this.notifications.showInfo('Library cleared successfully');
        }
    }
    
    /**
     * Load sample data for demonstration
     */
    loadSampleData() {
        // Only load sample data if library is empty
        if (this.library.getAllBooks().length === 0) {
            try {
                const sampleBooks = [
                    new Book("The Hobbit", "J.R.R. Tolkien", 295, true, "Fantasy", 5),
                    new Book("To Kill a Mockingbird", "Harper Lee", 376, false, "Classic Literature"),
                    new Book("1984", "George Orwell", 328, true, "Dystopian Fiction", 4),
                    new Book("Pride and Prejudice", "Jane Austen", 432, false, "Romance"),
                    new Book("The Catcher in the Rye", "J.D. Salinger", 277, true, "Coming of Age", 3)
                ];
                
                sampleBooks.forEach(book => {
                    this.library.addBook(book);
                });
                
            } catch (error) {
                console.error('Error loading sample data:', error);
            }
        }
    }
    
    /**
     * Get library statistics
     * @returns {Object} Library statistics
     */
    getStatistics() {
        return this.library.getStatistics();
    }
    
    /**
     * Get all unique genres
     * @returns {string[]} Array of genres
     */
    getGenres() {
        return this.library.getGenres();
    }
}
