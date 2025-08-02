const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Episode = require('../models/Episode');

// @desc    Add episode to wishlist
// @route   POST /api/wishlist/:episodeId
// @access  Private/User, Creator
const addEpisodeToWishlist = asyncHandler(async (req, res) => {
  const { episodeId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const episode = await Episode.findById(episodeId);
  if (!episode) {
    res.status(404);
    throw new Error('Episode not found');
  }

  if (!user.wishlist.includes(episodeId)) {
    user.wishlist.push(episodeId);
    await user.save();
    res.status(200).json({ message: 'Episode added to wishlist', wishlist: user.wishlist });
  } else {
    res.status(400).json({ message: 'Episode already in wishlist' });
  }
});

// @desc    Remove episode from wishlist
// @route   DELETE /api/wishlist/:episodeId
// @access  Private/User, Creator
const removeEpisodeFromWishlist = asyncHandler(async (req, res) => {
  const { episodeId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.wishlist = user.wishlist.filter((id) => id.toString() !== episodeId.toString());
  await user.save();
  res.status(200).json({ message: 'Episode removed from wishlist', wishlist: user.wishlist });
});

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private/User, Creator
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.status(200).json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  addEpisodeToWishlist,
  removeEpisodeFromWishlist,
  getWishlist,
};