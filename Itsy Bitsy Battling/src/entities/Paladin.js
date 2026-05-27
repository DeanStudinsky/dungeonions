// Paladin - Armored guardian with survivability and holy power
class Paladin extends BasePlayer {
    constructor(scene, x, y) {
        super(scene, x, y, 'paladin');

        // Paladin-specific stats
        this.stats = {
            baseHealth: 150,
            baseSpeed: 90,
            projectileDamage: 8,
            projectileSpeed: 220,
            projectileFireRate: 320,
            projectileTileIndex: TileConfig.projectiles.holyLight,
            projectileColor: 0xffff00 // Bright yellow for holy light
        };

        // Paladin-specific properties
        this.armor = 2; // Reduces damage taken
        this.holyPower = 0;
        this.maxHolyPower = 100;

        // Paladin skill tree
        this.skills = {
            divineShield: { unlocked: false, level: 0, maxLevel: 3 },
            holySmite: { unlocked: false, level: 0, maxLevel: 3 },
            regeneration: { unlocked: false, level: 0, maxLevel: 3 },
            blessing: { unlocked: false, level: 0, maxLevel: 1 },
            divineIntervention: { unlocked: false, level: 0, maxLevel: 1 } // Ultimate
        };

        // Initialize sprite
        const charConfig = TileConfig.characters['paladin'];
        this.initializeSprite(x, y, charConfig.tileIndex);
    }

    update(time, delta) {
        super.update(time, delta);

        // Regeneration if unlocked
        if (this.skills.regeneration.unlocked && this.health < this.maxHealth) {
            const regenAmount = this.skills.regeneration.level * 0.5;
            this.health += (regenAmount * delta) / 1000;
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }
        }
    }

    takeDamage(amount) {
        // Reduce damage by armor
        const actualDamage = Math.max(1, amount - this.armor);
        super.takeDamage(actualDamage);

        // Gain holy power when taking damage
        this.holyPower += 10;
        if (this.holyPower > this.maxHolyPower) {
            this.holyPower = this.maxHolyPower;
        }
    }

    unlockSkill(skillId) {
        if (this.skillPoints > 0 && this.skills[skillId]) {
            const skill = this.skills[skillId];

            if (skill.level < skill.maxLevel) {
                skill.level++;
                skill.unlocked = true;
                this.skillPoints--;

                console.log(`⚔️ Paladin unlocked: ${skillId} (Level ${skill.level})`);
                this.applySkillEffect(skillId, skill.level);
            }
        }
    }

    applySkillEffect(skillId, level) {
        switch(skillId) {
            case 'divineShield':
                // Increases armor
                this.armor += 1;
                console.log(`Divine shield - armor: ${this.armor}`);
                break;
            case 'holySmite':
                // Increased holy damage
                this.stats.projectileDamage += 3;
                console.log(`Holy smite - damage: ${this.stats.projectileDamage}`);
                break;
            case 'regeneration':
                // Passive HP regeneration
                console.log(`Regeneration level ${level} - ${level * 0.5} HP/sec`);
                break;
            case 'blessing':
                // Aura that buffs nearby allies (future multiplayer)
                console.log(`🌟 Blessing unlocked - aura active`);
                break;
            case 'divineIntervention':
                // Ultimate - auto-revive once
                console.log(`🌟 ULTIMATE: Divine Intervention unlocked!`);
                break;
        }
    }

    levelUp() {
        super.levelUp();

        // Paladin-specific level up bonuses
        this.armor += 0.5;

        console.log(`⚔️ Paladin bonus: +0.5 armor (${this.armor})`);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Paladin = Paladin;
}
