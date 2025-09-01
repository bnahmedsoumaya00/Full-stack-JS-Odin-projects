/**
 * Game model class that manages the overall game state and logic
 */
class Game {
    /**
     * Initialize a new game
     * @param {Player} player1 - First player
     * @param {Player} player2 - Second player
     * @param {Gameboard} gameboard - The game board
     */
    constructor(player1, player2, gameboard) {
        this._players = [player1, player2];
        this._gameboard = gameboard;
        this._currentPlayerIndex = 0;
        this._gameActive = false;
        this._gameHistory = [];
        this._startTime = null;
        this._endTime = null;
    }

    /**
     * Get the current player
     * @returns {Player} Current player
     */
    getCurrentPlayer() {
        return this._players[this._currentPlayerIndex];
    }

    /**
     * Get the other player (not current)
     * @returns {Player} Other player
     */
    getOtherPlayer() {
        const otherIndex = this._currentPlayerIndex === 0 ? 1 : 0;
        return this._players[otherIndex];
    }

    /**
     * Get both players
     * @returns {Array<Player>} Array of players
     */
    getPlayers() {
        return [...this._players];
    }

    /**
     * Get the gameboard
     * @returns {Gameboard} The gameboard instance
     */
    getGameboard() {
        return this._gameboard;
    }

    /**
     * Check if the game is active
     * @returns {boolean} True if game is active
     */
    isGameActive() {
        return this._gameActive;
    }

    /**
     * Start a new game
     */
    startGame() {
        this._gameActive = true;
        this._currentPlayerIndex = 0;
        this._gameHistory = [];
        this._startTime = new Date();
        this._endTime = null;
        this._gameboard.reset();
    }

    /**
     * Make a move at the specified position
     * @param {number} index - Board position (0-8)
     * @returns {Object} Move result with success status and game state
     */
    makeMove(index) {
        if (!this._gameActive) {
            return {
                success: false,
                error: 'Game is not active',
                gameState: this.getGameState()
            };
        }

        const currentPlayer = this.getCurrentPlayer();
        
        // Try to place the mark
        const moveSuccessful = this._gameboard.setMark(index, currentPlayer.symbol);
        
        if (!moveSuccessful) {
            return {
                success: false,
                error: 'Position already occupied',
                gameState: this.getGameState()
            };
        }

        // Record the move
        this._gameHistory.push({
            player: currentPlayer.name,
            symbol: currentPlayer.symbol,
            position: index,
            timestamp: new Date()
        });

        // Check game end conditions
        const winner = this._gameboard.checkWinner();
        const isFull = this._gameboard.isFull();

        if (winner || isFull) {
            this._gameActive = false;
            this._endTime = new Date();
        } else {
            // Switch to next player
            this._currentPlayerIndex = this._currentPlayerIndex === 0 ? 1 : 0;
        }

        return {
            success: true,
            gameState: this.getGameState()
        };
    }

    /**
     * Get the current game state
     * @returns {Object} Complete game state
     */
    getGameState() {
        const boardState = this._gameboard.getGameState();
        const winner = boardState.winner;
        let winningPlayer = null;
        
        if (winner) {
            winningPlayer = this._players.find(player => player.symbol === winner);
        }

        return {
            ...boardState,
            currentPlayer: this.getCurrentPlayer(),
            players: this.getPlayers(),
            isGameActive: this._gameActive,
            winningPlayer,
            gameHistory: [...this._gameHistory],
            startTime: this._startTime,
            endTime: this._endTime,
            gameDuration: this._endTime && this._startTime ? 
                this._endTime - this._startTime : null
        };
    }

    /**
     * Reset the game to initial state
     */
    resetGame() {
        this._currentPlayerIndex = 0;
        this._gameActive = false;
        this._gameHistory = [];
        this._startTime = null;
        this._endTime = null;
        this._gameboard.reset();
    }

    /**
     * Restart the game with the same players
     */
    restartGame() {
        this._currentPlayerIndex = 0;
        this._gameHistory = [];
        this._gameboard.reset();
        this.startGame();
    }

    /**
     * Get game statistics
     * @returns {Object} Game statistics
     */
    getGameStats() {
        return {
            totalMoves: this._gameHistory.length,
            gameHistory: [...this._gameHistory],
            duration: this._endTime && this._startTime ? 
                this._endTime - this._startTime : null,
            isComplete: !this._gameActive && this._gameHistory.length > 0
        };
    }

    /**
     * Validate if a move is legal
     * @param {number} index - Board position
     * @returns {Object} Validation result
     */
    validateMove(index) {
        if (!this._gameActive) {
            return { valid: false, error: 'Game is not active' };
        }

        if (!Number.isInteger(index) || index < 0 || index > 8) {
            return { valid: false, error: 'Invalid board position' };
        }

        if (!this._gameboard.isEmpty(index)) {
            return { valid: false, error: 'Position already occupied' };
        }

        return { valid: true };
    }

    /**
     * Get possible moves
     * @returns {Array<number>} Array of valid move positions
     */
    getPossibleMoves() {
        if (!this._gameActive) {
            return [];
        }
        return this._gameboard.getEmptyPositions();
    }

    /**
     * Convert game to JSON
     * @returns {Object} JSON representation
     */
    toJSON() {
        return {
            players: this._players.map(player => player.toJSON()),
            gameboard: this._gameboard.toJSON(),
            currentPlayerIndex: this._currentPlayerIndex,
            gameActive: this._gameActive,
            gameHistory: [...this._gameHistory],
            startTime: this._startTime,
            endTime: this._endTime
        };
    }

    /**
     * Create a game from JSON data
     * @param {Object} data - Game data
     * @param {Player} PlayerClass - Player constructor
     * @param {Gameboard} GameboardClass - Gameboard constructor
     * @returns {Game} New game instance
     */
    static fromJSON(data, PlayerClass, GameboardClass) {
        const players = data.players.map(playerData => 
            PlayerClass.fromJSON(playerData)
        );
        const gameboard = GameboardClass.fromJSON(data.gameboard);
        
        const game = new Game(players[0], players[1], gameboard);
        game._currentPlayerIndex = data.currentPlayerIndex || 0;
        game._gameActive = data.gameActive || false;
        game._gameHistory = data.gameHistory || [];
        game._startTime = data.startTime ? new Date(data.startTime) : null;
        game._endTime = data.endTime ? new Date(data.endTime) : null;
        
        return game;
    }
}

export default Game;
