// BootScene - Asset loading
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // Loading progress
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();

            // Hide loading screen
            const loading = document.getElementById('loading');
            if (loading) {
                loading.classList.add('hidden');
            }
        });

        // Load tiny dungeon tileset
        this.load.spritesheet(
            TileConfig.spritesheet.key,
            TileConfig.spritesheet.path,
            {
                frameWidth: TileConfig.spritesheet.frameWidth,
                frameHeight: TileConfig.spritesheet.frameHeight,
                spacing: TileConfig.spritesheet.spacing,
                margin: TileConfig.spritesheet.margin
            }
        );

        // Load roguelike tileset
        this.load.spritesheet(
            RoguelikeTileConfig.spritesheet.key,
            RoguelikeTileConfig.spritesheet.path,
            {
                frameWidth: RoguelikeTileConfig.spritesheet.frameWidth,
                frameHeight: RoguelikeTileConfig.spritesheet.frameHeight,
                spacing: RoguelikeTileConfig.spritesheet.spacing,
                margin: RoguelikeTileConfig.spritesheet.margin
            }
        );

        // Load tiny creatures tileset
        this.load.spritesheet(
            TinyCreaturesTileConfig.spritesheet.key,
            TinyCreaturesTileConfig.spritesheet.path,
            {
                frameWidth: TinyCreaturesTileConfig.spritesheet.frameWidth,
                frameHeight: TinyCreaturesTileConfig.spritesheet.frameHeight,
                spacing: TinyCreaturesTileConfig.spritesheet.spacing,
                margin: TinyCreaturesTileConfig.spritesheet.margin
            }
        );

        // Load healthbar images (from original p5.js version)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`healthbar_${i}`, `assets/healthbar_0${i}.png`);
        }

        // Load ground tile images
        for (let i = 0; i < 5; i++) {
            this.load.image(`ground_tile_${i}`, `assets/ground-tiles/ground_0${i}.png`);
        }

        // Load audio assets
        this.load.audio('click', 'assets/audio/click_001.ogg');
    }

    create() {
        console.log('✅ Assets loaded');

        // Verify ground tiles loaded
        for (let i = 0; i < 5; i++) {
            const key = `ground_tile_${i}`;
            if (this.textures.exists(key)) {
                console.log(`✅ Ground tile ${i} loaded`);
            } else {
                console.error(`❌ Ground tile ${i} FAILED to load`);
            }
        }

        // Go to menu
        this.scene.start('MenuScene');
    }
}

if (typeof window !== 'undefined') {
    window.BootScene = BootScene;
}
