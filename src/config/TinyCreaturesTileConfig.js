// Kenney Tiny Creatures Tileset Configuration
// Spritesheet: 10 columns × 18 rows (16x16 tiles, 1px spacing, 1px margin)
// 180 unique creature sprites - all face right, flip horizontally for left
// Tile file numbering: tile_0001.png = index 0, tile_0002.png = index 1, etc.

const TinyCreaturesTileConfig = {
    // Spritesheet settings
    spritesheet: {
        key: 'creature_tiles',
        path: 'assets/tilesets/kenney_tiny-creatures/Tilemap/tilemap.png',
        frameWidth: 16,
        frameHeight: 16,
        spacing: 1,
        margin: 1
    },

    // Grid dimensions
    columns: 10,
    rows: 18,
    totalTiles: 180,

    // ── Enemy creatures (good dungeon enemies) ──────────────────────────
    enemies: {
        // Small/basic enemies
        frog:         0,   // Green frog
        crab:         2,   // Red crab/lobster
        slime:        3,   // Orange slime
        eyeball:      5,   // Floating eyeball monster
        ghost:        6,   // Blue ghost/spirit
        plantMonster: 7,   // Green spiky plant creature
        bat:          10,  // Dark bat
        butterfly:    12,  // Moth/butterfly
        mushroom:     13,  // Red mushroom creature

        // Medium enemies
        spider:       30,  // Spider creature
        snake:        40,  // Serpent/seahorse creature
        iceCreature:  48,  // Icy/frost creature
        beetle:       60,  // Teal beetle/construct
        scorpion:     72,  // Dark horned creature

        // Strong enemies
        minotaur:     20,  // Brown ox/minotaur
        demon:        80,  // Green demon/construct
        darkEye:      120, // Dark eyeball horror

        // Boss-tier
        dragon:       40,  // Dragon/serpent
        golem:        80   // Construct/golem
    },

    // ── Friendly/neutral creatures (NPCs, pets, animals) ───────────────
    creatures: {
        owl:          1,   // Beige owl
        turtle:       8,   // Green turtle
        bear:         14,  // Brown bear
        cow:          15,  // Brown/purple cow
        wolf:         19,  // Grey wolf
        bunny:        30,  // White rabbit
        cat:          90,  // Orange/red cat
        chicken:      150, // White chicken
        rabbit:       130, // Purple bunny
        deer:         50   // Brown deer
    },

    // ── All tile indices organized by row ───────────────────────────────
    // Row 0 (indices 0-9): Frog, Owl, Crab, Slime, Purple creature,
    //                       Eyeball, Ghost, Plant, Turtle, Green creature
    // Row 1 (indices 10-19): Bat, Green creature, Butterfly, Mushroom,
    //                         Bear, Cow, Small frog, Teal creature,
    //                         Red creature, Wolf
    // Row 2 (indices 20-29): Minotaur, ...
    // Row 3 (indices 30-39): Bunny/Spider, ...
    // Row 4 (indices 40-49): Seahorse/Dragon, ...
    // Row 5-17: Additional creatures (180 total)

    // ── Collision config (all creature tiles block movement) ────────────
    collision: {
        // All creature indices block player/enemy movement
        // (since these are entity sprites placed on map)
        blocksPlayer: [],      // Creatures don't block as tiles
        blocksProjectiles: [], // Projectiles pass through creature tiles
        blocksEnemies: [],     // Enemies don't block each other
        special: {},
        damaging: {
            tiles: [],
            damage: 0,
            damageInterval: 1000
        }
    },

    // ── Layer configuration ─────────────────────────────────────────────
    layers: {
        characters: {
            name: 'Creatures',
            depth: 10
        }
    },

    // ── Helper to get a random enemy from a difficulty tier ─────────────
    helpers: {
        getBasicEnemy: function() {
            const basic = [
                TinyCreaturesTileConfig.enemies.frog,
                TinyCreaturesTileConfig.enemies.crab,
                TinyCreaturesTileConfig.enemies.slime,
                TinyCreaturesTileConfig.enemies.ghost,
                TinyCreaturesTileConfig.enemies.bat,
                TinyCreaturesTileConfig.enemies.mushroom
            ];
            return basic[Math.floor(Math.random() * basic.length)];
        },
        getMediumEnemy: function() {
            const medium = [
                TinyCreaturesTileConfig.enemies.spider,
                TinyCreaturesTileConfig.enemies.snake,
                TinyCreaturesTileConfig.enemies.iceCreature,
                TinyCreaturesTileConfig.enemies.beetle,
                TinyCreaturesTileConfig.enemies.scorpion,
                TinyCreaturesTileConfig.enemies.eyeball,
                TinyCreaturesTileConfig.enemies.plantMonster
            ];
            return medium[Math.floor(Math.random() * medium.length)];
        },
        getStrongEnemy: function() {
            const strong = [
                TinyCreaturesTileConfig.enemies.minotaur,
                TinyCreaturesTileConfig.enemies.demon,
                TinyCreaturesTileConfig.enemies.darkEye,
                TinyCreaturesTileConfig.enemies.dragon
            ];
            return strong[Math.floor(Math.random() * strong.length)];
        },
        // Get any creature tile index (0-179)
        isCreatureTile: function(tileIndex) {
            return tileIndex >= 0 && tileIndex < 180;
        }
    }
};

// Export for use in scenes
if (typeof window !== 'undefined') {
    window.TinyCreaturesTileConfig = TinyCreaturesTileConfig;
}
