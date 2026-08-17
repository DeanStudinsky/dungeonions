// Kenney Roguelike RPG Pack Tileset Configuration
// Spritesheet: 57 columns × 31 rows (16x16 tiles, no spacing)

const RoguelikeTileConfig = {
    // Spritesheet settings
    spritesheet: {
        key: 'roguelike_tiles',
        path: 'assets/tilesets/kenney_roguelike-rpg-pack/roguelikeSheet_transparent.png',
        frameWidth: 16,
        frameHeight: 16,
        spacing: 0,
        margin: 0
    },

    // Floor tiles (passable) - Brown/tan ground tiles
    floors: {
        // Good ground tiles from the roguelike sheet (rows 4-5, various columns)
        dirt: [228, 229, 230, 231, 285, 286, 287, 288], // Brown dirt tiles
        stone: [399, 400, 401, 456, 457, 458], // Stone floor tiles
        wood: [342, 343, 344, 399, 400, 401], // Wooden floor
        default: 228  // Brown dirt default
    },

    // Water tiles (top-left of sheet) - Cyan tiles with sparkles
    water: {
        pool: [0, 1, 2, 3, 57, 58, 59, 60], // Top-left water tiles
        default: 0
    },

    // Wall tiles (collision) - Using stone walls
    walls: {
        top: [512, 513, 514, 515],
        middle: [569, 570, 571, 572],
        bottom: [626, 627, 628, 629],
        corners: [512, 515, 626, 629],
        default: 570
    },

    // Object tiles (collision)
    objects: {
        barrel: [304, 361], // Barrels
        crate: [305, 362], // Crates
        chest: [274, 331], // Chests
        rock: [227, 284], // Rocks
        tree: [188, 245] // Trees/obstacles
    },

    // Character tiles - Using the same indices as tiny dungeon for consistency
    characters: {
        wizard: {
            tileIndex: 992, // Wizard character
            name: 'Wizard',
            description: 'A nimble spellcaster who hurls volatile potions at breakneck speed.'
        },
        paladin: {
            tileIndex: 990, // Armored character
            name: 'Paladin',
            description: 'An armored guardian who trades speed for survivability and righteous power.'
        },
        knight: {
            tileIndex: 1005, // Knight character
            name: 'Knight',
            description: 'A stalwart striker who cleaves nearby foes with a sweeping blade.'
        },
        archer: {
            tileIndex: 993, // Archer character
            name: 'Archer',
            description: 'A swift ranged attacker who charges powerful arrow shots.'
        }
    },

    // Enemy tiles
    enemies: {
        crab: 1018, // Crab enemy
        skeleton: 1006, // Skeleton
        bat: 1020, // Bat/flying enemy
        ghost: 1021 // Ghost
    },

    // Projectile tiles
    projectiles: {
        potion: 1023,    // Potion projectile
        holyLight: 1025, // Holy projectile
        sword: 1012,     // Sword slash
        arrow: 1024      // Arrow
    },

    // Collision configuration
    collision: {
        blocksPlayer: [512, 513, 514, 515, 569, 570, 571, 572, 626, 627, 628, 629, 304, 361, 305, 362, 274, 331, 227, 284],
        blocksProjectiles: [512, 513, 514, 515, 569, 570, 571, 572, 626, 627, 628, 629, 304, 361, 305, 362, 274, 331, 227, 284],
        blocksEnemies: [512, 513, 514, 515, 569, 570, 571, 572, 626, 627, 628, 629, 304, 361, 305, 362, 274, 331, 227, 284],
        special: {
            water: [0, 1, 2, 3, 57, 58, 59, 60],
            doors: [520, 521],
            decorative: [188, 245]
        },
        damaging: {
            tiles: [],
            damage: 1,
            damageInterval: 1000
        }
    },

    // Layer configuration
    layers: {
        ground: { name: 'Ground', depth: 0 },
        water: { name: 'Water', depth: 0.5 },
        walls: { name: 'Walls', depth: 1 },
        objects: { name: 'Objects', depth: 2 },
        characters: { name: 'Characters', depth: 10 }
    },

    // Helper methods
    helpers: {
        blocksPlayer: function(tileIndex) {
            return RoguelikeTileConfig.collision.blocksPlayer.includes(tileIndex);
        },
        blocksProjectiles: function(tileIndex) {
            return RoguelikeTileConfig.collision.blocksProjectiles.includes(tileIndex);
        },
        blocksEnemies: function(tileIndex) {
            return RoguelikeTileConfig.collision.blocksEnemies.includes(tileIndex);
        },
        isWater: function(tileIndex) {
            return RoguelikeTileConfig.collision.special.water.includes(tileIndex);
        },
        isDoor: function(tileIndex) {
            return RoguelikeTileConfig.collision.special.doors.includes(tileIndex);
        },
        isDamaging: function(tileIndex) {
            return RoguelikeTileConfig.collision.damaging.tiles.includes(tileIndex);
        },
        getTileDamage: function(tileIndex) {
            return this.isDamaging(tileIndex) ? RoguelikeTileConfig.collision.damaging.damage : 0;
        }
    }
};

// Export
if (typeof window !== 'undefined') {
    window.RoguelikeTileConfig = RoguelikeTileConfig;
}
