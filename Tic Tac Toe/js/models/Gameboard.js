/**
 * Gameboard model class managing the game board state
 */
class Gameboard {
    /**
     * Initialize the gameboard with an empty 3x3 grid
     */
    constructor() {
        this.reset();
        this._winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
    }

    /**
     * Get a copy of the current board state
     * @returns {Array} Copy of the board array
     */
    getBoard() {
        return [...this._board];
    }

    /**
     * Get the value at a specific position
     * @param {number} index - Position index (0-8)
     * @returns {string} The symbol at the position or empty string
     */
    getCellValue(index) {
        if (!this._isValidIndex(index)) {
            throw new Error('Invalid board index');
        }
        return this._board[index];
    }

    /**
     * Place a mark on the board
     * @param {number} index - Position index (0-8)
     * @param {string} symbol - Player symbol ('X' or 'O')
     * @returns {boolean} True if move was successful, false otherwise
     */
    setMark(index, symbol) {
        if (!this._isValidIndex(index)) {
            throw new Error('Invalid board index');
        }
        
        if (!['X', 'O'].includes(symbol)) {
            throw new Error('Invalid symbol. Must be "X" or "O"');
        }

        if (this._board[index] === '') {
            this._board[index] = symbol;
            return true;
        }
        return false;
    }

    /**
     * Check if the board is full
     * @returns {boolean} True if board is full
     */
    isFull() {
        return this._board.every(cell => cell !== '');
    }

    /**
     * Check if a specific position is empty
     * @param {number} index - Position index (0-8)
     * @returns {boolean} True if position is empty
     */
    isEmpty(index) {
        if (!this._isValidIndex(index)) {
            throw new Error('Invalid board index');
        }
        return this._board[index] === '';
    }

    /**
     * Get all empty positions
     * @returns {Array<number>} Array of empty position indices
     */
    getEmptyPositions() {
        return this._board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
    }

    /**
     * Check for a winner
     * @returns {string|null} Winner symbol ('X' or 'O') or null if no winner
     */
    checkWinner() {
        for (const combination of this._winningCombinations) {
            const [a, b, c] = combination;
            if (this._board[a] && 
                this._board[a] === this._board[b] && 
                this._board[a] === this._board[c]) {
                return this._board[a];
            }
        }
        return null;
    }

    /**
     * Get the winning combination if there's a winner
     * @returns {Array<number>|null} Array of winning positions or null
     */
    getWinningCombination() {
        for (const combination of this._winningCombinations) {
            const [a, b, c] = combination;
            if (this._board[a] && 
                this._board[a] === this._board[b] && 
                this._board[a] === this._board[c]) {
                return combination;
            }
        }
        return null;
    }

    /**
     * Reset the board to empty state
     */
    reset() {
        this._board = new Array(9).fill('');
    }

    /**
     * Get the current game state
     * @returns {Object} Object containing game state information
     */
    getGameState() {
        const winner = this.checkWinner();
        return {
            board: this.getBoard(),
            winner,
            isFull: this.isFull(),
            isGameOver: winner !== null || this.isFull(),
            winningCombination: this.getWinningCombination()
        };
    }

    /**
     * Validate if the index is within valid range
     * @param {number} index - Index to validate
     * @returns {boolean} True if valid
     * @private
     */
    _isValidIndex(index) {
        return Number.isInteger(index) && index >= 0 && index <= 8;
    }

    /**
     * Convert board to string representation for debugging
     * @returns {string} String representation of the board
     */
    toString() {
        const board = this._board;
        return `${board[0] || ' '} | ${board[1] || ' '} | ${board[2] || ' '}\n` +
               `----------\n` +
               `${board[3] || ' '} | ${board[4] || ' '} | ${board[5] || ' '}\n` +
               `----------\n` +
               `${board[6] || ' '} | ${board[7] || ' '} | ${board[8] || ' '}`;
    }

    /**
     * Create a gameboard from JSON data
     * @param {Object} data - Board data
     * @returns {Gameboard} New gameboard instance
     */
    static fromJSON(data) {
        const gameboard = new Gameboard();
        if (data.board && Array.isArray(data.board) && data.board.length === 9) {
            gameboard._board = [...data.board];
        }
        return gameboard;
    }

    /**
     * Convert gameboard to JSON
     * @returns {Object} JSON representation
     */
    toJSON() {
        return {
            board: this.getBoard()
        };
    }
}

export default Gameboard;
