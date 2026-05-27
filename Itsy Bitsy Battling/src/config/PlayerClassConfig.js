// Player Class Configuration
// Ported from old-p5-version/DungeOnionplayerclasses.js

const PLAYER_CLASSES = {
    wizard: {
        name: 'Wizard',
        description: 'A nimble spellcaster who hurls volatile potions at breakneck speed.',
        tileIndex: 84,
        baseHealth: 100,
        baseSpeed: 120, // pixels per second
        projectileDamage: 5,
        projectileSpeed: 250, // pixels per second
        projectileFireRate: 200, // ms between shots
        projectileTileIndex: 115,
        projectileColor: 0xFF00FF, // Magenta
        specialAbility: 'particleBurst',
        // Wizard specific
        burstCooldown: 400,
        burstParticleCount: 30,
        burstLifespan: 400
    },
    paladin: {
        name: 'Paladin',
        description: 'An armored guardian who trades speed for survivability and righteous power.',
        tileIndex: 82,  // EXACT P5.JS MATCH: tile_0082.png - Armored paladin
        baseHealth: 150,
        baseSpeed: 90,
        projectileDamage: 8,
        projectileSpeed: 220,
        projectileFireRate: 320,
        projectileTileIndex: 117,  // Item: Projectile (Magic Bolt)
        projectileColor: 0xFFD700, // Gold
        specialAbility: 'holyShield',
        // Paladin specific
        regenRate: 1, // HP per second
        regenDelay: 5000 // ms without damage before regen starts
    },
    knight: {
        name: 'Knight',
        description: 'A stalwart striker who cleaves nearby foes with a sweeping blade.',
        tileIndex: 97,  // EXACT P5.JS MATCH: tile_0097.png - Knight
        baseHealth: 140,
        baseSpeed: 110,
        projectileDamage: 12,
        projectileSpeed: 200,
        projectileFireRate: 360,
        projectileTileIndex: 104,  // EXACT P5.JS MATCH: tile_0104.png - Attack indicator
        projectileColor: 0xFFB432, // Orange
        specialAbility: 'meleeSlash',
        // Knight specific
        meleeRange: 64,
        meleeArc: Math.PI / 3, // 60 degrees
        meleeDuration: 140,
        critChance: 0.15 // 15% crit chance
    },
    archer: {
        name: 'Archer',
        description: 'A swift ranged attacker who charges powerful arrow shots.',
        tileIndex: 85,  // EXACT P5.JS MATCH: tile_0085.png - Archer with green hood
        baseHealth: 90,
        baseSpeed: 115,
        projectileDamage: 18,
        projectileSpeed: 350,
        projectileFireRate: 450,
        projectileTileIndex: 116,
        projectileColor: 0x8B4513, // Brown
        specialAbility: 'piercingShot',
        // Archer specific
        chargeTime: 0,
        maxChargeTime: 1000, // 1 second for full charge
        chargeMultiplier: 2.0 // 2x damage when fully charged
    }
};

// Helper function to get class config
function getPlayerClassConfig(className) {
    const config = PLAYER_CLASSES[className];
    if (!config) {
        console.error(`Player class "${className}" not found. Defaulting to wizard.`);
        return PLAYER_CLASSES.wizard;
    }
    return config;
}

// Helper function to get formatted class stats
function formatClassStats(classConfig) {
    return [
        `HP ${classConfig.baseHealth}`,
        `Speed ${classConfig.baseSpeed}`,
        `Damage ${classConfig.projectileDamage}`,
        `Fire Rate ${classConfig.projectileFireRate}ms`
    ].join(' • ');
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PLAYER_CLASSES = PLAYER_CLASSES;
    window.getPlayerClassConfig = getPlayerClassConfig;
    window.formatClassStats = formatClassStats;
}
