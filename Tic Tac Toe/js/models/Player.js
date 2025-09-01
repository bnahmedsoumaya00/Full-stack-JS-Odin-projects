/**
 * Player model class representing a player in the game
 */
class Player {
    /**
     * @param {string} name - The player's name
     * @param {string} symbol - The player's symbol ('X' or 'O')
     */
    constructor(name, symbol) {
        this._name = name;
        this._symbol = symbol;
    }

    // Getters
    get name() {
        return this._name;
    }

    get symbol() {
        return this._symbol;
    }

    // Setters
    set name(newName) {
        if (typeof newName !== 'string' || newName.trim().length === 0) {
            throw new Error('Player name must be a non-empty string');
        }
        this._name = newName.trim();
    }

    set symbol(newSymbol) {
        if (!['X', 'O'].includes(newSymbol)) {
            throw new Error('Player symbol must be either "X" or "O"');
        }
        this._symbol = newSymbol;
    }

    /**
     * Returns a string representation of the player
     * @returns {string} String representation
     */
    toString() {
        return `${this._name} (${this._symbol})`;
    }

    /**
     * Creates a player object from JSON data
     * @param {Object} data - The player data
     * @returns {Player} New player instance
     */
    static fromJSON(data) {
        return new Player(data.name, data.symbol);
    }

    /**
     * Converts the player to JSON
     * @returns {Object} JSON representation
     */
    toJSON() {
        return {
            name: this._name,
            symbol: this._symbol
        };
    }
}

export default Player;
