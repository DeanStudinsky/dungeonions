// WaveManager - Handles enemy spawning and waves (Phase 3)
class WaveManager {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 0;
        this.enemyObjects = []; // Track Enemy instances
        this.enemyGroup = scene.physics.add.group(); // Physics group for collisions
        this.waveActive = false;
    }

    startWave() {
        this.currentWave++;
        this.waveActive = true;
        console.log(`Starting wave ${this.currentWave}`);
        // TODO: Implement wave spawning logic in Phase 3
    }

    update(delta, player) {
        // Update all enemies
        this.enemyObjects.forEach(enemy => {
            if (enemy && !enemy.dead) {
                enemy.update(delta, player);
            }
        });

        // Clean up dead enemies
        this.enemyObjects = this.enemyObjects.filter(e => !e.dead);

        // Check if wave is complete
        if (this.waveActive && this.enemyObjects.length === 0) {
            this.waveActive = false;
            console.log(`Wave ${this.currentWave} complete!`);
        }
    }

    spawnEnemy(x, y, type = 'crab', healthMultiplier = 1.0, speedMultiplier = 1.0) {
        const enemy = new Enemy(this.scene, x, y, type);

        // Apply scaling multipliers
        enemy.maxHealth = Math.floor(enemy.maxHealth * healthMultiplier);
        enemy.health = enemy.maxHealth;
        enemy.speed = enemy.speed * speedMultiplier;

        this.enemyObjects.push(enemy);
        this.enemyGroup.add(enemy.sprite);

        return enemy;
    }

    // Spawn a crab from a random water tile
    spawnCrabFromWater(healthMultiplier = 1.0, speedMultiplier = 1.0) {
        const mapManager = this.scene.mapManager;
        if (!mapManager) {
            console.warn('No mapManager found, cannot spawn crab from water');
            return null;
        }

        const spawnPoint = mapManager.getRandomWaterSpawnPoint();
        if (!spawnPoint) {
            console.warn('No water tiles available for crab spawning');
            return null;
        }

        console.log(`🦀 Spawning crab from water at (${spawnPoint.x}, ${spawnPoint.y}) - HP x${healthMultiplier.toFixed(2)}, Speed x${speedMultiplier.toFixed(2)}`);
        return this.spawnEnemy(spawnPoint.x, spawnPoint.y, 'crab', healthMultiplier, speedMultiplier);
    }

    getCurrentWave() {
        return this.currentWave;
    }

    getEnemyCount() {
        return this.enemyObjects.length;
    }

    // Get the physics group for collision detection
    getEnemyGroup() {
        return this.enemyGroup;
    }

    destroy() {
        this.enemyObjects.forEach(e => e.destroy());
        this.enemyObjects = [];
        this.enemyGroup.clear(true, true);
    }
}

if (typeof window !== 'undefined') {
    window.WaveManager = WaveManager;
}
