const router = require('express').Router();
const friends = require('../controllers/friendController');
const { auth: protect } = require('../middleware/auth');

router.get('/', protect, friends.getFriends);
router.get('/requests', protect, friends.getPendingRequests);
router.get('/search', protect, friends.searchUsers);
router.post('/request', protect, friends.sendRequest);
router.put('/accept/:requestId', protect, friends.acceptRequest);
router.put('/decline/:requestId', protect, friends.declineRequest);
router.put('/block/:userId', protect, friends.blockUser);
router.delete('/:userId', protect, friends.unfriend);

module.exports = router;
