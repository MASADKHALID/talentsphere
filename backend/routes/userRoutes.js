const express = require('express');
const { getUserProfileById, followCompany, unfollowCompany } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', protect, getUserProfileById);
router.post('/:id/follow', protect, followCompany);
router.post('/:id/unfollow', protect, unfollowCompany);

module.exports = router;
