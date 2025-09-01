/**
 * Storage manager utility class for handling localStorage operations
 */
class StorageManager {
    /**
     * Initialize the storage manager
     * @param {string} prefix - Prefix for storage keys
     */
    constructor(prefix = 'ticTacToe') {
        this._prefix = prefix;
        this._isAvailable = this._checkStorageAvailability();
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     * @private
     */
    _checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available');
            return false;
        }
    }

    /**
     * Get the full key with prefix
     * @param {string} key - Key name
     * @returns {string} Prefixed key
     * @private
     */
    _getKey(key) {
        return `${this._prefix}_${key}`;
    }

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     * @returns {boolean} True if successful
     */
    save(key, data) {
        if (!this._isAvailable) {
            console.warn('Storage not available');
            return false;
        }

        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this._getKey(key), serializedData);
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored data or default value
     */
    load(key, defaultValue = null) {
        if (!this._isAvailable) {
            return defaultValue;
        }

        try {
            const serializedData = localStorage.getItem(this._getKey(key));
            if (serializedData === null) {
                return defaultValue;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error loading from storage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful
     */
    remove(key) {
        if (!this._isAvailable) {
            return false;
        }

        try {
            localStorage.removeItem(this._getKey(key));
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }

    /**
     * Check if a key exists in localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if key exists
     */
    exists(key) {
        if (!this._isAvailable) {
            return false;
        }

        return localStorage.getItem(this._getKey(key)) !== null;
    }

    /**
     * Clear all data with the current prefix
     * @returns {boolean} True if successful
     */
    clear() {
        if (!this._isAvailable) {
            return false;
        }

        try {
            const keys = this.getAllKeys();
            keys.forEach(key => {
                localStorage.removeItem(this._getKey(key));
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    /**
     * Get all keys with the current prefix
     * @returns {Array<string>} Array of keys (without prefix)
     */
    getAllKeys() {
        if (!this._isAvailable) {
            return [];
        }

        const keys = [];
        const prefixLength = this._prefix.length + 1; // +1 for underscore

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${this._prefix}_`)) {
                keys.push(key.substring(prefixLength));
            }
        }

        return keys;
    }

    /**
     * Get storage usage information
     * @returns {Object} Storage usage info
     */
    getStorageInfo() {
        if (!this._isAvailable) {
            return { available: false, used: 0, total: 0 };
        }

        let used = 0;
        const keys = this.getAllKeys();

        keys.forEach(key => {
            const data = localStorage.getItem(this._getKey(key));
            if (data) {
                used += data.length;
            }
        });

        return {
            available: true,
            used,
            keyCount: keys.length,
            keys
        };
    }

    /**
     * Save game state
     * @param {Object} gameState - Game state to save
     * @returns {boolean} True if successful
     */
    saveGameState(gameState) {
        return this.save('gameState', {
            ...gameState,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Load game state
     * @returns {Object|null} Saved game state or null
     */
    loadGameState() {
        return this.load('gameState');
    }

    /**
     * Save game statistics
     * @param {Object} statistics - Statistics to save
     * @returns {boolean} True if successful
     */
    saveStatistics(statistics) {
        return this.save('statistics', {
            ...statistics,
            lastUpdated: new Date().toISOString()
        });
    }

    /**
     * Load game statistics
     * @returns {Object} Statistics with default values
     */
    loadStatistics() {
        return this.load('statistics', {
            gamesPlayed: 0,
            player1Wins: 0,
            player2Wins: 0,
            ties: 0,
            lastUpdated: null
        });
    }

    /**
     * Save game history
     * @param {Array} history - Game history to save
     * @returns {boolean} True if successful
     */
    saveGameHistory(history) {
        return this.save('gameHistory', history);
    }

    /**
     * Load game history
     * @returns {Array} Game history array
     */
    loadGameHistory() {
        return this.load('gameHistory', []);
    }

    /**
     * Save player preferences
     * @param {Object} preferences - Preferences to save
     * @returns {boolean} True if successful
     */
    savePreferences(preferences) {
        return this.save('preferences', preferences);
    }

    /**
     * Load player preferences
     * @returns {Object} Player preferences
     */
    loadPreferences() {
        return this.load('preferences', {
            soundEnabled: true,
            animationsEnabled: true,
            theme: 'default',
            showHints: true
        });
    }

    /**
     * Check if storage is available
     * @returns {boolean} True if available
     */
    isAvailable() {
        return this._isAvailable;
    }
}

export default StorageManager;
