// MenuScene - Simple main menu
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Title
        this.add.text(width / 2, height / 2 - 100, 'DANGEROUS DUNGEONIONS', {
            fontSize: '48px',
            fontFamily: 'monospace',
            fill: '#ff6600',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Singleplayer button
        this.createButton(width / 2, height / 2, 'Singleplayer', () => {
            this.sound.play('click');
            this.scene.start('GameScene', { characterType: 'wizard' });
            this.scene.launch('UIScene');
        });

        // Map Editor button
        this.createButton(width / 2, height / 2 + 80, 'Map Editor', () => {
            this.sound.play('click');
            this.scene.start('MapEditorScene');
        });
    }

    createButton(x, y, text, callback) {
        // Button background
        const bg = this.add.rectangle(x, y, 300, 60, 0x333333);
        bg.setStrokeStyle(2, 0x666666);

        // Button text
        const buttonText = this.add.text(x, y, text, {
            fontSize: '32px',
            fontFamily: 'monospace',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Glow effect (initially invisible)
        const glow = this.add.rectangle(x, y, 310, 70, 0xffffff, 0);
        glow.setDepth(-1);

        // Make interactive
        bg.setInteractive({ useHandCursor: true });

        // Hover effects
        bg.on('pointerover', () => {
            bg.setFillStyle(0x555555);
            glow.setAlpha(0.3);
            // Animate glow
            this.tweens.add({
                targets: glow,
                alpha: 0.5,
                duration: 200,
                yoyo: true,
                repeat: -1
            });
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0x333333);
            this.tweens.killTweensOf(glow);
            glow.setAlpha(0);
        });

        // Click
        bg.on('pointerdown', callback);

        return { bg, text: buttonText, glow };
    }
}

if (typeof window !== 'undefined') {
    window.MenuScene = MenuScene;
}
