/**
 * Validation utility class for input validation
 */
class ValidationUtils {
    /**
     * Validate player name
     * @param {string} name - Player name to validate
     * @returns {Object} Validation result
     */
    static validatePlayerName(name) {
        const errors = [];
        
        if (typeof name !== 'string') {
            errors.push('Name must be a string');
        } else {
            const trimmedName = name.trim();
            
            if (trimmedName.length === 0) {
                errors.push('Name cannot be empty');
            } else if (trimmedName.length < 2) {
                errors.push('Name must be at least 2 characters long');
            } else if (trimmedName.length > 20) {
                errors.push('Name cannot be longer than 20 characters');
            }
            
            // Check for valid characters (letters, numbers, spaces, basic punctuation)
            if (!/^[a-zA-Z0-9\s\-_'.]+$/.test(trimmedName)) {
                errors.push('Name contains invalid characters');
            }
            
            // Check for inappropriate words (basic filter)
            if (this._containsInappropriateContent(trimmedName)) {
                errors.push('Name contains inappropriate content');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            sanitized: typeof name === 'string' ? name.trim() : ''
        };
    }

    /**
     * Validate player symbol
     * @param {string} symbol - Player symbol to validate
     * @returns {Object} Validation result
     */
    static validatePlayerSymbol(symbol) {
        const errors = [];
        const validSymbols = ['X', 'O'];
        
        if (!validSymbols.includes(symbol)) {
            errors.push('Symbol must be either "X" or "O"');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate board position
     * @param {number} position - Board position to validate
     * @returns {Object} Validation result
     */
    static validateBoardPosition(position) {
        const errors = [];
        
        if (!Number.isInteger(position)) {
            errors.push('Position must be an integer');
        } else if (position < 0 || position > 8) {
            errors.push('Position must be between 0 and 8');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate game configuration
     * @param {Object} config - Game configuration
     * @returns {Object} Validation result
     */
    static validateGameConfig(config) {
        const errors = [];
        
        if (!config || typeof config !== 'object') {
            errors.push('Configuration must be an object');
            return { valid: false, errors };
        }
        
        // Validate players
        if (!config.players || !Array.isArray(config.players) || config.players.length !== 2) {
            errors.push('Must have exactly 2 players');
        } else {
            config.players.forEach((player, index) => {
                if (!player || typeof player !== 'object') {
                    errors.push(`Player ${index + 1} must be an object`);
                } else {
                    const nameValidation = this.validatePlayerName(player.name);
                    if (!nameValidation.valid) {
                        errors.push(`Player ${index + 1}: ${nameValidation.errors.join(', ')}`);
                    }
                    
                    const symbolValidation = this.validatePlayerSymbol(player.symbol);
                    if (!symbolValidation.valid) {
                        errors.push(`Player ${index + 1}: ${symbolValidation.errors.join(', ')}`);
                    }
                }
            });
            
            // Check for duplicate names
            if (config.players.length === 2 && 
                config.players[0].name && config.players[1].name &&
                config.players[0].name.trim().toLowerCase() === config.players[1].name.trim().toLowerCase()) {
                errors.push('Player names must be different');
            }
            
            // Check for duplicate symbols
            if (config.players.length === 2 && 
                config.players[0].symbol === config.players[1].symbol) {
                errors.push('Player symbols must be different');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Sanitize input string
     * @param {string} input - Input to sanitize
     * @param {number} maxLength - Maximum length
     * @returns {string} Sanitized input
     */
    static sanitizeInput(input, maxLength = 50) {
        if (typeof input !== 'string') {
            return '';
        }
        
        return input
            .trim()
            .substring(0, maxLength)
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/\s+/g, ' '); // Normalize whitespace
    }

    /**
     * Validate email format (for potential features)
     * @param {string} email - Email to validate
     * @returns {Object} Validation result
     */
    static validateEmail(email) {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (typeof email !== 'string') {
            errors.push('Email must be a string');
        } else if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        } else if (email.length > 254) {
            errors.push('Email is too long');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate URL format (for potential features)
     * @param {string} url - URL to validate
     * @returns {Object} Validation result
     */
    static validateURL(url) {
        const errors = [];
        
        try {
            new URL(url);
        } catch {
            errors.push('Invalid URL format');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate game statistics object
     * @param {Object} stats - Statistics object to validate
     * @returns {Object} Validation result
     */
    static validateGameStatistics(stats) {
        const errors = [];
        
        if (!stats || typeof stats !== 'object') {
            errors.push('Statistics must be an object');
            return { valid: false, errors };
        }
        
        const requiredFields = ['gamesPlayed', 'player1Wins', 'player2Wins', 'ties'];
        
        requiredFields.forEach(field => {
            if (!(field in stats)) {
                errors.push(`Missing required field: ${field}`);
            } else if (!Number.isInteger(stats[field]) || stats[field] < 0) {
                errors.push(`${field} must be a non-negative integer`);
            }
        });
        
        // Logical validation
        if (errors.length === 0) {
            const totalGames = stats.player1Wins + stats.player2Wins + stats.ties;
            if (totalGames !== stats.gamesPlayed) {
                errors.push('Sum of wins and ties must equal total games played');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if string contains inappropriate content (basic filter)
     * @param {string} text - Text to check
     * @returns {boolean} True if contains inappropriate content
     * @private
     */
    static _containsInappropriateContent(text) {
        // Very basic inappropriate content filter
        // In a real application, you'd want a more sophisticated filter
        const inappropriateWords = [
            'admin', 'root', 'system', 'null', 'undefined',
            // Add more inappropriate words as needed
        ];
        
        const lowerText = text.toLowerCase();
        return inappropriateWords.some(word => lowerText.includes(word));
    }

    /**
     * Create a validation error object
     * @param {string} field - Field that failed validation
     * @param {string} message - Error message
     * @returns {Object} Error object
     */
    static createError(field, message) {
        return {
            field,
            message,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Format validation errors for display
     * @param {Array} errors - Array of error messages
     * @returns {string} Formatted error string
     */
    static formatErrors(errors) {
        if (!Array.isArray(errors) || errors.length === 0) {
            return '';
        }
        
        if (errors.length === 1) {
            return errors[0];
        }
        
        return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
    }

    /**
     * Validate and sanitize form data
     * @param {Object} formData - Form data to validate
     * @param {Object} rules - Validation rules
     * @returns {Object} Validation result with sanitized data
     */
    static validateFormData(formData, rules) {
        const errors = [];
        const sanitizedData = {};
        
        for (const [field, value] of Object.entries(formData)) {
            const rule = rules[field];
            if (!rule) continue;
            
            let sanitizedValue = value;
            
            // Apply sanitization
            if (rule.sanitize && typeof rule.sanitize === 'function') {
                sanitizedValue = rule.sanitize(value);
            }
            
            // Apply validation
            if (rule.validate && typeof rule.validate === 'function') {
                const validation = rule.validate(sanitizedValue);
                if (!validation.valid) {
                    errors.push(...validation.errors.map(error => `${field}: ${error}`));
                }
            }
            
            sanitizedData[field] = sanitizedValue;
        }
        
        return {
            valid: errors.length === 0,
            errors,
            data: sanitizedData
        };
    }
}

export default ValidationUtils;
