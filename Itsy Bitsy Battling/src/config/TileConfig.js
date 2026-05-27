// Kenney Tiny Dungeon Tileset Configuration
// Spritesheet: 12 columns × 11 rows (16x16 tiles, 1px spacing)

const TileConfig = {
    // Spritesheet settings - USING EXACT P5.JS TILEMAP
    spritesheet: {
        key: 'dungeon_tiles',
        path: 'assets/tilesets/kenney_tiny-dungeon/Tilemap/tilemap.png',  // ← Changed from tilemap_packed.png
        frameWidth: 16,
        frameHeight: 16,
        spacing: 1,  // 1px spacing between tiles
        margin: 1    // 1px margin around tileset
    },

    // Floor tiles (passable) - MATCHED TO P5.JS VERSION
    floors: {
        stone: [32, 33, 36, 37, 38, 39],  // Stone Brick, Stone Slab, Light Stone floors
        dirt: [24, 25, 26, 27],            // Dirt Floor edges and center
        wood: [28, 29, 30],                // Wooden Plank Floor variants
        sand: [51],                        // Sand/Light Dirt Floor (main floor in p5.js)
        default: 51                        // Default to sand floor like p5.js
    },

    // Water tiles - MATCHED TO P5.JS VERSION
    water: {
        pool: [28, 29, 40, 41],  // Dark blue/water tiles used in p5.js waterAnimationOffset
        default: 28
    },

    // Wall tiles (collision) - MATCHED TO P5.JS VERSION
    walls: {
        top: [0, 1, 2],           // Stone Wall Top Left Corner, Top, Top Right Corner
        middle: [12, 13, 14, 15], // Stone Wall Left Side, Center, with Banner, Right Side
        bottom: [12, 13, 15],     // Reuse middle for bottom (p5.js doesn't have separate bottom)
        corners: [0, 2, 12, 15],  // Top-left, Top-right, Bottom-left, Bottom-right
        default: 13               // Stone Wall Center Block
    },

    // Object tiles (collision) - MATCHED TO P5.JS VERSION
    objects: {
        barrel: [57, 63],  // Barrel, Barrel (Side View)
        crate: [58, 64],   // Crate, Crate Stack
        chest: [59, 66],   // Chest (Closed Brown), Chest (Closed Red/Gold)
        door: [60, 61, 62], // Wooden Door Vertical, Horizontal, Metal Gate
        column: [71],      // Stone Column/Pillar Base
        torch: [54]        // Not specified in p5.js but keeping for compatibility
    },

    // Character tiles - EXACT MATCH TO P5.JS VERSION
    characters: {
        wizard: {
            tileIndex: 84,  // tile_0084.png - Purple wizard
            name: 'Wizard',
            description: 'A nimble spellcaster who hurls volatile potions at breakneck speed.'
        },
        paladin: {
            tileIndex: 82,  // tile_0082.png - Armored paladin (was 97)
            name: 'Paladin',
            description: 'An armored guardian who trades speed for survivability and righteous power.'
        },
        knight: {
            tileIndex: 97,  // tile_0097.png - Knight (was 72)
            name: 'Knight',
            description: 'A stalwart striker who cleaves nearby foes with a sweeping blade.'
        },
        archer: {
            tileIndex: 85,  // tile_0085.png - Archer with green hood (was 73)
            name: 'Archer',
            description: 'A swift ranged attacker who charges powerful arrow shots.'
        }
    },

    // Enemy tiles - MATCHED TO P5.JS VERSION
    enemies: {
        crab: 110,      // Entity Sprite: Orc (used as crab in p5.js)
        skeleton: 98,   // Entity Sprite: Skeleton
        bat: 102,       // Entity Sprite: Bat
        ghost: 109      // Entity Sprite: Ghost
    },

    // Projectile tiles - MATCHED TO P5.JS VERSION
    projectiles: {
        potion: 115,      // Item: Potion (Red) - Wizard projectile
        holyLight: 117,   // Item: Projectile (Magic Bolt) - Paladin
        sword: 119,       // Item: Sword - Knight
        arrow: 116        // Item: Projectile (Arrow) - Archer
    },

    // Collision configuration - MATCHED TO P5.JS VERSION
    collision: {
        // Tile indices that block player movement (playerPasses: false in p5.js)
        blocksPlayer: [
            // Wall tiles (tiles 0-23)
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            // Low walls/beams
            34, 35, 40, 41,
            // Objects: barrels, crates, chests, doors, columns
            57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 71
        ],
        // Tiles that block projectiles (magicPasses: false in p5.js)
        blocksProjectiles: [
            // All wall tiles
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            // Low walls/beams
            34, 35, 40, 41,
            // Objects
            57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 71
        ],
        // Tiles that block enemies (same as player in p5.js)
        blocksEnemies: [
            // Wall tiles
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            // Low walls/beams
            34, 35, 40, 41,
            // Objects
            57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 71
        ],
        // Walkable tiles that have special properties
        special: {
            // Water tiles - used for animation and crab spawning in p5.js
            water: [28, 29, 40, 41],
            // Door tiles - these are actually blocking in p5.js
            doors: [60, 61, 62],
            // Decorative non-blocking tiles
            decorative: [31, 54, 65]  // Floor Grate, tracks, open chest
        },
        // Tiles that damage entities
        damaging: {
            tiles: [],
            damage: 1,
            damageInterval: 1000
        }
    },

    // Layer configuration
    layers: {
        ground: {
            name: 'Ground',
            depth: 0
        },
        water: {
            name: 'Water',
            depth: 0.5
        },
        walls: {
            name: 'Walls',
            depth: 1
        },
        objects: {
            name: 'Objects',
            depth: 2
        },
        characters: {
            name: 'Characters',
            depth: 10 // Base depth, will be modified by Y position
        }
    },

    // Helper methods for collision detection
    helpers: {
        // Check if a tile blocks player movement
        blocksPlayer: function(tileIndex) {
            return TileConfig.collision.blocksPlayer.includes(tileIndex);
        },

        // Check if a tile blocks projectiles
        blocksProjectiles: function(tileIndex) {
            return TileConfig.collision.blocksProjectiles.includes(tileIndex);
        },

        // Check if a tile blocks enemies
        blocksEnemies: function(tileIndex) {
            return TileConfig.collision.blocksEnemies.includes(tileIndex);
        },

        // Check if a tile is water
        isWater: function(tileIndex) {
            return TileConfig.collision.special.water.includes(tileIndex);
        },

        // Check if a tile is a door
        isDoor: function(tileIndex) {
            return TileConfig.collision.special.doors.includes(tileIndex);
        },

        // Check if a tile damages entities
        isDamaging: function(tileIndex) {
            return TileConfig.collision.damaging.tiles.includes(tileIndex);
        },

        // Get damage amount for a tile
        getTileDamage: function(tileIndex) {
            return this.isDamaging(tileIndex) ? TileConfig.collision.damaging.damage : 0;
        }
    }
};

// Export for use in scenes
if (typeof window !== 'undefined') {
    window.TileConfig = TileConfig;
}
