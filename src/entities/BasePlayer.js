// BasePlayer - Shared functionality for all character classes
class BasePlayer {
    constructor(scene, x, y, characterType) {
        this.scene = scene;
        this.characterType = characterType;

        // Will be set by subclass
        this.stats = {};
        this.sprite = null;

        // Common properties
        this.health = 0;
        this.maxHealth = 0;
        this.speed = 0;
        this.facingDirection = 'right';
        this.isDead = false;

        // Leveling system
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.skillPoints = 0;

        // Combat
        this.lastFireTime = 0;
        this.projectiles = null;

        // Input
        this.cursors = null;
        this.wasd = null;
        this.fireKey = null;
        this.pointer = null;

        // Mobile controls
        this.joystickData = { x: 0, y: 0 };
        this.fireButtonDown = false;
    }

    initializeSprite(x, y, tileIndex) {
        // Create sprite
        this.sprite = this.scene.physics.add.sprite(x, y, 'dungeon_tiles', tileIndex);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(12, 12);
        this.sprite.body.setOffset(2, 4);
        this.sprite.setDepth(10);

        // Initialize health and speed from stats
        this.health = this.stats.baseHealth;
        this.maxHealth = this.stats.baseHealth;
        this.speed = this.stats.baseSpeed;

        // Create projectile group
        this.projectiles = this.scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 50,
            runChildUpdate: true
        });
    }

    setupInput() {
        // Keyboard controls
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.fireKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Mouse/touch firing
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.button === 0 || pointer.isDown) {
                this.fire(pointer);
            }
        });
    }

    update(time, delta) {
        if (!this.sprite || !this.sprite.active) return;

        // Movement input
        let velocityX = 0;
        let velocityY = 0;

        // Keyboard input
        if (this.cursors && this.wasd) {
            if (this.cursors.left.isDown || this.wasd.left.isDown) velocityX = -1;
            else if (this.cursors.right.isDown || this.wasd.right.isDown) velocityX = 1;

            if (this.cursors.up.isDown || this.wasd.up.isDown) velocityY = -1;
            else if (this.cursors.down.isDown || this.wasd.down.isDown) velocityY = 1;
        }

        // Mobile joystick input (override keyboard if active)
        if (this.joystickData.x !== 0 || this.joystickData.y !== 0) {
            velocityX = this.joystickData.x;
            velocityY = this.joystickData.y;
        }

        // Normalize diagonal movement
        if (velocityX !== 0 || velocityY !== 0) {
            const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            velocityX = (velocityX / length) * this.speed;
            velocityY = (velocityY / length) * this.speed;

            // Update facing direction
            if (Math.abs(velocityX) > Math.abs(velocityY)) {
                this.facingDirection = velocityX > 0 ? 'right' : 'left';
            }
        }

        this.sprite.setVelocity(velocityX, velocityY);

        // Update depth for Y-sorting
        this.sprite.setDepth(10 + this.sprite.y);

        // Auto-fire for mobile or spacebar for desktop
        if (this.fireButtonDown || (this.fireKey && this.fireKey.isDown)) {
            if (time > this.lastFireTime + this.stats.projectileFireRate) {
                this.fireInDirection();
                this.lastFireTime = time;
            }
        }
    }

    fire(pointer) {
        const now = this.scene.time.now;
        if (now < this.lastFireTime + this.stats.projectileFireRate) return;

        const angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            pointer.worldX,
            pointer.worldY
        );

        this.fireAtAngle(angle);
        this.lastFireTime = now;
    }

    fireInDirection() {
        // Fire in facing direction
        const directions = {
            'right': 0,
            'left': Math.PI,
            'up': -Math.PI / 2,
            'down': Math.PI / 2
        };

        const angle = directions[this.facingDirection] || 0;
        this.fireAtAngle(angle);
    }

    fireAtAngle(angle) {
        const projectile = this.projectiles.get(this.sprite.x, this.sprite.y, 'dungeon_tiles', this.stats.projectileTileIndex);

        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setDepth(5);
            projectile.body.setSize(8, 8);

            // Apply color tint if specified
            if (this.stats.projectileColor) {
                projectile.setTint(this.stats.projectileColor);
            }

            // Make projectile smaller for better visuals
            projectile.setScale(0.5);

            const velocityX = Math.cos(angle) * this.stats.projectileSpeed;
            const velocityY = Math.sin(angle) * this.stats.projectileSpeed;
            projectile.setVelocity(velocityX, velocityY);

            // Store damage on projectile
            projectile.damage = this.stats.projectileDamage;

            // Auto-destroy after 2 seconds
            this.scene.time.delayedCall(2000, () => {
                if (projectile.active) {
                    projectile.setActive(false);
                    projectile.setVisible(false);
                }
            });
        }
    }

    takeDamage(amount) {
        // Don't take damage if already dead
        if (this.isDead) return;

        this.health -= amount;
        if (this.health < 0) this.health = 0;

        // Visual feedback - flash red
        if (this.sprite) {
            this.sprite.setTint(0xff0000);
            this.scene.time.delayedCall(100, () => {
                if (this.sprite) {
                    this.sprite.clearTint();
                }
            });
        }

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        if (this.isDead) return; // Prevent multiple death calls

        this.isDead = true;
        console.log('💀 Player died!');

        // Disable sprite
        if (this.sprite) {
            this.sprite.setActive(false);
            this.sprite.setTint(0x666666); // Gray out
        }

        // Show game over screen after a delay
        this.scene.time.delayedCall(2000, () => {
            this.scene.scene.start('MenuScene');
        });
    }

    // Leveling system
    gainXP(amount) {
        this.xp += amount;
        console.log(`Gained ${amount} XP (${this.xp}/${this.xpToNextLevel})`);

        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        this.skillPoints++;

        console.log(`🎉 Level Up! Now level ${this.level}`);
        console.log(`Gained 1 skill point (${this.skillPoints} total)`);

        // Base stat increases (can be overridden by subclasses)
        this.maxHealth += Math.floor(this.stats.baseHealth * 0.1);
        this.health = this.maxHealth; // Heal on level up
        this.stats.projectileDamage += 1;

        // Emit event for UI update
        this.scene.events.emit('playerLevelUp', this.level, this.skillPoints);
    }

    // Skill tree methods (to be overridden by subclasses)
    unlockSkill(skillId) {
        console.log(`Unlocking skill: ${skillId}`);
        // Subclasses will implement specific skill unlocking
    }

    reset() {
        this.health = this.maxHealth;
        this.sprite.setPosition(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY);
        this.sprite.setVelocity(0, 0);
    }

    // Mobile control setters
    setJoystickInput(x, y) {
        this.joystickData.x = x;
        this.joystickData.y = y;
    }

    setFireButton(isDown) {
        this.fireButtonDown = isDown;
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
        if (this.projectiles) {
            this.projectiles.clear(true, true);
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.BasePlayer = BasePlayer;
}
