class SlotMachine {
    constructor() {
        this.symbols = ['🍒', '🍊', '🍇', '7️⃣', '💎', '🎰'];
        this.credits = 100;
        this.spinning = false;
        this.spinCost = 10;
        
        // DOM elements
        this.creditDisplay = document.getElementById('credit-amount');
        this.reelsContainer = document.getElementById('reels-container');
        this.spinButton = document.getElementById('spin-button');
        this.messageElement = document.getElementById('message');
        
        // Event listeners
        this.spinButton.addEventListener('click', () => this.spin());
        
        // Initialize
        this.updateDisplay();
    }

    updateDisplay() {
        this.creditDisplay.textContent = this.credits;
        const reels = this.reelsContainer.getElementsByClassName('reel');
        Array.from(reels).forEach((reel, index) => {
            reel.textContent = this.currentReels[index] || this.symbols[0];
        });
    }

    setMessage(text, isWinner = false) {
        this.messageElement.textContent = text;
        this.messageElement.className = 'message ' + (isWinner ? 'winner' : 'error');
        if (text === '') {
            this.messageElement.className = 'message';
        }
    }

    getWinAmount(symbol) {
        const winAmounts = {
            '🍒': 50,
            '🍊': 100,
            '🍇': 150,
            '7️⃣': 200,
            '💎': 300,
            '🎰': 500
        };
        return winAmounts[symbol];
    }

    spin() {
        if (this.spinning) return;
        
        if (this.credits < this.spinCost) {
            this.setMessage('Not enough credits!');
            return;
        }

        this.spinning = true;
        this.credits -= this.spinCost;
        this.setMessage('');
        this.spinButton.disabled = true;
        this.spinButton.textContent = 'Spinning...';

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const reels = this.reelsContainer.getElementsByClassName('reel');
            Array.from(reels).forEach(reel => {
                reel.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            });
            
            spinCount++;
            if (spinCount >= 20) { // Stop after 20 iterations
                clearInterval(spinInterval);
                this.finishSpin();
            }
        }, 100);
    }

    finishSpin() {
        // Generate final result
        this.currentReels = Array(3).fill(0).map(() => 
            this.symbols[Math.floor(Math.random() * this.symbols.length)]
        );
        
        // Update display
        this.updateDisplay();
        
        // Check for wins
        if (this.currentReels.every(symbol => symbol === this.currentReels[0])) {
            const winAmount = this.getWinAmount(this.currentReels[0]);
            this.credits += winAmount;
            this.setMessage(`Winner! +${winAmount} credits!`, true);
        }
        
        // Reset state
        this.spinning = false;
        this.spinButton.disabled = false;
        this.spinButton.textContent = 'Spin (10 credits)';
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.slotMachine = new SlotMachine();
});