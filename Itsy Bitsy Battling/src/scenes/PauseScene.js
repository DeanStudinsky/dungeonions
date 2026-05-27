// PauseScene - ESC menu overlay for Dangerous Dungeonions
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Dim overlay
        this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.65);

        // Panel
        this.add.rectangle(W / 2, H / 2, 300, 320, 0x0a0a0a, 0.97);
        this.add.rectangle(W / 2, H / 2, 300, 320, 0x000000, 0).setStrokeStyle(1, 0x553322);

        this.add.text(W / 2, H / 2 - 128, '[ PAUSED ]', {
            fontSize: '16px', color: '#cc5533', fontFamily: 'monospace', fontStyle: 'bold',
            letterSpacing: 6
        }).setOrigin(0.5, 0);

        this.add.text(W / 2, H / 2 - 98, 'DANGEROUS DUNGEONIONS', {
            fontSize: '10px', color: '#443322', fontFamily: 'monospace',
            letterSpacing: 2
        }).setOrigin(0.5, 0);

        this._btn(W / 2, H / 2 - 38, 'RESUME', 0x221a0a, 0x3d2a10, '#ffaa44', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });

        this._btn(W / 2, H / 2 + 30, 'HOME', 0x0a0a1a, 0x151530, '#8899cc', () => {
            this.scene.stop('GameScene');
            this.scene.stop('UIScene');
            this.scene.stop();
            window.location.href = '../../../home.html';
        });

        this._btn(W / 2, H / 2 + 98, 'SETTINGS', 0x111111, 0x222222, '#666677', () => {
            // placeholder
        });

        // ESC again to resume
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }

    _btn(x, y, label, fillNorm, fillHover, textColor, cb) {
        const bg = this.add.rectangle(x, y, 210, 46, fillNorm)
            .setInteractive({ useHandCursor: true })
            .on('pointerover',  () => bg.setFillStyle(fillHover))
            .on('pointerout',   () => bg.setFillStyle(fillNorm))
            .on('pointerdown',  cb);

        this.add.text(x, y, label, {
            fontSize: '13px', color: textColor, fontFamily: 'monospace', fontStyle: 'bold',
            letterSpacing: 3
        }).setOrigin(0.5, 0.5);
    }
}
