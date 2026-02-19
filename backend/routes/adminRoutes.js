const router = require('express').Router();
const admin = require('../controllers/adminController');
const { auth: protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', admin.getDashboardStats);
router.get('/users', admin.getUsers);
router.put('/ban/:userId', admin.banUser);
router.put('/unban/:userId', admin.unbanUser);
router.post('/games', admin.addGame);
router.delete('/games/:id', admin.removeGame);
router.put('/games/:id/feature', admin.toggleFeature);
router.put('/mods/:id/approve', admin.approveMod);

module.exports = router;
