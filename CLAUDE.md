# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dangerous Dungeonions** is a roguelike dungeon crawler featuring procedural generation, multiple character classes, and an in-game map editor. The repository contains multiple versions representing different stages of development and migration between frameworks.

## Repository Structure

This repository contains multiple versions of the game at different stages of development:

### ⭐ **Itsy Bitsy Battling/DangerousDungeonions-Phaser/** (CURRENT ACTIVE VERSION)
**Main development branch - Phaser 3 implementation with corrected tile mappings**

- **Framework**: Phaser 3.70.0
- **Status**: Active development, tile system FIXED (Dec 31, 2025)
- **Features**:
  - ✅ Correct tile rendering (tile indices matched to p5.js version)
  - ✅ All 4 character classes with correct sprites (Wizard, Paladin, Knight, Archer)
  - ✅ Proper tilemap using `tilemap.png` (12×11 grid, 16×16 tiles, 1px spacing)
  - ✅ Multi-layer map system (ground, water, walls, objects)
  - ✅ Character sprites: Wizard(84), Paladin(82), Knight(97), Archer(85-green hood)
  - ⚠️ In progress: Enemy AI, healthbar, map editor, points system
- **Documentation**: See `DangerousDungeonions-Phaser/ASSETS.md` for complete asset reference
- **Tilemap**: Uses exact p5.js tilemap from `old-p5-version/tilemap.png`

### **Itsy Bitsy Battling/public/old-p5-version/** (Reference Implementation)
**Original working version - use as reference for feature implementation**

- **Framework**: p5.js + vanilla JavaScript
- **Status**: Feature-complete, reference only (no longer active development)
- **All features working**: 4 character classes, healthbar, map editor, tile layers, occlusion, points/leveling
- Proper tile rendering with multiple layers and correct sizing
- Canvas-based rendering with manual tile extraction and rendering
- **Use this as reference** when implementing features in Phaser version

### **Itsy Bitsy Battling/public/** (Legacy - Deprecated)
- Old Phaser 3 attempt with incorrect tile mappings
- **DO NOT USE** - superseded by `DangerousDungeonions-Phaser/`

### **Other Legacy Directories**
- **`Dangerous Dungeonions Revamped/`** - Early attempt, incomplete
- **`Dangerous Dungeonions Refactored/`** - Abandoned
- **`Itsy Bitsy Battling/public/dangerous-dungeonions/`** - Earlier experiment

## Current Development Focus

**👉 ACTIVE REPOSITORY:** `Itsy Bitsy Battling/DangerousDungeonions-Phaser/`
**👉 REFERENCE FOR FEATURES:** `Itsy Bitsy Battling/public/old-p5-version/`

## Phaser Version Architecture (Current Active)

### Directory Structure
```
DangerousDungeonions-Phaser/
├── index.html              # Main entry point
├── ASSETS.md              # ⭐ Complete asset reference for tile atlas
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
├── assets/
│   ├── tilesets/
│   │   └── kenney_tiny-dungeon/
│   │       └── Tilemap/
│   │           └── tilemap.png  # ⭐ PRIMARY TILEMAP (12×11, 16×16, 1px spacing)
│   ├── healthbar_01.png - healthbar_07.png
│   └── audio/
│       └── click_001.ogg
├── src/
│   ├── config/
│   │   ├── TileConfig.js         # ⭐ Tile indices (MATCHED TO P5.JS)
│   │   ├── RoguelikeTileConfig.js
│   │   ├── PlayerClassConfig.js  # Character stats and sprites
│   │   └── GameConfig.js
│   ├── entities/
│   │   ├── BasePlayer.js
│   │   ├── Wizard.js, Archer.js, Paladin.js, Knight.js
│   │   ├── Enemy.js
│   │   └── Projectile.js
│   ├── managers/
│   │   ├── MapManager.js         # Tilemap creation (FIXED tile indices)
│   │   ├── WaveManager.js
│   │   └── ScoreManager.js
│   ├── scenes/
│   │   ├── BootScene.js          # Asset loading
│   │   ├── MenuScene.js
│   │   ├── MapEditorScene.js
│   │   ├── GameScene.js
│   │   └── UIScene.js
│   └── main.js
```

### Critical Asset Paths (for Tile Atlas)

**PRIMARY TILEMAP** (Currently in use):
- Path: `assets/tilesets/kenney_tiny-dungeon/Tilemap/tilemap.png`
- Copied from: `old-p5-version/tilemap.png`
- Grid: 12 columns × 11 rows = 132 tiles
- Tile Size: 16×16 pixels
- Spacing: 1px between tiles
- Margin: 1px around tileset

**Other Assets**:
- Health bars: `assets/healthbar_01.png` through `healthbar_07.png`
- Audio: `assets/audio/click_001.ogg`

See `DangerousDungeonions-Phaser/ASSETS.md` for complete tile index mappings.

## P5.js Reference Version (Feature Complete)

This p5.js version has all features working:
- ✅ All 4 character classes (Wizard, Paladin, Knight, Archer)
- ✅ Working healthbar with visual feedback
- ✅ Full map editor with tile palette, layers, and properties
- ✅ Proper tile rendering layers (ground, walls, decorations, objects, special)
- ✅ Correct occlusion (entities above walls are properly hidden)
- ✅ Tiles sized properly (16x16) and interchangeable
- ✅ Points and leveling system with round progression
- ✅ Enemy spawning with pathfinding AI
- ✅ Character switching mid-game
- ✅ Main menu system
- ✅ Responsive canvas sizing

## Core Architecture (p5.js Functional Version)

### File Load Order (Critical)
```javascript
1. medievalRTS_atlas.js         // Tile atlas data
2. DungeOnionplayerclasses.js   // Player class definitions
3. DungeOniontilelogic.js       // Tile properties and collision
4. DungeOnionmapmanager.js      // Map loading, collision, pathfinding
5. DungeOnionenemies.js         // Enemy types and AI
6. DungeOnioninnerworking.js    // Core game managers
7. mainMenu.js                  // Menu system
8. gameInit.js                  // Initialization and mode switching
9. editorEngine.js              // Map editor engine
```

### Manager Classes (DungeOnioninnerworking.js)

**AtlasManager** - Tileset loading and tile extraction
- Extracts individual 16x16 tiles from spritesheet with 1px spacing
- Creates canvas for each tile (12 columns × 11 rows = 132 tiles)
- Handles placeholder generation if tileset fails to load

**InputManager** - Keyboard and mouse input handling
- Tracks WASD/arrow keys for movement
- Mouse click for shooting direction
- Integrates with canvas coordinate system

**Camera** - Viewport and camera positioning
- Smooth camera following player
- Constrains to map bounds
- Handles canvas-to-world coordinate conversion

**GameManager** - Main game loop coordinator
- Manages player, enemies, projectiles
- Handles collision detection
- Round/wave progression
- Score tracking
- Character class switching
- Render loop orchestration

**HealthBarManager** - Health bar rendering
- Loads health bar sprites
- Flash effect on damage
- Gradient fills based on health percentage

**ParticleManager** - Visual effects
- Death particles
- Hit effects
- Particle sampler loading

### Map System (DungeOnionmapmanager.js)

**MapManager** - Map data and collision
- Multi-layer tile storage: `gameMapData[row][col] = [tile1, tile2, ...]`
- Default dungeon map with encoded tile data (bitflags for flipping)
- Water border generation with animation
- Collision detection using TileManager properties
- A* pathfinding for enemy AI

**TileManager** (DungeOniontilelogic.js) - Tile properties
- Collision flags (COLLISION_NONE, COLLISION_PLAYER, COLLISION_MAGIC)
- Tile type definitions (floor, wall, water, door, etc.)
- Properties: passable, magicPassable, layer assignment

### Entity System

**Player** (DungeOnionplayerclasses.js)
- 4 classes with unique stats:
  - **Wizard**: High speed, low HP, rapid-fire potions
  - **Paladin**: Slow, high HP, powerful attacks
  - **Knight**: Balanced melee-range fighter
  - **Archer**: Fast, long-range charged shots
- Position, health, speed, projectile properties
- Facing direction for sprite flipping

**Enemy** (DungeOnionenemies.js)
- Enemy types (crab, etc.) with configurable stats
- Pathfinding with A* algorithm
- Smooth interpolated movement
- Knockback physics
- Health bars
- Hurt flash and death animations
- Attack cooldowns

### Map Editor Features

Full-featured tile editor with:
- **Tools**: Draw, Erase, Select, Pan
- **Tileset selection**: Multiple tilesets (Kenney Tiny Dungeon, Roguelike RPG, Medieval RTS)
- **Tile palette**: Visual tile picker with scrolling
- **Layers**: 5 layers (0-Ground, 1-Walls, 2-Decorations, 3-Objects, 4-Special)
- **Tile properties**: Type, passability, spawn points, barrier costs
- **Map operations**: New, Save, Load (JSON format), Test in-game
- **Camera controls**: Pan with WASD, Zoom with Q/E
- **Grid and snap**: Toggle-able grid and snap-to-grid

### Tile Data Format

Map data structure:
```javascript
gameMapData[row][col] = [tileIndex1, tileIndex2, ...] // Multiple layers per cell
```

Tile properties (per tile index):
```javascript
{
  collisionType: COLLISION_PLAYER,  // Player collision flag
  magicPassable: true,              // Can projectiles pass?
  tileType: 'wall',                 // Semantic type
  layer: 1,                         // Render layer (0-4)
  barrierCost: 500                  // For purchasable barriers
}
```

## Current Phaser Implementation Issues

The Phaser version at `Itsy Bitsy Battling/public/` has several problems:

1. **Tilemaps not working** - Phaser tilemap rendering is broken or misconfigured
2. **Missing map editor** - No equivalent to the p5.js editor
3. **Incomplete character classes** - Not all 4 classes functional
4. **No healthbar** - UI systems incomplete
5. **Broken tile sizing** - Tiles not sized/rendered correctly
6. **Layer occlusion issues** - Depth sorting not working properly
7. **No points/leveling** - Progression systems missing

### Phaser Structure (Current Attempt)

```
Itsy Bitsy Battling/public/
├── src/
│   ├── config/
│   │   ├── TileConfig.js          // Tile definitions
│   │   ├── RoguelikeTileConfig.js // Roguelike tileset
│   │   └── GameConfig.js          // Phaser configuration
│   ├── entities/
│   │   ├── BasePlayer.js          // Player base class
│   │   ├── Wizard.js, Archer.js, Paladin.js, Knight.js
│   │   ├── Enemy.js
│   │   └── Projectile.js
│   ├── managers/
│   │   ├── MapManager.js          // Map generation
│   │   ├── WaveManager.js         // Enemy waves
│   │   └── ScoreManager.js        // Scoring
│   ├── scenes/
│   │   ├── BootScene.js           // Asset loading
│   │   ├── MenuScene.js           // Main menu
│   │   ├── MapEditorScene.js      // Map editor (incomplete)
│   │   ├── GameScene.js           // Main gameplay
│   │   └── UIScene.js             // HUD overlay
│   └── main.js                    // Bootstrap
├── assets/
│   ├── tilesets/                  // Kenney tilesets
│   ├── ground-tiles/              // Custom 16x16 tiles
│   └── audio/                     // Sound effects
└── index.html
```

## Development Commands

### Itsy Bitsy Battling (Current Version)

```bash
# Development server
npx http-server public -p 8080

# Or use Python
cd "Itsy Bitsy Battling/public"
python -m http.server 8000

# Build sync script (syncs files)
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Old p5.js Version (Most Functional)

```bash
# Serve the old p5.js version
npx http-server "Itsy Bitsy Battling/public/old-p5-version" -p 8080

# Or Python
cd "Itsy Bitsy Battling/public/old-p5-version"
python -m http.server 8000
```

### Dangerous Dungeonions Revamped

```bash
# Development server
npm run serve
# Opens on http://localhost:8081
```

## Migration Strategy: p5.js → Phaser 3

When migrating features from `old-p5-version` to the Phaser implementation:

### 1. Tile System Migration
- **p5.js approach**: Manual tile extraction via canvas, stored in `AtlasManager.tiles`
- **Phaser approach**: Use `this.load.spritesheet()` in BootScene with proper config:
  ```javascript
  this.load.spritesheet('tileset', 'path', {
    frameWidth: 16,
    frameHeight: 16,
    spacing: 1  // Important: 1px spacing in Kenney tilesets
  });
  ```

### 2. Layer System Migration
- **p5.js approach**: Manual Z-ordering, render layers in order 0→4
- **Phaser approach**: Use `tilemap.createLayer()` for each layer, set depth:
  ```javascript
  groundLayer.setDepth(0);
  wallLayer.setDepth(1);
  wallLayer.setCollisionByProperty({ collides: true });
  ```

### 3. Camera System Migration
- **p5.js approach**: Manual camera class with offset calculations
- **Phaser approach**: Use built-in camera:
  ```javascript
  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
  ```

### 4. Player Class System Migration
- **p5.js approach**: Single `Player` class + `playerClasses` config object
- **Phaser approach**: Base class + subclasses extending `Phaser.Physics.Arcade.Sprite`:
  ```javascript
  class BasePlayer extends Phaser.Physics.Arcade.Sprite { /* shared */ }
  class Wizard extends BasePlayer { /* wizard specific */ }
  ```

### 5. Collision Detection Migration
- **p5.js approach**: Manual tile property checks in `MapManager`
- **Phaser approach**: Use `this.physics.add.collider()` with tilemap layers

### 6. Rendering Order (Occlusion)
- **p5.js approach**: Manual sorting by Y position + layer
- **Phaser approach**: Set sprite depth dynamically:
  ```javascript
  // In update loop
  this.setDepth(1000 + this.y);
  ```

### 7. Map Editor Migration
The p5.js map editor (`editorEngine.js`) has extensive UI:
- Consider creating separate `MapEditorScene` in Phaser
- Reuse tile palette HTML/CSS approach
- Store map data in same JSON format for compatibility

## Tile Assets

All versions use **Kenney assets** (CC0 license):
- **Tiny Dungeon**: 12×11 tileset, 16×16 tiles, 1px spacing
- **Roguelike RPG**: 57×31 tileset, 16×16 tiles, no spacing
- Located in `Itsy Bitsy Battling/public/assets/tilesets/`

Custom ground tiles (5 PNGs) in `assets/ground-tiles/` use Zipf distribution for natural variation.

## Key Implementation Notes

### Tile Rendering Best Practices
1. **Always** respect 1px spacing in Kenney Tiny Dungeon tileset
2. Use 16×16 tile size throughout
3. Store tiles in multi-layer arrays: `map[row][col] = [tile1, tile2, ...]`
4. Render layers in order: ground (0) → walls (1) → decorations (2) → objects (3) → special (4)
5. Apply sprite depth based on Y position for proper occlusion

### Collision System
- Use `TileManager` property system for fine-grained control
- Separate flags for player collision vs magic/projectile collision
- Water tiles block player but not magic
- Walls block both

### Character Balance
Based on `playerClasses` config:
- **Wizard**: Glass cannon (HP 100, Speed 120, Fire rate 200ms)
- **Paladin**: Tank (HP 150, Speed 90, Fire rate 320ms, high damage)
- **Knight**: Balanced (HP 140, Speed 110, melee-range)
- **Archer**: Sniper (HP 90, Speed 115, Fire rate 450ms, highest damage)

### Map Format
When saving/loading maps, use this structure:
```json
{
  "width": 32,
  "height": 20,
  "layers": {
    "ground": [{ "x": 0, "y": 0, "index": 51 }, ...],
    "walls": [...],
    "decorations": [...],
    "objects": [...],
    "special": [...]
  },
  "spawnPoints": [
    { "x": 26, "y": 18, "type": "player" }
  ]
}
```

## Firebase Deployment

The game is deployed via Firebase Hosting:
- Config: `Itsy Bitsy Battling/firebase.json`
- Public directory: `public/`
- Deploy: `firebase deploy --only hosting`
- Service worker disabled during development (enabled in production for PWA)

## Testing Locally

Always test with a local server (not file://):
```bash
# Recommended
npx http-server public -p 8080 -c-1  # -c-1 disables caching

# View at
http://localhost:8080
```

Use hard refresh (Ctrl+Shift+R) if assets are cached.

## Character Class Switching

The p5.js version supports mid-game class switching:
- Press `C` to open character sidebar
- Click character portrait to switch
- Player health, position maintained across switches
- Called via `GameManager.switchPlayerClass(className)`

## Common Development Tasks

### To add a new character class:
1. Add to `playerClasses` object with stats
2. Create sprite tile index mapping
3. Update character sidebar HTML
4. Test balance against enemy types

### To add a new tile type:
1. Add tile index to `TileManager.getProperties()`
2. Set collision flags and layer
3. Update map editor tile palette
4. Add to relevant tilesets

### To add a new enemy type:
1. Add to `enemyTypes` object with stats
2. Create AI behavior in `Enemy.update()`
3. Add spawn logic in `GameManager`
4. Balance health/damage/speed

### To modify map:
1. Switch to "Editor Mode" button in-game
2. Select tileset and tiles from palette
3. Paint on canvas
4. Set tile properties in right sidebar
5. Save map to JSON
6. Load in game mode to test

## Known Issues & Workarounds

### Phaser Tilemap Issues (Current)
- **Problem**: Tilemaps not rendering correctly in current Phaser version
- **Workaround**: Reference `old-p5-version` for correct tile extraction logic
- **Fix**: Ensure spritesheet loader uses correct spacing (1px for Tiny Dungeon)

### Service Worker Caching
- **Problem**: Changes not appearing during development
- **Workaround**: Service worker unregistered in `main.js`, use hard refresh
- **Fix**: Only enable service worker for production builds

### Canvas Responsiveness
- **Problem**: Canvas sizing on mobile
- **Workaround**: p5.js version has `calculateCanvasDimensions()` with constraints
- **Fix**: Phaser uses `scale.FIT` mode with min/max bounds

## Next Steps for Phaser Migration

To complete the Phaser migration and reach feature parity with `old-p5-version`:

1. **Fix tilemap rendering** - Debug spritesheet loading, ensure 1px spacing configured
2. **Implement multi-layer tilemap system** - 5 layers with proper depth sorting
3. **Port all 4 character classes** - Ensure stats match `playerClasses` config
4. **Add healthbar system** - Use DOM overlay or Phaser UI elements
5. **Implement points/leveling** - Port round progression from `GameManager`
6. **Create map editor scene** - Replicate `editorEngine.js` functionality
7. **Add character switching** - Mid-game class change support
8. **Fix depth/occlusion** - Entities should be hidden behind walls

Refer to `old-p5-version` as the source of truth for each feature's implementation.
