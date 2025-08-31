/**
 * Book Model Class
 * Represents a single book in the library with all its properties and methods
 */
class Book {
    constructor(title, author, pages, read = false, genre = '', rating = null) {
        this.id = this.generateId();
        this.title = title;
        this.author = author;
        this.pages = parseInt(pages);
        this.read = read;
        this.genre = genre;
        this.rating = rating;
        this.dateAdded = new Date();
        
        // Validate input data
        this.validateBookData();
    }
    
    /**
     * Generates a unique ID for the book
     * @returns {string} Unique identifier
     */
    generateId() {
        return crypto.randomUUID ? crypto.randomUUID() : 
               'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Validates book data on creation
     * @throws {Error} If required data is invalid
     */
    validateBookData() {
        if (!this.title || typeof this.title !== 'string' || this.title.trim().length === 0) {
            throw new Error('Book title is required and must be a non-empty string');
        }
        
        if (!this.author || typeof this.author !== 'string' || this.author.trim().length === 0) {
            throw new Error('Book author is required and must be a non-empty string');
        }
        
        if (!this.pages || this.pages <= 0 || !Number.isInteger(this.pages)) {
            throw new Error('Book pages must be a positive integer');
        }
        
        if (this.rating !== null && (!Number.isInteger(this.rating) || this.rating < 1 || this.rating > 5)) {
            throw new Error('Book rating must be null or an integer between 1 and 5');
        }
    }
    
    /**
     * Toggle the read status of the book
     */
    toggleReadStatus() {
        this.read = !this.read;
    }
    
    /**
     * Update the rating of the book
     * @param {number|null} newRating - Rating between 1-5 or null
     */
    updateRating(newRating) {
        if (newRating !== null && (!Number.isInteger(newRating) || newRating < 1 || newRating > 5)) {
            throw new Error('Rating must be null or an integer between 1 and 5');
        }
        this.rating = newRating;
    }
    
    /**
     * Update the genre of the book
     * @param {string} newGenre - New genre
     */
    updateGenre(newGenre) {
        this.genre = newGenre || '';
    }
    
    /**
     * Get formatted date when book was added
     * @returns {string} Formatted date string
     */
    getFormattedDateAdded() {
        return this.dateAdded.toLocaleDateString();
    }
    
    /**
     * Get star rating display
     * @returns {string} Stars representation of rating
     */
    getStarRating() {
        return this.rating ? '⭐'.repeat(this.rating) : '';
    }
    
    /**
     * Get book info as object for serialization
     * @returns {Object} Book data object
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            pages: this.pages,
            read: this.read,
            genre: this.genre,
            rating: this.rating,
            dateAdded: this.dateAdded.toISOString()
        };
    }
    
    /**
     * Create a Book instance from JSON data
     * @param {Object} bookData - Book data object
     * @returns {Book} New Book instance
     */
    static fromJSON(bookData) {
        const book = new Book(
            bookData.title,
            bookData.author,
            bookData.pages,
            bookData.read,
            bookData.genre,
            bookData.rating
        );
        book.id = bookData.id;
        book.dateAdded = new Date(bookData.dateAdded);
        return book;
    }
    
    /**
     * Check if book matches search criteria
     * @param {string} searchTerm - Search term to match against
     * @returns {boolean} True if book matches search criteria
     */
    matchesSearch(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.title.toLowerCase().includes(term) ||
               this.author.toLowerCase().includes(term) ||
               this.genre.toLowerCase().includes(term);
    }
    
    /**
     * Get a summary of the book
     * @returns {string} Book summary
     */
    getSummary() {
        return `"${this.title}" by ${this.author} (${this.pages} pages)${this.genre ? ` - ${this.genre}` : ''}`;
    }
}
