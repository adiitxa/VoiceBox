const asyncHandler = require('express-async-handler');
const Episode = require('../models/Episode');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

// Configure Multer for in-memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @desc    Get all public episodes
// @route   GET /api/episodes
// @access  Public
const getEpisodes = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  const episodes = await Episode.find(query).populate('creator', 'username');
  res.status(200).json(episodes);
});

// @desc    Get episode by ID
// @route   GET /api/episodes/:id
// @access  Public
const getEpisodeById = asyncHandler(async (req, res) => {
  const episode = await Episode.findById(req.params.id).populate('creator', 'username');
  if (episode) {
    res.json(episode);
  } else {
    res.status(404);
    throw new Error('Episode not found');
  }
});

// @desc    Upload new episode
// @route   POST /api/episodes
// @access  Private/Creator
const createEpisode = asyncHandler(async (req, res) => {
  const { title, description, tags, category } = req.body;

  if (!req.files || !req.files.audio || !req.files.thumbnail) {
    res.status(400);
    throw new Error('Audio and thumbnail files are required');
  }

  const audioFile = req.files.audio[0];
  const thumbnailFile = req.files.thumbnail[0];

  try {
    // Upload audio
    const audioResult = await cloudinary.uploader.upload(
      `data:${audioFile.mimetype};base64,${audioFile.buffer.toString('base64')}`,
      {
        resource_type: 'video', // Cloudinary treats audio as video resource type
        folder: 'voicebox_audios',
      }
    );

    // Upload thumbnail
    const thumbnailResult = await cloudinary.uploader.upload(
      `data:${thumbnailFile.mimetype};base64,${thumbnailFile.buffer.toString('base64')}`,
      {
        folder: 'voicebox_thumbnails',
      }
    );

    const episode = await Episode.create({
      creator: req.user._id,
      title,
      description,
      audioUrl: audioResult.secure_url,
      thumbnailUrl: thumbnailResult.secure_url,
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
      category,
    });

    res.status(201).json(episode);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500);
    throw new Error('File upload failed');
  }
});

// @desc    Update an episode
// @route   PUT /api/episodes/:id
// @access  Private/Creator (own only)
const updateEpisode = asyncHandler(async (req, res) => {
  const { title, description, tags, category } = req.body;
  const { id } = req.params;

  const episode = await Episode.findById(id);

  if (!episode) {
    res.status(404);
    throw new Error('Episode not found');
  }

  if (episode.creator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this episode');
  }

  let audioUrl = episode.audioUrl;
  let thumbnailUrl = episode.thumbnailUrl;

  if (req.files && req.files.audio) {
    const audioFile = req.files.audio[0];
    const audioResult = await cloudinary.uploader.upload(
      `data:${audioFile.mimetype};base64,${audioFile.buffer.toString('base64')}`,
      { resource_type: 'video', folder: 'voicebox_audios' }
    );
    audioUrl = audioResult.secure_url;
  }

  if (req.files && req.files.thumbnail) {
    const thumbnailFile = req.files.thumbnail[0];
    const thumbnailResult = await cloudinary.uploader.upload(
      `data:${thumbnailFile.mimetype};base64,${thumbnailFile.buffer.toString('base64')}`,
      { folder: 'voicebox_thumbnails' }
    );
    thumbnailUrl = thumbnailResult.secure_url;
  }

  episode.title = title || episode.title;
  episode.description = description || episode.description;
  episode.tags = tags ? tags.split(',').map((tag) => tag.trim()) : episode.tags;
  episode.category = category || episode.category;
  episode.audioUrl = audioUrl;
  episode.thumbnailUrl = thumbnailUrl;

  const updatedEpisode = await episode.save();
  res.json(updatedEpisode);
});

// @desc    Delete an episode
// @route   DELETE /api/episodes/:id
// @access  Private/Creator (own only)
const deleteEpisode = asyncHandler(async (req, res) => {
  const episode = await Episode.findById(req.params.id);

  if (!episode) {
    res.status(404);
    throw new Error('Episode not found');
  }

  if (episode.creator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this episode');
  }

  // Optionally delete files from Cloudinary
  // const publicIdAudio = episode.audioUrl.split('/').pop().split('.')[0];
  // await cloudinary.uploader.destroy(`voicebox_audios/${publicIdAudio}`, { resource_type: 'video' });
  // const publicIdThumbnail = episode.thumbnailUrl.split('/').pop().split('.')[0];
  // await cloudinary.uploader.destroy(`voicebox_thumbnails/${publicIdThumbnail}`);

  await Episode.deleteOne({ _id: req.params.id });
  res.json({ message: 'Episode removed' });
});

// @desc    Increment play count
// @route   PUT /api/episodes/:id/play
// @access  Public
const incrementPlayCount = asyncHandler(async (req, res) => {
  const episode = await Episode.findById(req.params.id);

  if (episode) {
    episode.playCount += 1;
    await episode.save();
    res.json({ message: 'Play count incremented' });
  } else {
    res.status(404);
    throw new Error('Episode not found');
  }
});


module.exports = {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  incrementPlayCount,
  upload // Export multer upload instance
};