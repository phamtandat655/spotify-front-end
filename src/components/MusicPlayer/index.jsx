import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import { nextSong, prevSong, playPause } from '../../redux/features/playerSlice';
import Controls from '../../components/MusicPlayer/Controls';
import Player from '../../components/MusicPlayer/Player';
import Track from '../../components/MusicPlayer/Track';
import VolumeBar from '../../components/MusicPlayer/VolumeBar';

const MusicPlayer = () => {
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying } = useSelector((state) => state.player);
  const [volume, setVolume] = useState(0.3);
  const [isMinimized, setIsMinimized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentSongs.length && isActive) dispatch(playPause(true));
  }, [currentIndex, isActive, dispatch, currentSongs.length]);

  const handlePlayPause = () => {
    if (!isActive) return;

    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
  };

  const handleNextSong = () => {
    dispatch(playPause(false));
    dispatch(nextSong((currentIndex + 1) % currentSongs.length));
  };

  const handlePrevSong = () => {
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isActive) return null; // Hide player if no active song

  return (
    <div
      className={`w-full ${
        isMinimized
          ? 'fixed bottom-0 left-0 bg-gray-800 shadow-lg z-50'
          : 'relative sm:px-12 py-3 px-8 flex flex-col items-center'
      }`}
    >
      {isMinimized ? (
        // Minimized View
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <img
              src={activeSong?.album?.image || 'https://picsum.photos/50'}
              alt={activeSong?.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div>
              <p className="text-white font-semibold text-sm truncate max-w-[150px]">
                {activeSong?.name || 'No active song'}
              </p>
              <p className="text-gray-400 text-xs truncate max-w-[150px]">
                {activeSong?.artist?.name || 'Unknown Artist'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Controls
              isPlaying={isPlaying}
              currentSongs={currentSongs}
              handlePlayPause={handlePlayPause}
              handlePrevSong={handlePrevSong}
              handleNextSong={handleNextSong}
              minimal // Pass prop to render minimal controls
            />
            <button
              onClick={toggleMinimize}
              className="text-white hover:text-gray-300 focus:outline-none"
              aria-label="Maximize player"
            >
              <ChevronUpIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : (
        // Full View
        <>
          <div className="w-full flex items-center justify-between mb-4">
            <Track isPlaying={isPlaying} isActive={isActive} activeSong={activeSong} />
            <div className="flex items-center space-x-4">
              <VolumeBar
                value={volume}
                min="0"
                max="1"
                onChange={(event) => setVolume(event.target.value)}
                setVolume={setVolume}
              />
              <button
                onClick={toggleMinimize}
                className="text-white hover:text-gray-300 focus:outline-none"
                aria-label="Minimize player"
              >
                <ChevronDownIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="w-full">
            <Player
              activeSong={activeSong}
              volume={volume}
              isPlaying={isPlaying}
              repeat={false}
              currentIndex={currentIndex}
              onEnded={handleNextSong}
            />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Controls
              isPlaying={isPlaying}
              currentSongs={currentSongs}
              handlePlayPause={handlePlayPause}
              handlePrevSong={handlePrevSong}
              handleNextSong={handleNextSong}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;