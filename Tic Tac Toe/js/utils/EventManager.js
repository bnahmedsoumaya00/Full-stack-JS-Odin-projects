/**
 * Event manager utility class for handling custom events
 */
class EventManager {
    /**
     * Initialize the event manager
     */
    constructor() {
        this._listeners = new Map();
    }

    /**
     * Add an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @param {Object} context - Optional context for the callback
     */
    on(event, callback, context = null) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        if (!this._listeners.has(event)) {
            this._listeners.set(event, []);
        }

        this._listeners.get(event).push({ callback, context });
    }

    /**
     * Remove an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (!this._listeners.has(event)) return;

        const listeners = this._listeners.get(event);
        const index = listeners.findIndex(listener => listener.callback === callback);
        
        if (index !== -1) {
            listeners.splice(index, 1);
        }

        // Remove event key if no listeners left
        if (listeners.length === 0) {
            this._listeners.delete(event);
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass to callbacks
     */
    emit(event, ...args) {
        if (!this._listeners.has(event)) return;

        const listeners = this._listeners.get(event);
        listeners.forEach(({ callback, context }) => {
            try {
                if (context) {
                    callback.call(context, ...args);
                } else {
                    callback(...args);
                }
            } catch (error) {
                console.error(`Error in event listener for '${event}':`, error);
            }
        });
    }

    /**
     * Add a one-time event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @param {Object} context - Optional context for the callback
     */
    once(event, callback, context = null) {
        const onceCallback = (...args) => {
            this.off(event, onceCallback);
            if (context) {
                callback.call(context, ...args);
            } else {
                callback(...args);
            }
        };

        this.on(event, onceCallback);
    }

    /**
     * Get all event names
     * @returns {Array<string>} Array of event names
     */
    getEvents() {
        return Array.from(this._listeners.keys());
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    getListenerCount(event) {
        return this._listeners.has(event) ? this._listeners.get(event).length : 0;
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    removeAllListeners(event) {
        if (event) {
            this._listeners.delete(event);
        } else {
            this._listeners.clear();
        }
    }

    /**
     * Check if an event has listeners
     * @param {string} event - Event name
     * @returns {boolean} True if event has listeners
     */
    hasListeners(event) {
        return this._listeners.has(event) && this._listeners.get(event).length > 0;
    }
}

export default EventManager;
