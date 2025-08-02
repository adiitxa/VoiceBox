import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import episodeService from '../services/episodeService';
import { useRecoilState } from 'recoil';
import { creatorEpisodesState } from '../atoms/episodeAtoms';

const UploadEditEpisode = () => {
  const { id } = useParams(); // For editing an existing episode
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingEpisode, setExistingEpisode] = useState(null);

  const [creatorEpisodes, setCreatorEpisodes] = useRecoilState(creatorEpisodesState);

  useEffect(() => {
    if (id) {
      const fetchEpisode = async () => {
        setLoading(true);
        try {
          const episode = await episodeService.getEpisodeById(id);
          setExistingEpisode(episode);
          setTitle(episode.title);
          setDescription(episode.description);
          setTags(episode.tags.join(', '));
          setCategory(episode.category);
        } catch (err) {
          setError('Failed to fetch episode for editing.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEpisode();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('category', category);
    if (audioFile) formData.append('audio', audioFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    try {
      if (id) {
        // Update existing episode
        const updatedEpisode = await episodeService.updateEpisode(id, formData);
        setCreatorEpisodes(
          creatorEpisodes.map((ep) => (ep._id === id ? updatedEpisode : ep))
        );
      } else {
        // Create new episode
        const newEpisode = await episodeService.createEpisode(formData);
        setCreatorEpisodes([...creatorEpisodes, newEpisode]);
      }
      navigate('/creator/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save episode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        {id ? 'Edit Episode' : 'Upload New Episode'}
      </h1>

      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-300 text-sm font-bold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-300 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="audioFile" className="block text-gray-300 text-sm font-bold mb-2">
              Audio File {id && existingEpisode?.audioUrl && '(Current file exists)'}
            </label>
            <input
              type="file"
              id="audioFile"
              accept="audio/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setAudioFile(e.target.files[0])}
              required={!id} // Required for new upload, optional for edit
            />
          </div>
          <div className="mb-6">
            <label htmlFor="thumbnailFile" className="block text-gray-300 text-sm font-bold mb-2">
              Thumbnail Image {id && existingEpisode?.thumbnailUrl && '(Current image exists)'}
            </label>
            <input
              type="file"
              id="thumbnailFile"
              accept="image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              required={!id} // Required for new upload, optional for edit
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : id ? 'Update Episode' : 'Upload Episode'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadEditEpisode;