# 🚀 Firebase Deployment Guide

## ✅ Ready to Deploy!

Your new Phaser 3 game is now set up for Firebase deployment!

### What Changed:
- ✅ Old p5.js game backed up to `/old-p5-version/`
- ✅ New Phaser 3 game moved to root of `/public/`
- ✅ All paths updated for root deployment
- ✅ PWA manifest configured
- ✅ Service worker ready

---

## 📱 Mobile Support Included:
- ✅ Responsive scaling (fits any screen)
- ✅ Touch controls (virtual joystick + fire button)
- ✅ PWA installable on iOS/Android
- ✅ Offline support via service worker
- ✅ Fullscreen mode when installed

---

## 🔥 Deploy to Firebase

### 1. Test Locally First
```bash
firebase serve
```

Open: `http://localhost:5000/`

### 2. Deploy to Production
```bash
firebase deploy
```

### 3. Your Live URL
```
https://your-project.web.app/
```

---

## 📱 Install on Mobile

### iPhone (Safari)
1. Open your Firebase URL in Safari
2. Tap Share button (box with ↑)
3. Scroll down → "Add to Home Screen"
4. Tap "Add"
5. Game appears as app icon!

### Android (Chrome)
1. Open your Firebase URL in Chrome
2. Tap menu (⋮) → "Add to Home Screen"
3. Confirm
4. Game appears as app icon!

---

## 🎮 Game Features

### Desktop Controls
- **Move**: WASD or Arrow Keys
- **Fire**: Click mouse or hold SPACE

### Mobile Controls
- **Move**: Virtual joystick (bottom-left)
- **Fire**: Fire button (bottom-right)

### Character Classes
1. **Wizard** - Fast spellcaster (HP: 100, Speed: 120)
2. **Paladin** - Tank guardian (HP: 150, Speed: 90)
3. **Knight** - Melee striker (HP: 140, Speed: 110)
4. **Archer** - Ranged sniper (HP: 90, Speed: 115)

---

## 🗂️ Project Structure

```
public/
├── index.html          # Main entry point
├── manifest.json       # PWA configuration
├── sw.js              # Service worker
├── src/
│   ├── config/        # Game & tile config
│   ├── entities/      # Player, Enemy, Projectile
│   ├── managers/      # Map, Wave, Score managers
│   ├── scenes/        # Boot, Menu, Game, UI scenes
│   └── main.js        # Bootstrap
├── assets/
│   ├── tilemap.png    # Kenney Tiny Dungeon tileset
│   └── tilesets/      # Original tilesets (for reference)
└── old-p5-version/    # Backup of original game
```

---

## 📝 TODO Before First Deploy

1. **Create App Icons** (optional but recommended):
   - Open: `public/dangerous-dungeonions/assets/icon-generator.html` in browser
   - Download both icons (192x192 and 512x512)
   - Save as `public/assets/icon-192.png` and `icon-512.png`

2. **Test on Mobile Device**:
   - Connect phone to same WiFi
   - Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - On phone, go to: `http://YOUR_IP:5000/`
   - Test touch controls!

3. **Deploy**:
   ```bash
   firebase deploy
   ```

---

## 🐛 Troubleshooting

### Game doesn't load
- Check browser console for errors
- Verify `assets/tilemap.png` exists
- Clear browser cache (Ctrl+Shift+R)

### Touch controls not showing
- Check if device is properly detected
- Open browser console, should see: "Mobile device: true"

### Service worker issues
- Unregister old service workers in DevTools → Application → Service Workers
- Clear site data
- Hard refresh (Ctrl+Shift+R)

---

## 🎯 Next Steps (Post-Deploy)

### Phase 2 Enhancements:
- Better enemy AI (pathfinding)
- Particle effects (explosions, hit sparks)
- Sound effects & music
- More enemy types
- Power-ups & items
- Wave progression system

---

**Your game is ready to deploy! 🚀**

Run `firebase deploy` when ready!
