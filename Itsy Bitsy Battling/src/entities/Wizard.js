// Wizard - Fast spellcaster with rapid-fire potions
class Wizard extends BasePlayer {
    constructor(scene, x, y) {
        super(scene, x, y, 'wizard');

        // Wizard-specific stats
        this.stats = {
            baseHealth: 100,
            baseSpeed: 120,
            projectileDamage: 5,
            projectileSpeed: 250,
            projectileFireRate: 200,
            projectileTileIndex: TileConfig.projectiles.potion,
            projectileColor: 0x9966ff // Purple/magenta for magic
        };

        // Wizard-specific properties
        this.manaRegenRate = 10; // Mana per second
        this.currentMana = 100;
        this.maxMana = 100;

        // Wizard skill tree
        this.skills = {
            multiShot: { unlocked: false, level: 0, maxLevel: 3 },
            fireballUpgrade: { unlocked: false, level: 0, maxLevel: 3 },
            manaEfficiency: { unlocked: false, level: 0, maxLevel: 3 },
            arcaneShield: { unlocked: false, level: 0, maxLevel: 1 },
            meteorStrike: { unlocked: false, level: 0, maxLevel: 1 } // Ultimate
        };

        // Initialize sprite
        const charConfig = TileConfig.characters['wizard'];
        this.initializeSprite(x, y, charConfig.tileIndex);
    }

    update(time, delta) {
        super.update(time, delta);

        // Regenerate mana
        if (this.currentMana < this.maxMana) {
            this.currentMana += (this.manaRegenRate * delta) / 1000;
            if (this.currentMana > this.maxMana) {
                this.currentMana = this.maxMana;
            }
        }
    }

    unlockSkill(skillId) {
        if (this.skillPoints > 0 && this.skills[skillId]) {
            const skill = this.skills[skillId];

            if (skill.level < skill.maxLevel) {
                skill.level++;
                skill.unlocked = true;
                this.skillPoints--;

                console.log(`🔮 Wizard unlocked: ${skillId} (Level ${skill.level})`);
                this.applySkillEffect(skillId, skill.level);
            }
        }
    }

    applySkillEffect(skillId, level) {
        switch(skillId) {
            case 'multiShot':
                // Increases number of projectiles
                console.log(`Multi-shot level ${level} - fires ${level + 1} projectiles`);
                break;
            case 'fireballUpgrade':
                // Increases damage
                this.stats.projectileDamage += 2;
                console.log(`Fireball damage increased to ${this.stats.projectileDamage}`);
                break;
            case 'manaEfficiency':
                // Increases fire rate
                this.stats.projectileFireRate -= 30;
                console.log(`Fire rate increased (${this.stats.projectileFireRate}ms)`);
                break;
            case 'arcaneShield':
                // Increases max health
                this.maxHealth += 50;
                this.health += 50;
                console.log(`Arcane shield granted +50 max HP`);
                break;
            case 'meteorStrike':
                // Ultimate ability unlocked
                console.log(`🌟 ULTIMATE: Meteor Strike unlocked!`);
                break;
        }
    }

    fireAtAngle(angle) {
        const multiShotLevel = this.skills.multiShot.level;

        if (multiShotLevel === 0) {
            // Normal single shot
            super.fireAtAngle(angle);
        } else {
            // Multi-shot
            const projectileCount = multiShotLevel + 1;
            const spreadAngle = Math.PI / 8; // 22.5 degrees
            const startAngle = angle - (spreadAngle * (projectileCount - 1)) / 2;

            for (let i = 0; i < projectileCount; i++) {
                const shotAngle = startAngle + (spreadAngle * i);
                super.fireAtAngle(shotAngle);
            }
        }
    }

    levelUp() {
        super.levelUp();

        // Wizard-specific level up bonuses
        this.maxMana += 10;
        this.currentMana = this.maxMana;

        console.log(`🔮 Wizard bonus: +10 max mana (${this.maxMana})`);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Wizard = Wizard;
}
