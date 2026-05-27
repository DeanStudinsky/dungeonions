// Knight - Stalwart striker with melee-focused combat
class Knight extends BasePlayer {
    constructor(scene, x, y) {
        super(scene, x, y, 'knight');

        // Knight-specific stats
        this.stats = {
            baseHealth: 140,
            baseSpeed: 110,
            projectileDamage: 12,
            projectileSpeed: 200,
            projectileFireRate: 360,
            projectileTileIndex: TileConfig.projectiles.sword,
            projectileColor: 0xc0c0c0 // Silver for sword slashes
        };

        // Knight-specific properties
        this.defense = 3;
        this.critChance = 0.1; // 10% base crit chance
        this.critMultiplier = 2.0;

        // Melee slash properties (from PlayerClassConfig)
        const classConfig = window.PLAYER_CLASSES.knight;
        this.meleeRange = classConfig.meleeRange;
        this.meleeArc = classConfig.meleeArc;
        this.meleeDuration = classConfig.meleeDuration;
        this.meleeIndicator = null;

        // Knight skill tree
        this.skills = {
            heavyBlade: { unlocked: false, level: 0, maxLevel: 3 },
            fortitude: { unlocked: false, level: 0, maxLevel: 3 },
            criticalStrike: { unlocked: false, level: 0, maxLevel: 3 },
            ironWill: { unlocked: false, level: 0, maxLevel: 1 },
            whirlwind: { unlocked: false, level: 0, maxLevel: 1 } // Ultimate
        };

        // Initialize sprite
        const charConfig = TileConfig.characters['knight'];
        this.initializeSprite(x, y, charConfig.tileIndex);
    }

    takeDamage(amount) {
        // Reduce damage by defense
        const actualDamage = Math.max(1, amount - this.defense);
        super.takeDamage(actualDamage);
    }

    unlockSkill(skillId) {
        if (this.skillPoints > 0 && this.skills[skillId]) {
            const skill = this.skills[skillId];

            if (skill.level < skill.maxLevel) {
                skill.level++;
                skill.unlocked = true;
                this.skillPoints--;

                console.log(`🗡️ Knight unlocked: ${skillId} (Level ${skill.level})`);
                this.applySkillEffect(skillId, skill.level);
            }
        }
    }

    applySkillEffect(skillId, level) {
        switch(skillId) {
            case 'heavyBlade':
                // Increased melee damage
                this.stats.projectileDamage += 4;
                console.log(`Heavy blade - damage: ${this.stats.projectileDamage}`);
                break;
            case 'fortitude':
                // Increased defense
                this.defense += 1;
                console.log(`Fortitude - defense: ${this.defense}`);
                break;
            case 'criticalStrike':
                // Increased crit chance
                this.critChance += 0.05;
                console.log(`Critical strike - crit chance: ${(this.critChance * 100).toFixed(0)}%`);
                break;
            case 'ironWill':
                // Cannot be stunned/knocked back
                console.log(`🌟 Iron Will unlocked - immune to knockback`);
                break;
            case 'whirlwind':
                // Ultimate - spin attack hitting all nearby enemies
                console.log(`🌟 ULTIMATE: Whirlwind unlocked!`);
                break;
        }
    }

    fireAtAngle(angle) {
        // Knight alternates between melee slash and ranged sword throw
        // Use melee slash for close combat
        this.performMeleeSlash(angle);
    }

    performMeleeSlash(angle) {
        // Check for critical hit
        const isCrit = Math.random() < this.critChance;
        const damage = isCrit
            ? Math.floor(this.stats.projectileDamage * this.critMultiplier)
            : this.stats.projectileDamage;

        if (isCrit) {
            console.log(`⚡ CRITICAL MELEE! ${damage} damage`);
        }

        // Create visual indicator
        this.showMeleeIndicator(angle);

        // Damage enemies in range
        this.damageEnemiesInArc(angle, damage);
    }

    showMeleeIndicator(angle) {
        // Remove old indicator if exists
        if (this.meleeIndicator) {
            this.meleeIndicator.destroy();
        }

        // Create graphics for melee arc
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(4, 0xFFB432, 0.75);
        graphics.fillStyle(0xFFB432, 0.22);

        // Draw arc
        graphics.beginPath();
        graphics.moveTo(this.sprite.x, this.sprite.y);
        graphics.arc(
            this.sprite.x,
            this.sprite.y,
            this.meleeRange,
            angle - this.meleeArc / 2,
            angle + this.meleeArc / 2,
            false
        );
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        this.meleeIndicator = graphics;

        // Fade out indicator
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: this.meleeDuration,
            onComplete: () => graphics.destroy()
        });
    }

    damageEnemiesInArc(angle, damage) {
        // Get all enemies
        const enemies = this.scene.enemies.getChildren();

        enemies.forEach(enemy => {
            if (!enemy.active || enemy.isDead) return;

            // Calculate distance to enemy
            const dx = enemy.x - this.sprite.x;
            const dy = enemy.y - this.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if in range
            if (distance <= this.meleeRange) {
                // Check if in arc
                const enemyAngle = Math.atan2(dy, dx);
                const angleDiff = this.normalizeAngle(enemyAngle - angle);

                if (Math.abs(angleDiff) <= this.meleeArc / 2) {
                    // Enemy is in melee range and arc - damage them
                    if (enemy.takeDamage) {
                        enemy.takeDamage(damage);
                    }
                }
            }
        });
    }

    normalizeAngle(angle) {
        // Normalize angle to -PI to PI range
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    }

    levelUp() {
        super.levelUp();

        // Knight-specific level up bonuses
        this.defense += 0.5;
        this.critChance += 0.01;

        console.log(`🗡️ Knight bonus: +0.5 defense, +1% crit (${(this.critChance * 100).toFixed(0)}%)`);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Knight = Knight;
}
