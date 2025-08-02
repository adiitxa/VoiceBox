import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import episodeService from '../services/episodeService';
import wishlistService from '../services/wishlistService';
import AudioPlayer from '../components/AudioPlayer';
import Spinner from '../components/Spinner';
import { useRecoilState, useRecoilValue } from 'recoil';
import { wishlistState } from '../atoms/wishlistAtoms';
import { authState } from '../atoms/authAtoms';

const EpisodeDetail = () => {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useRecoilState(wishlistState);
  const { user, token } = useRecoilValue(authState);

  useEffect(() => {
    const fetchEpisode = async () => {
      setLoading(true);
      try {
        const data = await episodeService.getEpisodeById(id);
        setEpisode(data);
      } catch (err) {
        setError('Failed to fetch episode details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (token) {
        try {
          const data = await wishlistService.getWishlist();
          setWishlist(data.map((item) => item._id)); // Store just IDs for quick lookup
        } catch (err) {
          console.error('Failed to fetch wishlist:', err);
        }
      }
    };

    fetchEpisode();
    fetchWishlist();
  }, [id, token, setWishlist]);

  const handleWishlistToggle = async () => {
    if (!user) {
      alert('Please login to manage your wishlist.');
      return;
    }
    try {
      if (wishlist.includes(episode._id)) {
        await wishlistService.removeEpisodeFromWishlist(episode._id);
        setWishlist(wishlist.filter((itemId) => itemId !== episode._id));
      } else {
        await wishlistService.addEpisodeToWishlist(episode._id);
        setWishlist([...wishlist, episode._id]);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500 text-center text-lg">{error}</p>;
  }

  if (!episode) {
    return <p className="text-gray-400 text-center text-lg">Episode not found.</p>;
  }

  const isWishlisted = wishlist.includes(episode._id);

  return (
    <div className="py-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{episode.title}</h1>
        <p className="text-gray-400 text-lg mb-4">By: {episode.creator?.username || 'Unknown'}</p>
        <div className="mb-6">
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="w-full h-96 object-cover object-center rounded-lg"
          />
        </div>

        <AudioPlayer url={episode.audioUrl} episodeId={episode._id} />

        <p className="text-gray-300 mt-6 leading-relaxed">{episode.description}</p>

        <div className="mt-6 flex flex-wrap gap-2 text-gray-500">
          {episode.tags.map((tag, index) => (
            <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-2">Category: {episode.category}</p>
        <p className="text-gray-500 text-sm mt-2">Plays: {episode.playCount}</p>

        {user && (
          <button
            onClick={handleWishlistToggle}
            className={`mt-6 py-2 px-4 rounded-lg font-semibold transition duration-200
            ${isWishlisted ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
          >
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;