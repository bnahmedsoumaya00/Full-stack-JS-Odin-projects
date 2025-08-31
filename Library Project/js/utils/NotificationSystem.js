/**
 * Notification System Class
 * Handles displaying toast notifications to users
 */
class NotificationSystem {
    constructor() {
        this.createToastContainer();
    }
    
    /**
     * Create the toast container if it doesn't exist
     */
    createToastContainer() {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = HTMLUtils.createElement('div', {
                id: 'toastContainer',
                className: 'toast-container position-fixed top-0 end-0 p-3',
                style: 'z-index: 9999;'
            });
            document.body.appendChild(toastContainer);
        }
        this.container = toastContainer;
    }
    
    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, warning, info)
     * @param {number} duration - Auto-hide duration in milliseconds (0 to disable)
     */
    showToast(message, type = 'info', duration = 5000) {
        const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        const iconMap = {
            success: 'check-circle-fill',
            error: 'exclamation-triangle-fill',
            warning: 'exclamation-triangle-fill',
            info: 'info-circle-fill'
        };
        
        const colorMap = {
            success: 'var(--olive-600)',
            error: '#dc3545',
            warning: '#ffc107',
            info: 'var(--olive-500)'
        };
        
        const toastHtml = `
            <div class="toast-header" style="background-color: ${colorMap[type]}; color: white;">
                <i class="bi bi-${iconMap[type]} me-2"></i>
                <strong class="me-auto">Library</strong>
                <small class="text-light">${this.getTimeStamp()}</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${HTMLUtils.escapeHtml(message)}
            </div>
        `;
        
        const toastElement = HTMLUtils.createElement('div', {
            id: toastId,
            className: 'toast',
            role: 'alert',
            'aria-live': 'assertive',
            'aria-atomic': 'true'
        }, toastHtml);
        
        this.container.appendChild(toastElement);
        
        // Initialize Bootstrap toast
        const toast = new bootstrap.Toast(toastElement, {
            autohide: duration > 0,
            delay: duration
        });
        
        // Show the toast
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        });
        
        return toast;
    }
    
    /**
     * Show success notification
     * @param {string} message - Success message
     * @param {number} duration - Duration in milliseconds
     */
    showSuccess(message, duration = 3000) {
        return this.showToast(message, 'success', duration);
    }
    
    /**
     * Show error notification
     * @param {string} message - Error message
     * @param {number} duration - Duration in milliseconds
     */
    showError(message, duration = 5000) {
        return this.showToast(message, 'error', duration);
    }
    
    /**
     * Show warning notification
     * @param {string} message - Warning message
     * @param {number} duration - Duration in milliseconds
     */
    showWarning(message, duration = 4000) {
        return this.showToast(message, 'warning', duration);
    }
    
    /**
     * Show info notification
     * @param {string} message - Info message
     * @param {number} duration - Duration in milliseconds
     */
    showInfo(message, duration = 3000) {
        return this.showToast(message, 'info', duration);
    }
    
    /**
     * Get current timestamp for display
     * @returns {string} Formatted timestamp
     */
    getTimeStamp() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    /**
     * Clear all notifications
     */
    clearAll() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => {
            const bsToast = bootstrap.Toast.getInstance(toast);
            if (bsToast) {
                bsToast.hide();
            }
        });
    }
}
