// Progression Manager - Handles rounds, scoring, enemy scaling
// Ported from old-p5-version/DungeOnioninnerworking.js GameManager class

class ProgressionManager {
    constructor(scene) {
        this.scene = scene;

        // Round state
        this.round = 1;
        this.finalRound = 14;
        this.roundState = 'playing'; // 'playing', 'between_rounds', 'game_over', 'victory'
        this.betweenRoundsTimer = 0;
        this.betweenRoundsDuration = 3000; // 3 seconds between rounds

        // Scoring
        this.score = 0;
        this.baseKillScore = 25; // Base points per kill

        // Map expansion
        this.mapExpansionCost = 500;
        this.mapExpansionMultiplier = 1.8;
        this.mapExpansionCount = 0;

        // Enemy scaling
        this.baseMaxEnemies = 8;
        this.maxEnemies = 8;
    }

    // Called when an enemy is killed
    onEnemyKilled() {
        // Calculate points based on current round
        const points = this.baseKillScore * this.round;
        this.score += points;

        console.log(`Enemy killed! +${points} points (Round ${this.round}). Total: ${this.score}`);

        // Emit score change event
        this.scene.events.emit('scoreChanged', this.score, points);

        // Check if round is complete
        this.checkRoundComplete();
    }

    // Check if all enemies are dead
    checkRoundComplete() {
        const aliveEnemies = this.scene.enemies.getChildren()
            .filter(enemy => enemy.active && !enemy.isDead);

        if (aliveEnemies.length === 0 && this.roundState === 'playing') {
            this.completeRound();
        }
    }

    // Round completion logic
    completeRound() {
        console.log(`Round ${this.round} complete!`);
        this.roundState = 'between_rounds';

        // Determine message
        const message = this.round >= this.finalRound
            ? 'Final Round Complete! Victory!'
            : `Round ${this.round} Complete!`;

        // Show round complete message
        this.scene.events.emit('showRoundMessage', message, 3000);

        // Delay before next round
        this.scene.time.delayedCall(this.betweenRoundsDuration, () => {
            if (this.round < this.finalRound) {
                this.startNextRound();
            } else {
                this.gameVictory();
            }
        });
    }

    // Start the next round
    startNextRound() {
        this.round++;
        this.roundState = 'playing';

        console.log(`Starting Round ${this.round}...`);

        // Calculate enemy count for this round
        // Base 8 enemies + 2 per round (capped at 30)
        this.maxEnemies = Math.min(
            30,
            this.baseMaxEnemies + (this.round - 1) * 2
        );

        console.log(`Round ${this.round}: Spawning ${this.maxEnemies} enemies`);

        // Emit round change event
        this.scene.events.emit('roundChanged', this.round, this.maxEnemies);

        // Spawn enemies (WaveManager or scene will handle this)
        if (this.scene.spawnEnemies) {
            this.scene.spawnEnemies(this.maxEnemies);
        }
    }

    // Get enemy health multiplier for current round
    // +10% health per round
    getEnemyHealthMultiplier() {
        return 1 + (this.round - 1) * 0.1;
    }

    // Get enemy speed multiplier for current round
    // Matches p5.js getEnemySpeedMultiplier() logic
    getEnemySpeedMultiplier() {
        if (this.round <= 3) return 0.50;  // 50% speed rounds 1-3
        if (this.round <= 6) return 0.60;  // 60% speed rounds 4-6
        if (this.round <= 9) return 0.70;  // 70% speed rounds 7-9
        if (this.round <= 12) return 0.85; // 85% speed rounds 10-12
        if (this.round <= 14) return 0.90; // 90% speed rounds 13-14
        return 1.0; // 100% speed round 15+
    }

    // Check if player can afford map expansion
    canExpandMap() {
        return this.score >= this.mapExpansionCost;
    }

    // Expand the map (costs points)
    expandMap() {
        if (!this.canExpandMap()) {
            console.warn(`Cannot expand map. Need ${this.mapExpansionCost} points, have ${this.score}`);
            return false;
        }

        // Deduct cost
        this.score -= this.mapExpansionCost;
        this.mapExpansionCount++;

        console.log(`Map expanded! Cost: ${this.mapExpansionCost} points. Remaining: ${this.score}`);

        // Trigger map expansion (MapManager handles generation)
        if (this.scene.mapManager && this.scene.mapManager.expandMap) {
            this.scene.mapManager.expandMap();
        }

        // Increase cost for next expansion
        const oldCost = this.mapExpansionCost;
        this.mapExpansionCost = Math.floor(this.mapExpansionCost * this.mapExpansionMultiplier);

        console.log(`Next expansion cost: ${this.mapExpansionCost} (was ${oldCost})`);

        // Emit event
        this.scene.events.emit('mapExpanded', this.mapExpansionCount, this.mapExpansionCost);
        this.scene.events.emit('scoreChanged', this.score, -oldCost);

        return true;
    }

    // Game victory
    gameVictory() {
        this.roundState = 'victory';
        console.log(`🎉 VICTORY! All ${this.finalRound} rounds complete! Final score: ${this.score}`);

        this.scene.events.emit('gameVictory', this.score);

        // Show victory screen or return to menu after delay
        this.scene.time.delayedCall(5000, () => {
            this.scene.scene.start('MenuScene');
        });
    }

    // Game over (player died)
    gameOver() {
        this.roundState = 'game_over';
        console.log(`💀 Game Over. Round: ${this.round}, Score: ${this.score}`);

        this.scene.events.emit('gameOver', this.score, this.round);
    }

    // Reset for new game
    reset() {
        this.round = 1;
        this.score = 0;
        this.roundState = 'playing';
        this.maxEnemies = this.baseMaxEnemies;
        this.mapExpansionCost = 500;
        this.mapExpansionCount = 0;

        console.log('ProgressionManager reset for new game');
    }

    // Update (called from GameScene update loop)
    update(time, delta) {
        // Currently no continuous updates needed
        // Between rounds timing is handled by scene.time.delayedCall
    }

    // Get current game state info
    getState() {
        return {
            round: this.round,
            score: this.score,
            roundState: this.roundState,
            maxEnemies: this.maxEnemies,
            mapExpansionCost: this.mapExpansionCost,
            enemyHealthMultiplier: this.getEnemyHealthMultiplier(),
            enemySpeedMultiplier: this.getEnemySpeedMultiplier()
        };
    }
}

// Export for use in GameScene
if (typeof window !== 'undefined') {
    window.ProgressionManager = ProgressionManager;
}
