const router = require('express').Router();
const dlc = require('../controllers/dlcController');
const { auth: protect } = require('../middleware/auth');

router.get('/game/:gameId', dlc.getGameDLCs);
router.post('/', protect, dlc.createDLC);
router.put('/:id', protect, dlc.updateDLC);
router.post('/:id/purchase', protect, dlc.purchaseDLC);
router.get('/:id/download', protect, dlc.downloadDLC);

module.exports = router;
