import api from '../utils/api';

const getPublicEpisodes = async (searchParams = {}) => {
  try {
    const params = new URLSearchParams(searchParams).toString();
    const response = await api.get(`/episodes?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
};

const getEpisodeById = async (id) => {
  const response = await api.get(`/episodes/${id}`);
  return response.data;
};

const getCreatorEpisodes = async () => {
  const response = await api.get('/episodes?creator=me'); // Assuming backend filters by creator if 'creator=me' is present
  return response.data;
};

const createEpisode = async (episodeData) => {
  const response = await api.post('/episodes', episodeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateEpisode = async (id, episodeData) => {
  const response = await api.put(`/episodes/${id}`, episodeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteEpisode = async (id) => {
  const response = await api.delete(`/episodes/${id}`);
  return response.data;
};

const incrementPlayCount = async (id) => {
  const response = await api.put(`/episodes/${id}/play`);
  return response.data;
};

const episodeService = {
  getPublicEpisodes,
  getEpisodeById,
  getCreatorEpisodes,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  incrementPlayCount,
};

export default episodeService;