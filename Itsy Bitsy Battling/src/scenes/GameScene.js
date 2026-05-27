// GameScene - Main gameplay scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.mapManager = null;
        this.waveManager = null;
        this.progressionManager = null;
        this.mobileControls = null;
    }

    init(data) {
        this.characterType = data.characterType || 'wizard';
        this.customMap = data.customMap || null;
    }

    create() {
        console.log(`🎮 Game starting with ${this.characterType}`);

        // Create map (with custom map if provided)
        this.mapManager = new MapManager(this);
        const mapWidth = this.customMap ? this.customMap.width : 40;
        const mapHeight = this.customMap ? this.customMap.height : 30;
        const map = this.mapManager.createMap(mapWidth, mapHeight, this.customMap);

        // Create player at center with correct class
        const centerX = map.widthInPixels / 2;
        const centerY = map.heightInPixels / 2;

        // Instantiate the correct player class based on character type
        switch(this.characterType) {
            case 'wizard':
                this.player = new Wizard(this, centerX, centerY);
                break;
            case 'archer':
                this.player = new Archer(this, centerX, centerY);
                break;
            case 'paladin':
                this.player = new Paladin(this, centerX, centerY);
                break;
            case 'knight':
                this.player = new Knight(this, centerX, centerY);
                break;
            default:
                this.player = new Wizard(this, centerX, centerY);
        }

        this.player.setupInput();

        // ESC = pause menu
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.scene.isActive('PauseScene')) {
                this.scene.pause('GameScene');
                this.scene.launch('PauseScene');
            }
        });

        // Setup collisions
        this.physics.add.collider(this.player.sprite, this.mapManager.getWallsLayer());
        this.physics.add.collider(this.player.sprite, this.mapManager.getObjectsLayer());

        // Projectile vs walls collision
        this.physics.add.collider(this.player.projectiles, this.mapManager.getWallsLayer(), (projectile) => {
            projectile.setActive(false);
            projectile.setVisible(false);
        });

        // Camera setup
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Wave manager
        this.waveManager = new WaveManager(this);

        // Progression manager (rounds, scoring, enemy scaling)
        this.progressionManager = new ProgressionManager(this);

        // Create enemies group for easier access
        this.enemies = this.waveManager.getEnemyGroup();

        // Setup enemy collisions
        this.setupEnemyCollisions();

        // Listen for progression events
        this.events.on('enemyKilled', () => {
            this.progressionManager.onEnemyKilled();
        });

        this.events.on('roundChanged', (round, maxEnemies) => {
            console.log(`📊 Round ${round} started - ${maxEnemies} enemies to spawn`);
            // Spawn enemies for new round
            this.spawnEnemies(maxEnemies);
        });

        this.events.on('scoreChanged', (score, pointsGained) => {
            // UI will handle this
        });

        this.events.on('showRoundMessage', (message, duration) => {
            this.showRoundCompleteMessage(message, duration);
        });

        // Mobile controls
        if (this.game.isMobile || this.sys.game.device.os.iOS || this.sys.game.device.os.android) {
            this.createMobileControls();
        }

        // Spawn crabs from water pool after 2 seconds
        this.time.delayedCall(2000, () => {
            // Spawn 3 crabs from the water pool
            for (let i = 0; i < 3; i++) {
                this.waveManager.spawnCrabFromWater();
            }
        });

        // Continue spawning crabs periodically from water
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                if (this.waveManager.getEnemyCount() < 6) {
                    this.waveManager.spawnCrabFromWater();
                }
            },
            loop: true
        });
    }

    setupEnemyCollisions() {
        // Projectiles vs enemies
        this.physics.add.overlap(
            this.player.projectiles,
            this.waveManager.getEnemyGroup(),
            (projectile, enemySprite) => {
                // Find enemy object
                const enemy = this.waveManager.enemyObjects.find(e => e.sprite === enemySprite);
                if (enemy && projectile.active) {
                    const damage = projectile.damage || 5;
                    console.log(`💥 Projectile hit enemy for ${damage} damage`);
                    enemy.takeDamage(damage, this.player); // Pass player for XP
                    projectile.setActive(false);
                    projectile.setVisible(false);
                }
            }
        );

        // Enemies vs player - deal contact damage
        this.playerHitCooldown = 0;
        this.physics.add.overlap(
            this.player.sprite,
            this.waveManager.getEnemyGroup(),
            (playerSprite, enemySprite) => {
                // Find enemy object
                const enemy = this.waveManager.enemyObjects.find(e => e.sprite === enemySprite);
                if (enemy && !enemy.dead) {
                    // Only damage player if cooldown expired (prevents rapid damage)
                    const now = this.time.now;
                    if (now > this.playerHitCooldown) {
                        const damage = enemy.damage || 10;
                        console.log(`🩸 Player hit by enemy for ${damage} damage`);
                        this.player.takeDamage(damage);
                        this.playerHitCooldown = now + 500; // 500ms cooldown between hits

                        // Knockback effect
                        const angle = Phaser.Math.Angle.Between(
                            enemySprite.x,
                            enemySprite.y,
                            playerSprite.x,
                            playerSprite.y
                        );
                        const knockbackSpeed = 200;
                        playerSprite.setVelocity(
                            Math.cos(angle) * knockbackSpeed,
                            Math.sin(angle) * knockbackSpeed
                        );

                        // Update UI
                        this.events.emit('playerHealthChanged', this.player.health, this.player.maxHealth);
                    }
                }
            }
        );

        // Enemies vs walls collision
        this.physics.add.collider(
            this.waveManager.getEnemyGroup(),
            this.mapManager.getWallsLayer()
        );

        // Enemies vs objects collision
        this.physics.add.collider(
            this.waveManager.getEnemyGroup(),
            this.mapManager.getObjectsLayer()
        );
    }

    createMobileControls() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.mobileControls = {
            joystick: null,
            fireButton: null,
            joystickBase: null,
            joystickThumb: null
        };

        // Virtual Joystick (bottom-left)
        const joystickX = 80;
        const joystickY = height - 80;

        this.mobileControls.joystickBase = this.add.circle(joystickX, joystickY, 50, 0x333333, 0.5);
        this.mobileControls.joystickBase.setScrollFactor(0);
        this.mobileControls.joystickBase.setDepth(1000);

        this.mobileControls.joystickThumb = this.add.circle(joystickX, joystickY, 25, 0xffffff, 0.8);
        this.mobileControls.joystickThumb.setScrollFactor(0);
        this.mobileControls.joystickThumb.setDepth(1001);

        // Make joystick interactive
        const joystickZone = this.add.zone(joystickX, joystickY, 100, 100);
        joystickZone.setInteractive({ draggable: true });
        joystickZone.setScrollFactor(0);

        let joystickActive = false;

        joystickZone.on('pointerdown', (pointer) => {
            joystickActive = true;
        });

        joystickZone.on('pointermove', (pointer) => {
            if (!joystickActive) return;

            const distance = Phaser.Math.Distance.Between(joystickX, joystickY, pointer.x, pointer.y);
            const angle = Phaser.Math.Angle.Between(joystickX, joystickY, pointer.x, pointer.y);

            const maxDistance = 40;
            const clampedDistance = Math.min(distance, maxDistance);

            const thumbX = joystickX + Math.cos(angle) * clampedDistance;
            const thumbY = joystickY + Math.sin(angle) * clampedDistance;

            this.mobileControls.joystickThumb.setPosition(thumbX, thumbY);

            // Calculate normalized input
            const normalizedX = Math.cos(angle) * (clampedDistance / maxDistance);
            const normalizedY = Math.sin(angle) * (clampedDistance / maxDistance);

            if (this.player) {
                this.player.setJoystickInput(normalizedX, normalizedY);
            }
        });

        joystickZone.on('pointerup', () => {
            joystickActive = false;
            this.mobileControls.joystickThumb.setPosition(joystickX, joystickY);
            if (this.player) {
                this.player.setJoystickInput(0, 0);
            }
        });

        // Fire button (bottom-right)
        const fireButtonX = width - 60;
        const fireButtonY = height - 80;

        this.mobileControls.fireButton = this.add.circle(fireButtonX, fireButtonY, 40, 0xff0000, 0.6);
        this.mobileControls.fireButton.setScrollFactor(0);
        this.mobileControls.fireButton.setDepth(1000);
        this.mobileControls.fireButton.setInteractive();

        const fireText = this.add.text(fireButtonX, fireButtonY, 'FIRE', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        fireText.setScrollFactor(0);
        fireText.setDepth(1001);

        this.mobileControls.fireButton.on('pointerdown', () => {
            this.mobileControls.fireButton.setFillStyle(0xff6600, 0.8);
            if (this.player) {
                this.player.setFireButton(true);
            }
        });

        this.mobileControls.fireButton.on('pointerup', () => {
            this.mobileControls.fireButton.setFillStyle(0xff0000, 0.6);
            if (this.player) {
                this.player.setFireButton(false);
            }
        });

        this.mobileControls.fireButton.on('pointerout', () => {
            this.mobileControls.fireButton.setFillStyle(0xff0000, 0.6);
            if (this.player) {
                this.player.setFireButton(false);
            }
        });
    }

    spawnEnemies(count) {
        // Spawn enemies using wave manager with progression scaling
        const healthMultiplier = this.progressionManager.getEnemyHealthMultiplier();
        const speedMultiplier = this.progressionManager.getEnemySpeedMultiplier();

        console.log(`Spawning ${count} enemies (HP x${healthMultiplier.toFixed(2)}, Speed x${speedMultiplier.toFixed(2)})`);

        for (let i = 0; i < count; i++) {
            this.waveManager.spawnCrabFromWater(healthMultiplier, speedMultiplier);
        }
    }

    showRoundCompleteMessage(message, duration = 3000) {
        // Create centered text message
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const messageText = this.add.text(width / 2, height / 2, message, {
            fontSize: '48px',
            fontFamily: 'monospace',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            fontStyle: 'bold'
        });
        messageText.setOrigin(0.5);
        messageText.setScrollFactor(0);
        messageText.setDepth(2000);

        // Pulse animation
        this.tweens.add({
            targets: messageText,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                messageText.destroy();
            }
        });
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);
        }

        if (this.waveManager) {
            this.waveManager.update(delta, this.player);
        }

        if (this.mapManager) {
            this.mapManager.update(delta);
        }

        if (this.progressionManager) {
            this.progressionManager.update(time, delta);
        }
    }
}

if (typeof window !== 'undefined') {
    window.GameScene = GameScene;
}
