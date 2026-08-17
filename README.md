# Dangerous Dungeonions

A roguelike dungeon crawler built with Phaser 3, featuring procedural generation, multiple character classes, and an in-game map editor.

## Project Structure

Everything is served straight from the repository root — no build step.

```
.
├── index.html               # Main entry point (loads Phaser from CDN)
├── src/                     # Game source code
│   ├── scenes/             # Phaser scenes (Boot, Menu, Game, UI, MapEditor, Pause)
│   ├── managers/           # Game systems (Map, Wave, Score, Progression)
│   ├── entities/           # Game objects (players, enemies, projectiles)
│   └── config/             # Configuration files (TileConfig, GameConfig, ...)
├── assets/                  # Game assets
│   ├── tilesets/           # Kenney Tiny Dungeon & Roguelike tilesets
│   ├── ground-tiles/       # Custom 16x16 ground tile PNGs
│   ├── ui/                 # Interface art
│   └── audio/              # Sound effects
├── sw.js                    # Service worker (registration currently disabled)
├── manifest.json            # PWA manifest
├── firebase.json            # Firebase Hosting configuration
├── .firebaserc              # Firebase project configuration
└── .nojekyll                # Stops GitHub Pages running Jekyll over the assets
```

## Play

- **GitHub Pages**: https://deanstudinsky.github.io/dungeonions/
- **Locally**: `npx http-server . -p 8080`

## Features

### Core Gameplay
- **4 Character Classes**: Wizard, Paladin, Knight, Archer - each with unique abilities and playstyles
- **Procedural Dungeon Generation**: Rooms connected by corridors with smart spawn placement
- **Custom Ground Tiles**: Zipf distribution algorithm creates natural-looking tile patterns
- **Enemy Spawning**: Context-aware enemy placement (crabs in water, etc.)
- **Collision System**: Multi-layer tilemap with proper collision detection

### Map Editor
- In-game tile placement with click-and-drag painting
- Support for both Tiny Dungeon and Roguelike tilesets
- Camera controls (WASD/arrows to pan, Q/E to zoom)
- JSON import/export for sharing custom maps
- Save/load to localStorage
- Test maps directly from the editor

### Technical Features
- **Phaser 3** game framework with WebGL/Canvas rendering
- **Multi-tileset support**: Seamlessly blend Kenney Tiny Dungeon and Roguelike packs
- **PWA-ready**: Service worker for offline play (disabled during development)
- **Firebase Hosting**: Fast CDN deployment
- **Responsive**: Adapts to window size, touch controls for mobile

## Development Workflow

### Local Development

1. **Make changes** to files in `public/`
   - Edit scenes in `public/src/scenes/`
   - Modify game logic in `public/src/managers/` or `public/src/entities/`
   - Update assets in `public/assets/`

2. **Test locally** using any static file server:
   ```bash
   # Using Python
   cd public
   python -m http.server 8000

   # Using Node.js http-server
   npx http-server public -p 8080

   # Using VS Code Live Server extension
   # Right-click index.html > Open with Live Server
   ```

3. **View in browser** at `http://localhost:8000` (or whatever port you chose)

### Deployment

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

The game will be live at your Firebase Hosting URL.

### Important Development Notes

- **Service Worker**: Currently disabled during development to prevent aggressive caching. Re-enable in [main.js](public/src/main.js) for production builds.
- **Hard Refresh**: If you see stale content, use Ctrl+Shift+R (or Cmd+Shift+R on Mac) to bypass cache.
- **Console Logging**: The game outputs debug logs for asset loading, map generation, and enemy spawning.

## Game Controls

### Menu
- Click buttons to navigate
- **Singleplayer**: Start game with default character
- **Map Editor**: Open the map editor

### In-Game
- **WASD** or **Arrow Keys**: Move character
- **Mouse Click** or **Spacebar**: Attack in direction of movement
- **ESC**: Pause (future feature)

### Map Editor
- **WASD** or **Arrow Keys**: Pan camera
- **Q/E**: Zoom in/out
- **Left Click + Drag**: Paint tiles
- **Right Click + Drag**: Erase tiles
- **Number Keys 1-3**: Quick select floor/wall/water
- **ESC**: Return to menu

## Assets

- **Kenney Tiny Dungeon**: 12×11 tileset (16x16 tiles, 1px spacing)
- **Kenney Roguelike RPG Pack**: 57×31 tileset (16x16 tiles, no spacing)
- **Custom Ground Tiles**: 5 hand-picked 16x16 PNG tiles with Zipf distribution
- **Kenney Interface Sounds**: UI click sounds

## Technical Details

### Tile Distribution Algorithm

Ground tiles use a **Zipf distribution** combined with **Perlin-like noise** for natural clustering:

- **Primary tiles** (ground_tile_0, ground_tile_1): ~52% of map
- **Medium tiles** (ground_tile_2, ground_tile_3): ~33% of map
- **Accent tiles** (ground_tile_4): ~15% of map

This creates visual variety while maintaining cohesion through grouped similar tiles.

### Map Data Format

Custom maps are stored as JSON with this structure:

```json
{
  "width": 40,
  "height": 30,
  "layers": {
    "ground": [{"x": 0, "y": 0, "index": 1}, ...],
    "water": [...],
    "walls": [...],
    "objects": [...]
  }
}
```

Each layer stores only non-empty tiles as `{x, y, index}` objects for efficiency.

## Requirements

- **Modern browser** with WebGL support (Chrome, Firefox, Safari, Edge)
- **Node.js 16+** (for Firebase CLI deployment)
- **Firebase CLI** authenticated against the dangerous-dungeonions project

## Troubleshooting

### Changes not appearing
- Service worker may be caching old files
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache if issue persists

### Texture loading errors
- Check browser console for specific errors
- Verify asset paths in `public/assets/`
- Check BootScene.js for asset loading configuration

### Map editor issues
- Ensure both tilesets loaded successfully (check console)
- Verify you're clicking within the map bounds
- Right-click to erase tiles (left-click paints)

## License

This project uses assets from Kenney (www.kenney.nl), licensed under CC0 1.0 Universal.
