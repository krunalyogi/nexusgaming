const router = require('express').Router();
const auth = require('../controllers/authController');
const { auth: protect } = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/refresh', auth.refreshToken);
router.get('/verify-email', auth.verifyEmail);
router.get('/me', protect, auth.getMe);
router.put('/profile', protect, auth.updateProfile);
router.post('/logout', protect, auth.logout);

module.exports = router;
