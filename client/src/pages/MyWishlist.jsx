import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { wishlistState } from '../atoms/wishlistAtoms';
import { authState } from '../atoms/authAtoms';
import wishlistService from '../services/wishlistService';
import PodcastCard from '../components/PodcastCard';
import Spinner from '../components/Spinner';

const MyWishlist = () => {
  const [wishlist, setWishlist] = useRecoilState(wishlistState);
  const { token } = useRecoilValue(authState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      if (token) {
        setLoading(true);
        setError('');
        try {
          const data = await wishlistService.getWishlist();
          setWishlist(data); // Data here will be populated Episode objects
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch wishlist.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Please log in to view your wishlist.');
      }
    };
    fetchWishlist();
  }, [token, setWishlist]);

  const handleRemoveFromWishlist = async (episodeId) => {
    try {
      await wishlistService.removeEpisodeFromWishlist(episodeId);
      setWishlist(wishlist.filter((episode) => episode._id !== episodeId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove from wishlist. Please try again.');
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
      <h1 className="text-4xl font-bold text-center mb-8 text-white">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((episode) => (
            <div key={episode._id} className="relative">
              <PodcastCard episode={episode} />
              <button
                onClick={() => handleRemoveFromWishlist(episode._id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 text-xs font-bold"
                title="Remove from Wishlist"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;