/**
 * Validation Utilities Class
 * Provides validation methods for form inputs and data
 */
class ValidationUtils {
    /**
     * Validate book form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} Validation result with isValid and errors
     */
    static validateBookForm(formData) {
        const errors = [];
        
        // Validate title
        if (!formData.title || formData.title.trim().length === 0) {
            errors.push('Title is required');
        } else if (formData.title.trim().length > 200) {
            errors.push('Title must be less than 200 characters');
        }
        
        // Validate author
        if (!formData.author || formData.author.trim().length === 0) {
            errors.push('Author is required');
        } else if (formData.author.trim().length > 100) {
            errors.push('Author name must be less than 100 characters');
        }
        
        // Validate pages
        const pages = parseInt(formData.pages);
        if (!formData.pages || isNaN(pages) || pages <= 0) {
            errors.push('Pages must be a positive number');
        } else if (pages > 50000) {
            errors.push('Pages must be less than 50,000');
        }
        
        // Validate rating (optional)
        if (formData.rating) {
            const rating = parseInt(formData.rating);
            if (isNaN(rating) || rating < 1 || rating > 5) {
                errors.push('Rating must be between 1 and 5');
            }
        }
        
        // Validate genre (optional)
        if (formData.genre && formData.genre.length > 50) {
            errors.push('Genre must be less than 50 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Validate search input
     * @param {string} searchTerm - Search term to validate
     * @returns {Object} Validation result
     */
    static validateSearch(searchTerm) {
        const errors = [];
        
        if (searchTerm && searchTerm.length > 100) {
            errors.push('Search term must be less than 100 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Check if string contains only allowed characters
     * @param {string} str - String to check
     * @param {RegExp} pattern - Allowed pattern
     * @returns {boolean} True if valid
     */
    static matchesPattern(str, pattern) {
        return pattern.test(str);
    }
    
    /**
     * Sanitize string input
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeString(input) {
        if (typeof input !== 'string') {
            return '';
        }
        
        return input.trim().replace(/\s+/g, ' ');
    }
    
    /**
     * Validate ISBN format (basic validation)
     * @param {string} isbn - ISBN to validate
     * @returns {boolean} True if valid ISBN format
     */
    static validateISBN(isbn) {
        if (!isbn) return true; // ISBN is optional
        
        // Remove hyphens and spaces
        const cleaned = isbn.replace(/[-\s]/g, '');
        
        // Check if it's ISBN-10 or ISBN-13
        return /^\d{10}$/.test(cleaned) || /^\d{13}$/.test(cleaned);
    }
}
