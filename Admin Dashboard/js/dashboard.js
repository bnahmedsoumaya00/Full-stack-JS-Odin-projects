// Main Dashboard Controller - Much Cleaner and Modular!
class Dashboard {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        this.initializeComponents();
        this.setupComponentInteractions();
        console.log('Dashboard initialized successfully');
    }

    initializeComponents() {
        // Initialize all components
        this.components = {
            navigation: new Navigation(),
            projectCards: new ProjectCards(),
            search: new Search(),
            buttonActions: new ButtonActions()
        };
    }

    setupComponentInteractions() {
        // Connect search with project filtering
        this.components.search.onSearch((searchTerm) => {
            this.components.projectCards.filter(searchTerm);
        });

        // Connect navigation events
        this.components.navigation.onNavigate((section) => {
            this.handleNavigation(section);
        });

        // Connect project card events
        this.components.projectCards.onCardClick((title, card) => {
            this.handleProjectOpen(title, card);
        });

        // Connect button actions
        this.setupButtonCallbacks();
    }

    setupButtonCallbacks() {
        const { buttonActions } = this.components;
        
        buttonActions.onCreateNew(() => {
            // Handle new project creation
            console.log('Dashboard: Creating new project');
        });

        buttonActions.onUploadFile(() => {
            // Handle file upload
            console.log('Dashboard: Uploading file');
        });

        buttonActions.onShareProject(() => {
            // Handle project sharing
            console.log('Dashboard: Sharing project');
        });
    }

    handleNavigation(section) {
        console.log(`Dashboard: Navigating to ${section}`);
        // Add your navigation logic here
    }

    handleProjectOpen(title, card) {
        console.log(`Dashboard: Opening project "${title}"`);
        // Add your project opening logic here
    }

    // Public API methods
    search(term) {
        this.components.search.performSearch(term);
    }

    clearSearch() {
        this.components.search.clear();
        this.components.projectCards.showAll();
    }

    destroy() {
        // Clean up all components
        Object.values(this.components).forEach(component => {
            component.removeAll?.();
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
