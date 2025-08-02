import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { publicEpisodesState } from '../atoms/episodeAtoms';
import { authState } from '../atoms/authAtoms';
import episodeService from '../services/episodeService';
import PodcastCard from '../components/PodcastCard';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const Home = () => {
  const [episodes, setEpisodes] = useRecoilState(publicEpisodesState);
  const [loading, setLoading] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState(''); // State for input value
  const [searchQuery, setSearchQuery] = useState(''); // State that triggers actual search
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  const { user } = useRecoilValue(authState);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const data = await episodeService.getPublicEpisodes({
          search: searchQuery, // Use searchQuery for the API call
          category: categoryFilter,
          // Removed page and limit parameters
        });
        // Assuming backend now returns just the array of episodes
        setEpisodes(data);

        // Extract unique categories from fetched episodes
        const uniqueCategories = [...new Set(data.map(ep => ep.category))];
        setCategories(prevCategories => [...new Set([...prevCategories, ...uniqueCategories])]);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [searchQuery, categoryFilter, setEpisodes]); // Removed currentPage, episodesPerPage from dependencies

  // Handler for input field change (updates local input value state)
  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  // Handler for search button click (updates actual searchQuery state)
  const handleSearchButtonClick = () => {
    setSearchQuery(searchInputValue); // This will trigger the useEffect
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    // Removed setCurrentPage(1);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">DISCOVER INSIGHTS</h1>

      {/* Button Section */}
      <div className="flex justify-center mb-3">
        {!user ? (
          <Link
  to="/auth"
  className="bg-gray-700 hover:bg-gray-200 text-white hover:text-gray-800 font-bold py-1 px-2 rounded transition duration-200 shadow-md text-sm border border-transparent hover:border-gray-800"
>
  Unlock VoiceBox Queue Feature.
</Link>
        ) : (
          <Link
            to="/"            
          >
          </Link>
        )}
      </div>

      {/* Search Input, Search Button, and Category Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative w-full md:w-2/3 flex">
          <input
            type="text"
            placeholder="Search Podcats..."
            className="flex-grow p-3 rounded-l-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={searchInputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    handleSearchButtonClick();
                }
            }}
          />
          {/* Search Icon (simple SVG) */}
          <div className="absolute inset-y-0 right-14 flex items-center pr-3 pointer-events-none">
            
          </div>
          {/* Search Button */}
          <button
            onClick={handleSearchButtonClick}
            className="bg-gray-700 hover:bg-white text-white hover:text-black font-bold py-3 px-4 rounded-r-lg transition duration-200 shadow-md flex items-center justify-center border border-transparent hover:border-black"
          >
           🚀
          </button>
        </div>

        <select
          className="w-full md:w-1/3 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categoryFilter}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>


      {/* Podcast Display */}
      {episodes.length === 0 && !loading ? (
        <p className="text-center text-gray-400 text-lg">No podcasts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode) => (
            <PodcastCard key={episode._id} episode={episode} />
          ))}
        </div>
      )}

      {/* Removed Pagination Controls */}
    </div>
  );
};

export default Home;
