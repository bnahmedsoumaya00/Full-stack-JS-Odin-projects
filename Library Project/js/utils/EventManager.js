/**
 * Event Manager Class
 * Manages custom events and event delegation throughout the application
 */
class EventManager {
    constructor() {
        this.events = new Map();
        this.delegatedEvents = new Map();
    }
    
    /**
     * Register an event listener
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Event callback function
     * @param {Object} options - Event options
     */
    on(eventName, callback, options = {}) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        
        this.events.get(eventName).push({
            callback,
            options,
            once: options.once || false
        });
    }
    
    /**
     * Register a one-time event listener
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Event callback function
     */
    once(eventName, callback) {
        this.on(eventName, callback, { once: true });
    }
    
    /**
     * Remove event listener(s)
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Specific callback to remove (optional)
     */
    off(eventName, callback = null) {
        if (!this.events.has(eventName)) return;
        
        if (callback) {
            const listeners = this.events.get(eventName);
            const index = listeners.findIndex(listener => listener.callback === callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        } else {
            this.events.delete(eventName);
        }
    }
    
    /**
     * Emit/trigger an event
     * @param {string} eventName - Name of the event
     * @param {*} data - Data to pass to event listeners
     */
    emit(eventName, data = null) {
        if (!this.events.has(eventName)) return;
        
        const listeners = this.events.get(eventName);
        const toRemove = [];
        
        listeners.forEach((listener, index) => {
            try {
                listener.callback(data);
                
                if (listener.once) {
                    toRemove.push(index);
                }
            } catch (error) {
                console.error(`Error in event listener for '${eventName}':`, error);
            }
        });
        
        // Remove one-time listeners
        toRemove.reverse().forEach(index => {
            listeners.splice(index, 1);
        });
    }
    
    /**
     * Set up event delegation for dynamic elements
     * @param {HTMLElement} container - Container element
     * @param {string} selector - CSS selector for target elements
     * @param {string} eventType - DOM event type (click, change, etc.)
     * @param {Function} handler - Event handler function
     */
    delegate(container, selector, eventType, handler) {
        const delegateKey = `${container.tagName}-${selector}-${eventType}`;
        
        if (this.delegatedEvents.has(delegateKey)) {
            return; // Already delegated
        }
        
        const delegateHandler = (event) => {
            const target = event.target.closest(selector);
            if (target && container.contains(target)) {
                handler.call(target, event);
            }
        };
        
        container.addEventListener(eventType, delegateHandler);
        this.delegatedEvents.set(delegateKey, {
            container,
            handler: delegateHandler,
            eventType
        });
    }
    
    /**
     * Remove event delegation
     * @param {HTMLElement} container - Container element
     * @param {string} selector - CSS selector
     * @param {string} eventType - DOM event type
     */
    undelegate(container, selector, eventType) {
        const delegateKey = `${container.tagName}-${selector}-${eventType}`;
        
        if (this.delegatedEvents.has(delegateKey)) {
            const delegation = this.delegatedEvents.get(delegateKey);
            delegation.container.removeEventListener(delegation.eventType, delegation.handler);
            this.delegatedEvents.delete(delegateKey);
        }
    }
    
    /**
     * Clear all events
     */
    clear() {
        this.events.clear();
        
        // Remove all delegated events
        this.delegatedEvents.forEach((delegation) => {
            delegation.container.removeEventListener(delegation.eventType, delegation.handler);
        });
        this.delegatedEvents.clear();
    }
}
