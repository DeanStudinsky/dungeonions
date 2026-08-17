# Asset Reference - Dangerous Dungeonions Phaser

This document lists all assets currently used in the Phaser version for creating a tile atlas.

## Primary Tilemap (ACTIVE)

**Path**: `assets/tilesets/kenney_tiny-dungeon/Tilemap/tilemap.png`
- **Dimensions**: 12 columns × 11 rows = 132 tiles
- **Tile Size**: 16×16 pixels
- **Spacing**: 1px between tiles
- **Margin**: 1px around entire tileset
- **Source**: Copied from `old-p5-version/tilemap.png`
- **Used For**: All gameplay tiles (walls, floors, characters, enemies, objects)

### Tile Index Map (0-131):
```
Row 0 (0-11):    Walls (tops, corners)
Row 1 (12-23):   Walls (middles, sides)
Row 2 (24-35):   Floors (dirt, wood)
Row 3 (36-47):   Floors (stone variants)
Row 4 (48-59):   UI elements, barrels, chests, doors
Row 5 (60-71):   More objects, columns
Row 6 (72-83):   Character sprites (knight, archer, etc.)
Row 7 (84-95):   Player classes: 84=Wizard, 85=Archer(green hood), 82=Paladin
Row 8 (96-107):  More characters: 97=Knight
Row 9 (108-119): Enemies and items: 110=Crab, 115=Potion, 116=Arrow, 117=Magic Bolt
Row 10 (120-131): More items: 104=Attack indicator
```

## Secondary Tilemap (UNUSED - For Future)

**Path**: `assets/tilesets/kenney_roguelike-rpg-pack/roguelikeSheet_transparent.png`
- **Dimensions**: 57 columns × 31 rows = 1,767 tiles
- **Tile Size**: 16×16 pixels
- **Spacing**: 0px (no spacing)
- **Margin**: 0px
- **Status**: Loaded but not actively used in current gameplay

## Health Bar Sprites

**Path**: `assets/healthbar_0X.png` (where X = 1-7)
- **Count**: 7 frames
- **Files**:
  - `healthbar_01.png`
  - `healthbar_02.png`
  - `healthbar_03.png`
  - `healthbar_04.png`
  - `healthbar_05.png`
  - `healthbar_06.png`
  - `healthbar_07.png`
- **Used For**: Player health bar animation/states

## Ground Tiles (UNUSED - Replaced by Tilemap)

**Path**: `assets/ground-tiles/ground_0X.png` (where X = 0-4)
- **Count**: 5 tiles
- **Files**:
  - `ground_00.png` - Dark brown (primary)
  - `ground_01.png` - Accent variant
  - `ground_02.png` - Variation 2
  - `ground_03.png` - Variation 3
  - `ground_04.png` - Variation 4
- **Status**: Loaded but NOT USED - using tilemap tile 51 instead

## Audio Assets

**Path**: `assets/audio/click_001.ogg`
- **Format**: OGG Vorbis
- **Used For**: Menu/UI click sounds

---

## Asset Summary for Tile Atlas

### CRITICAL ASSETS (Must Include):
1. **`tilemap.png`** - Main gameplay tileset (12×11 grid, 16×16 tiles, 1px spacing)
2. **`healthbar_01.png` through `healthbar_07.png`** - Health bar frames
3. **`click_001.ogg`** - Audio

### OPTIONAL ASSETS (Future Use):
1. **`roguelikeSheet_transparent.png`** - Alternative tileset
2. **`ground_0X.png`** - Individual ground tiles (currently unused)

---

## Key Tile Indices (Reference)

### Characters
- **84**: Wizard (purple)
- **82**: Paladin (armored)
- **97**: Knight
- **85**: Archer (green hood)

### Enemies
- **110**: Crab/Orc
- **98**: Skeleton
- **102**: Bat
- **109**: Ghost

### Projectiles
- **115**: Potion (red) - Wizard
- **117**: Magic Bolt - Paladin
- **104**: Attack indicator - Knight
- **116**: Arrow - Archer

### Walls
- **0-2**: Top walls (left corner, top, right corner)
- **12-15**: Middle walls (left, center, banner, right)

### Floors
- **51**: Sand/Light Dirt Floor (DEFAULT - used everywhere)
- **32-39**: Stone floor variants

### Objects
- **57-58**: Barrels, Crates
- **59, 66**: Chests
- **60-62**: Doors

---

## File Paths Summary

```
DangerousDungeonions-Phaser/
├── assets/
│   ├── tilesets/
│   │   ├── kenney_tiny-dungeon/
│   │   │   └── Tilemap/
│   │   │       └── tilemap.png ⭐ PRIMARY TILEMAP
│   │   └── kenney_roguelike-rpg-pack/
│   │       └── roguelikeSheet_transparent.png (future use)
│   ├── healthbar_01.png through healthbar_07.png
│   ├── ground-tiles/ (unused)
│   │   └── ground_00.png through ground_04.png
│   └── audio/
│       └── click_001.ogg
```

---

**Last Updated**: December 31, 2025
