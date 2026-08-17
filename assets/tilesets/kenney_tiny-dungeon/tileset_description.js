// Tiny Dungeon tileset description helpers
// Exposes a simple mapping on window.TINY_DUNGEON for use in map generation and rendering
// Tiny Dungeon tileset description helpers (hard-coded mapping)
// Exposes a simple mapping on window.TINY_DUNGEON for use in map generation and rendering
(function(){
    if (typeof window === 'undefined') return;
    window.TINY_DUNGEON = window.TINY_DUNGEON || {};

    // Key tile indices based on the project's TileManager descriptions and the
    // shipped Tiny Dungeon tileset (tiles are present under the Tiles/ folder
    // as tile_0000.png .. tile_0131.png).
    // These values are intentionally explicit so map generation doesn't rely on
    // a separate generated file at runtime.
    window.TINY_DUNGEON.FLOOR_VARIANTS = [36, 37, 38]; // light stone/cracked/plain variants
    window.TINY_DUNGEON.BASE_FLOOR = 51; // sand / light dirt floor

    window.TINY_DUNGEON.WALL = {
        TOP_LEFT: 0,
        TOP: 1,
        TOP_RIGHT: 2,
        TOP_T: 3,
        TOP_END_RIGHT: 4,
        TOP_END_LEFT: 5,
        TOP_DECOR: 6,
        TOP_SINGLE: 7,
        TOP_DETAILED: 8,
        TOP_PILLAR_LEFT: 9,
        TOP_PILLAR_RIGHT: 10,
        TOP_ARCH: 11,
        LEFT: 12,
        CENTER: 13,
        CENTER_BANNER: 14,
        RIGHT: 15,
        CENTER_WINDOW: 16,
        CENTER_PLAIN: 17,
        CENTER_SHIELD: 18,
        CENTER_DETAILED: 19,
        PILLAR_MID_LEFT: 20,
        PILLAR_MID_RIGHT: 21,
        ARCH_MID_LEFT: 22,
        ARCH_MID_RIGHT: 23,
        BOTTOM_LEFT: 24,
        BOTTOM_BASE_LEFT: 34,
        BOTTOM_BASE_RIGHT: 35,
        BOTTOM: 27,
        BOTTOM_RIGHT: 26
    };

    window.TINY_DUNGEON.DOOR = {
        VERTICAL: 60,
        HORIZONTAL: 61,
        METAL_GATE: 62
    };

    window.TINY_DUNGEON.PROPS = {
        BARREL: 57,
        CRATE: 58,
        CHEST_CLOSED: 59,
        CHEST_OPEN: 65,
        CRATE_STACK: 64,
        BARREL_SIDE: 63
    };

    window.TINY_DUNGEON.ENTITY = {
        KNIGHT: 72,
        ARCHER: 73,
        FEMALE_WARRIOR: 74,
        CIVILIAN_MAGE: 75,
        NOBLE: 76,
        MERCHANT: 77,
        GUARD: 78,
        HOODED: 79,
        CIVILIAN_FEMALE: 80,
        CHILD: 81,
        CIVILIAN_MALE: 82,
        DARK_KNIGHT: 83,
        PLAYER_WIZARD: 84,
        ALT_HERO_1: 85,
        ALT_HERO_2: 86,
        ALT_HERO_3: 87
    };

})();
