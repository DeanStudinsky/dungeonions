// ScoreManager - Handles scoring and high scores (Phase 4)
class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.multiplier = 1;
    }

    addScore(points) {
        this.score += Math.floor(points * this.multiplier);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    addKill(enemyType = 'crab') {
        const basePoints = 25; // BASE_KILL_SCORE from original
        this.addScore(basePoints);
    }

    getScore() {
        return this.score;
    }

    getHighScore() {
        return this.highScore;
    }

    reset() {
        this.score = 0;
        this.multiplier = 1;
    }

    setMultiplier(value) {
        this.multiplier = Math.max(1, value);
    }

    loadHighScore() {
        try {
            const saved = localStorage.getItem('dungeonions_highscore');
            return saved ? parseInt(saved, 10) : 0;
        } catch (e) {
            return 0;
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem('dungeonions_highscore', this.highScore.toString());
        } catch (e) {
            console.warn('Could not save high score to localStorage');
        }
    }
}

if (typeof window !== 'undefined') {
    window.ScoreManager = ScoreManager;
}
