import React from 'react';
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';

const Controls = ({ isPlaying, currentSongs, handlePlayPause, handlePrevSong, handleNextSong, minimal = false }) => {
  return (
    <div className={`flex items-center space-x-${minimal ? '2' : '4'}`}>
      <button
        onClick={handlePrevSong}
        disabled={!currentSongs.length}
        className={`${
          minimal ? 'h-6 w-6' : 'h-8 w-8'
        } text-white hover:text-gray-300 disabled:text-gray-600 focus:outline-none`}
        aria-label="Previous song"
      >
        <BackwardIcon />
      </button>
      <button
        onClick={handlePlayPause}
        disabled={!currentSongs.length}
        className={`${
          minimal ? 'h-8 w-8' : 'h-10 w-10'
        } text-white hover:text-gray-300 disabled:text-gray-600 focus:outline-none`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        onClick={handleNextSong}
        disabled={!currentSongs.length}
        className={`${
          minimal ? 'h-6 w-6' : 'h-8 w-8'
        } text-white hover:text-gray-300 disabled:text-gray-600 focus:outline-none`}
        aria-label="Next song"
      >
        <ForwardIcon />
      </button>
    </div>
  );
};

export default Controls;