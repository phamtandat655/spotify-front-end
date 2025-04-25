import React from 'react';

const Track = ({ isPlaying, isActive, activeSong }) => {
  return (
    <div className="flex items-center gap-4">
      {isActive && activeSong ? (
        <>
          <img
            src={activeSong?.album?.image || 'https://via.placeholder.com/64'}
            alt={activeSong?.name || 'Song'}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <p className="text-white font-semibold text-lg truncate max-w-[200px]">
              {activeSong?.name || 'Unknown Song'}
            </p>
            <p className="text-gray-300 text-sm truncate max-w-[200px]">
              {activeSong?.artist?.name || 'Unknown Artist'}
            </p>
          </div>
        </>
      ) : (
        <p className="text-gray-300">No active song</p>
      )}
    </div>
  );
};

export default Track;