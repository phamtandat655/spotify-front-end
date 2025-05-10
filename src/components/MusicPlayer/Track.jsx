import React from 'react';

const Track = ({ isPlaying, isActive, activeSong }) => {
  return (
    <div className="flex items-center gap-4">
      {isActive && activeSong ? (
        <>
          <img
            src={activeSong?.image_url || 'https://via.placeholder.com/64'}
            alt={activeSong?.name || 'Bài hát'}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <p className="text-white font-semibold text-lg truncate max-w-[200px]">
              {activeSong?.name || 'Không rõ bài hát'}
            </p>
            <p className="text-gray-300 text-sm truncate max-w-[200px]">
              {activeSong?.artist?.name || 'Không rõ nghệ sĩ'}
            </p>
          </div>
        </>
      ) : (
        <p className="text-gray-300 text-lg">Không có bài hát đang phát</p>
      )}
    </div>
  );
};

export default Track;