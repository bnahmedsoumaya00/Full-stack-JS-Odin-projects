/**
 * Storage Manager Class
 * Handles local storage operations with error handling and data validation
 */
class StorageManager {
    constructor(prefix = 'library') {
        this.prefix = prefix;
        this.isAvailable = this.checkStorageAvailability();
    }
    
    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }
    
    /**
     * Get full key with prefix
     * @param {string} key - Storage key
     * @returns {string} Prefixed key
     */
    getKey(key) {
        return `${this.prefix}-${key}`;
    }
    
    /**
     * Store data in localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @returns {boolean} True if successful
     */
    set(key, data) {
        if (!this.isAvailable) {
            console.warn('Storage not available');
            return false;
        }
        
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this.getKey(key), serializedData);
            return true;
        } catch (error) {
            console.error('Error storing data:', error);
            
            // Check if quota exceeded
            if (error.name === 'QuotaExceededError') {
                console.warn('Storage quota exceeded. Attempting cleanup...');
                this.cleanup();
                
                // Try again after cleanup
                try {
                    localStorage.setItem(this.getKey(key), serializedData);
                    return true;
                } catch (retryError) {
                    console.error('Failed to store data even after cleanup:', retryError);
                }
            }
            
            return false;
        }
    }
    
    /**
     * Retrieve data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Retrieved data or default value
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) {
            return defaultValue;
        }
        
        try {
            const serializedData = localStorage.getItem(this.getKey(key));
            
            if (serializedData === null) {
                return defaultValue;
            }
            
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error retrieving data:', error);
            return defaultValue;
        }
    }
    
    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful
     */
    remove(key) {
        if (!this.isAvailable) {
            return false;
        }
        
        try {
            localStorage.removeItem(this.getKey(key));
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }
    
    /**
     * Check if key exists in storage
     * @param {string} key - Storage key
     * @returns {boolean} True if key exists
     */
    has(key) {
        if (!this.isAvailable) {
            return false;
        }
        
        return localStorage.getItem(this.getKey(key)) !== null;
    }
    
    /**
     * Get all keys with the current prefix
     * @returns {string[]} Array of keys (without prefix)
     */
    getAllKeys() {
        if (!this.isAvailable) {
            return [];
        }
        
        const keys = [];
        const prefixLength = this.prefix.length + 1; // +1 for the dash
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${this.prefix}-`)) {
                keys.push(key.substring(prefixLength));
            }
        }
        
        return keys;
    }
    
    /**
     * Get storage size for current prefix
     * @returns {number} Size in bytes
     */
    getSize() {
        if (!this.isAvailable) {
            return 0;
        }
        
        let size = 0;
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            const value = localStorage.getItem(this.getKey(key));
            if (value) {
                size += key.length + value.length;
            }
        });
        
        return size;
    }
    
    /**
     * Clear all data with current prefix
     * @returns {boolean} True if successful
     */
    clear() {
        if (!this.isAvailable) {
            return false;
        }
        
        try {
            const keys = this.getAllKeys();
            keys.forEach(key => {
                localStorage.removeItem(this.getKey(key));
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
    
    /**
     * Cleanup old/unused data (basic implementation)
     */
    cleanup() {
        if (!this.isAvailable) {
            return;
        }
        
        try {
            // Remove items that might be corrupted or very old
            const keys = this.getAllKeys();
            const now = new Date().getTime();
            const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
            
            keys.forEach(key => {
                try {
                    const data = this.get(key);
                    
                    // If data has a timestamp and is too old, remove it
                    if (data && data.timestamp && (now - data.timestamp) > maxAge) {
                        this.remove(key);
                    }
                } catch (error) {
                    // If we can't parse the data, it's probably corrupted
                    console.warn(`Removing corrupted data for key: ${key}`);
                    this.remove(key);
                }
            });
        } catch (error) {
            console.error('Error during storage cleanup:', error);
        }
    }
    
    /**
     * Export all data as JSON
     * @returns {string|null} JSON string or null if failed
     */
    export() {
        if (!this.isAvailable) {
            return null;
        }
        
        try {
            const data = {};
            const keys = this.getAllKeys();
            
            keys.forEach(key => {
                data[key] = this.get(key);
            });
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Error exporting storage data:', error);
            return null;
        }
    }
    
    /**
     * Import data from JSON
     * @param {string} jsonData - JSON data string
     * @param {boolean} overwrite - Whether to overwrite existing data
     * @returns {boolean} True if successful
     */
    import(jsonData, overwrite = false) {
        if (!this.isAvailable) {
            return false;
        }
        
        try {
            const data = JSON.parse(jsonData);
            
            Object.entries(data).forEach(([key, value]) => {
                if (overwrite || !this.has(key)) {
                    this.set(key, value);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error importing storage data:', error);
            return false;
        }
    }
}
