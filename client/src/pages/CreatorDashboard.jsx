import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { creatorEpisodesState } from '../atoms/episodeAtoms';
import episodeService from '../services/episodeService';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const CreatorDashboard = () => {
  const [creatorEpisodes, setCreatorEpisodes] = useRecoilState(creatorEpisodesState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreatorEpisodes = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await episodeService.getCreatorEpisodes();
        setCreatorEpisodes(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your podcasts.');
      } finally {
        setLoading(false);
      }
    };
    fetchCreatorEpisodes();
  }, [setCreatorEpisodes]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this episode?')) {
      try {
        await episodeService.deleteEpisode(id);
        setCreatorEpisodes(creatorEpisodes.filter((episode) => episode._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete episode.');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500 text-center text-lg">{error}</p>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Your Podcasts</h1>

      <div className="flex justify-end mb-6">
        <Link
          to="/creator/upload"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Upload New Episode
        </Link>
      </div>

      {creatorEpisodes.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">You haven't uploaded any podcasts yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700 text-left text-gray-300">
                <th className="py-3 px-4 border-b border-gray-600">Title</th>
                <th className="py-3 px-4 border-b border-gray-600">Category</th>
                <th className="py-3 px-4 border-b border-gray-600">Play Count</th>
                <th className="py-3 px-4 border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creatorEpisodes.map((episode) => (
                <tr key={episode._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-4">{episode.title}</td>
                  <td className="py-3 px-4">{episode.category}</td>
                  <td className="py-3 px-4">{episode.playCount}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link
                      to={`/creator/edit/${episode._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(episode._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;