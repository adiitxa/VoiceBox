import React from 'react';
import { Link } from 'react-router-dom';

const PodcastCard = ({ episode }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <Link to={`/episode/${episode._id}`} className="block">
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          className="w-full h-48 object-cover object-center"
        />
      </Link>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{episode.title}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{episode.description}</p>
        </div>
        <div className="mt-auto">
          <p className="text-gray-500 text-xs">By: {episode.creator?.username || 'Unknown'}</p>
          <p className="text-gray-500 text-xs">Category: {episode.category}</p>
          <Link
            to={`/episode/${episode._id}`}
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Listen Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;