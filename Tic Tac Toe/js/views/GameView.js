/**
 * Game view class for managing the game screen and board
 */
class GameView {
    /**
     * Initialize the game view
     */
    constructor() {
        this._elements = {
            gameScreen: document.getElementById('gameScreen'),
            currentPlayer: document.getElementById('currentPlayer'),
            gameboard: document.getElementById('gameboard'),
            gameResult: document.getElementById('gameResult'),
            newGameButton: document.getElementById('newGameButton'),
            changePlayersButton: document.getElementById('changePlayersButton')
        };

        this._callbacks = {};
        this._cells = [];
        this._bindEvents();
    }

    /**
     * Show the game screen
     */
    show() {
        if (this._elements.gameScreen) {
            this._elements.gameScreen.style.display = 'block';
        }
    }

    /**
     * Hide the game screen
     */
    hide() {
        if (this._elements.gameScreen) {
            this._elements.gameScreen.style.display = 'none';
        }
    }

    /**
     * Update the current player display
     * @param {Player} player - Current player
     */
    updateCurrentPlayer(player) {
        if (this._elements.currentPlayer) {
            this._elements.currentPlayer.textContent = `${player.name}'s turn (${player.symbol})`;
        }
    }

    /**
     * Render the game board
     * @param {Array} board - Board state array
     * @param {boolean} gameActive - Whether the game is active
     */
    renderBoard(board, gameActive = true) {
        if (!this._elements.gameboard) return;

        // Clear existing board
        this._elements.gameboard.innerHTML = '';
        this._cells = [];

        // Create cells
        board.forEach((cellValue, index) => {
            const cell = this._createCell(cellValue, index, gameActive);
            this._cells.push(cell);
            this._elements.gameboard.appendChild(cell);
        });
    }

    /**
     * Create a single cell element
     * @param {string} value - Cell value ('X', 'O', or '')
     * @param {number} index - Cell index
     * @param {boolean} gameActive - Whether the game is active
     * @returns {HTMLElement} Cell element
     * @private
     */
    _createCell(value, index, gameActive) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.textContent = value;
        cell.dataset.index = index;

        // Disable cell if it has a value or game is not active
        if (value !== '' || !gameActive) {
            cell.disabled = true;
        }

        // Add click event listener
        cell.addEventListener('click', () => {
            if (this._callbacks.cellClick && !cell.disabled) {
                this._callbacks.cellClick(index);
            }
        });

        return cell;
    }

    /**
     * Highlight winning cells
     * @param {Array<number>} winningCombination - Array of winning cell indices
     */
    highlightWinningCells(winningCombination) {
        if (!winningCombination) return;

        winningCombination.forEach(index => {
            if (this._cells[index]) {
                this._cells[index].classList.add('winning-cell');
            }
        });
    }

    /**
     * Disable all board cells
     */
    disableBoard() {
        this._cells.forEach(cell => {
            cell.disabled = true;
        });
    }

    /**
     * Enable empty board cells
     */
    enableBoard() {
        this._cells.forEach(cell => {
            if (cell.textContent === '') {
                cell.disabled = false;
            }
        });
    }

    /**
     * Show game result
     * @param {string} result - Result type ('winner' or 'tie')
     * @param {Player|null} winner - Winning player (if any)
     */
    showGameResult(result, winner = null) {
        if (!this._elements.gameResult) return;

        this._elements.gameResult.style.display = 'block';
        this._elements.gameResult.className = 'game-result';

        if (result === 'tie') {
            this._elements.gameResult.textContent = "It's a tie!";
            this._elements.gameResult.classList.add('tie');
        } else if (result === 'winner' && winner) {
            this._elements.gameResult.textContent = `${winner.name} wins!`;
            this._elements.gameResult.classList.add('winner');
        }
    }

    /**
     * Hide game result
     */
    hideGameResult() {
        if (this._elements.gameResult) {
            this._elements.gameResult.style.display = 'none';
            this._elements.gameResult.className = 'game-result';
        }
    }

    /**
     * Update cell content without re-rendering entire board
     * @param {number} index - Cell index
     * @param {string} symbol - Symbol to place
     */
    updateCell(index, symbol) {
        if (this._cells[index]) {
            this._cells[index].textContent = symbol;
            this._cells[index].disabled = true;
        }
    }

    /**
     * Add animation to a cell
     * @param {number} index - Cell index
     * @param {string} animationClass - CSS animation class
     */
    animateCell(index, animationClass = 'cell-placed') {
        if (this._cells[index]) {
            this._cells[index].classList.add(animationClass);
            
            // Remove animation class after animation completes
            setTimeout(() => {
                if (this._cells[index]) {
                    this._cells[index].classList.remove(animationClass);
                }
            }, 300);
        }
    }

    /**
     * Clear all board animations and highlights
     */
    clearBoardEffects() {
        this._cells.forEach(cell => {
            cell.classList.remove('winning-cell', 'cell-placed', 'cell-hover');
        });
    }

    /**
     * Set callback for cell clicks
     * @param {Function} callback - Callback function receiving cell index
     */
    onCellClick(callback) {
        this._callbacks.cellClick = callback;
    }

    /**
     * Set callback for new game button
     * @param {Function} callback - Callback function
     */
    onNewGame(callback) {
        this._callbacks.newGame = callback;
    }

    /**
     * Set callback for change players button
     * @param {Function} callback - Callback function
     */
    onChangePlayers(callback) {
        this._callbacks.changePlayers = callback;
    }

    /**
     * Enable or disable game control buttons
     * @param {boolean} enabled - Whether buttons should be enabled
     */
    setControlButtonsEnabled(enabled) {
        [this._elements.newGameButton, this._elements.changePlayersButton].forEach(button => {
            if (button) {
                button.disabled = !enabled;
            }
        });
    }

    /**
     * Bind DOM events for control buttons
     * @private
     */
    _bindEvents() {
        if (this._elements.newGameButton) {
            this._elements.newGameButton.addEventListener('click', () => {
                if (this._callbacks.newGame) {
                    this._callbacks.newGame();
                }
            });
        }

        if (this._elements.changePlayersButton) {
            this._elements.changePlayersButton.addEventListener('click', () => {
                if (this._callbacks.changePlayers) {
                    this._callbacks.changePlayers();
                }
            });
        }
    }

    /**
     * Get the current board state from DOM
     * @returns {Array} Current board values
     */
    getCurrentBoardState() {
        return this._cells.map(cell => cell.textContent);
    }

    /**
     * Get DOM elements for testing
     * @returns {Object} DOM elements
     */
    getElements() {
        return { ...this._elements };
    }

    /**
     * Get cell elements for testing
     * @returns {Array} Cell elements
     */
    getCells() {
        return [...this._cells];
    }

    /**
     * Destroy the view and clean up
     */
    destroy() {
        this._callbacks = {};
        this._cells = [];
    }
}

export default GameView;
