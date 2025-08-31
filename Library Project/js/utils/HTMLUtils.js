/**
 * HTML Utilities Class
 * Provides utility methods for HTML manipulation and validation
 */
class HTMLUtils {
    /**
     * Escape HTML special characters to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML text
     */
    static escapeHtml(text) {
        if (typeof text !== 'string') {
            return '';
        }
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Create a DOM element with specified attributes and content
     * @param {string} tagName - HTML tag name
     * @param {Object} attributes - Object containing attributes
     * @param {string} content - Inner HTML content
     * @returns {HTMLElement} Created element
     */
    static createElement(tagName, attributes = {}, content = '') {
        const element = document.createElement(tagName);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'data' && typeof value === 'object') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    }
    
    /**
     * Show/hide element with optional animation
     * @param {HTMLElement} element - Element to show/hide
     * @param {boolean} show - Whether to show or hide
     * @param {string} displayType - Display type when showing (default: block)
     */
    static toggleElement(element, show, displayType = 'block') {
        if (!element) return;
        
        if (show) {
            element.style.display = displayType;
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.3s ease';
            
            // Trigger reflow
            element.offsetHeight;
            
            element.style.opacity = '1';
        } else {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * Add animation class to element and remove it after duration
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - CSS class for animation
     * @param {number} duration - Animation duration in milliseconds
     */
    static animateElement(element, animationClass, duration = 1000) {
        if (!element) return;
        
        element.classList.add(animationClass);
        
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
}
