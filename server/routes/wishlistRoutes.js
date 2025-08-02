const express = require('express');
const {
  addEpisodeToWishlist,
  removeEpisodeFromWishlist,
  getWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getWishlist);
router.route('/:episodeId').post(protect, addEpisodeToWishlist).delete(protect, removeEpisodeFromWishlist);

module.exports = router;