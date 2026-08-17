// Archer - Swift ranged attacker with charged shots
class Archer extends BasePlayer {
    constructor(scene, x, y) {
        super(scene, x, y, 'archer');

        // Archer-specific stats
        this.stats = {
            baseHealth: 90,
            baseSpeed: 115,
            projectileDamage: 18,
            projectileSpeed: 350,
            projectileFireRate: 450,
            projectileTileIndex: TileConfig.projectiles.arrow,
            projectileColor: 0x8b4513 // Brown for wooden arrows
        };

        // Archer-specific properties
        this.chargeTime = 0;
        this.maxChargeTime = 1000; // 1 second to fully charge
        this.isCharging = false;

        // Archer skill tree
        this.skills = {
            quickDraw: { unlocked: false, level: 0, maxLevel: 3 },
            piercingArrow: { unlocked: false, level: 0, maxLevel: 3 },
            swiftness: { unlocked: false, level: 0, maxLevel: 3 },
            evasion: { unlocked: false, level: 0, maxLevel: 1 },
            volley: { unlocked: false, level: 0, maxLevel: 1 } // Ultimate
        };

        // Initialize sprite
        const charConfig = TileConfig.characters['archer'];
        this.initializeSprite(x, y, charConfig.tileIndex);
    }

    unlockSkill(skillId) {
        if (this.skillPoints > 0 && this.skills[skillId]) {
            const skill = this.skills[skillId];

            if (skill.level < skill.maxLevel) {
                skill.level++;
                skill.unlocked = true;
                this.skillPoints--;

                console.log(`🏹 Archer unlocked: ${skillId} (Level ${skill.level})`);
                this.applySkillEffect(skillId, skill.level);
            }
        }
    }

    applySkillEffect(skillId, level) {
        switch(skillId) {
            case 'quickDraw':
                // Faster fire rate
                this.stats.projectileFireRate -= 50;
                console.log(`Quick draw - fire rate: ${this.stats.projectileFireRate}ms`);
                break;
            case 'piercingArrow':
                // Increased damage
                this.stats.projectileDamage += 5;
                console.log(`Piercing arrow - damage: ${this.stats.projectileDamage}`);
                break;
            case 'swiftness':
                // Increased movement speed
                this.speed += 10;
                this.stats.baseSpeed += 10;
                console.log(`Swiftness - speed: ${this.speed}`);
                break;
            case 'evasion':
                // Chance to dodge attacks (would need collision code update)
                console.log(`🌟 Evasion unlocked - 25% dodge chance`);
                break;
            case 'volley':
                // Ultimate ability - rain of arrows
                console.log(`🌟 ULTIMATE: Volley unlocked!`);
                break;
        }
    }

    levelUp() {
        super.levelUp();

        // Archer-specific level up bonuses
        this.stats.projectileSpeed += 10;

        console.log(`🏹 Archer bonus: +10 arrow speed (${this.stats.projectileSpeed})`);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Archer = Archer;
}
