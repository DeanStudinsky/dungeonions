# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dangerous Dungeonions is a browser-based dungeon crawler game being rebuilt with **Phaser 3**. The game features multiple playable character classes, enemy AI, a tile-based map system, PWA support, and mobile controls.

**IMPORTANT - Active Codebase**: `public/src/` (Phaser 3 game - edit this)
**Legacy/Reference Code**: `src/` (old p5.js version being migrated to Phaser)

Any JavaScript files named "Dungeonion" or similar outside the Phaser structure are old code for reference only.

## Development Commands

```bash
# Serve the Phaser game locally
npx http-server public -p 8080

# Test locally before deployment
firebase serve

# Deploy to Firebase Hosting
firebase deploy

# Generate tileset mapping (legacy tool)
npm run generate-tiles
```

**NOTE**: `npm run dev` and `npm run build` are for the legacy p5.js version and should NOT be used for Phaser development.

## Code Architecture (Phaser 3)

### Entry Point
`public/index.html` loads Phaser 3 from CDN and includes all game scripts in dependency order.

### File Structure (`public/src/`)

```
public/src/
├── main.js              # Game bootstrap, Phaser init, PWA setup
├── config/
│   ├── GameConfig.js           # Phaser config (physics, scale, input, mobile)
│   ├── TileConfig.js           # Kenney Tiny Dungeon tile indices
│   └── RoguelikeTileConfig.js  # Kenney Roguelike tileset tile indices
├── scenes/
│   ├── BootScene.js      # Asset preloading (both tilesets)
│   ├── MenuScene.js      # Main menu with game/editor options
│   ├── GameScene.js      # Main gameplay loop
│   ├── UIScene.js        # HUD overlay (runs parallel to GameScene)
│   └── MapEditorScene.js # In-game tile editor with JSON import/export
├── entities/
│   ├── BasePlayer.js    # Shared player logic (health, XP, input)
│   ├── Wizard.js        # Fast, low-health ranged attacker
│   ├── Archer.js        # Charged shot specialist
│   ├── Paladin.js       # Tanky, slow, high damage
│   ├── Knight.js        # Melee sweep attacker
│   ├── Enemy.js         # Enemy AI and behavior
│   └── Projectile.js    # Projectile physics
└── managers/
    ├── MapManager.js    # Tilemap creation, Zipf ground tiles, layers
    ├── WaveManager.js   # Enemy spawning and wave logic
    └── ScoreManager.js  # Score tracking
```

### Key Architecture Patterns

#### 1. Scene Flow
Scenes load in sequence: `BootScene` → `MenuScene` → `GameScene` + `UIScene` (parallel) OR `MapEditorScene`

- **BootScene**: Preloads both tilesets (Tiny Dungeon + Roguelike), ground tiles, audio
- **MenuScene**: Two buttons: "Singleplayer" (starts game) or "Map Editor"
- **GameScene**: Main gameplay with physics, collisions, enemy spawning
- **UIScene**: Runs parallel to GameScene, displays HUD
- **MapEditorScene**: Standalone tile editor with camera controls, JSON save/load

#### 2. Multi-Tileset System
The game uses **two tilesets** that can be mixed freely:

**TileConfig.js** - Kenney Tiny Dungeon (12×11 grid, 16x16, 1px spacing):
```javascript
TileConfig.characters.wizard.tileIndex  // 96
TileConfig.enemies.crab                 // 108
TileConfig.floors.dirt                  // [25, 26, 37, 38]
TileConfig.projectiles.potion           // 120
```

**RoguelikeTileConfig.js** - Kenney Roguelike RPG (57×31 grid, 16x16, no spacing):
```javascript
RoguelikeTileConfig.floors.dirt         // [228, 229, 230, 231, ...]
RoguelikeTileConfig.walls.top           // [512, 513, 514, 515]
RoguelikeTileConfig.water.pool          // [0, 1, 2, 3, 57, 58, 59, 60]
```

Layers support both tilesets simultaneously via `addTilesetImage()` with an array of tilesets.

#### 3. Tilemap Layers
MapManager creates **four tilemap layers** plus **custom ground sprites**:

**Tilemap Layers** (created from tilesets):
- `ground` - Floor tiles from tileset (rarely used due to custom sprites, depth: 0)
- `water` - Animated water pools (depth: 0.5)
- `walls` - Dungeon walls (collision enabled, depth: 1)
- `objects` - Barrels, crates, chests (collision enabled, depth: 2)

**Custom Ground Sprites** (PNG images, not from tileset):
- 5 individual 16x16 ground tiles (`ground_tile_0` through `ground_tile_4`)
- Distributed using Zipf algorithm for natural variation
- Created as Phaser Image sprites, not tilemap tiles
- Stored in `mapManager.groundSprites[]` array

Access via: `mapManager.getWallsLayer()`, `getWaterLayer()`, `getObjectsLayer()`

#### 4. Character Class Inheritance
Player classes use inheritance for code reuse:

```javascript
// GameScene instantiates the specific class:
this.player = new Wizard(scene, x, y);
this.player = new Archer(scene, x, y);
// etc.

// All classes extend BasePlayer:
BasePlayer           // Abstract base with health, XP, input, shooting
├── Wizard          // Fast, low HP, rapid-fire potions
├── Archer          // Charged arrows, medium stats
├── Paladin         // Slow, high HP, high damage
└── Knight          // Melee sweeps, medium stats

// Access:
player.sprite       // The Phaser physics sprite
player.health       // Game state (from BasePlayer)
player.stats        // Class-specific stats (defined in subclass)
player.update()     // Called each frame from scene
```

**Key Methods in BasePlayer:**
- `initializeSprite()` - Creates physics sprite
- `setupInput()` - Keyboard/mouse controls
- `handleMovement()` - WASD + mobile joystick
- `handleShooting()` - Fire projectiles
- `takeDamage()` / `gainXP()` - RPG mechanics

#### 5. Map Editor Architecture
MapEditorScene is a standalone editor with full tilemap editing:

**Features:**
- Click-and-drag painting (left mouse) / erasing (right mouse)
- Switch between ground/water/walls/objects layers
- Camera pan (WASD/arrows) and zoom (Q/E keys)
- JSON export: Saves only non-empty tiles as `{x, y, index}` objects
- JSON import: Loads custom maps into the game
- LocalStorage: Auto-save current work
- Test button: Launch GameScene with custom map

**Layer Access:**
```javascript
this.groundLayer   // Tilemap layer for floors
this.waterLayer    // Water tiles
this.wallLayer     // Walls
this.objectLayer   // Objects (barrels, chests)
```

#### 6. Physics & Collisions
Set up in `GameScene.create()`:
- Player vs walls/objects: `physics.add.collider()`
- Projectiles vs walls: Deactivates projectile
- Projectiles vs enemies: `physics.add.overlap()` with damage handling
- Enemies vs walls/objects: Basic collision
- Enemies vs player: Contact damage with knockback

#### 7. Water Tile Animation & Enemy Spawning
MapManager tracks water tiles for two purposes:

**Animation:**
- Water tiles cycle through animation frames every 400ms
- `mapManager.waterTilePositions[]` stores grid coordinates
- `mapManager.update(delta)` handles frame cycling

**Crab Spawning:**
- `mapManager.waterTiles[]` stores world pixel coordinates (center of each water tile)
- `waveManager.spawnCrabFromWater()` picks random water tile for spawn location
- Called periodically in GameScene (every 5 seconds if < 6 enemies)

```javascript
// Get spawn point from water
const spawnPoint = mapManager.getRandomWaterSpawnPoint();
if (spawnPoint) {
    waveManager.spawnEnemy(spawnPoint.x, spawnPoint.y, 'crab');
}
```

#### 8. Mobile Support
- **Auto-detection**: Mobile detected via user agent in `GameConfig.callbacks.preBoot`
- **Virtual joystick**: Created in `GameScene.createMobileControls()`
- **Touch controls**: Joystick (bottom-left), Fire button (bottom-right)
- **Responsive scaling**: `Phaser.Scale.FIT` mode with min/max constraints

### Critical Design Decisions

**Two Codebases:**
- `public/src/` - Active Phaser 3 game (EDIT THIS)
- `src/` - Legacy p5.js version (reference only, being migrated)

**Global Namespace:** Classes attach to `window` (e.g., `window.GameScene`, `window.TileConfig`) for cross-file access without ES6 modules.

**No Build Tooling:** Vanilla JS with `<script>` tags in index.html. No bundler, no transpiler.

**PWA Support:** Service worker (`public/sw.js`) caches all game assets for offline play. Installable on iOS/Android.

## Common Workflows

### Adding a New Enemy Type
1. Add tile index to `TileConfig.enemies` in [public/src/config/TileConfig.js](public/src/config/TileConfig.js)
2. Update `Enemy.js` constructor to handle the new type if behavior differs
3. Spawn via `waveManager.spawnEnemy(x, y, 'newType')`

### Adding a New Character Class
1. Create new class file extending `BasePlayer` (e.g., `Rogue.js`)
2. Define `this.stats` object with `baseHealth`, `baseSpeed`, `fireRate`, `projectileDamage`, `projectileSpeed`
3. Add to `TileConfig.characters` or `RoguelikeTileConfig.characters` with `tileIndex`, `name`, `description`
4. Update [public/src/scenes/MenuScene.js](public/src/scenes/MenuScene.js) character selection UI
5. Add case to [public/src/scenes/GameScene.js](public/src/scenes/GameScene.js) `switch(this.characterType)` block
6. Add `<script>` tag to [public/index.html](public/index.html) in entities section

### Modifying the Map
Edit `MapManager.createMap()` in [public/src/managers/MapManager.js](public/src/managers/MapManager.js):
- Add new tile layers (ground, walls, objects)
- Place specific tiles at grid positions
- Add procedural generation logic

### Porting Features from Old p5.js Version
1. Find the feature in `src/` directory (legacy code)
2. Understand the logic/behavior
3. Reimplement in appropriate Phaser entity/scene in `public/src/`
4. Update TileConfig if new sprites are needed

## Common Issues & Debugging

### Array Index Out of Bounds
**Symptom:** `Cannot read properties of undefined (reading '2')` in MapManager
**Cause:** Accessing tile array with index beyond array length (e.g., `TileConfig.walls.middle[3]` when array only has 3 elements at indices 0-2)
**Fix:** Check array length in TileConfig before accessing. Use `array.length - 1` for last element.

### Tileset Image Dimension Warnings
**Symptom:** Console warns "Image tile area not tile size multiple"
**Cause:** Tileset PNG dimensions don't match `(columns × tileWidth) + ((columns - 1) × spacing) + (2 × margin)`
**Impact:** Non-critical, but some tiles may be misaligned
**Fix:** Verify actual image dimensions or adjust `spacing`/`margin` in TileConfig

### Custom Map Not Loading
**Cause:** JSON format mismatch or invalid tile indices
**Debug:** Check console for errors, verify JSON structure matches `{width, height, layers: {ground: [], water: [], walls: [], objects: []}}`

### Projectiles Not Hitting Enemies
**Cause:** Missing collision setup or wrong overlap callback
**Fix:** Ensure `GameScene.setupEnemyCollisions()` is called and projectiles are in correct group

### Ground Tiles Not Showing
**Cause:** Assets not loaded or incorrect path in BootScene
**Debug:** Check console for "Ground tile X loaded" messages. Verify `assets/ground-tiles/ground_0X.png` exists

## Tileset Information

**Tiny Dungeon Tileset**: Kenney Tiny Dungeon (16x16px tiles)
- Location: `public/assets/tilesets/kenney_tiny-dungeon/Tilemap/tilemap_packed.png`
- Grid: 12 columns × 11 rows = 132 tiles (indices 0-131)
- Spacing: 1px between tiles, 1px margin
- Config: `TileConfig.spritesheet`

**Roguelike Tileset**: Kenney Roguelike RPG Pack (16x16px tiles)
- Location: `public/assets/tilesets/kenney_roguelike-rpg-pack/roguelikeSheet_transparent.png`
- Grid: 57 columns × 31 rows = 1,767 tiles (indices 0-1766)
- Spacing: 0px, margin: 0px
- Config: `RoguelikeTileConfig.spritesheet`

Both loaded in BootScene using respective config settings.

## Firebase Deployment

The project deploys to Firebase Hosting:
- **Public directory**: `public/`
- **Config**: `firebase.json`
- **Deploy**: `firebase deploy` (or `firebase deploy --only hosting`)
- **Local preview**: `firebase serve` (port 5000)

## Known Patterns & Conventions

**Coordinate Systems:**
- Entity positions are in pixels
- Tile positions: convert via `Math.floor(pixelPos / 16)`

**Camera:**
- 2x zoom: `cameras.main.setZoom(2)`
- Follows player with lerp smoothing

**Y-Sorting:**
- Entities set depth based on Y for proper layering: `sprite.setDepth(10 + sprite.y)`

**Zipf Distribution Ground Tiles:**
MapManager uses a statistical distribution for natural-looking ground variation:
- **Primary tiles** (ground_tile_0, ground_tile_1): ~52% frequency
- **Medium tiles** (ground_tile_2, ground_tile_3): ~33% frequency
- **Accent tiles** (ground_tile_4): ~15% frequency
- Combined with Perlin-like noise (`simpleNoise()`) for spatial clustering
- Creates organic patterns without repetition
- Configured via `calculateZipfWeights(n, s)` where `s=1.5` controls clustering strength

**Script Load Order:**
Script tags in [public/index.html](public/index.html) must maintain dependency order:
1. **Phaser 3 CDN** - Load Phaser framework first
2. **Config files** - `TileConfig.js`, `RoguelikeTileConfig.js`, `GameConfig.js`
3. **Entities** - `BasePlayer.js` FIRST, then `Wizard.js`, `Archer.js`, `Paladin.js`, `Knight.js`, then `Enemy.js`, `Projectile.js`
4. **Managers** - `MapManager.js`, `WaveManager.js`, `ScoreManager.js`
5. **Scenes** - `BootScene.js`, `MenuScene.js`, `MapEditorScene.js`, `GameScene.js`, `UIScene.js`
6. **Main bootstrap** - `main.js` (creates Phaser.Game instance)

**CRITICAL:** BasePlayer.js must load before any subclasses (Wizard, Archer, etc.)
