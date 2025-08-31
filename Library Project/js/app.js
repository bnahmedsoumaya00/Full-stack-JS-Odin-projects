/**
 * Application Entry Point
 * Initializes and starts the Library Application
 */

// Global application instance
let libraryApp;

/**
 * Application Class
 * Main application orchestrator
 */
class LibraryApp {
    constructor() {
        this.controller = null;
        this.isInitialized = false;
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing Library Application...');
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize the main controller
            this.controller = new LibraryController();
            
            // Set up global error handlers
            this.setupErrorHandlers();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('Library Application initialized successfully');
            
            // Show welcome message for first-time users
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('Failed to initialize Library Application:', error);
            this.showInitializationError(error);
        }
    }
    
    /**
     * Wait for DOM to be fully loaded
     * @returns {Promise} Promise that resolves when DOM is ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    /**
     * Set up global error handlers
     */
    setupErrorHandlers() {
        // Handle uncaught JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Uncaught error:', event.error);
            if (this.controller?.notifications) {
                this.controller.notifications.showError(
                    'An unexpected error occurred. Please refresh the page if problems persist.'
                );
            }
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (this.controller?.notifications) {
                this.controller.notifications.showError(
                    'An unexpected error occurred. Please refresh the page if problems persist.'
                );
            }
            event.preventDefault();
        });
    }
    
    /**
     * Show welcome message for new users
     */
    showWelcomeMessage() {
        // Check if this is the first visit
        const isFirstVisit = !localStorage.getItem('library-visited');
        
        if (isFirstVisit) {
            localStorage.setItem('library-visited', 'true');
            
            setTimeout(() => {
                if (this.controller?.notifications) {
                    this.controller.notifications.showInfo(
                        'Welcome to your Personal Library! We\'ve added some sample books to get you started.',
                        8000
                    );
                }
            }, 1000);
        }
    }
    
    /**
     * Show initialization error
     * @param {Error} error - Error that occurred during initialization
     */
    showInitializationError(error) {
        // Create a simple error message if the notification system isn't available
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Application Error</h4>
                <p>Failed to initialize the Library Application.</p>
                <p class="mb-0">Error: ${error.message}</p>
                <hr>
                <p class="mb-0">Please refresh the page. If the problem persists, check the browser console for details.</p>
            </div>
        `;
        
        // Insert error message at the top of the main container
        const container = document.querySelector('.main-container') || document.body;
        container.insertBefore(errorDiv, container.firstChild);
    }
    
    /**
     * Get the controller instance
     * @returns {LibraryController|null} Controller instance
     */
    getController() {
        return this.controller;
    }
    
    /**
     * Check if application is initialized
     * @returns {boolean} True if initialized
     */
    isReady() {
        return this.isInitialized;
    }
    
    /**
     * Restart the application
     */
    async restart() {
        console.log('Restarting Library Application...');
        this.isInitialized = false;
        this.controller = null;
        await this.init();
    }
}

/**
 * Utility function to safely access the application controller
 * @returns {LibraryController|null} Controller instance if available
 */
function getLibraryController() {
    return libraryApp?.getController() || null;
}

/**
 * Initialize the application when the page loads
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        libraryApp = new LibraryApp();
        await libraryApp.init();
    } catch (error) {
        console.error('Critical error during application startup:', error);
    }
});

/**
 * Expose some useful functions globally for debugging
 */
if (typeof window !== 'undefined') {
    window.LibraryApp = {
        getController: getLibraryController,
        restart: () => libraryApp?.restart(),
        isReady: () => libraryApp?.isReady()
    };
}
