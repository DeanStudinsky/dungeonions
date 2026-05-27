// Enemy class - Basic implementation, will be expanded in Phase 3
class Enemy {
    constructor(scene, x, y, enemyType = 'crab') {
        this.scene = scene;
        this.enemyType = enemyType;

        const tileIndex = TileConfig.enemies[enemyType] || TileConfig.enemies.crab;

        this.sprite = scene.physics.add.sprite(x, y, 'dungeon_tiles', tileIndex);
        this.sprite.setDepth(10);
        this.sprite.body.setSize(12, 12);

        // Basic stats (from original DungeOnionenemies.js)
        this.health = 10;
        this.maxHealth = 10;
        this.speed = 50;  // Slowed down from 100
        this.damage = 10;
        this.xpValue = 25; // XP awarded when killed
        this.dead = false;
    }

    update(delta, player) {
        if (this.dead || !this.sprite || !this.sprite.active) return;

        // Basic AI - move towards player (Phase 3 will improve this)
        if (player && player.sprite) {
            const angle = Phaser.Math.Angle.Between(
                this.sprite.x,
                this.sprite.y,
                player.sprite.x,
                player.sprite.y
            );

            this.sprite.setVelocity(
                Math.cos(angle) * this.speed,
                Math.sin(angle) * this.speed
            );
        }

        // Update depth for Y-sorting
        this.sprite.setDepth(10 + this.sprite.y);
    }

    takeDamage(amount, player = null) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die(player);
        } else {
            // Flash
            this.sprite.setTint(0xff0000);
            this.scene.time.delayedCall(100, () => {
                this.sprite.clearTint();
            });
        }
    }

    die(player = null) {
        this.dead = true;
        this.sprite.setActive(false);
        this.sprite.setVisible(false);

        // Award XP to player
        if (player && player.gainXP) {
            player.gainXP(this.xpValue);
        }

        // Emit enemyKilled event for progression tracking
        this.scene.events.emit('enemyKilled', this);

        console.log(`💀 Enemy ${this.enemyType} killed!`);

        // TODO: Death animation, particles, etc.
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}

if (typeof window !== 'undefined') {
    window.Enemy = Enemy;
}
