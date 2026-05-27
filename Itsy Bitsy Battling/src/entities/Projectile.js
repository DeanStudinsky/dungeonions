// Projectile class - Placeholder for Phase 2
// Currently handled by Player class, will be refactored later
class Projectile {
    constructor(scene, x, y, angle, speed, damage, tileIndex) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'dungeon_tiles', tileIndex);

        this.sprite.setDepth(5);
        this.sprite.body.setSize(8, 8);

        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        this.sprite.setVelocity(velocityX, velocityY);

        this.damage = damage;
        this.active = true;

        // Auto-destroy after 2 seconds
        this.scene.time.delayedCall(2000, () => this.destroy());
    }

    destroy() {
        this.active = false;
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}

if (typeof window !== 'undefined') {
    window.Projectile = Projectile;
}
