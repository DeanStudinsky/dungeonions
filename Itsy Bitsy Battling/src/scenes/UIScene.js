// UIScene - HUD overlay that runs parallel to GameScene
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        this.healthBar = null;
        this.healthBarSprite = null;
        this.scoreText = null;
        this.roundText = null;

        // Flash animation for critical health (ported from p5.js version)
        this.criticalFlashTimer = 0;
        this.criticalFlashInterval = 250; // ms
        this.isFlashingImage4 = true;

        // Track score and round from GameScene
        this.currentScore = 0;
        this.currentRound = 1;
        this.enemyCount = 0;
    }

    create() {
        const width = this.cameras.main.width;

        // Health bar (top-left)
        this.createHealthBar();

        // Score (top-right)
        this.scoreText = this.add.text(width - 20, 20, 'Score: 0', {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.scoreText.setOrigin(1, 0);
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(1000);

        // Round counter (top-center)
        this.roundText = this.add.text(width / 2, 20, 'Round: 1 | Enemies: 0', {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: '#00FF00',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.roundText.setOrigin(0.5, 0);
        this.roundText.setScrollFactor(0);
        this.roundText.setDepth(1000);

        // Listen for progression events from GameScene
        const gameScene = this.scene.get('GameScene');
        if (gameScene) {
            gameScene.events.on('scoreChanged', (score) => {
                this.currentScore = score;
                this.updateScoreDisplay();
            });

            gameScene.events.on('roundChanged', (round) => {
                this.currentRound = round;
                this.updateRoundDisplay();
            });
        }

        // FPS counter (debug, top-left under health)
        this.fpsText = this.add.text(20, 80, 'FPS: 60', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#888888'
        });
        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(1000);
    }

    createHealthBar() {
        const x = 20;
        const y = 20;

        // Create healthbar sprite using image (ported from p5.js version)
        this.healthBarSprite = this.add.image(x, y, 'healthbar_1');
        this.healthBarSprite.setOrigin(0, 0);
        this.healthBarSprite.setScrollFactor(0);
        this.healthBarSprite.setDepth(1000);
        this.healthBarSprite.setAlpha(0.9);
    }

    update(time, delta) {
        // Get game scene
        const gameScene = this.scene.get('GameScene');
        if (!gameScene) return;

        // Update health bar with image sprites (ported from p5.js version)
        if (gameScene.player && this.healthBarSprite) {
            const player = gameScene.player;
            const healthPercent = player.health > 0 ? player.health / player.maxHealth : 0;

            let imageKey = 'healthbar_1'; // Default to full health

            if (healthPercent <= 0 || healthPercent <= 0.20) {
                imageKey = 'healthbar_7'; // Empty/critical
            } else if (healthPercent <= 0.40) {
                imageKey = 'healthbar_6'; // Very low
            } else if (healthPercent <= 0.60) {
                // Critical flash range (ported from p5.js HealthBarManager)
                this.criticalFlashTimer += delta;
                if (this.criticalFlashTimer >= this.criticalFlashInterval) {
                    this.criticalFlashTimer = 0;
                    this.isFlashingImage4 = !this.isFlashingImage4;
                }
                imageKey = this.isFlashingImage4 ? 'healthbar_4' : 'healthbar_5';
            } else if (healthPercent <= 0.80) {
                imageKey = 'healthbar_3'; // Medium
            } else if (healthPercent < 1.0) {
                imageKey = 'healthbar_2'; // High
            } else {
                imageKey = 'healthbar_1'; // Full health
            }

            this.healthBarSprite.setTexture(imageKey);
        }

        // Update enemy count
        if (gameScene.waveManager) {
            this.enemyCount = gameScene.waveManager.getEnemyCount();
            this.updateRoundDisplay();
        }

        // Update FPS
        this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
    }

    updateScoreDisplay() {
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${this.currentScore}`);
        }
    }

    updateRoundDisplay() {
        if (this.roundText) {
            this.roundText.setText(`Round: ${this.currentRound} | Enemies: ${this.enemyCount}`);
        }
    }
}

if (typeof window !== 'undefined') {
    window.UIScene = UIScene;
}
