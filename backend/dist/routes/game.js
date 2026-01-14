/// <reference path="../declarations.d.ts" />
import express from 'express';
import { Game } from '../models/Game.js';
const router = express.Router();
// In-memory game instance
const games = {
    default: new Game('default'),
};
// Get game state
router.get('/state', (req, res) => {
    const gameId = req.query.gameId || 'default';
    const game = games[gameId];
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game.getState());
});
// Get available energy unit types
router.get('/units', (req, res) => {
    const gameId = req.query.gameId || 'default';
    let game = games[gameId];
    if (!game) {
        game = new Game(gameId);
        games[gameId] = game;
    }
    res.json(game.getEnergyUnitTypes());
});
// Buy energy unit
router.post('/buy-unit', (req, res) => {
    const gameId = req.body.gameId || 'default';
    const { typeId } = req.body;
    let game = games[gameId];
    if (!game) {
        game = new Game(gameId);
        games[gameId] = game;
    }
    const success = game.buyEnergyUnit(typeId);
    res.json({ success, state: game.getState() });
});
// Toggle unit on/off
router.post('/toggle-unit', (req, res) => {
    const gameId = req.body.gameId || 'default';
    const { unitId } = req.body;
    const game = games[gameId];
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    const success = game.toggleUnit(unitId);
    res.json({ success, state: game.getState() });
});
// Start game (enable ticking)
router.post('/start', (req, res) => {
    const gameId = req.body.gameId || 'default';
    let game = games[gameId];
    if (!game) {
        game = new Game(gameId);
        games[gameId] = game;
    }
    game.startGame();
    res.json({ success: true, state: game.getState() });
});
// Update game tick
router.post('/update', (req, res) => {
    const gameId = req.body.gameId || 'default';
    let game = games[gameId];
    if (!game) {
        game = new Game(gameId);
        games[gameId] = game;
    }
    game.update();
    res.json(game.getState());
});
// Set game speed
router.post('/set-speed', (req, res) => {
    const gameId = req.body.gameId || 'default';
    const { speed } = req.body;
    const game = games[gameId];
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    game.setGameSpeed(speed);
    res.json({ success: true, state: game.getState() });
});
// Restart game
router.post('/restart', (req, res) => {
    const gameId = req.body.gameId || 'default';
    let game = games[gameId];
    if (!game) {
        game = new Game(gameId);
        games[gameId] = game;
    }
    game.restartGame();
    res.json({ success: true, state: game.getState() });
});
export default router;
