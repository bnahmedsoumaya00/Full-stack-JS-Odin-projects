/**
 * Setup view class for managing the player setup screen
 */
class SetupView {
    /**
     * Initialize the setup view
     */
    constructor() {
        this._elements = {
            setupScreen: document.getElementById('setupScreen'),
            player1Input: document.getElementById('player1Name'),
            player2Input: document.getElementById('player2Name'),
            startButton: document.getElementById('startButton')
        };

        this._callbacks = {};
        this._bindEvents();
    }

    /**
     * Show the setup screen
     */
    show() {
        if (this._elements.setupScreen) {
            this._elements.setupScreen.style.display = 'block';
        }
    }

    /**
     * Hide the setup screen
     */
    hide() {
        if (this._elements.setupScreen) {
            this._elements.setupScreen.style.display = 'none';
        }
    }

    /**
     * Get player names from inputs
     * @returns {Object} Object with player1 and player2 names
     */
    getPlayerNames() {
        return {
            player1: this._elements.player1Input ? 
                (this._elements.player1Input.value.trim() || 'Player 1') : 'Player 1',
            player2: this._elements.player2Input ? 
                (this._elements.player2Input.value.trim() || 'Player 2') : 'Player 2'
        };
    }

    /**
     * Set player names in inputs
     * @param {string} player1Name - Player 1 name
     * @param {string} player2Name - Player 2 name
     */
    setPlayerNames(player1Name, player2Name) {
        if (this._elements.player1Input) {
            this._elements.player1Input.value = player1Name;
        }
        if (this._elements.player2Input) {
            this._elements.player2Input.value = player2Name;
        }
    }

    /**
     * Reset player inputs to default values
     */
    resetPlayerInputs() {
        this.setPlayerNames('Player 1', 'Player 2');
    }

    /**
     * Enable or disable the start button
     * @param {boolean} enabled - Whether button should be enabled
     */
    setStartButtonEnabled(enabled) {
        if (this._elements.startButton) {
            this._elements.startButton.disabled = !enabled;
        }
    }

    /**
     * Validate player inputs
     * @returns {Object} Validation result
     */
    validateInputs() {
        const names = this.getPlayerNames();
        const errors = [];

        if (!names.player1 || names.player1.trim().length === 0) {
            errors.push('Player 1 name cannot be empty');
        }

        if (!names.player2 || names.player2.trim().length === 0) {
            errors.push('Player 2 name cannot be empty');
        }

        if (names.player1.trim() === names.player2.trim()) {
            errors.push('Player names must be different');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Show validation errors
     * @param {Array<string>} errors - Array of error messages
     */
    showErrors(errors) {
        // Remove any existing error display
        this._clearErrors();

        if (errors.length === 0) return;

        const errorDiv = document.createElement('div');
        errorDiv.id = 'setupErrors';
        errorDiv.className = 'error-messages';
        errorDiv.innerHTML = errors.map(error => `<p class="error">${error}</p>`).join('');

        if (this._elements.setupScreen) {
            this._elements.setupScreen.appendChild(errorDiv);
        }
    }

    /**
     * Clear any displayed errors
     */
    _clearErrors() {
        const existingErrors = document.getElementById('setupErrors');
        if (existingErrors) {
            existingErrors.remove();
        }
    }

    /**
     * Set callback for start game action
     * @param {Function} callback - Callback function
     */
    onStartGame(callback) {
        this._callbacks.startGame = callback;
    }

    /**
     * Set callback for input change
     * @param {Function} callback - Callback function
     */
    onInputChange(callback) {
        this._callbacks.inputChange = callback;
    }

    /**
     * Bind DOM events
     * @private
     */
    _bindEvents() {
        // Start button click
        if (this._elements.startButton) {
            this._elements.startButton.addEventListener('click', () => {
                if (this._callbacks.startGame) {
                    this._callbacks.startGame();
                }
            });
        }

        // Input change events
        [this._elements.player1Input, this._elements.player2Input].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this._clearErrors();
                    if (this._callbacks.inputChange) {
                        this._callbacks.inputChange();
                    }
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        if (this._callbacks.startGame) {
                            this._callbacks.startGame();
                        }
                    }
                });
            }
        });
    }

    /**
     * Focus on the first player input
     */
    focusFirstInput() {
        if (this._elements.player1Input) {
            this._elements.player1Input.focus();
        }
    }

    /**
     * Get DOM elements for testing
     * @returns {Object} DOM elements
     */
    getElements() {
        return { ...this._elements };
    }

    /**
     * Destroy the view and clean up event listeners
     */
    destroy() {
        this._callbacks = {};
        // Event listeners will be automatically removed when elements are removed from DOM
    }
}

export default SetupView;
