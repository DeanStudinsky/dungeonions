// Collision constants and tile property management

const COLLISION = Object.freeze({
    PLAYER: 1,
    PROJECTILE: 2,
    ENEMY: 3
});

const normalizeCollisionMask = (mask) => {
    if (typeof mask === 'string') {
        switch (mask.toLowerCase()) {
            case 'projectile':
                return COLLISION.PROJECTILE;
            case 'enemy':
                return COLLISION.ENEMY;
            case 'player':
            default:
                return COLLISION.PLAYER;
        }
    }
    return Object.values(COLLISION).includes(mask) ? mask : COLLISION.PLAYER;
};

class TileManager {
    constructor() {
        this.tileProperties = [
            { "tileIndex": 0, "description": "Stone Wall Top Left Corner", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 1, "description": "Stone Wall Top", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 2, "description": "Stone Wall Top Right Corner", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 3, "description": "Stone Wall Top T-Junction Down", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 4, "description": "Stone Wall Top End (Cap Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 5, "description": "Stone Wall Top End (Cap Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 6, "description": "Stone Wall Top with Shield", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 7, "description": "Stone Wall Top (Single Block)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 8, "description": "Stone Wall Top (Detailed)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 9, "description": "Stone Wall Top (Pillar Top Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 10, "description": "Stone Wall Top (Pillar Top Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 11, "description": "Stone Wall Top (Archway Top)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 12, "description": "Stone Wall Left Side", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 13, "description": "Stone Wall Center Block", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 14, "description": "Stone Wall with Banner", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 15, "description": "Stone Wall Right Side", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 16, "description": "Stone Wall with Barred Window", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 17, "description": "Stone Wall (Plain)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 18, "description": "Stone Wall with Shield Emblem", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 19, "description": "Stone Wall (Detailed Center)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 20, "description": "Stone Wall (Pillar Mid Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 21, "description": "Stone Wall (Pillar Mid Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 22, "description": "Stone Wall (Archway Mid Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 23, "description": "Stone Wall (Archway Mid Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 24, "description": "Dirt Floor Edge (Top Left)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 25, "description": "Dirt Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 26, "description": "Dirt Floor with Pebbles", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 27, "description": "Dirt Floor Edge (Top Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 28, "description": "Wooden Plank Floor (Vertical)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 29, "description": "Wooden Plank Floor (Horizontal)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 30, "description": "Wooden Plank Floor (Cross)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 31, "description": "Floor Grate", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 32, "description": "Stone Brick Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 33, "description": "Stone Slab Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 34, "description": "Stone Wall (Pillar Base Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 35, "description": "Stone Wall (Pillar Base Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 36, "description": "Stone Floor (Light, Cracked)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 37, "description": "Stone Floor (Light, Plain)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 38, "description": "Stone Floor (Common Grey)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 39, "description": "Stone Floor (Darker Grey)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 40, "description": "Wooden Beam/Low Wall Base", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 41, "description": "Wooden Beam/Low Wall End", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 42, "description": "Stone Floor (Patterned)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 43, "description": "Stone Floor (Small Tiles)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 44, "description": "Stone Floor (Large Tile Center)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 45, "description": "Stone Floor (Stairs Illusion Up Left)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 46, "description": "Stone Floor (Stairs Illusion Up Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 47, "description": "Stone Floor (Stairs Illusion Down)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 48, "description": "UI Element (Selection Box Corner)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 49, "description": "UI Element (Selection Box Edge)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 50, "description": "UI Element (Slash Icon)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 51, "description": "Sand/Light Dirt Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 52, "description": "Minecart Track (Horizontal)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 53, "description": "Minecart Track (Vertical)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 54, "description": "Minecart Track (Curve Bottom-Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 55, "description": "Minecart Track (Curve Top-Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 56, "description": "Minecart Track End/Buffer", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 57, "description": "Barrel", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 58, "description": "Crate", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 59, "description": "Chest (Closed, Brown)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 60, "description": "Wooden Door (Closed, Vertical)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 61, "description": "Wooden Door (Closed, Horizontal)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 62, "description": "Metal Door/Gate (Closed)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 63, "description": "Barrel (Side View)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 64, "description": "Crate Stack", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 65, "description": "Chest (Open, Empty)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 66, "description": "Chest (Closed, Red/Gold)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 67, "description": "Minecart (Empty)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 68, "description": "Minecart Track Intersection", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 69, "description": "Minecart Track (Horizontal, Darker)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 70, "description": "Minecart Track (Curve Top-Left)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 71, "description": "Stone Column/Pillar Base", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 72, "description": "Entity Sprite: Knight", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 73, "description": "Entity Sprite: Archer", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 74, "description": "Entity Sprite: Female Warrior", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 75, "description": "Entity Sprite: Mage/Civilian", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 76, "description": "Entity Sprite: King/Noble", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 77, "description": "Entity Sprite: Old Man/Merchant", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 78, "description": "Entity Sprite: Guard", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 79, "description": "Entity Sprite: Hooded Figure", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 80, "description": "Entity Sprite: Female Civilian", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 81, "description": "Entity Sprite: Child/Small Figure", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 82, "description": "Entity Sprite: Male Civilian", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 83, "description": "Entity Sprite: Dark Knight", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 84, "description": "Entity Sprite: Player Wizard", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 85, "description": "Entity Sprite: Alt Hero 1", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 86, "description": "Entity Sprite: Alt Hero 2", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 87, "description": "Entity Sprite: Alt Hero 3", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 88, "description": "Entity Sprite: Alt Hero 4", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 89, "description": "Entity Sprite: Alt Hero 5", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 90, "description": "Entity Sprite: Alt Hero 6", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 91, "description": "Entity Sprite: Alt Hero 7", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 92, "description": "Entity Sprite: Alt Hero 8", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 93, "description": "Entity Sprite: Alt Hero 9", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 94, "description": "Entity Sprite: Alt Hero 10", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 95, "description": "Entity Sprite: Alt Hero 11", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 96, "description": "Entity Sprite: Goblin", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 97, "description": "Entity Sprite: Paladin", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 98, "description": "Entity Sprite: Skeleton", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 99, "description": "Entity Sprite: Slime", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 100, "description": "Entity Sprite: Mushroom Creature", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 101, "description": "Entity Sprite: Eye Monster", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 102, "description": "Entity Sprite: Bat", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 103, "description": "Entity Sprite: Spider", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 104, "description": "Entity Sprite: Demon/Gargoyle", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 105, "description": "Entity Sprite: Fire Elemental", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 106, "description": "Entity Sprite: Ice Creature", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 107, "description": "Entity Sprite: Plant Monster", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 108, "description": "Entity Sprite: Zombie", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 109, "description": "Entity Sprite: Ghost", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 110, "description": "Entity Sprite: Orc", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 111, "description": "Entity Sprite: Minotaur", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 112, "description": "Item: Coin", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 113, "description": "Item: Gem", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 114, "description": "Item: Key", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 115, "description": "Item: Potion (Red)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 116, "description": "Item: Projectile (Arrow)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 117, "description": "Item: Projectile (Magic Bolt)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 118, "description": "Item: Projectile (Fireball)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 119, "description": "Item: Sword", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 120, "description": "Item: Shield", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 121, "description": "Entity Sprite: Ghost (Floating)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 122, "description": "Item: Scroll", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 123, "description": "Item: Book/Tome", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 124, "description": "Item: Ring", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 125, "description": "Item: Amulet", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 126, "description": "Item: Food/Bread", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 127, "description": "Item: Meat/Food 2", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 128, "description": "Item: Potion (Blue)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 129, "description": "Item: Potion (Green)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 130, "description": "Item: Staff/Wand", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 131, "description": "Item: Helmet/Armor", "magicPasses": true, "playerPasses": true }
        ];
    }

    getProperties(tileIndex) {
        if (tileIndex < 0 || tileIndex >= this.tileProperties.length) {
            return {
                description: "Unknown Tile",
                magicPasses: true,
                playerPasses: true
            };
        }
        return this.tileProperties[tileIndex];
    }
}

if (typeof window !== 'undefined') {
    window.COLLISION = COLLISION;
    window.TileManager = TileManager;
}
