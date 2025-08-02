import api from '../utils/api';

const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

const addEpisodeToWishlist = async (episodeId) => {
  const response = await api.post(`/wishlist/${episodeId}`);
  return response.data;
};

const removeEpisodeFromWishlist = async (episodeId) => {
  const response = await api.delete(`/wishlist/${episodeId}`);
  return response.data;
};

const wishlistService = {
  getWishlist,
  addEpisodeToWishlist,
  removeEpisodeFromWishlist,
};

export default wishlistService;