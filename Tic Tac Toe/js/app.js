/**
 * Main application entry point
 * Initializes and coordinates all components of the Tic Tac Toe game
 */

// Import all necessary classes
import Player from './models/Player.js';
import Gameboard from './models/Gameboard.js';
import Game from './models/Game.js';
import SetupView from './views/SetupView.js';
import GameView from './views/GameView.js';
import GameController from './controllers/GameController.js';
import EventManager from './utils/EventManager.js';
import StorageManager from './utils/StorageManager.js';
import AnimationUtils from './utils/AnimationUtils.js';
import ValidationUtils from './utils/ValidationUtils.js';

/**
 * Application class that manages the entire Tic Tac Toe application
 */
class TicTacToeApp {
    /**
     * Initialize the application
     */
    constructor() {
        this._eventManager = new EventManager();
        this._storageManager = new StorageManager('ticTacToe');
        this._isInitialized = false;
        this._components = {};

        // Bind methods to preserve context
        this._initialize = this._initialize.bind(this);
        this._handleError = this._handleError.bind(this);
        this._setupGlobalErrorHandling = this._setupGlobalErrorHandling.bind(this);
    }

    /**
     * Start the application
     * @returns {Promise<void>} Promise that resolves when app is ready
     */
    async start() {
        try {
            console.log('🎮 Starting Tic Tac Toe Application...');
            
            // Check if DOM is ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize the application
            await this._initialize();
            
            // Setup global error handling
            this._setupGlobalErrorHandling();
            
            // Load saved data if available
            this._loadSavedData();
            
            console.log('✅ Tic Tac Toe Application started successfully');
            
            // Emit app ready event
            this._eventManager.emit('app:ready');
            
        } catch (error) {
            this._handleError('Failed to start application', error);
        }
    }

    /**
     * Initialize application components
     * @private
     */
    async _initialize() {
        try {
            // Inject CSS animations
            AnimationUtils.injectCSS();

            // Create model instances
            const gameboard = new Gameboard();
            const player1 = new Player('Player 1', 'X');
            const player2 = new Player('Player 2', 'O');
            const game = new Game(player1, player2, gameboard);

            // Create view instances
            const setupView = new SetupView();
            const gameView = new GameView();

            // Create controller
            const gameController = new GameController(game, setupView, gameView);

            // Store components for access
            this._components = {
                game,
                gameboard,
                setupView,
                gameView,
                gameController,
                eventManager: this._eventManager,
                storageManager: this._storageManager
            };

            // Setup component event listeners
            this._setupComponentEvents();

            // Add to global scope for console access
            window.ticTacToeApp = this;
            window.gameController = gameController;

            this._isInitialized = true;
            
        } catch (error) {
            throw new Error(`Initialization failed: ${error.message}`);
        }
    }

    /**
     * Setup inter-component event listeners
     * @private
     */
    _setupComponentEvents() {
        const { gameController, storageManager } = this._components;

        // Auto-save game state on significant events
        this._eventManager.on('game:started', () => {
            this._autoSave();
        });

        this._eventManager.on('game:ended', () => {
            this._autoSave();
        });

        this._eventManager.on('game:move', () => {
            this._autoSave();
        });

        // Log game events
        this._eventManager.on('game:started', () => {
            console.log('🎯 Game started');
        });

        this._eventManager.on('game:ended', (result) => {
            console.log('🏁 Game ended:', result);
        });

        this._eventManager.on('game:move', (moveInfo) => {
            console.log('👆 Move made:', moveInfo);
        });
    }

    /**
     * Load saved data from storage
     * @private
     */
    _loadSavedData() {
        try {
            const { gameController, storageManager } = this._components;
            
            // Load statistics
            const savedStats = storageManager.loadStatistics();
            if (savedStats && savedStats.gamesPlayed > 0) {
                console.log('📊 Loaded game statistics:', savedStats);
                // Apply loaded statistics to controller if needed
            }

            // Load preferences
            const preferences = storageManager.loadPreferences();
            if (preferences) {
                this._applyPreferences(preferences);
            }

            console.log('💾 Saved data loaded successfully');
            
        } catch (error) {
            console.warn('⚠️ Failed to load saved data:', error.message);
        }
    }

    /**
     * Apply user preferences
     * @param {Object} preferences - User preferences
     * @private
     */
    _applyPreferences(preferences) {
        // Apply theme, animations, etc.
        if (preferences.animationsEnabled === false) {
            document.body.classList.add('no-animations');
        }

        if (preferences.theme && preferences.theme !== 'default') {
            document.body.classList.add(`theme-${preferences.theme}`);
        }
    }

    /**
     * Auto-save game state and statistics
     * @private
     */
    _autoSave() {
        try {
            const { gameController, storageManager } = this._components;
            
            // Save current statistics
            const stats = gameController.getStatistics();
            storageManager.saveStatistics(stats);
            
            // Save game history
            const history = gameController.getGameHistory();
            storageManager.saveGameHistory(history);
            
        } catch (error) {
            console.warn('⚠️ Auto-save failed:', error.message);
        }
    }

    /**
     * Setup global error handling
     * @private
     */
    _setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this._handleError('Global error', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this._handleError('Unhandled promise rejection', event.reason);
        });
    }

    /**
     * Handle application errors
     * @param {string} context - Error context
     * @param {Error} error - The error object
     * @private
     */
    _handleError(context, error) {
        console.error(`❌ ${context}:`, error);
        
        // Emit error event
        this._eventManager.emit('app:error', { context, error });
        
        // Show user-friendly error message
        this._showErrorMessage(`Something went wrong: ${error.message}`);
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     * @private
     */
    _showErrorMessage(message) {
        // Create and show error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e53e3e;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            max-width: 300px;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Get application components (for testing/debugging)
     * @returns {Object} Application components
     */
    getComponents() {
        return { ...this._components };
    }

    /**
     * Get application status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this._isInitialized,
            version: '1.0.0',
            components: Object.keys(this._components),
            storageAvailable: this._storageManager.isAvailable(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Restart the application
     */
    restart() {
        try {
            console.log('🔄 Restarting application...');
            
            // Reset game state
            if (this._components.gameController) {
                this._components.gameController.resetStatistics();
            }
            
            // Clear storage
            this._storageManager.clear();
            
            // Reload the page
            window.location.reload();
            
        } catch (error) {
            this._handleError('Failed to restart application', error);
        }
    }

    /**
     * Shutdown the application
     */
    shutdown() {
        try {
            console.log('🛑 Shutting down application...');
            
            // Save final state
            this._autoSave();
            
            // Clean up components
            if (this._components.gameController) {
                this._components.gameController.destroy();
            }
            
            // Clear event listeners
            this._eventManager.removeAllListeners();
            
            // Remove from global scope
            delete window.ticTacToeApp;
            delete window.gameController;
            
            this._isInitialized = false;
            
            console.log('✅ Application shut down successfully');
            
        } catch (error) {
            this._handleError('Failed to shutdown application', error);
        }
    }
}

// Create and start the application when DOM is loaded
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new TicTacToeApp();
        app.start();
    });
} else {
    app = new TicTacToeApp();
    app.start();
}

// Export for ES6 modules
export default TicTacToeApp;

// Also add to global scope for non-module usage
window.TicTacToeApp = TicTacToeApp;
