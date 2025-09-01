/**
 * Animation utility class for handling game animations
 */
class AnimationUtils {
    /**
     * Animate cell placement
     * @param {HTMLElement} element - Cell element
     * @param {string} symbol - Symbol being placed
     */
    static animateCellPlacement(element, symbol) {
        if (!element) return;

        // Add placement animation class
        element.classList.add('cell-placing');
        
        // Set the symbol with a slight delay for better effect
        setTimeout(() => {
            element.textContent = symbol;
            element.classList.add('cell-placed');
        }, 150);

        // Clean up animation classes
        setTimeout(() => {
            element.classList.remove('cell-placing', 'cell-placed');
        }, 600);
    }

    /**
     * Animate winning cells
     * @param {Array<HTMLElement>} cells - Winning cell elements
     */
    static animateWinningCells(cells) {
        if (!cells || cells.length === 0) return;

        cells.forEach((cell, index) => {
            setTimeout(() => {
                if (cell) {
                    cell.classList.add('winning-cell-animation');
                }
            }, index * 100);
        });

        // Add permanent winning class after animation
        setTimeout(() => {
            cells.forEach(cell => {
                if (cell) {
                    cell.classList.remove('winning-cell-animation');
                    cell.classList.add('winning-cell');
                }
            });
        }, cells.length * 100 + 300);
    }

    /**
     * Animate screen transition
     * @param {HTMLElement} hideElement - Element to hide
     * @param {HTMLElement} showElement - Element to show
     * @param {Function} callback - Optional callback after transition
     */
    static animateScreenTransition(hideElement, showElement, callback = null) {
        if (!hideElement || !showElement) return;

        // Fade out current screen
        hideElement.style.transition = 'opacity 0.3s ease-out';
        hideElement.style.opacity = '0';

        setTimeout(() => {
            hideElement.style.display = 'none';
            hideElement.style.opacity = '1';
            hideElement.style.transition = '';

            // Fade in new screen
            showElement.style.opacity = '0';
            showElement.style.display = 'block';
            showElement.style.transition = 'opacity 0.3s ease-in';

            requestAnimationFrame(() => {
                showElement.style.opacity = '1';
            });

            setTimeout(() => {
                showElement.style.transition = '';
                if (callback) callback();
            }, 300);
        }, 300);
    }

    /**
     * Animate result message appearance
     * @param {HTMLElement} element - Result element
     * @param {string} message - Result message
     * @param {string} type - Result type ('winner' or 'tie')
     */
    static animateResultMessage(element, message, type) {
        if (!element) return;

        element.textContent = message;
        element.className = `game-result ${type}`;
        element.style.transform = 'scale(0)';
        element.style.display = 'block';
        element.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
        });

        setTimeout(() => {
            element.style.transition = '';
        }, 400);
    }

    /**
     * Animate board reset
     * @param {Array<HTMLElement>} cells - Cell elements
     * @param {Function} callback - Callback after animation
     */
    static animateBoardReset(cells, callback = null) {
        if (!cells || cells.length === 0) {
            if (callback) callback();
            return;
        }

        cells.forEach((cell, index) => {
            setTimeout(() => {
                if (cell) {
                    cell.style.transform = 'scale(0)';
                    cell.style.transition = 'transform 0.2s ease-in';
                }
            }, index * 30);
        });

        setTimeout(() => {
            cells.forEach(cell => {
                if (cell) {
                    cell.textContent = '';
                    cell.disabled = false;
                    cell.classList.remove('winning-cell', 'cell-placed');
                    cell.style.transform = 'scale(1)';
                    cell.style.transition = 'transform 0.2s ease-out';
                }
            });

            setTimeout(() => {
                cells.forEach(cell => {
                    if (cell) {
                        cell.style.transition = '';
                    }
                });
                if (callback) callback();
            }, 200);
        }, cells.length * 30 + 100);
    }

    /**
     * Add hover effect to interactive elements
     * @param {HTMLElement} element - Element to add hover effect
     */
    static addHoverEffect(element) {
        if (!element) return;

        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
            element.style.transition = 'transform 0.2s ease';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Add click animation to buttons
     * @param {HTMLElement} element - Button element
     */
    static addClickAnimation(element) {
        if (!element) return;

        element.addEventListener('mousedown', () => {
            element.style.transform = 'scale(0.95)';
            element.style.transition = 'transform 0.1s ease';
        });

        element.addEventListener('mouseup', () => {
            element.style.transform = 'scale(1)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    }

    /**
     * Shake animation for invalid moves
     * @param {HTMLElement} element - Element to shake
     */
    static shakeElement(element) {
        if (!element) return;

        element.classList.add('shake-animation');
        
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 600);
    }

    /**
     * Pulse animation for current player indicator
     * @param {HTMLElement} element - Player indicator element
     */
    static pulseElement(element) {
        if (!element) return;

        element.classList.add('pulse-animation');
    }

    /**
     * Stop pulse animation
     * @param {HTMLElement} element - Element to stop pulsing
     */
    static stopPulse(element) {
        if (!element) return;

        element.classList.remove('pulse-animation');
    }

    /**
     * Add CSS animations to document if not already present
     */
    static injectCSS() {
        const styleId = 'tic-tac-toe-animations';
        
        if (document.getElementById(styleId)) {
            return; // CSS already injected
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .cell-placing {
                transform: scale(0.8);
                opacity: 0.5;
            }
            
            .cell-placed {
                animation: cellPlaced 0.3s ease-out;
            }
            
            @keyframes cellPlaced {
                0% { transform: scale(0.8); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            .winning-cell-animation {
                animation: winningCell 0.6s ease-in-out;
            }
            
            @keyframes winningCell {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.1) rotate(5deg); }
                75% { transform: scale(1.1) rotate(-5deg); }
            }
            
            .winning-cell {
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%) !important;
                color: white !important;
                transform: scale(1.05);
                box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
            }
            
            .shake-animation {
                animation: shake 0.6s ease-in-out;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
                20%, 40%, 60%, 80% { transform: translateX(3px); }
            }
            
            .pulse-animation {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .slide-in {
                animation: slideIn 0.4s ease-out;
            }
            
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Inject CSS when the class is loaded
AnimationUtils.injectCSS();

export default AnimationUtils;
