// Base Event Handler Class
class EventHandler {
    constructor() {
        this.events = new Map();
    }

    on(element, event, handler) {
        if (!element) return;
        
        const key = `${element.tagName}-${event}`;
        if (!this.events.has(key)) {
            this.events.set(key, []);
        }
        
        element.addEventListener(event, handler);
        this.events.get(key).push({ element, handler });
    }

    off(element, event, handler) {
        element?.removeEventListener(event, handler);
    }

    removeAll() {
        this.events.forEach((handlers) => {
            handlers.forEach(({ element, handler, event }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.events.clear();
    }
}

// Utility Functions
class DOMUtils {
    static $(selector) {
        return document.querySelector(selector);
    }

    static $$(selector) {
        return document.querySelectorAll(selector);
    }

    static addClass(element, className) {
        element?.classList.add(className);
    }

    static removeClass(element, className) {
        element?.classList.remove(className);
    }

    static toggleClass(element, className) {
        element?.classList.toggle(className);
    }

    static setStyle(element, styles) {
        if (!element) return;
        Object.assign(element.style, styles);
    }
}

// Animation Helper
class Animator {
    static fadeIn(element, duration = 300) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    static fadeOut(element, duration = 300) {
        if (!element) return;
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
    }

    static slideUp(element, isUp = true) {
        if (!element) return;
        const transform = isUp ? 'translateY(-4px)' : 'translateY(0)';
        const shadow = isUp ? '0 6px 20px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)';
        
        DOMUtils.setStyle(element, {
            transform,
            boxShadow: shadow
        });
    }

    static scaleButton(element) {
        if (!element) return;
        DOMUtils.setStyle(element, { transform: 'scale(0.95)' });
        setTimeout(() => {
            DOMUtils.setStyle(element, { transform: 'scale(1)' });
        }, 100);
    }
}
