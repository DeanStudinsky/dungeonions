// Phaser 3 Game Configuration
const GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#2d2d2d',

    // Pixel art settings
    pixelArt: true,
    antialias: false,
    roundPixels: true,

    // Scale configuration for responsive + mobile
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 960,
        height: 720,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1920,
            height: 1440
        }
    },

    // Physics
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Top-down game
            debug: false,
            fps: 60
        }
    },

    // Input
    input: {
        activePointers: 3, // Support multi-touch
        touch: {
            target: null,
            capture: true
        },
        mouse: {
            target: null,
            preventDefaultDown: true,
            preventDefaultUp: true,
            preventDefaultMove: true,
            preventDefaultWheel: false
        }
    },

    // Scenes (order matters for load sequence)
    scene: [], // Will be populated in main.js

    // Audio
    audio: {
        disableWebAudio: false
    },

    // Performance
    fps: {
        target: 60,
        forceSetTimeOut: false
    },

    render: {
        powerPreference: 'high-performance',
        batchSize: 4096
    },

    // Mobile specific
    dom: {
        createContainer: false
    },

    // Callbacks
    callbacks: {
        preBoot: (game) => {
            // Detect mobile
            game.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            console.log('Mobile device:', game.isMobile);
        }
    }
};

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.GameConfig = GameConfig;
}
