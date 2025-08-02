import ReactPlayer from 'react-player';
import { useEffect } from 'react';
import episodeService from '../services/episodeService';

const AudioPlayer = ({ url, episodeId }) => {
  useEffect(() => {
    // Increment play count when component mounts (episode starts playing)
    const increment = async () => {
      if (episodeId) {
        try {
          await episodeService.incrementPlayCount(episodeId);
        } catch (error) {
          console.error('Error incrementing play count:', error);
        }
      }
    };
    increment();
  }, [episodeId]);

  return (
    <div className="w-full flex justify-center py-4">
      <ReactPlayer
        url={url}
        controls={true}
        width="100%"
        height="50px" // Adjust height for a more compact audio player
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload', // Disable download option in some browsers
            },
          },
        }}
        onEnded={() => console.log('Episode ended')}
        style={{ maxWidth: '800px' }}
      />
    </div>
  );
};

export default AudioPlayer;