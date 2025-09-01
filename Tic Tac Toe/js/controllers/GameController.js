// Import Player class
import Player from '../models/Player.js';

/**
 * Main game controller that orchestrates the game flow
 */
class GameController {
    /**
     * Initialize the game controller
     * @param {Game} gameModel - Game model instance
     * @param {SetupView} setupView - Setup view instance
     * @param {GameView} gameView - Game view instance
     */
    constructor(gameModel, setupView, gameView) {
        this._gameModel = gameModel;
        this._setupView = setupView;
        this._gameView = gameView;
        this._gameHistory = [];
        this._statistics = {
            gamesPlayed: 0,
            player1Wins: 0,
            player2Wins: 0,
            ties: 0
        };

        this._bindEvents();
        this._initializeApp();
    }

    /**
     * Initialize the application
     * @private
     */
    _initializeApp() {
        // Show setup screen initially
        this._setupView.show();
        this._gameView.hide();
        this._setupView.focusFirstInput();

        // Log initialization
        this._log('Game controller initialized');
    }

    /**
     * Bind events from views
     * @private
     */
    _bindEvents() {
        // Setup view events
        this._setupView.onStartGame(() => this._handleStartGame());
        this._setupView.onInputChange(() => this._handleInputChange());

        // Game view events
        this._gameView.onCellClick((index) => this._handleCellClick(index));
        this._gameView.onNewGame(() => this._handleNewGame());
        this._gameView.onChangePlayers(() => this._handleChangePlayers());
    }

    /**
     * Handle start game action from setup view
     * @private
     */
    _handleStartGame() {
        const validation = this._setupView.validateInputs();
        
        if (!validation.valid) {
            this._setupView.showErrors(validation.errors);
            return;
        }

        const playerNames = this._setupView.getPlayerNames();
        
        try {
            // Create new players (assuming Player class is available)
            const player1 = new Player(playerNames.player1, 'X');
            const player2 = new Player(playerNames.player2, 'O');

            // Reset the game model with new players
            this._gameModel._players = [player1, player2];
            this._gameModel.startGame();

            // Switch to game view
            this._setupView.hide();
            this._gameView.show();

            // Update game display
            this._updateGameDisplay();

            this._log(`Game started: ${player1.name} vs ${player2.name}`);
        } catch (error) {
            this._setupView.showErrors([error.message]);
            this._log(`Error starting game: ${error.message}`, 'error');
        }
    }

    /**
     * Handle input change in setup view
     * @private
     */
    _handleInputChange() {
        // Real-time validation feedback could be added here
        const validation = this._setupView.validateInputs();
        this._setupView.setStartButtonEnabled(validation.valid);
    }

    /**
     * Handle cell click in game view
     * @param {number} index - Cell index that was clicked
     * @private
     */
    _handleCellClick(index) {
        if (!this._gameModel.isGameActive()) {
            this._log('Attempted move on inactive game', 'warning');
            return;
        }

        const moveResult = this._gameModel.makeMove(index);
        
        if (!moveResult.success) {
            this._log(`Invalid move: ${moveResult.error}`, 'warning');
            return;
        }

        const gameState = moveResult.gameState;
        
        // Update the display
        this._updateGameDisplay();

        // Add cell animation
        this._gameView.animateCell(index);

        // Check if game ended
        if (!gameState.isGameActive) {
            this._handleGameEnd(gameState);
        } else {
            this._log(`Move made by ${gameState.currentPlayer.name} at position ${index}`);
        }
    }

    /**
     * Handle game end
     * @param {Object} gameState - Current game state
     * @private
     */
    _handleGameEnd(gameState) {
        this._updateStatistics(gameState);

        if (gameState.winningPlayer) {
            this._gameView.showGameResult('winner', gameState.winningPlayer);
            this._gameView.highlightWinningCells(gameState.winningCombination);
            this._log(`Game won by ${gameState.winningPlayer.name}`);
        } else if (gameState.isFull) {
            this._gameView.showGameResult('tie');
            this._log('Game ended in a tie');
        }

        // Disable the board
        this._gameView.disableBoard();

        // Add game to history
        this._gameHistory.push({
            players: gameState.players.map(p => ({ name: p.name, symbol: p.symbol })),
            winner: gameState.winningPlayer ? gameState.winningPlayer.name : null,
            moves: gameState.gameHistory,
            duration: gameState.gameDuration,
            endTime: new Date()
        });
    }

    /**
     * Handle new game button click
     * @private
     */
    _handleNewGame() {
        this._gameModel.restartGame();
        this._gameView.hideGameResult();
        this._gameView.clearBoardEffects();
        this._updateGameDisplay();
        this._log('Game restarted');
    }

    /**
     * Handle change players button click
     * @private
     */
    _handleChangePlayers() {
        this._gameModel.resetGame();
        this._gameView.hide();
        this._setupView.show();
        this._setupView.resetPlayerInputs();
        this._setupView.focusFirstInput();
        this._log('Returned to player setup');
    }

    /**
     * Update the game display based on current state
     * @private
     */
    _updateGameDisplay() {
        const gameState = this._gameModel.getGameState();
        
        // Update current player display
        if (gameState.isGameActive) {
            this._gameView.updateCurrentPlayer(gameState.currentPlayer);
        }

        // Render the board
        this._gameView.renderBoard(gameState.board, gameState.isGameActive);
    }

    /**
     * Update game statistics
     * @param {Object} gameState - Game state
     * @private
     */
    _updateStatistics(gameState) {
        this._statistics.gamesPlayed++;
        
        if (gameState.winningPlayer) {
            const players = this._gameModel.getPlayers();
            if (gameState.winningPlayer.name === players[0].name) {
                this._statistics.player1Wins++;
            } else {
                this._statistics.player2Wins++;
            }
        } else {
            this._statistics.ties++;
        }
    }

    /**
     * Get current game statistics
     * @returns {Object} Game statistics
     */
    getStatistics() {
        return { ...this._statistics };
    }

    /**
     * Get game history
     * @returns {Array} Array of completed games
     */
    getGameHistory() {
        return [...this._gameHistory];
    }

    /**
     * Get current game state
     * @returns {Object} Current game state
     */
    getCurrentGameState() {
        return this._gameModel.getGameState();
    }

    /**
     * Make a move programmatically (for testing/console)
     * @param {number} index - Board position
     * @returns {Object} Move result
     */
    makeMove(index) {
        return this._handleCellClick(index);
    }

    /**
     * Reset all statistics
     */
    resetStatistics() {
        this._statistics = {
            gamesPlayed: 0,
            player1Wins: 0,
            player2Wins: 0,
            ties: 0
        };
        this._gameHistory = [];
        this._log('Statistics reset');
    }

    /**
     * Save game state to localStorage
     */
    saveGame() {
        try {
            const saveData = {
                gameState: this._gameModel.toJSON(),
                statistics: this._statistics,
                gameHistory: this._gameHistory
            };
            localStorage.setItem('ticTacToeGame', JSON.stringify(saveData));
            this._log('Game saved successfully');
        } catch (error) {
            this._log(`Error saving game: ${error.message}`, 'error');
        }
    }

    /**
     * Load game state from localStorage
     * @returns {boolean} True if game was loaded successfully
     */
    loadGame() {
        try {
            const saveData = localStorage.getItem('ticTacToeGame');
            if (!saveData) return false;

            const data = JSON.parse(saveData);
            
            // Restore statistics and history
            this._statistics = data.statistics || this._statistics;
            this._gameHistory = data.gameHistory || [];

            // Note: Game state restoration would need the model classes
            this._log('Game loaded successfully');
            return true;
        } catch (error) {
            this._log(`Error loading game: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Log messages with timestamp
     * @param {string} message - Message to log
     * @param {string} level - Log level (info, warning, error)
     * @private
     */
    _log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        switch (level) {
            case 'error':
                console.error(logMessage);
                break;
            case 'warning':
                console.warn(logMessage);
                break;
            default:
                console.log(logMessage);
        }
    }

    /**
     * Display current board state in console
     */
    displayBoardInConsole() {
        const gameState = this._gameModel.getGameState();
        console.log('Current board:');
        console.log(this._gameModel.getGameboard().toString());
        console.log(`Current player: ${gameState.currentPlayer?.name} (${gameState.currentPlayer?.symbol})`);
        console.log(`Game active: ${gameState.isGameActive}`);
    }

    /**
     * Get available moves for current player
     * @returns {Array<number>} Available move positions
     */
    getAvailableMoves() {
        return this._gameModel.getPossibleMoves();
    }

    /**
     * Destroy the controller and clean up
     */
    destroy() {
        this._setupView.destroy();
        this._gameView.destroy();
        this._log('Game controller destroyed');
    }
}

export default GameController;
