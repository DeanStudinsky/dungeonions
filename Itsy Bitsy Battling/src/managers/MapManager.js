// MapManager - Handles tilemap creation and management
class MapManager {
    constructor(scene) {
        this.scene = scene;
        this.map = null;
        this.tileset = null;
        this.layers = {};
        this.waterTiles = []; // Track water tile positions for crab spawning
        this.waterTilePositions = []; // Track water tile grid positions for animation
        this.waterAnimationTimer = 0;
        this.waterAnimationIndex = 0;
        this.groundSprites = []; // Track custom ground tile sprites
    }

    createMap(width = 32, height = 20, customMapData = null) {
        const tileSize = 16;

        // Create blank tilemap
        this.map = this.scene.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: width,
            height: height
        });

        // Add tilesets (both tiny dungeon and roguelike)
        const tinyDungeonTileset = this.map.addTilesetImage('dungeon_tiles', 'dungeon_tiles', 16, 16, 1, 1);
        const roguelikeTileset = this.map.addTilesetImage('roguelike_tiles', 'roguelike_tiles', 16, 16, 0, 0);

        // Create layers
        this.layers.ground = this.map.createBlankLayer('Ground', [tinyDungeonTileset, roguelikeTileset]);
        this.layers.water = this.map.createBlankLayer('Water', [tinyDungeonTileset, roguelikeTileset]);
        this.layers.walls = this.map.createBlankLayer('Walls', [tinyDungeonTileset, roguelikeTileset]);
        this.layers.objects = this.map.createBlankLayer('Objects', [tinyDungeonTileset, roguelikeTileset]);

        // Set layer depths
        this.layers.ground.setDepth(0);
        this.layers.water.setDepth(0.5);
        this.layers.walls.setDepth(1);
        this.layers.objects.setDepth(2);

        // Check if custom map data provided
        if (customMapData) {
            console.log('📜 Loading custom map');
            this.loadCustomMap(customMapData);
        } else {
            // Fill ground with varied dirt tiles for better look
            this.fillGroundWithVariety(width, height);

            // Create default dungeon layout with rooms and corridors
            this.createDefaultDungeon(width, height);
        }

        // Set collision
        this.layers.walls.setCollisionByExclusion([-1]); // All tiles collide except empty
        this.layers.objects.setCollisionByExclusion([-1]);

        return this.map;
    }

    loadCustomMap(mapData) {
        // Clear water tile tracking
        this.waterTiles = [];
        this.waterTilePositions = [];

        // Load each layer from custom map data
        mapData.layers.ground.forEach(tile => {
            this.layers.ground.putTileAt(tile.index, tile.x, tile.y);
        });

        mapData.layers.water.forEach(tile => {
            this.layers.water.putTileAt(tile.index, tile.x, tile.y);

            // Track water tiles for spawning and animation
            this.waterTiles.push({
                x: tile.x * 16 + 8,
                y: tile.y * 16 + 8
            });
            this.waterTilePositions.push({
                tileX: tile.x,
                tileY: tile.y
            });
        });

        mapData.layers.walls.forEach(tile => {
            this.layers.walls.putTileAt(tile.index, tile.x, tile.y);
        });

        mapData.layers.objects.forEach(tile => {
            this.layers.objects.putTileAt(tile.index, tile.x, tile.y);
        });

        console.log(`✅ Custom map loaded (${mapData.width}x${mapData.height})`);
        console.log(`🌊 Water tiles: ${this.waterTiles.length}`);
    }

    fillGroundWithVariety(width, height) {
        // MATCHED TO P5.JS VERSION: Use tile 51 (Sand/Light Dirt Floor) as base
        // p5.js fills entire map with tile 51 first in loadDefaultMap()

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Use tile 51 (Sand/Light Dirt Floor) - same as p5.js default
                this.layers.ground.putTileAt(51, x, y);
            }
        }

        console.log(`✅ Filled ground with tile 51 (Sand/Light Dirt Floor) - matches p5.js`);
    }

    // Calculate Zipf distribution weights
    calculateZipfWeights(n, s = 1.5) {
        const weights = [];
        let sum = 0;

        // Calculate raw weights: 1/k^s
        for (let k = 1; k <= n; k++) {
            const weight = 1 / Math.pow(k, s);
            weights.push(weight);
            sum += weight;
        }

        // Normalize to probabilities
        return weights.map(w => w / sum);
    }

    // Select index based on Zipf distribution with noise influence
    selectFromZipf(weights, noise) {
        // Add noise influence to create natural variation
        const rand = (Math.random() * 0.7 + noise * 0.3);
        let cumulative = 0;

        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
                return i;
            }
        }

        return weights.length - 1;
    }

    // Simple noise function for natural clustering
    simpleNoise(x, y) {
        // Pseudo-random noise based on position
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return (n - Math.floor(n));
    }

    createDefaultDungeon(width, height) {
        // Create a cleaner, more open dungeon layout (don't fill everything with walls!)

        // 1. Create border walls only
        this.createBorderWalls(width, height);

        // 2. Define room areas (x, y, width, height)
        const rooms = [
            // Center starting room
            { x: Math.floor(width/2) - 6, y: Math.floor(height/2) - 4, w: 12, h: 8, isSpawn: true },
            // Top-left room
            { x: 5, y: 4, w: 8, h: 6 },
            // Top-right room
            { x: width - 13, y: 4, w: 8, h: 6 },
            // Bottom-left room
            { x: 5, y: height - 10, w: 8, h: 6 },
            // Bottom-right room (with water pool)
            { x: width - 13, y: height - 10, w: 8, h: 6, hasWater: true }
        ];

        // 3. Place walls AROUND rooms (not filling entire map)
        rooms.forEach(room => this.createRoomWalls(room));

        // 4. Place objects in rooms
        this.placeObjectsInRoom(rooms[1]); // Top-left
        this.placeObjectsInRoom(rooms[2]); // Top-right
        this.placeObjectsInRoom(rooms[3]); // Bottom-left

        // 5. Create water pool in bottom-right room
        this.createWaterPoolInRoom(rooms[4]);

        // 6. Add some scattered decorative objects in open areas
        this.placeScatteredObjects(width, height, rooms);

        console.log('🏰 Default dungeon layout created');
    }

    createRoomWalls(room) {
        const { x, y, w, h } = room;

        // Create walls AROUND the room perimeter only
        // MATCHED TO P5.JS: walls.top = [0, 1, 2], walls.middle = [12, 13, 14, 15]

        // Top wall - use tile 1 (Stone Wall Top)
        for (let rx = x; rx < x + w; rx++) {
            this.layers.walls.putTileAt(1, rx, y);
        }
        // Bottom wall - use tile 13 (Stone Wall Center)
        for (let rx = x; rx < x + w; rx++) {
            this.layers.walls.putTileAt(13, rx, y + h - 1);
        }
        // Left wall - use tile 12 (Stone Wall Left Side)
        for (let ry = y + 1; ry < y + h - 1; ry++) {
            this.layers.walls.putTileAt(12, x, ry);
        }
        // Right wall - use tile 15 (Stone Wall Right Side)
        for (let ry = y + 1; ry < y + h - 1; ry++) {
            this.layers.walls.putTileAt(15, x + w - 1, ry);
        }

        // Corners: 0=top-left, 2=top-right, 12=bottom-left, 15=bottom-right
        this.layers.walls.putTileAt(0, x, y);                    // Top-left corner
        this.layers.walls.putTileAt(2, x + w - 1, y);           // Top-right corner
        this.layers.walls.putTileAt(12, x, y + h - 1);          // Bottom-left
        this.layers.walls.putTileAt(15, x + w - 1, y + h - 1);  // Bottom-right

        // Create doorways (remove 2 tiles from one wall for entry)
        const doorX = x + Math.floor(w / 2);
        const doorY = y + Math.floor(h / 2);

        // Random door position (top, bottom, left, or right)
        const doorSide = Phaser.Math.Between(0, 3);
        if (doorSide === 0) { // Top
            this.layers.walls.removeTileAt(doorX, y);
            this.layers.walls.removeTileAt(doorX + 1, y);
        } else if (doorSide === 1) { // Bottom
            this.layers.walls.removeTileAt(doorX, y + h - 1);
            this.layers.walls.removeTileAt(doorX + 1, y + h - 1);
        } else if (doorSide === 2) { // Left
            this.layers.walls.removeTileAt(x, doorY);
            this.layers.walls.removeTileAt(x, doorY + 1);
        } else { // Right
            this.layers.walls.removeTileAt(x + w - 1, doorY);
            this.layers.walls.removeTileAt(x + w - 1, doorY + 1);
        }
    }

    placeScatteredObjects(width, height, rooms) {
        // Place some random barrels/crates in open areas (not inside rooms)
        const numObjects = Phaser.Math.Between(8, 15);

        for (let i = 0; i < numObjects; i++) {
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 50) {
                const x = Phaser.Math.Between(3, width - 4);
                const y = Phaser.Math.Between(3, height - 4);

                // Check if position is inside any room
                const insideRoom = rooms.some(room =>
                    x >= room.x && x < room.x + room.w &&
                    y >= room.y && y < room.y + room.h
                );

                // Check if there's already something here
                const hasObject = this.layers.objects.getTileAt(x, y);
                const hasWall = this.layers.walls.getTileAt(x, y);

                if (!insideRoom && !hasObject && !hasWall) {
                    // MATCHED TO P5.JS: barrel=57, crate=58
                    const objectTypes = [57, 58];
                    const randomObject = Phaser.Math.RND.pick(objectTypes);
                    this.layers.objects.putTileAt(randomObject, x, y);
                    placed = true;
                }

                attempts++;
            }
        }
    }

    placeObjectsInRoom(room) {
        const { x, y, w, h } = room;

        // Place 2-3 random objects in the room
        const numObjects = Phaser.Math.Between(2, 3);

        for (let i = 0; i < numObjects; i++) {
            // Random position inside room (not on walls)
            const objX = x + Phaser.Math.Between(1, w - 2);
            const objY = y + Phaser.Math.Between(1, h - 2);

            // Random object type - MATCHED TO P5.JS: barrel=57, crate=58, chest=59
            const objectTypes = [57, 58, 59];
            const randomObject = Phaser.Math.RND.pick(objectTypes);

            // Only place if no object already there
            if (!this.layers.objects.getTileAt(objX, objY)) {
                this.layers.objects.putTileAt(randomObject, objX, objY);
            }
        }
    }

    createWaterPoolInRoom(room) {
        const { x, y, w, h } = room;
        const waterTiles = TileConfig.water.pool;

        // Create water pool in the center of the room
        const poolWidth = Math.min(4, w - 2);
        const poolHeight = Math.min(3, h - 2);
        const poolX = x + Math.floor((w - poolWidth) / 2);
        const poolY = y + Math.floor((h - poolHeight) / 2);

        this.waterTiles = []; // Reset water tile positions
        this.waterTilePositions = []; // Reset grid positions

        for (let py = 0; py < poolHeight; py++) {
            for (let px = 0; px < poolWidth; px++) {
                const tileX = poolX + px;
                const tileY = poolY + py;

                // Pick a random water tile variant
                const randomTile = Phaser.Math.RND.pick(waterTiles);
                this.layers.water.putTileAt(randomTile, tileX, tileY);

                // Store water tile world positions for spawning
                this.waterTiles.push({
                    x: tileX * 16 + 8, // Center of tile
                    y: tileY * 16 + 8
                });

                // Store grid positions for animation
                this.waterTilePositions.push({
                    tileX: tileX,
                    tileY: tileY
                });
            }
        }

        console.log(`🌊 Created water pool with ${this.waterTiles.length} tiles`);
    }

    createBorderWalls(width, height) {
        // MATCHED TO P5.JS VERSION
        // Top wall - tile 1
        for (let x = 0; x < width; x++) {
            this.layers.walls.putTileAt(1, x, 0);
        }
        // Bottom wall - tile 13
        for (let x = 0; x < width; x++) {
            this.layers.walls.putTileAt(13, x, height - 1);
        }
        // Left wall - tile 12
        for (let y = 1; y < height - 1; y++) {
            this.layers.walls.putTileAt(12, 0, y);
        }
        // Right wall - tile 15
        for (let y = 1; y < height - 1; y++) {
            this.layers.walls.putTileAt(15, width - 1, y);
        }

        // Corners: 0=top-left, 2=top-right, 12=bottom-left, 15=bottom-right
        this.layers.walls.putTileAt(0, 0, 0);
        this.layers.walls.putTileAt(2, width - 1, 0);
        this.layers.walls.putTileAt(12, 0, height - 1);
        this.layers.walls.putTileAt(15, width - 1, height - 1);
    }

    update(delta) {
        // Animate water tiles
        if (this.waterTilePositions.length > 0) {
            this.waterAnimationTimer += delta;

            // Update water animation every 400ms
            if (this.waterAnimationTimer >= 400) {
                this.waterAnimationTimer = 0;
                this.waterAnimationIndex = (this.waterAnimationIndex + 1) % TileConfig.water.pool.length;

                // Update all water tiles to the current animation frame
                this.waterTilePositions.forEach(pos => {
                    const tileIndex = TileConfig.water.pool[this.waterAnimationIndex];
                    this.layers.water.putTileAt(tileIndex, pos.tileX, pos.tileY);
                });
            }
        }
    }

    getWallsLayer() {
        return this.layers.walls;
    }

    getObjectsLayer() {
        return this.layers.objects;
    }

    getGroundLayer() {
        return this.layers.ground;
    }

    getWaterLayer() {
        return this.layers.water;
    }

    // Get a random spawn point from water tiles
    getRandomWaterSpawnPoint() {
        if (this.waterTiles.length === 0) {
            return null;
        }
        return Phaser.Math.RND.pick(this.waterTiles);
    }

    // Get all water tile positions
    getWaterTiles() {
        return this.waterTiles;
    }
}

if (typeof window !== 'undefined') {
    window.MapManager = MapManager;
}
