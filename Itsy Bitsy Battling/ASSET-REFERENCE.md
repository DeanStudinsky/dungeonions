# Complete Asset Reference - Phaser Migration from P5.js

This document lists ALL assets used in the working p5.js version that need to be available in Phaser.

## Source of Truth
**Reference**: `Itsy Bitsy Battling/public/old-p5-version/`

---

## PRIMARY TILEMAP (Main Spritesheet)

**File**: `tilemap.png`
**Source**: `old-p5-version/tilemap.png` (14KB file)
**Current Location**: `DangerousDungeonions-Phaser/assets/tilesets/kenney_tiny-dungeon/Tilemap/tilemap.png`

### Specifications:
- **Grid**: 12 columns × 11 rows = 132 tiles total
- **Tile Size**: 16×16 pixels
- **Spacing**: 1px between each tile
- **Margin**: 1px around entire tileset
- **Total Image Size**: Approximately 205×188 pixels

### Tile Layout (0-131):
```
Row 0  (0-11):   Stone walls (tops, corners, T-junctions)
Row 1  (12-23):  Stone walls (middles, sides, banners, windows)
Row 2  (24-35):  Floors (dirt edges, dirt, wood planks, stone)
Row 3  (36-47):  Floors (stone variants, stairs illusion)
Row 4  (48-59):  UI elements, barrels(57), crates(58), chests(59), doors(60-62)
Row 5  (60-71):  More objects, doors, columns(71)
Row 6  (72-83):  Character sprites (72=Knight base, 73=Archer base, etc.)
Row 7  (84-95):  Player classes START HERE
                 - 84: Wizard (purple robes)
                 - 85: Archer (green hood) ⭐
                 - 82: Paladin (previous row - armored)
Row 8  (96-107): More characters
                 - 97: Knight ⭐
                 - 98: Skeleton enemy
Row 9  (108-119): Enemies and items
                  - 110: Crab/Orc enemy ⭐
                  - 115: Potion (red) - Wizard projectile ⭐
                  - 116: Arrow - Archer projectile ⭐
                  - 117: Magic Bolt - Paladin projectile ⭐
Row 10 (120-131): More items
                  - 104: Attack indicator - Knight projectile ⭐
```

---

## CHARACTER SPRITE INDICES (FROM P5.JS)

### Player Classes
| Class   | Tile Index | Description | Image Reference |
|---------|------------|-------------|-----------------|
| Wizard  | **84**     | Purple robed wizard | tile_0084.png |
| Paladin | **82**     | Armored paladin | tile_0082.png |
| Knight  | **97**     | Knight | tile_0097.png |
| Archer  | **85**     | Archer with green hood | tile_0085.png |

### Projectiles
| Class   | Tile Index | Description |
|---------|------------|-------------|
| Wizard  | **115**    | Red potion |
| Paladin | **117**    | Magic bolt / holy light |
| Knight  | **104**    | Attack indicator / sword |
| Archer  | **116**    | Arrow |

### Enemies
| Enemy Type | Tile Index | Description |
|------------|------------|-------------|
| Crab/Orc   | **110**    | Main enemy (red/brown creature) |
| Skeleton   | **98**     | Skeleton enemy |
| Bat        | **102**    | Flying enemy |
| Ghost      | **109**    | Ghost enemy |

---

## OTHER ASSETS

### Health Bar Sprites
**Location**: `assets/healthbar_0X.png` where X = 1 to 7

Files needed:
```
healthbar_01.png
healthbar_02.png
healthbar_03.png
healthbar_04.png
healthbar_05.png
healthbar_06.png
healthbar_07.png
```

**Used For**: Player health bar animation (7 states)

---

## TILE CATEGORIES FOR REFERENCE

### Walls (Collision)
- **0-2**: Top walls (corners and middle)
- **12-15**: Middle walls (left, center, banner, right)
- All wall tiles from 0-23 block movement

### Floors (Walkable)
- **51**: Sand/Light Dirt Floor (PRIMARY - used everywhere as base)
- **24-27**: Dirt floor variants
- **32-39**: Stone floor variants
- **28-30**: Wood plank variants

### Objects (Collision)
- **57-58**: Barrels and crates
- **59, 66**: Chests (closed)
- **60-62**: Doors (vertical, horizontal, metal gate)
- **71**: Stone column/pillar

### Water/Special (for future)
- **28, 29, 40, 41**: Dark blue tiles (used as water in p5.js)

---

## AUDIO ASSETS

**File**: `click_001.ogg`
**Location**: `assets/audio/click_001.ogg`
**Format**: OGG Vorbis
**Used For**: Menu/UI click sounds

---

## IMPORTANT NOTES FOR TILE ATLAS

1. **Use tilemap.png** (14KB file from old-p5-version) as the single source spritesheet
2. **DO NOT use tilemap_packed.png** (5.2KB) - this has different spacing/layout
3. **Tile spacing is critical**: 1px spacing + 1px margin must be maintained
4. **Character indices**: 84(Wizard), 82(Paladin), 97(Knight), 85(Archer) - these are FINAL
5. **Floor tile 51** is used as the default ground everywhere

---

## FILES TO INCLUDE IN TILE ATLAS

### Critical (Must Have):
1. `tilemap.png` - Main 132-tile spritesheet
2. `healthbar_01.png` through `healthbar_07.png` - Health bar states
3. `click_001.ogg` - Audio

### Optional (Future):
- Ground tile variants (currently using tile 51 from main tilemap)
- Roguelike tileset (for expansion)

---

**Last Updated**: December 31, 2025
**Verified Against**: `Itsy Bitsy Battling/public/old-p5-version/`
