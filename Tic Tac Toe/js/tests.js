/**
 * Simple test suite for the Tic Tac Toe application
 * This demonstrates how the modular architecture enables easy testing
 */

// Import classes for testing
import Player from '../models/Player.js';
import Gameboard from '../models/Gameboard.js';
import Game from '../models/Game.js';
import ValidationUtils from '../utils/ValidationUtils.js';
import StorageManager from '../utils/StorageManager.js';
import EventManager from '../utils/EventManager.js';

/**
 * Simple test framework
 */
class SimpleTestFramework {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Tests...\n');
        
        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ ${name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results:`);
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Success Rate: ${Math.round((this.passed / (this.passed + this.failed)) * 100)}%`);
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertThrows(fn, message) {
        let threw = false;
        try {
            fn();
        } catch (error) {
            threw = true;
        }
        if (!threw) {
            throw new Error(message || 'Expected function to throw');
        }
    }
}

// Create test framework instance
const test = new SimpleTestFramework();

// Player Class Tests
test.test('Player - Create valid player', () => {
    const player = new Player('Alice', 'X');
    test.assertEqual(player.name, 'Alice');
    test.assertEqual(player.symbol, 'X');
});

test.test('Player - Invalid symbol throws error', () => {
    test.assertThrows(() => {
        const player = new Player('Bob', 'Z');
    });
});

test.test('Player - Empty name throws error', () => {
    test.assertThrows(() => {
        const player = new Player('', 'O');
    });
});

test.test('Player - JSON serialization', () => {
    const player = new Player('Charlie', 'O');
    const json = player.toJSON();
    const restored = Player.fromJSON(json);
    
    test.assertEqual(restored.name, 'Charlie');
    test.assertEqual(restored.symbol, 'O');
});

// Gameboard Class Tests
test.test('Gameboard - Initial state is empty', () => {
    const board = new Gameboard();
    const state = board.getBoard();
    test.assert(state.every(cell => cell === ''));
});

test.test('Gameboard - Set mark works', () => {
    const board = new Gameboard();
    const success = board.setMark(0, 'X');
    test.assert(success);
    test.assertEqual(board.getCellValue(0), 'X');
});

test.test('Gameboard - Cannot overwrite mark', () => {
    const board = new Gameboard();
    board.setMark(0, 'X');
    const success = board.setMark(0, 'O');
    test.assert(!success);
    test.assertEqual(board.getCellValue(0), 'X');
});

test.test('Gameboard - Detect horizontal win', () => {
    const board = new Gameboard();
    board.setMark(0, 'X');
    board.setMark(1, 'X');
    board.setMark(2, 'X');
    test.assertEqual(board.checkWinner(), 'X');
});

test.test('Gameboard - Detect vertical win', () => {
    const board = new Gameboard();
    board.setMark(0, 'O');
    board.setMark(3, 'O');
    board.setMark(6, 'O');
    test.assertEqual(board.checkWinner(), 'O');
});

test.test('Gameboard - Detect diagonal win', () => {
    const board = new Gameboard();
    board.setMark(0, 'X');
    board.setMark(4, 'X');
    board.setMark(8, 'X');
    test.assertEqual(board.checkWinner(), 'X');
});

test.test('Gameboard - No winner returns null', () => {
    const board = new Gameboard();
    board.setMark(0, 'X');
    board.setMark(1, 'O');
    test.assertEqual(board.checkWinner(), null);
});

test.test('Gameboard - Board full detection', () => {
    const board = new Gameboard();
    // Fill board without winner
    const moves = ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
    moves.forEach((symbol, index) => {
        board.setMark(index, symbol);
    });
    test.assert(board.isFull());
});

// Game Class Tests
test.test('Game - Initialize with players', () => {
    const player1 = new Player('Alice', 'X');
    const player2 = new Player('Bob', 'O');
    const board = new Gameboard();
    const game = new Game(player1, player2, board);
    
    test.assertEqual(game.getCurrentPlayer().name, 'Alice');
    test.assert(!game.isGameActive());
});

test.test('Game - Start game activates it', () => {
    const player1 = new Player('Alice', 'X');
    const player2 = new Player('Bob', 'O');
    const board = new Gameboard();
    const game = new Game(player1, player2, board);
    
    game.startGame();
    test.assert(game.isGameActive());
});

test.test('Game - Make valid move', () => {
    const player1 = new Player('Alice', 'X');
    const player2 = new Player('Bob', 'O');
    const board = new Gameboard();
    const game = new Game(player1, player2, board);
    
    game.startGame();
    const result = game.makeMove(0);
    
    test.assert(result.success);
    test.assertEqual(game.getCurrentPlayer().name, 'Bob');
});

test.test('Game - Invalid move fails', () => {
    const player1 = new Player('Alice', 'X');
    const player2 = new Player('Bob', 'O');
    const board = new Gameboard();
    const game = new Game(player1, player2, board);
    
    game.startGame();
    game.makeMove(0); // Alice takes position 0
    const result = game.makeMove(0); // Bob tries same position
    
    test.assert(!result.success);
});

// Validation Utils Tests
test.test('ValidationUtils - Valid player name', () => {
    const result = ValidationUtils.validatePlayerName('Alice');
    test.assert(result.valid);
});

test.test('ValidationUtils - Empty name invalid', () => {
    const result = ValidationUtils.validatePlayerName('');
    test.assert(!result.valid);
});

test.test('ValidationUtils - Valid board position', () => {
    const result = ValidationUtils.validateBoardPosition(5);
    test.assert(result.valid);
});

test.test('ValidationUtils - Invalid board position', () => {
    const result = ValidationUtils.validateBoardPosition(10);
    test.assert(!result.valid);
});

// Storage Manager Tests
test.test('StorageManager - Save and load data', () => {
    const storage = new StorageManager('test');
    const testData = { message: 'Hello, World!' };
    
    const saved = storage.save('testKey', testData);
    test.assert(saved);
    
    const loaded = storage.load('testKey');
    test.assertEqual(loaded.message, 'Hello, World!');
    
    // Cleanup
    storage.remove('testKey');
});

test.test('StorageManager - Load with default', () => {
    const storage = new StorageManager('test');
    const defaultData = { default: true };
    
    const loaded = storage.load('nonexistent', defaultData);
    test.assertEqual(loaded.default, true);
});

// Event Manager Tests
test.test('EventManager - Emit and receive events', async () => {
    const eventManager = new EventManager();
    let received = false;
    
    eventManager.on('test-event', () => {
        received = true;
    });
    
    eventManager.emit('test-event');
    test.assert(received);
});

test.test('EventManager - Event with data', async () => {
    const eventManager = new EventManager();
    let receivedData = null;
    
    eventManager.on('test-event', (data) => {
        receivedData = data;
    });
    
    eventManager.emit('test-event', { value: 42 });
    test.assertEqual(receivedData.value, 42);
});

test.test('EventManager - Remove event listener', async () => {
    const eventManager = new EventManager();
    let count = 0;
    
    const handler = () => count++;
    eventManager.on('test-event', handler);
    eventManager.emit('test-event');
    
    eventManager.off('test-event', handler);
    eventManager.emit('test-event');
    
    test.assertEqual(count, 1);
});

// Integration Tests
test.test('Integration - Complete game flow', () => {
    const player1 = new Player('Alice', 'X');
    const player2 = new Player('Bob', 'O');
    const board = new Gameboard();
    const game = new Game(player1, player2, board);
    
    game.startGame();
    
    // Alice wins with top row
    game.makeMove(0); // X
    game.makeMove(3); // O
    game.makeMove(1); // X
    game.makeMove(4); // O
    const result = game.makeMove(2); // X wins
    
    const gameState = result.gameState;
    test.assert(!gameState.isGameActive);
    test.assertEqual(gameState.winningPlayer.name, 'Alice');
});

// Run all tests
test.run().then(() => {
    console.log('\n🎉 All tests completed!');
});
