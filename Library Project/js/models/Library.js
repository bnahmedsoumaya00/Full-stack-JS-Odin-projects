/**
 * Library Model Class
 * Manages a collection of books and provides operations to manipulate them
 */
class Library {
    constructor() {
        this.books = [];
        this.storageKey = 'library-books';
        this.loadFromStorage();
    }
    
    /**
     * Add a book to the library
     * @param {Book} book - Book instance to add
     * @throws {Error} If book is not a valid Book instance
     */
    addBook(book) {
        if (!(book instanceof Book)) {
            throw new Error('Only Book instances can be added to the library');
        }
        
        // Check for duplicate books (same title and author)
        const isDuplicate = this.books.some(existingBook => 
            existingBook.title.toLowerCase() === book.title.toLowerCase() &&
            existingBook.author.toLowerCase() === book.author.toLowerCase()
        );
        
        if (isDuplicate) {
            throw new Error('A book with this title and author already exists in the library');
        }
        
        this.books.push(book);
        this.saveToStorage();
    }
    
    /**
     * Remove a book from the library by ID
     * @param {string} bookId - ID of the book to remove
     * @returns {boolean} True if book was removed, false if not found
     */
    removeBook(bookId) {
        const initialLength = this.books.length;
        this.books = this.books.filter(book => book.id !== bookId);
        
        if (this.books.length < initialLength) {
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    /**
     * Find a book by ID
     * @param {string} bookId - ID of the book to find
     * @returns {Book|null} Found book or null
     */
    findBookById(bookId) {
        return this.books.find(book => book.id === bookId) || null;
    }
    
    /**
     * Get all books in the library
     * @returns {Book[]} Array of all books
     */
    getAllBooks() {
        return [...this.books]; // Return a copy to prevent direct manipulation
    }
    
    /**
     * Get books filtered by read status
     * @param {boolean} readStatus - Filter by read status
     * @returns {Book[]} Filtered books
     */
    getBooksByReadStatus(readStatus) {
        return this.books.filter(book => book.read === readStatus);
    }
    
    /**
     * Get books filtered by genre
     * @param {string} genre - Genre to filter by
     * @returns {Book[]} Books matching the genre
     */
    getBooksByGenre(genre) {
        return this.books.filter(book => 
            book.genre.toLowerCase() === genre.toLowerCase()
        );
    }
    
    /**
     * Search books by title, author, or genre
     * @param {string} searchTerm - Term to search for
     * @returns {Book[]} Books matching the search term
     */
    searchBooks(searchTerm) {
        if (!searchTerm || searchTerm.trim().length === 0) {
            return this.getAllBooks();
        }
        
        return this.books.filter(book => book.matchesSearch(searchTerm));
    }
    
    /**
     * Get library statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const total = this.books.length;
        const read = this.getBooksByReadStatus(true).length;
        const unread = this.getBooksByReadStatus(false).length;
        const totalPages = this.books.reduce((sum, book) => sum + book.pages, 0);
        const readPages = this.getBooksByReadStatus(true).reduce((sum, book) => sum + book.pages, 0);
        
        // Get genre distribution
        const genreCount = {};
        this.books.forEach(book => {
            if (book.genre) {
                genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
            }
        });
        
        // Get average rating
        const ratedBooks = this.books.filter(book => book.rating !== null);
        const averageRating = ratedBooks.length > 0 
            ? ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length 
            : 0;
        
        return {
            totalBooks: total,
            readBooks: read,
            unreadBooks: unread,
            totalPages,
            readPages,
            genreDistribution: genreCount,
            averageRating: Math.round(averageRating * 10) / 10,
            ratedBooksCount: ratedBooks.length
        };
    }
    
    /**
     * Get unique genres in the library
     * @returns {string[]} Array of unique genres
     */
    getGenres() {
        const genres = this.books
            .map(book => book.genre)
            .filter(genre => genre && genre.trim().length > 0);
        
        return [...new Set(genres)].sort();
    }
    
    /**
     * Sort books by different criteria
     * @param {string} sortBy - Criteria to sort by (title, author, pages, dateAdded, rating)
     * @param {string} order - Sort order (asc, desc)
     * @returns {Book[]} Sorted books
     */
    sortBooks(sortBy = 'title', order = 'asc') {
        const validSortFields = ['title', 'author', 'pages', 'dateAdded', 'rating'];
        
        if (!validSortFields.includes(sortBy)) {
            throw new Error(`Invalid sort field: ${sortBy}`);
        }
        
        return [...this.books].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            // Handle string comparisons
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            // Handle null values for rating
            if (sortBy === 'rating') {
                if (aValue === null) aValue = 0;
                if (bValue === null) bValue = 0;
            }
            
            let comparison = 0;
            if (aValue < bValue) {
                comparison = -1;
            } else if (aValue > bValue) {
                comparison = 1;
            }
            
            return order === 'desc' ? comparison * -1 : comparison;
        });
    }
    
    /**
     * Clear all books from the library
     */
    clearLibrary() {
        this.books = [];
        this.saveToStorage();
    }
    
    /**
     * Save library to localStorage
     */
    saveToStorage() {
        try {
            const booksData = this.books.map(book => book.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(booksData));
        } catch (error) {
            console.error('Error saving library to storage:', error);
        }
    }
    
    /**
     * Load library from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const booksData = JSON.parse(stored);
                this.books = booksData.map(bookData => Book.fromJSON(bookData));
            }
        } catch (error) {
            console.error('Error loading library from storage:', error);
            this.books = [];
        }
    }
    
    /**
     * Export library data as JSON string
     * @returns {string} JSON representation of the library
     */
    exportToJSON() {
        return JSON.stringify(this.books.map(book => book.toJSON()), null, 2);
    }
    
    /**
     * Import library data from JSON string
     * @param {string} jsonData - JSON string containing book data
     * @param {boolean} replaceExisting - Whether to replace existing books
     */
    importFromJSON(jsonData, replaceExisting = false) {
        try {
            const booksData = JSON.parse(jsonData);
            
            if (!Array.isArray(booksData)) {
                throw new Error('Invalid JSON format: expected an array of books');
            }
            
            if (replaceExisting) {
                this.books = [];
            }
            
            booksData.forEach(bookData => {
                try {
                    const book = Book.fromJSON(bookData);
                    this.addBook(book);
                } catch (error) {
                    console.warn('Skipping invalid book data:', bookData, error.message);
                }
            });
            
        } catch (error) {
            throw new Error(`Failed to import library: ${error.message}`);
        }
    }
}
