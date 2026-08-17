// MapEditorScene - In-game tile map editor with JSON import/export
class MapEditorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapEditorScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Map dimensions (in tiles)
        this.mapWidth = 40;
        this.mapHeight = 30;
        this.tileSize = 16;

        // Current selected tile
        this.selectedTileType = 'floor';
        this.selectedTileIndex = TileConfig.floors.default;
        this.selectedTexture = 'dungeon_tiles';

        // Editor state
        this.isPainting = false;
        this.isErasing = false;

        // Create tilemap
        this.map = this.make.tilemap({
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
            width: this.mapWidth,
            height: this.mapHeight
        });

        // Add tilesets (both tiny dungeon and roguelike)
        const tinyDungeonTileset = this.map.addTilesetImage('dungeon_tiles', 'dungeon_tiles', 16, 16, 1, 1);
        const roguelikeTileset = this.map.addTilesetImage('roguelike_tiles', 'roguelike_tiles', 16, 16, 0, 0);

        // Create layers
        this.groundLayer = this.map.createBlankLayer('Ground', [tinyDungeonTileset, roguelikeTileset]);
        this.waterLayer = this.map.createBlankLayer('Water', [tinyDungeonTileset, roguelikeTileset]);
        this.wallLayer = this.map.createBlankLayer('Walls', [tinyDungeonTileset, roguelikeTileset]);
        this.objectLayer = this.map.createBlankLayer('Objects', [tinyDungeonTileset, roguelikeTileset]);

        // Set layer depths
        this.groundLayer.setDepth(0);
        this.waterLayer.setDepth(0.5);
        this.wallLayer.setDepth(1);
        this.objectLayer.setDepth(2);

        // Fill with default floor
        this.groundLayer.fill(TileConfig.floors.default);

        // Camera controls
        this.cameras.main.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);
        this.cameras.main.setZoom(2);

        const cursors = this.input.keyboard.createCursorKeys();
        const wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 0.5
        });

        // Mouse controls for tile placement
        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 0) {
                this.isPainting = true;
                this.placeTile(pointer);
            } else if (pointer.button === 2) {
                this.isErasing = true;
                this.eraseTile(pointer);
            }
        });

        this.input.on('pointerup', () => {
            this.isPainting = false;
            this.isErasing = false;
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isPainting) {
                this.placeTile(pointer);
            } else if (this.isErasing) {
                this.eraseTile(pointer);
            }
        });

        // Disable right-click context menu
        this.input.mouse.disableContextMenu();

        // Create UI
        this.createUI();

        // Keyboard shortcuts
        this.createKeyboardShortcuts();

        console.log('✏️ Map Editor loaded');
        console.log('Controls: Arrow keys or WASD to pan, Q/E to zoom');
        console.log('Left click to place tiles, Right click to erase');
    }

    update(time, delta) {
        this.controls.update(delta);
    }

    createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // UI Camera (fixed to screen)
        const uiCamera = this.cameras.add(0, 0, width, height);
        uiCamera.setScroll(0, 0);

        // Background panel
        const panel = this.add.rectangle(10, 10, 200, height - 20, 0x000000, 0.8);
        panel.setOrigin(0, 0);
        panel.setScrollFactor(0);
        panel.setDepth(1000);

        // Title
        const title = this.add.text(20, 20, 'Map Editor', {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#ffffff'
        });
        title.setScrollFactor(0);
        title.setDepth(1001);

        // Tile palette
        let yPos = 60;
        const tileTypes = [
            { name: 'Floor', type: 'floor', texture: 'dungeon_tiles', index: TileConfig.floors.default },
            { name: 'Wall', type: 'wall', texture: 'dungeon_tiles', index: TileConfig.walls.default },
            { name: 'Water', type: 'water', texture: 'dungeon_tiles', index: TileConfig.water.default },
            { name: 'Barrel', type: 'object', texture: 'dungeon_tiles', index: 78 },
            { name: 'Crate', type: 'object', texture: 'dungeon_tiles', index: 79 },
            { name: 'Chest', type: 'object', texture: 'dungeon_tiles', index: 80 },
            { name: 'RG Floor', type: 'floor', texture: 'roguelike_tiles', index: RoguelikeTileConfig.floors.default },
            { name: 'RG Water', type: 'water', texture: 'roguelike_tiles', index: RoguelikeTileConfig.water.default },
            { name: 'RG Wall', type: 'wall', texture: 'roguelike_tiles', index: RoguelikeTileConfig.walls.default }
        ];

        tileTypes.forEach((tile, index) => {
            const button = this.add.rectangle(110, yPos, 180, 30, 0x333333, 1);
            button.setOrigin(0.5, 0.5);
            button.setScrollFactor(0);
            button.setDepth(1001);
            button.setInteractive({ useHandCursor: true });

            const text = this.add.text(30, yPos, tile.name, {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#ffffff'
            });
            text.setOrigin(0, 0.5);
            text.setScrollFactor(0);
            text.setDepth(1002);

            // Tile preview
            const preview = this.add.sprite(170, yPos, tile.texture, tile.index);
            preview.setScrollFactor(0);
            preview.setDepth(1002);
            preview.setScale(1.5);

            button.on('pointerdown', () => {
                this.selectedTileType = tile.type;
                this.selectedTileIndex = tile.index;
                this.selectedTexture = tile.texture;
                console.log(`Selected: ${tile.name} (${tile.texture}:${tile.index})`);
            });

            button.on('pointerover', () => {
                button.setFillStyle(0x555555);
            });

            button.on('pointerout', () => {
                button.setFillStyle(0x333333);
            });

            yPos += 35;
        });

        // Action buttons
        yPos += 20;

        // Clear Map button
        const clearBtn = this.createButton(110, yPos, 'Clear Map', () => {
            this.clearMap();
        });
        yPos += 40;

        // Save to localStorage button
        const saveBtn = this.createButton(110, yPos, 'Save Map', () => {
            this.saveMap();
        });
        yPos += 40;

        // Load from localStorage button
        const loadBtn = this.createButton(110, yPos, 'Load Map', () => {
            this.loadMap();
        });
        yPos += 40;

        // Export JSON button
        const exportBtn = this.createButton(110, yPos, 'Export JSON', () => {
            this.exportMapJSON();
        });
        yPos += 40;

        // Import JSON button
        const importBtn = this.createButton(110, yPos, 'Import JSON', () => {
            this.importMapJSON();
        });
        yPos += 40;

        // Test Map button
        const testBtn = this.createButton(110, yPos, 'Test Map', () => {
            this.testMap();
        });
        yPos += 40;

        // Back to Menu button
        const backBtn = this.createButton(110, yPos, 'Back to Menu', () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 180, 30, 0x444444, 1);
        button.setOrigin(0.5, 0.5);
        button.setScrollFactor(0);
        button.setDepth(1001);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ffffff'
        });
        buttonText.setOrigin(0.5, 0.5);
        buttonText.setScrollFactor(0);
        buttonText.setDepth(1002);

        button.on('pointerdown', callback);

        button.on('pointerover', () => {
            button.setFillStyle(0x666666);
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x444444);
        });

        return button;
    }

    createKeyboardShortcuts() {
        // Number keys 1-9 for quick tile selection
        this.input.keyboard.on('keydown-ONE', () => {
            this.selectedTileType = 'floor';
            this.selectedTileIndex = TileConfig.floors.default;
            this.selectedTexture = 'dungeon_tiles';
        });

        this.input.keyboard.on('keydown-TWO', () => {
            this.selectedTileType = 'wall';
            this.selectedTileIndex = TileConfig.walls.default;
            this.selectedTexture = 'dungeon_tiles';
        });

        this.input.keyboard.on('keydown-THREE', () => {
            this.selectedTileType = 'water';
            this.selectedTileIndex = TileConfig.water.default;
            this.selectedTexture = 'dungeon_tiles';
        });

        // ESC to go back to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    placeTile(pointer) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const tileX = Math.floor(worldPoint.x / this.tileSize);
        const tileY = Math.floor(worldPoint.y / this.tileSize);

        if (tileX < 0 || tileX >= this.mapWidth || tileY < 0 || tileY >= this.mapHeight) {
            return;
        }

        // Determine which layer to place on
        let layer = this.groundLayer;
        if (this.selectedTileType === 'wall') {
            layer = this.wallLayer;
        } else if (this.selectedTileType === 'water') {
            layer = this.waterLayer;
        } else if (this.selectedTileType === 'object') {
            layer = this.objectLayer;
        }

        // Place tile - layer already supports both tilesets
        layer.putTileAt(this.selectedTileIndex, tileX, tileY);
    }

    eraseTile(pointer) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const tileX = Math.floor(worldPoint.x / this.tileSize);
        const tileY = Math.floor(worldPoint.y / this.tileSize);

        if (tileX < 0 || tileX >= this.mapWidth || tileY < 0 || tileY >= this.mapHeight) {
            return;
        }

        // Erase from all layers except ground
        this.waterLayer.removeTileAt(tileX, tileY);
        this.wallLayer.removeTileAt(tileX, tileY);
        this.objectLayer.removeTileAt(tileX, tileY);
    }

    clearMap() {
        // Clear all layers
        this.groundLayer.fill(TileConfig.floors.default);
        this.waterLayer.fill(-1);
        this.wallLayer.fill(-1);
        this.objectLayer.fill(-1);
        console.log('✨ Map cleared');
    }

    saveMap() {
        const mapData = this.serializeMap();
        localStorage.setItem('customMap', JSON.stringify(mapData));
        console.log('💾 Map saved to localStorage');
        alert('Map saved!');
    }

    loadMap() {
        const saved = localStorage.getItem('customMap');
        if (saved) {
            const mapData = JSON.parse(saved);
            this.deserializeMap(mapData);
            console.log('📂 Map loaded from localStorage');
            alert('Map loaded!');
        } else {
            alert('No saved map found');
        }
    }

    exportMapJSON() {
        const mapData = this.serializeMap();
        const json = JSON.stringify(mapData, null, 2);

        // Create download
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom-map.json';
        a.click();
        URL.revokeObjectURL(url);

        console.log('📤 Map exported as JSON');
        console.log(json);
    }

    importMapJSON() {
        const json = prompt('Paste your map JSON:');
        if (json) {
            try {
                const mapData = JSON.parse(json);
                this.deserializeMap(mapData);
                console.log('📥 Map imported from JSON');
                alert('Map imported successfully!');
            } catch (e) {
                console.error('Error importing map:', e);
                alert('Invalid JSON format');
            }
        }
    }

    serializeMap() {
        const mapData = {
            width: this.mapWidth,
            height: this.mapHeight,
            layers: {
                ground: [],
                water: [],
                walls: [],
                objects: []
            }
        };

        // Serialize each layer (only store non-empty tiles)
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const groundTile = this.groundLayer.getTileAt(x, y);
                if (groundTile) {
                    mapData.layers.ground.push({ x, y, index: groundTile.index });
                }

                const waterTile = this.waterLayer.getTileAt(x, y);
                if (waterTile) {
                    mapData.layers.water.push({ x, y, index: waterTile.index });
                }

                const wallTile = this.wallLayer.getTileAt(x, y);
                if (wallTile) {
                    mapData.layers.walls.push({ x, y, index: wallTile.index });
                }

                const objectTile = this.objectLayer.getTileAt(x, y);
                if (objectTile) {
                    mapData.layers.objects.push({ x, y, index: objectTile.index });
                }
            }
        }

        return mapData;
    }

    deserializeMap(mapData) {
        // Clear current map
        this.clearMap();

        // Load each layer
        mapData.layers.ground.forEach(tile => {
            this.groundLayer.putTileAt(tile.index, tile.x, tile.y);
        });

        mapData.layers.water.forEach(tile => {
            this.waterLayer.putTileAt(tile.index, tile.x, tile.y);
        });

        mapData.layers.walls.forEach(tile => {
            this.wallLayer.putTileAt(tile.index, tile.x, tile.y);
        });

        mapData.layers.objects.forEach(tile => {
            this.objectLayer.putTileAt(tile.index, tile.x, tile.y);
        });
    }

    testMap() {
        // Save current map to temporary storage
        const mapData = this.serializeMap();
        localStorage.setItem('testMap', JSON.stringify(mapData));

        // Start game with custom map
        console.log('🎮 Testing map...');
        this.scene.start('GameScene', { customMap: mapData, characterType: 'wizard' });
    }
}

if (typeof window !== 'undefined') {
    window.MapEditorScene = MapEditorScene;
}
