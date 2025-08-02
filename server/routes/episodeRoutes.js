const express = require('express');
const {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  incrementPlayCount,
  upload
} = require('../controllers/episodeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router
  .route('/')
  .get(getEpisodes)
  .post(
    protect,
    authorizeRoles('Creator'),
    upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
    createEpisode
  );

router
  .route('/:id')
  .get(getEpisodeById)
  .put(
    protect,
    authorizeRoles('Creator'),
    upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
    updateEpisode
  )
  .delete(protect, authorizeRoles('Creator'), deleteEpisode);

router.put('/:id/play', incrementPlayCount);

module.exports = router;