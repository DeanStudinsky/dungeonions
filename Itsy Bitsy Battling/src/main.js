// Main game bootstrap
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }

    function initGame() {
        console.log('🎮 Initializing Dangerous Dungeonions...');

        // Prevent pull-to-refresh on mobile
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });

        // Prevent double-tap zoom on mobile
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add scenes to config
        GameConfig.scene = [
            BootScene,
            MenuScene,
            MapEditorScene,
            GameScene,
            UIScene,
            PauseScene
        ];

        // Create game
        const game = new Phaser.Game(GameConfig);

        // Global game reference for debugging
        window.game = game;

        // Log mobile detection
        console.log('📱 Mobile device detected:', game.isMobile);
        console.log('🎨 Renderer:', game.config.renderType === Phaser.WEBGL ? 'WebGL' : 'Canvas');

        // Unregister existing service workers during development
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister();
                    console.log('🗑️ Service Worker unregistered');
                }
            });
        }

        // Service Worker registration for PWA (disabled during development)
        // Uncomment for production builds
        /*
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ Service Worker registration failed:', error);
                    });
            });
        }
        */

        // Handle visibility change (pause when tab hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                game.sound.pauseAll();
            } else {
                game.sound.resumeAll();
            }
        });

        // Handle resize for responsive layout
        window.addEventListener('resize', () => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        });

        // iOS-specific: Handle safe areas
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content',
                    'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover'
                );
            }
        }

        console.log('✅ Game initialized successfully!');
    }
})();
