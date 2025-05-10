import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import {
  nextSong,
  prevSong,
  playPause,
} from "../../redux/features/playerSlice";
import Controls from "../../components/MusicPlayer/Controls";
import Player from "../../components/MusicPlayer/Player";
import Track from "../../components/MusicPlayer/Track";
import VolumeBar from "../../components/MusicPlayer/VolumeBar";

const MusicPlayer = () => {
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying } =
    useSelector((state) => state.player);
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
    if (isMinimized) {
      dispatch(playPause(true));
    } else {
      dispatch(playPause(false));
    }
    setIsMinimized(!isMinimized);
  };

  if (!isActive || !activeSong) return null;

  return (
    <div
      className={`w-full ${
        isMinimized
          ? "fixed bottom-0 left-0 bg-gray-800 shadow-lg z-50"
          : "relative sm:px-12 py-3 px-8 flex flex-col items-center"
      }`}
    >
      {/* Always render Player, but hide video when minimized */}
      <Player
        activeSong={activeSong}
        volume={volume}
        isPlaying={isPlaying}
        repeat={false}
        currentIndex={currentIndex}
        onEnded={handleNextSong}
        isMinimized={isMinimized}
      />

      {isMinimized ? (
        // Minimized View
        <div className="flex items-center justify-between px-4 py-3 mb-5">
          <div className="flex items-center space-x-4">
            <img
              src={activeSong?.preview_url || "https://via.placeholder.com/50"}
              alt={activeSong?.name || "Bài hát"}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div>
              <p className="text-white font-semibold text-sm truncate max-w-[150px]">
                {activeSong?.name || "Không có bài hát"}
              </p>
              <p className="text-gray-400 text-xs truncate max-w-[150px]">
                {activeSong?.artist?.name || "Không rõ nghệ sĩ"}
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
              minimal
            />
            <button
              onClick={toggleMinimize}
              className="text-white hover:text-gray-300 focus:outline-none"
              aria-label="Maximize player"
              title="Mở rộng trình phát"
            >
              <ChevronUpIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : (
        // Full View
        <>
          <div className="w-full flex items-center justify-around mb-4 mt-2">
            <Track
              isPlaying={isPlaying}
              isActive={isActive}
              activeSong={activeSong}
            />
            <div className="flex-1 flex flex-col items-center justify-center">
              <Controls
                isPlaying={isPlaying}
                currentSongs={currentSongs}
                handlePlayPause={handlePlayPause}
                handlePrevSong={handlePrevSong}
                handleNextSong={handleNextSong}
              />
            </div>
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
                title="Thu nhỏ trình phát"
              >
                <ChevronDownIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;