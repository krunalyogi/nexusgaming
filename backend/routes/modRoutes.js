const router = require('express').Router();
const mods = require('../controllers/modController');
const { auth: protect } = require('../middleware/auth');

router.get('/game/:gameId', mods.getGameMods);
router.post('/', protect, mods.createMod);
router.put('/:id', protect, mods.updateMod);
router.delete('/:id', protect, mods.deleteMod);
router.post('/:id/download', mods.downloadMod);

module.exports = router;
