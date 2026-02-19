const router = require('express').Router();
const dl = require('../controllers/downloadController');
const { auth: protect } = require('../middleware/auth');
const { attachDevAccount } = require('../controllers/developerController');

router.get('/:gameId', protect, dl.getDownloadLink);
router.get('/:gameId/check-update', dl.checkUpdate);
router.get('/:gameId/versions', dl.getVersions);
router.post('/:gameId/version', protect, attachDevAccount, dl.publishVersion);

module.exports = router;
